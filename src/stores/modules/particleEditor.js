/**
 * ExParticle 编辑器状态管理
 */

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { PARTICLE_TYPES, COMMON_PARTICLES } from '@/assets/more/particlex/particleTypes.js'
import { generateCommand, generateMcFunction, parseMcFunction, validateCommand } from '@/assets/more/particlex/commandGenerator.js'

export const useParticleEditorStore = defineStore('particleEditor', () => {
  // ==================== 状态 ====================

  // 工程元信息（用于明确“先创建/打开工程再编辑”的工作流）
  const projectMeta = ref({
    version: 1,
    name: '',
    createdAt: '',
    updatedAt: '',
  })
  const projectLoaded = ref(false)

  // 当前选择的粒子类型
  const selectedType = ref('parameter')

  // 当前粒子配置
  const particleConfig = ref({
    type: 'parameter',
    name: 'minecraft:end_rod',
    pos: { x: 0, y: 0, z: 0 },
    color: { r: 1.0, g: 1.0, b: 1.0, a: 1.0 },
    speed: { vx: 0, vy: 0, vz: 0 },
    range: { dx: 1, dy: 1, dz: 1 },
    count: 500,
    age: 0,
    begin: 0,
    end: 6.28,
    calcInterval: 0.1,
    CPT: 10,
    expression: 'x=cos(t);y=0;z=sin(t)',
    speedExpression: '',
    group: ''
  })

  // 多指令项目配置
  const projectConfig = ref({
    type: 'parameter',
    description: '',
    commands: []
  })

  // 当前生成的指令
  const generatedCommands = ref([])

  // 是否正在预览
  const isPreviewing = ref(false)

  // 3D 预览中的粒子数据
  const previewParticles = ref([])

  // 可视化形状构建器（用于生成 expression）
  const shapeBuilder = ref({
    enabled: false,
    liveSync: true,
    shape: 'circle',
    circle: {
      center: { x: 0, y: 0, z: 0 },
      radius: 1,
    },
    line: {
      start: { x: -1, y: 0, z: 0 },
      end: { x: 1, y: 0, z: 0 },
    },
    helix: {
      center: { x: 0, y: 0, z: 0 },
      radius: 1,
      height: 2,
      turns: 2,
    },
    cloud: {
      center: { x: 0, y: 0, z: 0 },
      radius: 1,
      mode: 'sphere',
    },
  })

  // ==================== 计算属性 ====================

  // 当前粒子类型定义
  const currentParticleType = computed(() => {
    return PARTICLE_TYPES[selectedType.value]
  })

  // 验证结果
  const validationResult = computed(() => {
    return validateCommand(selectedType.value, particleConfig.value)
  })

  // 是否可以生成指令
  const canGenerate = computed(() => {
    return validationResult.value.valid
  })

  const canUseShapeBuilder = computed(() => {
    const type = currentParticleType.value
    if (!type) return false
    // 只有当该类型的指令参数里真正包含 expression 时，shape builder 才有意义
    return (
      type.params?.required?.includes('expression') ||
      type.params?.optional?.includes('expression')
    )
  })

  const usesExpression = computed(() => canUseShapeBuilder.value)

  const hasProject = computed(() => projectLoaded.value && !!projectMeta.value.createdAt)

  // 编辑器辅助：目标点/时长，用于一键计算初速度（不直接参与指令参数）
  const aimHelper = ref({
    target: { x: 2, y: 0, z: 0 },
    duration: 20,
    gravity: -0.04,
    velocityScale: 5,
  })

  // ==================== 方法 ====================

  /**
   * 更新粒子类型
   */
  const setParticleType = (type) => {
    selectedType.value = type
    particleConfig.value.type = type

    // 根据类型设置默认表达式
    const typeConfig = PARTICLE_TYPES[type]
    if (typeConfig.hasExpression) {
      if (type.includes('polar')) {
        particleConfig.value.expression = 's1=t;s2=0'
      } else {
        particleConfig.value.expression = 'x=cos(t);y=0;z=sin(t)'
      }
    }
  }

  /**
   * 更新粒子配置
   */
  const updateConfig = (key, value) => {
    particleConfig.value[key] = value
  }

  /**
   * 更新嵌套配置对象
   */
  const updateNestedConfig = (parent, key, value) => {
    if (particleConfig.value[parent]) {
      particleConfig.value[parent][key] = value
    }
  }

  const setAimTarget = (next) => {
    aimHelper.value.target = {
      ...aimHelper.value.target,
      ...(next || {}),
    }
  }

  const snapAimTargetToGround = (groundY = 0) => {
    const y = Number(groundY)
    aimHelper.value.target = {
      ...aimHelper.value.target,
      y: Number.isFinite(y) ? y : 0,
    }
  }

  const setAimDuration = (ticks) => {
    const t = Math.max(1, Math.floor(Number(ticks) || 1))
    aimHelper.value.duration = t
  }

  const setAimGravity = (g) => {
    const gv = Number(g)
    aimHelper.value.gravity = Number.isFinite(gv) ? gv : aimHelper.value.gravity
  }

  const setVelocityScale = (scale) => {
    const s = Math.max(0.1, Number(scale) || 5)
    aimHelper.value.velocityScale = s
  }

  const applyVelocityFromTarget = ({ useGravity = false } = {}) => {
    const origin = particleConfig.value.pos || { x: 0, y: 0, z: 0 }
    const target = aimHelper.value.target || { x: 0, y: 0, z: 0 }
    const t = Math.max(1, Math.floor(Number(aimHelper.value.duration) || 1))

    const dx = (Number(target.x) || 0) - (Number(origin.x) || 0)
    const dy = (Number(target.y) || 0) - (Number(origin.y) || 0)
    const dz = (Number(target.z) || 0) - (Number(origin.z) || 0)

    let vx = dx / t
    let vy = dy / t
    let vz = dz / t

    if (useGravity) {
      const g = Number(aimHelper.value.gravity) || 0
      // 离散模拟（与编辑器预览一致）：vy = vy + g; y = y + vy
      // y_t = y0 + t*vy0 + g*t(t+1)/2
      vy = (dy - g * (t * (t + 1) / 2)) / t
      particleConfig.value.speedExpression = `vy=vy+(${g})`
    }

    particleConfig.value.speed = {
      vx: Number(vx.toFixed(4)),
      vy: Number(vy.toFixed(4)),
      vz: Number(vz.toFixed(4)),
    }
  }

  /**
   * 生成当前指令
   */
  const generateCurrentCommand = () => {
    if (!canGenerate.value) {
      return null
    }

    try {
      const command = generateCommand(selectedType.value, particleConfig.value)
      return command
    } catch (error) {
      console.error('Failed to generate command:', error)
      return null
    }
  }

  /**
   * 更新生成的指令列表
   */
  const updateGeneratedCommands = () => {
    const commands = []

    // 添加注释
    commands.push('# ExParticle 粒子效果配置')
    commands.push(`# 粒子类型: ${selectedType.value}`)
    commands.push(`# 创建时间: ${new Date().toLocaleString('zh-CN')}`)
    commands.push('')

    // 生成指令
    const command = generateCurrentCommand()
    if (command) {
      commands.push(command)
    }

    generatedCommands.value = commands
    return commands
  }

  /**
   * 从模板加载配置
   */
  const loadTemplate = (template) => {
    setParticleType(template.type || 'parameter')

    if (template.params) {
      const nextParams = { ...template.params }
      // 兼容旧模板：step -> calcInterval
      if (nextParams.step !== undefined && nextParams.calcInterval === undefined) {
        nextParams.calcInterval = nextParams.step
      }
      delete nextParams.step

      Object.assign(particleConfig.value, nextParams)
    }

    if (template.expression) {
      particleConfig.value.expression = template.expression
    }

    updateGeneratedCommands()
  }

  const formatNumber = (num) => {
    const n = Number(num)
    if (!Number.isFinite(n)) return '0'
    // 保留最多 6 位小数，去掉多余 0
    return String(Number(n.toFixed(6)))
  }

  const applyCircleShapeToExpression = (circle) => {
    const cx = formatNumber(circle.center.x)
    const cy = formatNumber(circle.center.y)
    const cz = formatNumber(circle.center.z)
    const r = formatNumber(circle.radius)
    // 注意：这里输出的是 x/y/z 的参数方程（适用于 hasExpression 的类型）
    return `x=${cx}+${r}*cos(t);y=${cy};z=${cz}+${r}*sin(t)`
  }

  const applyLineShapeToExpression = (line) => {
    const sx = formatNumber(line.start.x)
    const sy = formatNumber(line.start.y)
    const sz = formatNumber(line.start.z)
    const ex = formatNumber(line.end.x)
    const ey = formatNumber(line.end.y)
    const ez = formatNumber(line.end.z)

    // 线段：t in [0, 1]
    return `x=${sx}+(${ex}-${sx})*t;y=${sy}+(${ey}-${sy})*t;z=${sz}+(${ez}-${sz})*t`
  }

  const applyHelixShapeToExpression = (helix) => {
    const cx = formatNumber(helix.center.x)
    const cy = formatNumber(helix.center.y)
    const cz = formatNumber(helix.center.z)
    const r = formatNumber(helix.radius)
    const height = formatNumber(helix.height)
    const turns = Math.max(0.25, Number(helix.turns) || 1)

    // 使用数值常量，避免依赖 PI 常量
    const twoPi = 6.283185
    const end = formatNumber(twoPi * turns)
    const k = formatNumber(height / (twoPi * turns))

    // 螺旋：t in [0, 2π*turns]
    // y = cy + k * t
    return `x=${cx}+${r}*cos(t);y=${cy}+${k}*t;z=${cz}+${r}*sin(t)`
  }

  const applyCloudShapeToExpression = (cloud) => {
    const cx = formatNumber(cloud.center.x)
    const cy = formatNumber(cloud.center.y)
    const cz = formatNumber(cloud.center.z)
    const r = formatNumber(cloud.radius)
    const twoPi = 6.283185

    // 使用 random() 生成点云（每个 t 采样一次）
    if (cloud.mode === 'disk') {
      // XZ 平面圆盘：使用 sqrt(random()) 保证面积上更均匀
      return `a=random()*${twoPi};rr=sqrt(random())*${r};x=${cx}+rr*cos(a);y=${cy};z=${cz}+rr*sin(a)`
    }

    // sphere：球面/球体点云（这里做“球体内均匀”近似：u 控 y，rr 控 xz）
    return `a=random()*${twoPi};u=random()*2-1;rr=sqrt(1-u*u)*${r};x=${cx}+rr*cos(a);y=${cy}+u*${r};z=${cz}+rr*sin(a)`
  }

  const ensureSamplingDefaults = (mode) => {
    // 尽量给不同形状一套“好看且不太重”的默认采样
    if (mode === 'line') {
      particleConfig.value.begin = 0
      particleConfig.value.end = 1
      particleConfig.value.calcInterval = particleConfig.value.calcInterval || 0.02
      return
    }

    if (mode === 'helix') {
      const turns = Math.max(0.25, Number(shapeBuilder.value.helix.turns) || 1)
      particleConfig.value.begin = 0
      particleConfig.value.end = 6.283185 * turns
      particleConfig.value.calcInterval = particleConfig.value.calcInterval || 0.05
      return
    }

    // circle / cloud
    if (particleConfig.value.begin === undefined) particleConfig.value.begin = 0
    if (particleConfig.value.end === undefined) particleConfig.value.end = 6.28
    if (!particleConfig.value.calcInterval) particleConfig.value.calcInterval = 0.1
  }

  const updateCircleShape = (partial) => {
    shapeBuilder.value.circle = {
      ...shapeBuilder.value.circle,
      ...partial,
      center: {
        ...shapeBuilder.value.circle.center,
        ...(partial.center || {}),
      },
    }

    if (shapeBuilder.value.liveSync && canUseShapeBuilder.value && shapeBuilder.value.shape === 'circle') {
      ensureSamplingDefaults('circle')
      particleConfig.value.expression = applyCircleShapeToExpression(shapeBuilder.value.circle)
    }
  }

  const updateLineShape = (partial) => {
    shapeBuilder.value.line = {
      ...shapeBuilder.value.line,
      ...partial,
      start: {
        ...shapeBuilder.value.line.start,
        ...(partial.start || {}),
      },
      end: {
        ...shapeBuilder.value.line.end,
        ...(partial.end || {}),
      },
    }

    if (shapeBuilder.value.liveSync && canUseShapeBuilder.value && shapeBuilder.value.shape === 'line') {
      ensureSamplingDefaults('line')
      particleConfig.value.expression = applyLineShapeToExpression(shapeBuilder.value.line)
    }
  }

  const updateHelixShape = (partial) => {
    shapeBuilder.value.helix = {
      ...shapeBuilder.value.helix,
      ...partial,
      center: {
        ...shapeBuilder.value.helix.center,
        ...(partial.center || {}),
      },
    }

    if (shapeBuilder.value.liveSync && canUseShapeBuilder.value && shapeBuilder.value.shape === 'helix') {
      ensureSamplingDefaults('helix')
      particleConfig.value.expression = applyHelixShapeToExpression(shapeBuilder.value.helix)
    }
  }

  const updateCloudShape = (partial) => {
    shapeBuilder.value.cloud = {
      ...shapeBuilder.value.cloud,
      ...partial,
      center: {
        ...shapeBuilder.value.cloud.center,
        ...(partial.center || {}),
      },
    }

    if (shapeBuilder.value.liveSync && canUseShapeBuilder.value && shapeBuilder.value.shape === 'cloud') {
      ensureSamplingDefaults('cloud')
      particleConfig.value.expression = applyCloudShapeToExpression(shapeBuilder.value.cloud)
    }
  }

  const setShapeBuilderShape = (shape) => {
    shapeBuilder.value.shape = shape
    if (!shapeBuilder.value.enabled) return
    if (!canUseShapeBuilder.value) return

    if (shapeBuilder.value.liveSync) {
      ensureSamplingDefaults(shape)
      if (shape === 'circle') particleConfig.value.expression = applyCircleShapeToExpression(shapeBuilder.value.circle)
      else if (shape === 'line') particleConfig.value.expression = applyLineShapeToExpression(shapeBuilder.value.line)
      else if (shape === 'helix') particleConfig.value.expression = applyHelixShapeToExpression(shapeBuilder.value.helix)
      else if (shape === 'cloud') particleConfig.value.expression = applyCloudShapeToExpression(shapeBuilder.value.cloud)
    }
  }

  const setShapeBuilderEnabled = (enabled) => {
    shapeBuilder.value.enabled = !!enabled
    if (!shapeBuilder.value.enabled) return
    if (!canUseShapeBuilder.value) {
      shapeBuilder.value.enabled = false
      return
    }

    // 初次开启时，把当前形状应用到表达式（避免“启用后无变化”）
    if (shapeBuilder.value.liveSync) {
      ensureSamplingDefaults(shapeBuilder.value.shape)
      applyShapeBuilderOnce()
    }
  }

  const setShapeBuilderLiveSync = (liveSync) => {
    shapeBuilder.value.liveSync = !!liveSync
    if (shapeBuilder.value.liveSync && canUseShapeBuilder.value) {
      ensureSamplingDefaults(shapeBuilder.value.shape)
      applyShapeBuilderOnce()
    }
  }

  const applyShapeBuilderOnce = () => {
    if (!canUseShapeBuilder.value) return
    if (shapeBuilder.value.shape === 'circle') particleConfig.value.expression = applyCircleShapeToExpression(shapeBuilder.value.circle)
    else if (shapeBuilder.value.shape === 'line') particleConfig.value.expression = applyLineShapeToExpression(shapeBuilder.value.line)
    else if (shapeBuilder.value.shape === 'helix') {
      ensureSamplingDefaults('helix')
      particleConfig.value.expression = applyHelixShapeToExpression(shapeBuilder.value.helix)
    }
    else if (shapeBuilder.value.shape === 'cloud') particleConfig.value.expression = applyCloudShapeToExpression(shapeBuilder.value.cloud)
  }

  /**
   * 添加到项目（多指令）
   */
  const addToProject = (comment = '') => {
    const command = generateCurrentCommand()
    if (!command) return

    projectConfig.value.commands.push({
      type: selectedType.value,
      params: { ...particleConfig.value },
      comment
    })

    updateProjectCommands()
  }

  /**
   * 从项目中移除指令
   */
  const removeFromProject = (index) => {
    projectConfig.value.commands.splice(index, 1)
    updateProjectCommands()
  }

  /**
   * 更新项目指令列表
   */
  const updateProjectCommands = () => {
    const commands = []

    commands.push('# ExParticle 粒子效果配置')
    commands.push(`# 粒子类型: ${projectConfig.value.type}`)
    commands.push(`# 创建时间: ${new Date().toLocaleString('zh-CN')}`)
    if (projectConfig.value.description) {
      commands.push(`# 描述: ${projectConfig.value.description}`)
    }
    commands.push('')

    for (const cmdConfig of projectConfig.value.commands) {
      if (cmdConfig.comment) {
        commands.push(`# ${cmdConfig.comment}`)
      }
      const cmd = generateCommand(cmdConfig.type, cmdConfig.params)
      commands.push(cmd)
      commands.push('')
    }

    generatedCommands.value = commands
  }

  /**
   * 导出为 mcfunction 文件
   */
  const exportMcFunction = () => {
    const content = generateMcFunction({
      type: projectConfig.value.type,
      description: projectConfig.value.description,
      config: particleConfig.value,
      commands: projectConfig.value.commands.length > 0
        ? projectConfig.value.commands
        : [{ type: selectedType.value, params: particleConfig.value }]
    })

    // 创建下载
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `particlex_${Date.now()}.mcfunction`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  /**
   * 导入 mcfunction 文件
   */
  const importMcFunction = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const project = parseMcFunction(e.target.result)
          projectConfig.value = project

          if (project.commands.length > 0) {
            // 加载第一个指令作为当前配置
            const firstCmd = project.commands[0]
            setParticleType(firstCmd.type)
            Object.assign(particleConfig.value, firstCmd.params)
          }

          updateProjectCommands()
          projectLoaded.value = true
          if (!projectMeta.value.createdAt) {
            const now = new Date().toISOString()
            projectMeta.value = {
              version: 1,
              name: file?.name?.replace(/\.mcfunction$/i, '') || 'Imported',
              createdAt: now,
              updatedAt: now,
            }
          } else {
            projectMeta.value.updatedAt = new Date().toISOString()
          }
          resolve(project)
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }

  /**
   * 重置配置
   */
  const _resetAllState = () => {
    particleConfig.value = {
      type: 'parameter',
      name: 'minecraft:end_rod',
      pos: { x: 0, y: 0, z: 0 },
      color: { r: 1.0, g: 1.0, b: 1.0, a: 1.0 },
      speed: { vx: 0, vy: 0, vz: 0 },
      range: { dx: 1, dy: 1, dz: 1 },
      count: 500,
      age: 0,
      begin: 0,
      end: 6.28,
      calcInterval: 0.1,
      CPT: 10,
      expression: 'x=cos(t);y=0;z=sin(t)',
      speedExpression: '',
      group: ''
    }

    projectConfig.value = {
      type: 'parameter',
      description: '',
      commands: []
    }

    generatedCommands.value = []

    shapeBuilder.value = {
      enabled: false,
      liveSync: true,
      shape: 'circle',
      circle: {
        center: { x: 0, y: 0, z: 0 },
        radius: 1,
      },
      line: {
        start: { x: -1, y: 0, z: 0 },
        end: { x: 1, y: 0, z: 0 },
      },
      helix: {
        center: { x: 0, y: 0, z: 0 },
        radius: 1,
        height: 2,
        turns: 2,
      },
      cloud: {
        center: { x: 0, y: 0, z: 0 },
        radius: 1,
        mode: 'sphere',
      },
    }

    selectedType.value = 'parameter'
    particleConfig.value.type = 'parameter'
  }

  const resetConfig = () => {
    _resetAllState()
  }

  const newProject = (name = '') => {
    _resetAllState()
    const now = new Date().toISOString()
    projectMeta.value = {
      version: 1,
      name: (name || '').trim() || `ExParticle_${new Date().toLocaleString('zh-CN').replace(/[/:]/g, '-')}`,
      createdAt: now,
      updatedAt: now,
    }
    projectLoaded.value = true
    updateGeneratedCommands()
  }

  const exportProjectFile = () => {
    if (!hasProject.value) return
    projectMeta.value.updatedAt = new Date().toISOString()

    const payload = {
      version: 1,
      meta: projectMeta.value,
      selectedType: selectedType.value,
      particleConfig: particleConfig.value,
      shapeBuilder: shapeBuilder.value,
      projectConfig: projectConfig.value
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const safeName = (projectMeta.value.name || 'project').replace(/[\\/:*?"<>|]+/g, '_')
    link.href = url
    link.download = `${safeName}.particlex.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const importProjectFile = async (file) => {
    const text = await file.text()
    const json = JSON.parse(text)
    if (!json || typeof json !== 'object') throw new Error('无效工程文件')
    if (!json.particleConfig) throw new Error('工程文件缺少 particleConfig')

    _resetAllState()

    projectMeta.value = json.meta || {
      version: 1,
      name: file?.name?.replace(/\.particlex\.json$/i, '') || 'Imported',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    projectLoaded.value = true

    selectedType.value = json.selectedType || 'parameter'
    setParticleType(selectedType.value)
    Object.assign(particleConfig.value, json.particleConfig)
    if (json.shapeBuilder) shapeBuilder.value = json.shapeBuilder
    if (json.projectConfig) projectConfig.value = json.projectConfig

    updateProjectCommands()
  }

  // ==================== 监听配置变化 ====================

  watch(particleConfig, () => {
    updateGeneratedCommands()
  }, { deep: true })

  watch(selectedType, () => {
    updateGeneratedCommands()
  })

  // 初始化
  updateGeneratedCommands()

  return {
    // 状态
    projectMeta,
    projectLoaded,
    hasProject,
    aimHelper,
    selectedType,
    particleConfig,
    projectConfig,
    generatedCommands,
    isPreviewing,
    previewParticles,
    shapeBuilder,

    // 计算属性
    currentParticleType,
    validationResult,
    canGenerate,
    canUseShapeBuilder,
    usesExpression,

    // 方法
    setParticleType,
    updateConfig,
    updateNestedConfig,
    setAimTarget,
    snapAimTargetToGround,
    setAimDuration,
    setAimGravity,
    setVelocityScale,
    applyVelocityFromTarget,
    generateCurrentCommand,
    updateGeneratedCommands,
    loadTemplate,
    setShapeBuilderEnabled,
    setShapeBuilderLiveSync,
    updateCircleShape,
    updateLineShape,
    updateHelixShape,
    updateCloudShape,
    setShapeBuilderShape,
    applyShapeBuilderOnce,
    addToProject,
    removeFromProject,
    updateProjectCommands,
    exportMcFunction,
    importMcFunction,
    resetConfig,
    newProject,
    exportProjectFile,
    importProjectFile
  }
})
