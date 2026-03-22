/**
 * Three.js 粒子渲染器
 * 解析数学表达式并渲染粒子效果
 */

import * as THREE from 'three'

const DEFAULT_PREVIEW_MAX_PARTICLES = 5000

const mulberry32 = (seed) => {
  let t = seed >>> 0
  return () => {
    t += 0x6D2B79F5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * 简单的数学表达式解析器
 */
class MathExpressionParser {
  constructor() {
    // 可用函数
    this.functions = {
      sin: Math.sin,
      cos: Math.cos,
      tan: Math.tan,
      asin: Math.asin,
      acos: Math.acos,
      atan: Math.atan,
      sqrt: Math.sqrt,
      abs: Math.abs,
      pow: Math.pow,
      log: Math.log,
      exp: Math.exp,
      floor: Math.floor,
      ceil: Math.ceil,
      round: Math.round,
      max: Math.max,
      min: Math.min,
      random: Math.random,
      PI: Math.PI,
      E: Math.E
    }
  }

  /**
   * 解析表达式并计算（仅返回被赋值过的变量）
   * @param {string} expression - 表达式字符串
   * @param {object} variables - 变量对象
   * @returns {object} 计算结果（仅包含表达式内赋值过的字段）
   */
  evaluateAssignments(expression, variables = {}) {
    const result = {}

    // 分割表达式
    const statements = expression.split(';').filter(s => s.trim())

    for (const stmt of statements) {
      const trimmed = stmt.trim()

      // 赋值语句
      const match = trimmed.match(/^(\w+)\s*=\s*(.+)$/)
      if (match) {
        const [, varName, expr] = match
        try {
          result[varName] = this.evaluateExpression(expr, { ...variables, ...result })
        } catch (e) {
          console.warn(`Failed to evaluate: ${expr}`, e)
        }
      }
    }

    return result
  }

  /**
   * 计算单个表达式
   * @param {string} expr - 表达式
   * @param {object} variables - 变量
   * @returns {number} 计算结果
   */
  evaluateExpression(expr, variables) {
    // 替换变量
    let evalExpr = expr

    // 替换所有变量
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\b${key}\\b`, 'g')
      evalExpr = evalExpr.replace(regex, `(${value})`)
    }

    // 替换函数/常量
    for (const [name, funcOrValue] of Object.entries(this.functions)) {
      if (typeof funcOrValue === 'function') {
        const regex = new RegExp(`\\b${name}\\(`, 'g')
        evalExpr = evalExpr.replace(regex, `Math.${name}(`)
      } else {
        const regex = new RegExp(`\\b${name}\\b`, 'g')
        evalExpr = evalExpr.replace(regex, `(${funcOrValue})`)
      }
    }

    // 替换 ^ 为 ** (幂运算)
    evalExpr = evalExpr.replace(/\^/g, '**')

    // 安全评估
    try {
      // 只允许数学表达式
      if (!/^[0-9a-zA-Z._+\-*/()%^&|!>=<, ]+$/.test(evalExpr)) {
        throw new Error('Invalid expression')
      }

      return eval(evalExpr)
    } catch (e) {
      console.warn(`Failed to evaluate expression: ${evalExpr}`, e)
      return 0
    }
  }
}

/**
 * 粒子系统
 */
export class ParticleSystem {
  constructor(scene) {
    this.scene = scene
    this.particles = null
    this.parser = new MathExpressionParser()
    this.animationId = null
    this.isPaused = false
    this.demoRotate = false

    // 用于“生命周期预览”的基准数据（tick=0）
    this.basePositions = null // Float32Array
    this.baseCount = 0
    this.maxParticles = DEFAULT_PREVIEW_MAX_PARTICLES
  }

  /**
   * 生成粒子
   * @param {object} config - 粒子配置
   */
  generateParticles(config) {
    // 清除旧粒子
    this.clearParticles()

    const {
      expression,
      begin = 0,
      end = 6.28,
      calcInterval = 0.1,
      count = 500,
      offset = { x: 0, y: 0, z: 0 },
      range = null
    } = config

    const positions = []
    const colors = []
    const seedRand = mulberry32(0xC0FFEE)

    // end < begin 代表“空帧/未生成”
    if (typeof begin === 'number' && typeof end === 'number' && end < begin) {
      return { count: 0, positions: [] }
    }

    // 如果没有 expression，则退化为“范围内随机点云”（更符合新手对 normal 的直觉）
    const exprText = typeof expression === 'string' ? expression.trim() : ''
    const hasExpression = !!exprText

    if (!hasExpression) {
      const dx = range?.dx ?? 0
      const dy = range?.dy ?? 0
      const dz = range?.dz ?? 0
      const num = Math.min(Math.max(0, Number(count) || 0), this.maxParticles)

      for (let i = 0; i < num; i++) {
        const rx = (seedRand() * 2 - 1) * dx
        const ry = (seedRand() * 2 - 1) * dy
        const rz = (seedRand() * 2 - 1) * dz

        positions.push(
          (offset.x || 0) + rx,
          (offset.y || 0) + ry,
          (offset.z || 0) + rz
        )
        colors.push(0.2, 0.5, 1.0)
      }
    } else {
      // 参数方程：t in [begin, end] step calcInterval
      const b = Number(begin) || 0
      const e = Number(end) || 0
      let step = Number(calcInterval) || 0.1
      step = Math.max(1e-6, step)

      const estimated = Math.floor(Math.abs((e - b) / step)) + 1
      if (estimated > this.maxParticles) {
        step = Math.abs(e - b) / (this.maxParticles - 1)
      }

      for (let t = b; t <= e; t += step) {
        try {
          const assigned = this.parser.evaluateAssignments(exprText, { t })

          // 表达式不一定会写全 x/y/z，兜底为 0
          const x = (assigned.x ?? 0) + (offset.x || 0)
          const y = (assigned.y ?? 0) + (offset.y || 0)
          const z = (assigned.z ?? 0) + (offset.z || 0)

          positions.push(x, y, z)
          colors.push(0.2, 0.5, 1.0)
        } catch (e) {
          console.warn(`Failed to calculate particle at t=${t}`, e)
        }
      }
    }

    // 创建几何体
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    // 创建材质
    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    })

    // 创建粒子系统
    this.particles = new THREE.Points(geometry, material)
    this.scene.add(this.particles)

    this.basePositions = new Float32Array(positions)
    this.baseCount = positions.length / 3

    return {
      count: positions.length / 3,
      positions: positions
    }
  }

  setDemoRotate(enabled) {
    this.demoRotate = !!enabled
  }

  /**
   * 更新粒子颜色
   * @param {object} color - RGBA 颜色对象
   */
  updateParticleColor(color) {
    if (!this.particles) return

    const colors = this.particles.geometry.attributes.color.array
    const { r = 1, g = 1, b = 1 } = color

    for (let i = 0; i < colors.length; i += 3) {
      colors[i] = r
      colors[i + 1] = g
      colors[i + 2] = b
    }

    this.particles.geometry.attributes.color.needsUpdate = true
  }

  /**
   * 动画效果
   */
  animate() {
    if (this.isPaused || !this.particles) return

    // 默认不做“假旋转”动画，避免与 MC 内表现不一致
    if (this.demoRotate) {
      this.particles.rotation.y += 0.005
    }
  }

  /**
   * 按 tick 应用“运动预览”（基于 speed / speedExpression）
   * 注意：这只是编辑器的近似模拟，目的是让作者看到生命周期变化，不保证 100% 与模组实现一致。
   */
  applyMotionPreview({
                       tick = 0,
                       age = 0,
                       speed = { vx: 0, vy: 0, vz: 0 },
                       speedExpression = '',
                       speedStep = 0.1
                     }) {
    if (!this.particles || !this.basePositions) return

    const totalTick = Math.max(0, Math.floor(Number(tick) || 0))
    const lifeTick = Number(age) > 0 ? Math.min(totalTick, Math.floor(Number(age))) : totalTick
    const step = Number(speedStep) || 0.1

    const posAttr = this.particles.geometry.attributes.position
    const out = posAttr.array

    const base = this.basePositions
    const n = this.baseCount

    const svx = Number(speed?.vx) || 0
    const svy = Number(speed?.vy) || 0
    const svz = Number(speed?.vz) || 0

    const spdExpr = typeof speedExpression === 'string' ? speedExpression.trim() : ''

    // 无速度表达式：直接做线性平移（最符合作者直觉，也更快）
    if (!spdExpr) {
      for (let i = 0; i < n; i++) {
        const idx = i * 3
        out[idx] = base[idx] + svx * lifeTick
        out[idx + 1] = base[idx + 1] + svy * lifeTick
        out[idx + 2] = base[idx + 2] + svz * lifeTick
      }
      posAttr.needsUpdate = true
      return
    }

    // 有速度表达式：逐 tick 模拟（允许表达式动态改变 vx/vy/vz）
    for (let i = 0; i < n; i++) {
      const idx = i * 3

      let x = base[idx]
      let y = base[idx + 1]
      let z = base[idx + 2]

      let vx = svx
      let vy = svy
      let vz = svz

      for (let k = 0; k < lifeTick; k++) {
        const t = k * step
        const assigned = this.parser.evaluateAssignments(spdExpr, { t, x, y, z, vx, vy, vz })

        if ('vx' in assigned) vx = Number(assigned.vx) || 0
        if ('vy' in assigned) vy = Number(assigned.vy) || 0
        if ('vz' in assigned) vz = Number(assigned.vz) || 0

        if ('x' in assigned) x = Number(assigned.x) || 0
        if ('y' in assigned) y = Number(assigned.y) || 0
        if ('z' in assigned) z = Number(assigned.z) || 0

        x += vx
        y += vy
        z += vz
      }

      out[idx] = x
      out[idx + 1] = y
      out[idx + 2] = z
    }

    posAttr.needsUpdate = true
  }

  /**
   * 清除粒子
   */
  clearParticles() {
    if (this.particles) {
      this.scene.remove(this.particles)
      this.particles.geometry.dispose()
      this.particles.material.dispose()
      this.particles = null
    }

    this.basePositions = null
    this.baseCount = 0
  }

  /**
   * 暂停/继续
   */
  togglePause() {
    this.isPaused = !this.isPaused
    return this.isPaused
  }

  /**
   * 销毁
   */
  dispose() {
    this.clearParticles()
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
  }
}

/**
 * 3D 预览管理器
 */
export class Preview3DManager {
  constructor(container) {
    this.container = container
    this.scene = null
    this.camera = null
    this.renderer = null
    this.domElement = null
    this.particleSystem = null
    this.animationId = null
    this.isInitialized = false

    // 相机控制
    this.cameraDistance = 10
    this.cameraAngleX = 0.5
    this.cameraAngleY = 0.5
    this.isDragging = false
    this.lastMouseX = 0
    this.lastMouseY = 0

    // 可视化编辑（形状 gizmo）
    this.raycaster = new THREE.Raycaster()
    this.pointer = new THREE.Vector2()
    this.circleGizmo = null
    this.lineGizmo = null
    this.originGizmo = null
    this.velocityGizmo = null
    this.targetGizmo = null
    this.isGizmoDragging = false
    this.activeGizmoHandle = null
    this.activeGizmoType = null
    this.gizmoDragContext = null

    // 绑定后的事件引用（用于正确 removeEventListener）
    this._onWindowResize = this.onWindowResize.bind(this)
    this._onMouseDown = this.onMouseDown.bind(this)
    this._onMouseMove = this.onMouseMove.bind(this)
    this._onMouseUp = this.onMouseUp.bind(this)
    this._onWheel = this.onWheel.bind(this)
  }

  /**
   * 初始化 Three.js 场景
   */
  init() {
    if (this.isInitialized) return

    // 确保容器有尺寸
    if (!this.container.clientWidth || !this.container.clientHeight) {
      console.warn('Container has no size, delaying initialization')
      setTimeout(() => this.init(), 100)
      return
    }

    // 创建场景
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x050810)

    // 创建相机
    const aspect = this.container.clientWidth / this.container.clientHeight
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
    this.updateCameraPosition()

    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.container.appendChild(this.renderer.domElement)
    this.domElement = this.renderer.domElement

    // 添加辅助元素
    this.addHelpers()

    // 创建粒子系统
    this.particleSystem = new ParticleSystem(this.scene)

    // 添加事件监听
    this.addEventListeners()

    // 开始动画循环
    this.animate()

    this.isInitialized = true
    console.log('Three.js initialized successfully')
  }

  /**
   * 添加辅助元素
   */
  addHelpers() {
    // 坐标轴
    const axesHelper = new THREE.AxesHelper(10)
    this.scene.add(axesHelper)

    // 网格
    const gridHelper = new THREE.GridHelper(20, 20, 0x1e293b, 0x0f172a)
    this.scene.add(gridHelper)
  }

  /**
   * 添加事件监听
   */
  addEventListeners() {
    // 窗口大小变化
    window.addEventListener('resize', this._onWindowResize)

    // 鼠标控制
    this.domElement.addEventListener('mousedown', this._onMouseDown)
    window.addEventListener('mousemove', this._onMouseMove)
    window.addEventListener('mouseup', this._onMouseUp)
    this.domElement.addEventListener('wheel', this._onWheel, { passive: false })
  }

  setDemoRotate(enabled) {
    if (!this.particleSystem) return
    this.particleSystem.setDemoRotate(enabled)
  }

  /**
   * 设置“位置(偏移)”gizmo，用于直接在 3D 里拖拽配置 pos
   */
  setOriginGizmo(options = {}) {
    const { enabled, pos, onChange } = options

    if (!enabled) {
      this.clearOriginGizmo()
      return
    }

    if (!this.originGizmo) {
      this.originGizmo = this.createOriginGizmo()
      this.scene.add(this.originGizmo.group)
    }

    if (typeof onChange === 'function') {
      this.originGizmo.onChange = onChange
    }

    if (this.isGizmoDragging) return

    if (pos) {
      this.originGizmo.pos.set(pos.x || 0, pos.y || 0, pos.z || 0)
    }

    this.updateOriginGizmoVisual()
  }

  clearOriginGizmo() {
    if (!this.originGizmo) return
    this.scene.remove(this.originGizmo.group)
    this.originGizmo.handle.geometry.dispose()
    this.originGizmo.handle.material.dispose()
    this.originGizmo = null
    this.isGizmoDragging = false
    this.activeGizmoHandle = null
    this.activeGizmoType = null
  }

  createOriginGizmo() {
    const group = new THREE.Group()
    const geo = new THREE.SphereGeometry(0.14, 16, 16)
    const mat = new THREE.MeshBasicMaterial({ color: 0xa78bfa }) // violet-400
    const handle = new THREE.Mesh(geo, mat)
    handle.userData = { gizmo: 'origin', role: 'pos' }
    group.add(handle)

    return {
      group,
      pos: new THREE.Vector3(0, 0, 0),
      handle,
      onChange: null,
    }
  }

  updateOriginGizmoVisual() {
    if (!this.originGizmo) return
    this.originGizmo.handle.position.copy(this.originGizmo.pos)
  }

  /**
   * 设置“速度”gizmo（显示一个向量箭头并允许拖拽）
   */
  setVelocityGizmo(options = {}) {
    const { enabled, origin, velocity, scale = 5, onChange } = options

    if (!enabled) {
      this.clearVelocityGizmo()
      return
    }

    if (!this.velocityGizmo) {
      this.velocityGizmo = this.createVelocityGizmo()
      this.scene.add(this.velocityGizmo.group)
    }

    if (typeof onChange === 'function') {
      this.velocityGizmo.onChange = onChange
    }

    if (this.isGizmoDragging) return

    this.velocityGizmo.scale = Math.max(0.1, Number(scale) || 5)

    if (origin) {
      this.velocityGizmo.origin.set(origin.x || 0, origin.y || 0, origin.z || 0)
    }
    if (velocity) {
      this.velocityGizmo.velocity.set(velocity.vx || 0, velocity.vy || 0, velocity.vz || 0)
    }

    this.updateVelocityGizmoVisual()
  }

  clearVelocityGizmo() {
    if (!this.velocityGizmo) return
    this.scene.remove(this.velocityGizmo.group)
    this.velocityGizmo.tipHandle.geometry.dispose()
    this.velocityGizmo.tipHandle.material.dispose()
    this.velocityGizmo.yHandle.geometry.dispose()
    this.velocityGizmo.yHandle.material.dispose()
    this.velocityGizmo.line.geometry.dispose()
    this.velocityGizmo.line.material.dispose()
    this.velocityGizmo.vLine.geometry.dispose()
    this.velocityGizmo.vLine.material.dispose()
    this.velocityGizmo = null
    this.isGizmoDragging = false
    this.activeGizmoHandle = null
    this.activeGizmoType = null
    this.gizmoDragContext = null
  }

  createVelocityGizmo() {
    const group = new THREE.Group()

    const tipGeo = new THREE.SphereGeometry(0.12, 16, 16)
    const yGeo = new THREE.SphereGeometry(0.12, 16, 16)
    const tipMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 }) // amber-400
    const yMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee }) // cyan-400

    const tipHandle = new THREE.Mesh(tipGeo, tipMat)
    tipHandle.userData = { gizmo: 'velocity', role: 'xz' }
    group.add(tipHandle)

    const yHandle = new THREE.Mesh(yGeo, yMat)
    yHandle.userData = { gizmo: 'velocity', role: 'y' }
    group.add(yHandle)

    const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()])
    const lineMat = new THREE.LineBasicMaterial({ color: 0xfbbf24 })
    const line = new THREE.Line(lineGeo, lineMat)
    group.add(line)

    const vLineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()])
    const vLineMat = new THREE.LineBasicMaterial({ color: 0x22d3ee })
    const vLine = new THREE.Line(vLineGeo, vLineMat)
    group.add(vLine)

    return {
      group,
      origin: new THREE.Vector3(0, 0, 0),
      velocity: new THREE.Vector3(0, 0, 0),
      scale: 5,
      tipHandle,
      yHandle,
      line,
      vLine,
      onChange: null,
    }
  }

  updateVelocityGizmoVisual() {
    if (!this.velocityGizmo) return
    const { origin, velocity, scale, tipHandle, yHandle, line, vLine } = this.velocityGizmo

    const tip = origin.clone().add(velocity.clone().multiplyScalar(scale))
    tipHandle.position.copy(tip)

    const yPos = origin.clone().add(new THREE.Vector3(0, velocity.y * scale, 0))
    yHandle.position.copy(yPos)

    line.geometry.setFromPoints([origin.clone(), tip.clone()])
    line.geometry.attributes.position.needsUpdate = true

    vLine.geometry.setFromPoints([origin.clone(), yPos.clone()])
    vLine.geometry.attributes.position.needsUpdate = true
  }

  /**
   * 设置“目标点”gizmo（用于一键由目标计算速度）
   */
  setTargetGizmo(options = {}) {
    const { enabled, target, onChange } = options

    if (!enabled) {
      this.clearTargetGizmo()
      return
    }

    if (!this.targetGizmo) {
      this.targetGizmo = this.createTargetGizmo()
      this.scene.add(this.targetGizmo.group)
    }

    if (typeof onChange === 'function') {
      this.targetGizmo.onChange = onChange
    }

    if (this.isGizmoDragging) return

    if (target) {
      this.targetGizmo.target.set(target.x || 0, target.y || 0, target.z || 0)
    }

    this.updateTargetGizmoVisual()
  }

  clearTargetGizmo() {
    if (!this.targetGizmo) return
    this.scene.remove(this.targetGizmo.group)
    this.targetGizmo.handle.geometry.dispose()
    this.targetGizmo.handle.material.dispose()
    this.targetGizmo.yHandle.geometry.dispose()
    this.targetGizmo.yHandle.material.dispose()
    this.targetGizmo.vLine.geometry.dispose()
    this.targetGizmo.vLine.material.dispose()
    this.targetGizmo = null
    this.isGizmoDragging = false
    this.activeGizmoHandle = null
    this.activeGizmoType = null
    this.gizmoDragContext = null
  }

  createTargetGizmo() {
    const group = new THREE.Group()

    const geo = new THREE.SphereGeometry(0.14, 16, 16)
    const mat = new THREE.MeshBasicMaterial({ color: 0xfb7185 }) // rose-400
    const handle = new THREE.Mesh(geo, mat)
    handle.userData = { gizmo: 'target', role: 'xz' }
    group.add(handle)

    const yGeo = new THREE.SphereGeometry(0.12, 16, 16)
    const yMat = new THREE.MeshBasicMaterial({ color: 0x34d399 }) // emerald-400
    const yHandle = new THREE.Mesh(yGeo, yMat)
    yHandle.userData = { gizmo: 'target', role: 'y' }
    group.add(yHandle)

    const vLineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()])
    const vLineMat = new THREE.LineBasicMaterial({ color: 0x34d399 })
    const vLine = new THREE.Line(vLineGeo, vLineMat)
    group.add(vLine)

    return {
      group,
      target: new THREE.Vector3(2, 0, 0),
      handle,
      yHandle,
      vLine,
      onChange: null,
    }
  }

  updateTargetGizmoVisual() {
    if (!this.targetGizmo) return
    const { target, handle, yHandle, vLine } = this.targetGizmo

    handle.position.copy(target)
    const yPos = new THREE.Vector3(target.x, target.y, target.z)
    yHandle.position.copy(yPos)
    vLine.geometry.setFromPoints([new THREE.Vector3(target.x, 0, target.z), yPos.clone()])
    vLine.geometry.attributes.position.needsUpdate = true
  }

  /**
   * 设置圆形编辑 gizmo（XZ 平面）
   */
  setCircleGizmo(options = {}) {
    const { enabled, center, radius, onChange } = options

    if (!enabled) {
      this.clearCircleGizmo()
      return
    }

    if (!this.circleGizmo) {
      this.circleGizmo = this.createCircleGizmo()
      this.scene.add(this.circleGizmo.group)
    }

    if (typeof onChange === 'function') {
      this.circleGizmo.onChange = onChange
    }

    // 拖拽中：内部状态已经在 onMouseMove 更新，避免外部 watcher 反向覆盖导致抖动
    if (this.isGizmoDragging) return

    const prevCenter = this.circleGizmo.center.clone()

    if (center) {
      this.circleGizmo.center.set(center.x || 0, center.y || 0, center.z || 0)
    }
    if (typeof radius === 'number') {
      this.circleGizmo.radius = Math.max(0.1, radius)
    }

    // radiusPoint：保持原方向，仅调整距离；若方向为零向量则默认 +X
    const centerDelta = this.circleGizmo.center.clone().sub(prevCenter)
    this.circleGizmo.radiusPoint.add(centerDelta)

    const dir = this.circleGizmo.radiusPoint.clone().sub(this.circleGizmo.center)
    if (dir.lengthSq() < 1e-6) dir.set(1, 0, 0)
    dir.normalize()
    this.circleGizmo.radiusPoint.copy(this.circleGizmo.center.clone().add(dir.multiplyScalar(this.circleGizmo.radius)))
    this.circleGizmo.radiusPoint.y = this.circleGizmo.center.y

    this.updateCircleGizmoVisual()
  }

  clearCircleGizmo() {
    if (!this.circleGizmo) return
    this.scene.remove(this.circleGizmo.group)
    this.circleGizmo.centerHandle.geometry.dispose()
    this.circleGizmo.centerHandle.material.dispose()
    this.circleGizmo.radiusHandle.geometry.dispose()
    this.circleGizmo.radiusHandle.material.dispose()
    this.circleGizmo.line.geometry.dispose()
    this.circleGizmo.line.material.dispose()
    this.circleGizmo = null
    this.isGizmoDragging = false
    this.activeGizmoHandle = null
    this.activeGizmoType = null
  }

  setLineGizmo(options = {}) {
    const { enabled, start, end, onChange } = options

    if (!enabled) {
      this.clearLineGizmo()
      return
    }

    if (!this.lineGizmo) {
      this.lineGizmo = this.createLineGizmo()
      this.scene.add(this.lineGizmo.group)
    }

    if (typeof onChange === 'function') {
      this.lineGizmo.onChange = onChange
    }

    if (this.isGizmoDragging) return

    if (start) {
      this.lineGizmo.start.set(start.x || 0, start.y || 0, start.z || 0)
    }
    if (end) {
      this.lineGizmo.end.set(end.x || 0, end.y || 0, end.z || 0)
    }

    this.updateLineGizmoVisual()
  }

  clearLineGizmo() {
    if (!this.lineGizmo) return
    this.scene.remove(this.lineGizmo.group)
    this.lineGizmo.startHandle.geometry.dispose()
    this.lineGizmo.startHandle.material.dispose()
    this.lineGizmo.endHandle.geometry.dispose()
    this.lineGizmo.endHandle.material.dispose()
    this.lineGizmo.line.geometry.dispose()
    this.lineGizmo.line.material.dispose()
    this.lineGizmo = null
    this.isGizmoDragging = false
    this.activeGizmoHandle = null
    this.activeGizmoType = null
  }

  createCircleGizmo() {
    const group = new THREE.Group()

    const centerGeo = new THREE.SphereGeometry(0.12, 16, 16)
    const radiusGeo = new THREE.SphereGeometry(0.12, 16, 16)
    const centerMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa }) // blue-400
    const radiusMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b }) // amber-500

    const centerHandle = new THREE.Mesh(centerGeo, centerMat)
    centerHandle.userData = { gizmo: 'circle', role: 'center' }
    group.add(centerHandle)

    const radiusHandle = new THREE.Mesh(radiusGeo, radiusMat)
    radiusHandle.userData = { gizmo: 'circle', role: 'radius' }
    group.add(radiusHandle)

    const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()])
    const lineMat = new THREE.LineBasicMaterial({ color: 0x94a3b8 }) // slate-400
    const line = new THREE.Line(lineGeo, lineMat)
    group.add(line)

    return {
      group,
      center: new THREE.Vector3(0, 0, 0),
      radius: 1,
      radiusPoint: new THREE.Vector3(1, 0, 0),
      centerHandle,
      radiusHandle,
      line,
      onChange: null,
    }
  }

  createLineGizmo() {
    const group = new THREE.Group()

    const startGeo = new THREE.SphereGeometry(0.12, 16, 16)
    const endGeo = new THREE.SphereGeometry(0.12, 16, 16)
    const startMat = new THREE.MeshBasicMaterial({ color: 0x34d399 }) // emerald-400
    const endMat = new THREE.MeshBasicMaterial({ color: 0xf472b6 }) // pink-400

    const startHandle = new THREE.Mesh(startGeo, startMat)
    startHandle.userData = { gizmo: 'line', role: 'start' }
    group.add(startHandle)

    const endHandle = new THREE.Mesh(endGeo, endMat)
    endHandle.userData = { gizmo: 'line', role: 'end' }
    group.add(endHandle)

    const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()])
    const lineMat = new THREE.LineBasicMaterial({ color: 0x94a3b8 }) // slate-400
    const line = new THREE.Line(lineGeo, lineMat)
    group.add(line)

    return {
      group,
      start: new THREE.Vector3(-1, 0, 0),
      end: new THREE.Vector3(1, 0, 0),
      startHandle,
      endHandle,
      line,
      onChange: null,
    }
  }

  updateCircleGizmoVisual() {
    if (!this.circleGizmo) return
    const { center, radiusPoint, centerHandle, radiusHandle, line } = this.circleGizmo

    centerHandle.position.copy(center)
    radiusHandle.position.copy(radiusPoint)

    const points = [center.clone(), radiusPoint.clone()]
    line.geometry.setFromPoints(points)
    line.geometry.attributes.position.needsUpdate = true
  }

  updateLineGizmoVisual() {
    if (!this.lineGizmo) return
    const { start, end, startHandle, endHandle, line } = this.lineGizmo

    startHandle.position.copy(start)
    endHandle.position.copy(end)

    const points = [start.clone(), end.clone()]
    line.geometry.setFromPoints(points)
    line.geometry.attributes.position.needsUpdate = true
  }

  getPointerNDC(e) {
    const rect = this.domElement.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
    this.pointer.set(x, y)
    return this.pointer
  }

  pickGizmoHandle(e) {
    if (!this.domElement) return null

    this.getPointerNDC(e)
    this.raycaster.setFromCamera(this.pointer, this.camera)
    const targets = []
    if (this.circleGizmo) targets.push(this.circleGizmo.centerHandle, this.circleGizmo.radiusHandle)
    if (this.lineGizmo) targets.push(this.lineGizmo.startHandle, this.lineGizmo.endHandle)
    if (this.originGizmo) targets.push(this.originGizmo.handle)
    if (this.velocityGizmo) targets.push(this.velocityGizmo.tipHandle, this.velocityGizmo.yHandle)
    if (this.targetGizmo) targets.push(this.targetGizmo.handle, this.targetGizmo.yHandle)
    if (targets.length === 0) return null
    return this.raycaster.intersectObjects(targets, false)[0] || null
  }

  updateVelocityGizmoDrag(e) {
    if (!this.velocityGizmo || !this.activeGizmoHandle) return

    const role = this.activeGizmoHandle.userData.role

    if (role === 'y') {
      if (!this.gizmoDragContext) return
      const dy = e.clientY - this.gizmoDragContext.startClientY
      const nextVy = this.gizmoDragContext.startValue + (-dy) * 0.01
      this.velocityGizmo.velocity.y = nextVy
      this.updateVelocityGizmoVisual()
      if (typeof this.velocityGizmo.onChange === 'function') {
        this.velocityGizmo.onChange({
          vx: this.velocityGizmo.velocity.x,
          vy: this.velocityGizmo.velocity.y,
          vz: this.velocityGizmo.velocity.z,
        })
      }
      return
    }

    this.getPointerNDC(e)
    this.raycaster.setFromCamera(this.pointer, this.camera)

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -this.velocityGizmo.origin.y)
    const hitPoint = new THREE.Vector3()
    const ok = this.raycaster.ray.intersectPlane(plane, hitPoint)
    if (!ok) return

    const delta = hitPoint.clone().sub(this.velocityGizmo.origin)
    this.velocityGizmo.velocity.x = delta.x / this.velocityGizmo.scale
    this.velocityGizmo.velocity.z = delta.z / this.velocityGizmo.scale

    this.updateVelocityGizmoVisual()

    if (typeof this.velocityGizmo.onChange === 'function') {
      this.velocityGizmo.onChange({
        vx: this.velocityGizmo.velocity.x,
        vy: this.velocityGizmo.velocity.y,
        vz: this.velocityGizmo.velocity.z,
      })
    }
  }

  updateTargetGizmoDrag(e) {
    if (!this.targetGizmo || !this.activeGizmoHandle) return

    const role = this.activeGizmoHandle.userData.role
    if (role === 'y') {
      if (!this.gizmoDragContext) return
      const dy = e.clientY - this.gizmoDragContext.startClientY
      this.targetGizmo.target.y = this.gizmoDragContext.startValue + (-dy) * 0.02
      this.updateTargetGizmoVisual()
      if (typeof this.targetGizmo.onChange === 'function') {
        this.targetGizmo.onChange({
          x: this.targetGizmo.target.x,
          y: this.targetGizmo.target.y,
          z: this.targetGizmo.target.z,
        })
      }
      return
    }

    this.getPointerNDC(e)
    this.raycaster.setFromCamera(this.pointer, this.camera)
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -this.targetGizmo.target.y)
    const hitPoint = new THREE.Vector3()
    const ok = this.raycaster.ray.intersectPlane(plane, hitPoint)
    if (!ok) return

    this.targetGizmo.target.x = hitPoint.x
    this.targetGizmo.target.z = hitPoint.z
    this.updateTargetGizmoVisual()

    if (typeof this.targetGizmo.onChange === 'function') {
      this.targetGizmo.onChange({
        x: this.targetGizmo.target.x,
        y: this.targetGizmo.target.y,
        z: this.targetGizmo.target.z,
      })
    }
  }

  updateOriginGizmoDrag(e) {
    if (!this.originGizmo || !this.activeGizmoHandle) return

    this.getPointerNDC(e)
    this.raycaster.setFromCamera(this.pointer, this.camera)

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -this.originGizmo.pos.y)
    const hitPoint = new THREE.Vector3()
    const ok = this.raycaster.ray.intersectPlane(plane, hitPoint)
    if (!ok) return

    this.originGizmo.pos.copy(hitPoint)
    this.updateOriginGizmoVisual()

    if (typeof this.originGizmo.onChange === 'function') {
      this.originGizmo.onChange({
        x: this.originGizmo.pos.x,
        y: this.originGizmo.pos.y,
        z: this.originGizmo.pos.z,
      })
    }
  }

  updateCircleGizmoDrag(e) {
    if (!this.circleGizmo || !this.activeGizmoHandle) return

    this.getPointerNDC(e)
    this.raycaster.setFromCamera(this.pointer, this.camera)

    // XZ 平面：y 固定为 center.y
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -this.circleGizmo.center.y)
    const hitPoint = new THREE.Vector3()
    const ok = this.raycaster.ray.intersectPlane(plane, hitPoint)
    if (!ok) return

    if (this.activeGizmoHandle.userData.role === 'center') {
      const delta = hitPoint.clone().sub(this.circleGizmo.center)
      this.circleGizmo.center.copy(hitPoint)
      this.circleGizmo.radiusPoint.add(delta)
      this.circleGizmo.radius = Math.max(0.1, this.circleGizmo.center.distanceTo(this.circleGizmo.radiusPoint))
    } else if (this.activeGizmoHandle.userData.role === 'radius') {
      const radius = Math.max(0.1, this.circleGizmo.center.distanceTo(hitPoint))
      this.circleGizmo.radius = radius
      this.circleGizmo.radiusPoint.set(hitPoint.x, this.circleGizmo.center.y, hitPoint.z)
    }

    this.updateCircleGizmoVisual()

    if (typeof this.circleGizmo.onChange === 'function') {
      this.circleGizmo.onChange({
        center: {
          x: this.circleGizmo.center.x,
          y: this.circleGizmo.center.y,
          z: this.circleGizmo.center.z,
        },
        radius: this.circleGizmo.radius,
      })
    }
  }

  updateLineGizmoDrag(e) {
    if (!this.lineGizmo || !this.activeGizmoHandle) return

    this.getPointerNDC(e)
    this.raycaster.setFromCamera(this.pointer, this.camera)

    const role = this.activeGizmoHandle.userData.role
    const y = role === 'start' ? this.lineGizmo.start.y : this.lineGizmo.end.y
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -y)
    const hitPoint = new THREE.Vector3()
    const ok = this.raycaster.ray.intersectPlane(plane, hitPoint)
    if (!ok) return

    if (role === 'start') {
      this.lineGizmo.start.copy(hitPoint)
    } else if (role === 'end') {
      this.lineGizmo.end.copy(hitPoint)
    }

    this.updateLineGizmoVisual()

    if (typeof this.lineGizmo.onChange === 'function') {
      this.lineGizmo.onChange({
        start: { x: this.lineGizmo.start.x, y: this.lineGizmo.start.y, z: this.lineGizmo.start.z },
        end: { x: this.lineGizmo.end.x, y: this.lineGizmo.end.y, z: this.lineGizmo.end.z },
      })
    }
  }

  /**
   * 更新粒子
   * @param {object} config - 粒子配置
   */
  updateParticles(config) {
    if (!this.isInitialized) return

    const result = this.particleSystem.generateParticles(config)
    return result
  }

  applyMotionPreview(options) {
    if (!this.isInitialized) return
    this.particleSystem.applyMotionPreview(options)
  }

  /**
   * 更新粒子颜色
   * @param {object} color - RGBA 颜色
   */
  updateColor(color) {
    if (!this.isInitialized) return
    this.particleSystem.updateParticleColor(color)
  }

  /**
   * 更新相机位置
   */
  updateCameraPosition() {
    const x = this.cameraDistance * Math.sin(this.cameraAngleX) * Math.cos(this.cameraAngleY)
    const y = this.cameraDistance * Math.sin(this.cameraAngleY)
    const z = this.cameraDistance * Math.cos(this.cameraAngleX) * Math.cos(this.cameraAngleY)

    this.camera.position.set(x, y, z)
    this.camera.lookAt(0, 0, 0)
  }

  /**
   * 重置相机
   */
  resetCamera() {
    this.cameraDistance = 10
    this.cameraAngleX = 0.5
    this.cameraAngleY = 0.5
    this.updateCameraPosition()
  }

  /**
   * 暂停/继续动画
   */
  togglePause() {
    return this.particleSystem.togglePause()
  }

  /**
   * 动画循环
   */
  animate = () => {
    this.animationId = requestAnimationFrame(this.animate)

    if (this.particleSystem) {
      this.particleSystem.animate()
    }

    this.renderer.render(this.scene, this.camera)
  }

  /**
   * 窗口大小变化处理
   */
  onWindowResize() {
    if (!this.container || !this.camera || !this.renderer) return

    const width = this.container.clientWidth
    const height = this.container.clientHeight

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  /**
   * 鼠标按下
   */
  onMouseDown(e) {
    // 先尝试选中 gizmo 控制点
    const hit = this.pickGizmoHandle(e)
    if (hit) {
      this.isGizmoDragging = true
      this.activeGizmoHandle = hit.object
      this.activeGizmoType = hit.object.userData?.gizmo || null
      this.gizmoDragContext = null

      const role = hit.object.userData?.role
      if (this.activeGizmoType === 'velocity' && role === 'y' && this.velocityGizmo) {
        this.gizmoDragContext = {
          startClientY: e.clientY,
          startValue: this.velocityGizmo.velocity.y,
        }
      }
      if (this.activeGizmoType === 'target' && role === 'y' && this.targetGizmo) {
        this.gizmoDragContext = {
          startClientY: e.clientY,
          startValue: this.targetGizmo.target.y,
        }
      }
      return
    }

    this.isDragging = true
    this.lastMouseX = e.clientX
    this.lastMouseY = e.clientY
  }

  /**
   * 鼠标移动
   */
  onMouseMove(e) {
    if (this.isGizmoDragging) {
      if (this.activeGizmoType === 'origin') this.updateOriginGizmoDrag(e)
      else if (this.activeGizmoType === 'velocity') this.updateVelocityGizmoDrag(e)
      else if (this.activeGizmoType === 'target') this.updateTargetGizmoDrag(e)
      else if (this.activeGizmoType === 'line') this.updateLineGizmoDrag(e)
      else this.updateCircleGizmoDrag(e)
      return
    }

    if (!this.isDragging) return

    const deltaX = e.clientX - this.lastMouseX
    const deltaY = e.clientY - this.lastMouseY

    this.cameraAngleX += deltaX * 0.01
    this.cameraAngleY += deltaY * 0.01

    // 限制垂直角度
    this.cameraAngleY = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, this.cameraAngleY))

    this.updateCameraPosition()

    this.lastMouseX = e.clientX
    this.lastMouseY = e.clientY
  }

  /**
   * 鼠标释放
   */
  onMouseUp() {
    this.isDragging = false
    this.isGizmoDragging = false
    this.activeGizmoHandle = null
    this.activeGizmoType = null
    this.gizmoDragContext = null
  }

  /**
   * 鼠标滚轮
   */
  onWheel(e) {
    e.preventDefault()
    this.cameraDistance += e.deltaY * 0.01
    this.cameraDistance = Math.max(2, Math.min(50, this.cameraDistance))
    this.updateCameraPosition()
  }

  /**
   * 销毁
   */
  dispose() {
    if (this.particleSystem) {
      this.particleSystem.dispose()
    }

    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }

    if (this.renderer) {
      this.renderer.dispose()
    }

    this.clearCircleGizmo()
    this.clearLineGizmo()
    this.clearOriginGizmo()
    this.clearVelocityGizmo()
    this.clearTargetGizmo()

    window.removeEventListener('resize', this._onWindowResize)
    if (this.domElement) {
      this.domElement.removeEventListener('mousedown', this._onMouseDown)
      this.domElement.removeEventListener('wheel', this._onWheel)
    }
    window.removeEventListener('mousemove', this._onMouseMove)
    window.removeEventListener('mouseup', this._onMouseUp)
  }
}

export default Preview3DManager
