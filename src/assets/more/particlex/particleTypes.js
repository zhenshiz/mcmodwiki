/**
 * ExParticle 粒子类型定义
 * 定义所有粒子类型的参数结构和 Inspector 配置
 */

// 基础粒子类型
export const PARTICLE_TYPES = {
  normal: {
    id: 'normal',
    name: '普通粒子',
    description: '按照原版方式生成粒子，可调颜色、初速度、寿命以及控制运动轨迹',
    command: 'normal',
    hasExpression: true,
    hasSpeedExpression: true,
    params: {
      // 必需参数
      required: ['name', 'pos', 'color', 'speed', 'range', 'count'],
      // 可选参数
      optional: ['age', 'speedExpression', 'calcInterval', 'group']
    }
  },

  conditional: {
    id: 'conditional',
    name: '条件粒子',
    description: '根据给出的条件表达式生成粒子',
    command: 'conditional',
    hasExpression: true,
    hasSpeedExpression: true,
    params: {
      required: ['name', 'pos', 'color', 'speed', 'range', 'expression'],
      optional: ['calcInterval', 'age', 'speedExpression', 'group']
    }
  },

  parameter: {
    id: 'parameter',
    name: '参数方程',
    description: '根据给出的参数方程生成粒子',
    command: 'parameter',
    hasExpression: true,
    hasSpeedExpression: true,
    params: {
      required: ['name', 'pos', 'color', 'speed', 'begin', 'end', 'expression'],
      optional: ['calcInterval', 'age', 'speedExpression', 'group']
    }
  },

  'polar-parameter': {
    id: 'polar-parameter',
    name: '极坐标方程',
    description: '根据给出的参数方程在极坐标系中生成粒子',
    command: 'polar-parameter',
    hasExpression: true,
    hasSpeedExpression: true,
    params: {
      required: ['name', 'pos', 'color', 'speed', 'begin', 'end', 'expression'],
      optional: ['calcInterval', 'age', 'speedExpression', 'group']
    }
  },

  'rgba-parameter': {
    id: 'rgba-parameter',
    name: '动态颜色参数方程',
    description: '粒子颜色在表达式中指定，可随 t 变化',
    command: 'rgba-parameter',
    hasExpression: true,
    hasSpeedExpression: true,
    hasColorExpression: true,
    params: {
      required: ['name', 'pos', 'speed', 'begin', 'end', 'expression'],
      optional: ['calcInterval', 'age', 'speedExpression', 'group']
    }
  },

  'tick-parameter': {
    id: 'tick-parameter',
    name: '动画参数方程',
    description: '根据 CPT 参数逐帧生成粒子，可做动画效果',
    command: 'tick-parameter',
    hasExpression: true,
    hasSpeedExpression: true,
    params: {
      required: ['name', 'pos', 'color', 'speed', 'begin', 'end', 'expression', 'CPT'],
      optional: ['calcInterval', 'age', 'speedExpression', 'group']
    }
  },

  'rgba-tick-parameter': {
    id: 'rgba-tick-parameter',
    name: '动态颜色动画参数方程',
    description: '支持动态颜色和逐帧动画',
    command: 'rgba-tick-parameter',
    hasExpression: true,
    hasSpeedExpression: true,
    hasColorExpression: true,
    params: {
      required: ['name', 'pos', 'speed', 'begin', 'end', 'expression', 'CPT'],
      optional: ['calcInterval', 'age', 'speedExpression', 'group']
    }
  },

  image: {
    id: 'image',
    name: '图片转粒子',
    description: '根据图片生成粒子效果',
    command: 'image',
    hasExpression: false,
    hasSpeedExpression: true,
    params: {
      required: ['name', 'pos', 'path'],
      optional: ['scaling', 'xRotation', 'yRotation', 'zRotation', 'flip', 'DPB', 'speed', 'age', 'speedExpression', 'calcInterval', 'group']
    }
  },

  'image-matrix': {
    id: 'image-matrix',
    name: '图片矩阵变换',
    description: '使用矩阵变换的图片粒子效果',
    command: 'image-matrix',
    hasExpression: false,
    hasSpeedExpression: true,
    params: {
      required: ['name', 'pos', 'path'],
      optional: ['scaling', 'matrix', 'DPB', 'speed', 'age', 'speedExpression', 'calcInterval', 'group']
    }
  },

  video: {
    id: 'video',
    name: '视频转粒子',
    description: '根据视频生成粒子效果',
    command: 'video',
    hasExpression: false,
    hasSpeedExpression: true,
    params: {
      required: ['name', 'pos', 'path'],
      optional: ['scaling', 'xRotation', 'yRotation', 'zRotation', 'flip', 'DPB', 'speed', 'age', 'speedExpression', 'calcInterval', 'group']
    }
  },

  'video-matrix': {
    id: 'video-matrix',
    name: '视频矩阵变换',
    description: '使用矩阵变换的视频粒子效果',
    command: 'video-matrix',
    hasExpression: false,
    hasSpeedExpression: true,
    params: {
      required: ['name', 'pos', 'path'],
      optional: ['scaling', 'matrix', 'DPB', 'speed', 'age', 'speedExpression', 'calcInterval', 'group']
    }
  }
}

// 常用粒子类型列表
export const COMMON_PARTICLES = [
  'minecraft:end_rod',
  'minecraft:flame',
  'minecraft:heart',
  'minecraft:dragon_breath',
  'minecraft:totem_of_undying',
  'minecraft:lava',
  'minecraft:rainbow',
  'minecraft:spark',
  'minecraft:cloud',
  'minecraft:crit',
  'minecraft:magic_crit',
  'minecraft:smoke',
  'minecraft:large_smoke',
  'minecraft:explosion_emitter',
  'minecraft:firework',
  'minecraft:bubble',
  'minecraft:splash',
  'minecraft:enchant',
  'minecraft:nautilus',
  'minecraft:mycelium',
  'minecraft:spore_blossom_air',
  'minecraft:sneeze',
  'minecraft:falling_dust',
  'minecraft:dripping_water',
  'minecraft:dripping_lava',
  'minecraft:falling_water',
  'minecraft:falling_lava',
  'minecraft:landing_lava',
  'minecraft:witch',
  'minecraft:dragon_breath',
  'minecraft:portal',
  'minecraft:particle_emitter',
  'minecraft:entity_effect'
]

// 参数定义结构
export const PARAM_DEFINITIONS = {
  // 粒子名称
  name: {
    type: 'string',
    label: '粒子类型',
    description: 'Minecraft 原版粒子 ID',
    default: 'minecraft:end_rod',
    component: 'select',
    options: COMMON_PARTICLES
  },

  // 位置
  pos: {
    type: 'object',
    label: '位置',
    description: '生成粒子的坐标 (X, Y, Z)',
    default: { x: 0, y: 0, z: 0 },
    properties: {
      x: { type: 'number', label: 'X', default: 0 },
      y: { type: 'number', label: 'Y', default: 0 },
      z: { type: 'number', label: 'Z', default: 0 }
    }
  },

  // 颜色 (RGBA)
  color: {
    type: 'object',
    label: '颜色',
    description: '粒子颜色 (RGBA，范围 0.0-1.0)',
    default: { r: 1.0, g: 1.0, b: 1.0, a: 1.0 },
    properties: {
      r: { type: 'number', label: 'R', default: 1.0, min: 0, max: 1, step: 0.1 },
      g: { type: 'number', label: 'G', default: 1.0, min: 0, max: 1, step: 0.1 },
      b: { type: 'number', label: 'B', default: 1.0, min: 0, max: 1, step: 0.1 },
      a: { type: 'number', label: 'A', default: 1.0, min: 0, max: 1, step: 0.1 }
    }
  },

  // 速度
  speed: {
    type: 'object',
    label: '初始速度',
    description: '粒子的初速度 (VX, VY, VZ)',
    default: { vx: 0, vy: 0, vz: 0 },
    properties: {
      vx: { type: 'number', label: 'VX', default: 0 },
      vy: { type: 'number', label: 'VY', default: 0 },
      vz: { type: 'number', label: 'VZ', default: 0 }
    }
  },

  // 范围
  range: {
    type: 'object',
    label: '范围',
    description: '生成粒子的范围 (DX, DY, DZ)',
    default: { dx: 1, dy: 1, dz: 1 },
    properties: {
      dx: { type: 'number', label: 'DX', default: 1, min: 0 },
      dy: { type: 'number', label: 'DY', default: 1, min: 0 },
      dz: { type: 'number', label: 'DZ', default: 1, min: 0 }
    }
  },

  // 数量
  count: {
    type: 'number',
    label: '粒子数量',
    description: '生成粒子的数量',
    default: 500,
    min: 1,
    max: 10000
  },

  // 寿命
  age: {
    type: 'number',
    label: '寿命',
    description: '粒子的寿命 (0=原寿命, -1=不消失)',
    default: 0,
    min: -1
  },

  // 参数方程范围
  begin: {
    type: 'number',
    label: '参数起始值',
    description: '参数 t 的起始值',
    default: 0
  },

  end: {
    type: 'number',
    label: '参数结束值',
    description: '参数 t 的结束值',
    default: 6.28
  },

  // 计算间隔
  calcInterval: {
    type: 'number',
    label: '计算间隔',
    description: '自变量每次递增的值',
    default: 0.1,
    min: 0.001,
    step: 0.01
  },

  // CPT (每 tick 执行次数)
  CPT: {
    type: 'number',
    label: 'CPT',
    description: '每 tick 执行表达式的次数',
    default: 10,
    min: 1
  },

  // 表达式
  expression: {
    type: 'string',
    label: '表达式',
    description: '数学表达式，用分号分隔多个赋值',
    default: 'x=cos(t);y=0;z=sin(t)',
    component: 'expression-editor'
  },

  // 速度表达式
  speedExpression: {
    type: 'string',
    label: '速度表达式',
    description: '控制粒子运动速度的表达式',
    default: '',
    component: 'expression-editor'
  },

  // 文件路径
  path: {
    type: 'string',
    label: '文件路径',
    description: '图片/视频文件路径',
    default: ''
  },

  // 缩放比例
  scaling: {
    type: 'number',
    label: '缩放比例',
    description: '图片/视频的缩放比例',
    default: 1.0,
    min: 0.1,
    step: 0.1
  },

  // 旋转角度
  xRotation: {
    type: 'number',
    label: 'X 轴旋转',
    description: '绕 X 轴旋转角度 (90 的整倍数)',
    default: 0
  },

  yRotation: {
    type: 'number',
    label: 'Y 轴旋转',
    description: '绕 Y 轴旋转角度 (90 的整倍数)',
    default: 0
  },

  zRotation: {
    type: 'number',
    label: 'Z 轴旋转',
    description: '绕 Z 轴旋转角度 (90 的整倍数)',
    default: 0
  },

  // 翻转
  flip: {
    type: 'string',
    label: '翻转',
    description: '图片翻转方式',
    default: 'not',
    component: 'select',
    options: ['not', 'horizontally', 'vertical']
  },

  // 矩阵
  matrix: {
    type: 'string',
    label: '变换矩阵',
    description: '用于线性变换的矩阵',
    default: ''
  },

  // DPB (每方块粒子数)
  DPB: {
    type: 'number',
    label: 'DPB',
    description: '每方块粒子数',
    default: 10,
    min: 1
  },

  // 组
  group: {
    type: 'string',
    label: '组',
    description: '粒子所属的组',
    default: ''
  }
}

// 导出所有粒子类型
export default PARTICLE_TYPES