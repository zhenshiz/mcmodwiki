/**
 * 颜色类，支持RGB、RGBA和Minecraft整数颜色格式之间的转换
 */
export class Color {
  /**
   * 创建一个颜色对象
   * @param {number} r - 红色通道值 (0-255)
   * @param {number} g - 绿色通道值 (0-255)
   * @param {number} b - 蓝色通道值 (0-255)
   * @param {number} a - 透明度通道值 (0-255)，默认为255（完全不透明）
   */
  constructor(r = 0, g = 0, b = 0, a = 255) {
    this.r = this.clamp(r, 0, 255)
    this.g = this.clamp(g, 0, 255)
    this.b = this.clamp(b, 0, 255)
    this.a = this.clamp(a, 0, 255)
  }

  /**
   * 限制值在指定范围内
   * @param {number} value - 要限制的值
   * @param {number} min - 最小值
   * @param {number} max - 最大值
   * @returns {number} 限制后的值
   * @private
   */
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
  }

  /**
   * 从十六进制颜色字符串创建颜色对象
   * @param {string} hex - 十六进制颜色字符串，格式为 #RGB, #RGBA, #RRGGBB 或 #RRGGBBAA
   * @returns {Color} 颜色对象
   */
  static fromHex(hex) {
    // 移除 # 前缀（如果有）
    hex = hex.replace(/^#/, '')

    let r, g, b, a = 255

    if (hex.length === 3 || hex.length === 4) {
      // 处理 #RGB 或 #RGBA 格式
      r = parseInt(hex[0] + hex[0], 16)
      g = parseInt(hex[1] + hex[1], 16)
      b = parseInt(hex[2] + hex[2], 16)

      if (hex.length === 4) {
        a = parseInt(hex[3] + hex[3], 16)
      }
    } else if (hex.length === 6 || hex.length === 8) {
      // 处理 #RRGGBB 或 #RRGGBBAA 格式
      r = parseInt(hex.substring(0, 2), 16)
      g = parseInt(hex.substring(2, 4), 16)
      b = parseInt(hex.substring(4, 6), 16)

      if (hex.length === 8) {
        a = parseInt(hex.substring(6, 8), 16)
      }
    } else {
      throw new Error(`无效的十六进制颜色格式: ${hex}`)
    }

    return new Color(r, g, b, a)
  }

  /**
   * 从RGB或RGBA字符串创建颜色对象
   * @param {string} rgbStr - RGB或RGBA字符串，格式为 rgb(r,g,b) 或 rgba(r,g,b,a)
   * @returns {Color} 颜色对象
   */
  static fromRgbString(rgbStr) {
    // 匹配 rgb(r,g,b) 或 rgba(r,g,b,a) 格式
    const rgbRegex = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/i
    const match = rgbStr.match(rgbRegex)

    if (!match) {
      throw new Error(`无效的RGB或RGBA字符串格式: ${rgbStr}`)
    }

    const r = parseInt(match[1], 10)
    const g = parseInt(match[2], 10)
    const b = parseInt(match[3], 10)
    // 如果是rgba格式，将alpha值（0-1）转换为0-255范围
    const a = match[4] !== undefined ? Math.round(parseFloat(match[4]) * 255) : 255

    return new Color(r, g, b, a)
  }

  /**
   * 从Minecraft整数颜色格式创建颜色对象
   * Minecraft颜色格式: (a << 24) | (r << 16) | (g << 8) | b
   * @param {number} mcColor - Minecraft整数颜色值
   * @returns {Color} 颜色对象
   */
  static fromMinecraftInt(mcColor) {
    const r = (mcColor >> 16) & 0xFF
    const g = (mcColor >> 8) & 0xFF
    const b = mcColor & 0xFF
    const a = (mcColor >> 24) & 0xFF

    // 如果alpha为负数（因为JavaScript中的位移操作是有符号的），需要转换为0-255范围
    const normalizedA = a < 0 ? 256 + a : a

    return new Color(r, g, b, normalizedA)
  }

  /**
   * 转换为Minecraft整数颜色格式
   * @returns {number} Minecraft整数颜色值
   */
  toMinecraftInt() {
    return ((this.a & 0xFF) << 24) | ((this.r & 0xFF) << 16) | ((this.g & 0xFF) << 8) | (this.b & 0xFF)
  }

  /**
   * 转换为十六进制颜色字符串
   * @param {boolean} includeAlpha - 是否包含透明度通道
   * @returns {string} 十六进制颜色字符串，格式为 #RRGGBB 或 #RRGGBBAA
   */
  toHex(includeAlpha = false) {
    const rHex = this.r.toString(16).padStart(2, '0')
    const gHex = this.g.toString(16).padStart(2, '0')
    const bHex = this.b.toString(16).padStart(2, '0')

    if (includeAlpha && this.a !== 255) {
      const aHex = this.a.toString(16).padStart(2, '0')
      return `#${rHex}${gHex}${bHex}${aHex}`
    }

    return `#${rHex}${gHex}${bHex}`
  }

  /**
   * 转换为RGB或RGBA字符串
   * @param {boolean} includeAlpha - 是否包含透明度通道
   * @returns {string} RGB或RGBA字符串，格式为 rgb(r,g,b) 或 rgba(r,g,b,a)
   */
  toRgbString(includeAlpha = false) {
    if (includeAlpha && this.a !== 255) {
      // 将alpha值（0-255）转换为0-1范围
      const alphaValue = (this.a / 255).toFixed(2)
      return `rgba(${this.r}, ${this.g}, ${this.b}, ${alphaValue})`
    }

    return `rgb(${this.r}, ${this.g}, ${this.b})`
  }

  /**
   * 设置颜色的透明度
   * @param {number} alpha - 透明度值 (0-255)
   * @returns {Color} 新的颜色对象
   */
  withAlpha(alpha) {
    return new Color(this.r, this.g, this.b, alpha)
  }

  /**
   * 混合两种颜色
   * @param {Color} color - 要混合的颜色
   * @param {number} amount - 混合比例 (0-1)，0表示完全使用当前颜色，1表示完全使用参数颜色
   * @returns {Color} 混合后的新颜色
   */
  blend(color, amount) {
    const r = Math.round(this.r * (1 - amount) + color.r * amount)
    const g = Math.round(this.g * (1 - amount) + color.g * amount)
    const b = Math.round(this.b * (1 - amount) + color.b * amount)
    const a = Math.round(this.a * (1 - amount) + color.a * amount)

    return new Color(r, g, b, a)
  }

  /**
   * 创建颜色的副本
   * @returns {Color} 颜色副本
   */
  clone() {
    return new Color(this.r, this.g, this.b, this.a)
  }

  /**
   * 判断两个颜色是否相等
   * @param {Color} color - 要比较的颜色
   * @returns {boolean} 如果颜色相等则返回true，否则返回false
   */
  equals(color) {
    return this.r === color.r &&
      this.g === color.g &&
      this.b === color.b &&
      this.a === color.a
  }
}

/**
 * ChatBoxTheme 默认值对象
 */
export const defaultThemeValues = {
  portrait: {}, // 肖像配置，键值对形式
  option: {
    texture: null,
    selectTexture: null,
    lockTexture: null,
    optionChatX: 0,
    optionChatY: 0,
    textAlign: 'LEFT',
    x: 0,
    y: 0,
    width: 10,
    height: 10,
    alignX: 'LEFT',
    alignY: 'TOP',
    opacity: 100,
    renderOrder: 10
  },
  dialogBox: {
    texture: null,
    lineWidth: null,
    nameX: 0,
    nameY: 0,
    textX: 0,
    textY: 0,
    x: 0,
    y: 0,
    width: 10,
    height: 10,
    alignX: 'LEFT',
    alignY: 'TOP',
    opacity: 100,
    renderOrder: 0
  },
  functionalButton: [], // 功能按钮列表
  keyPrompt: {
    visible: true,
    mouseTextureWidth: 16,
    mouseTextureHeight: 16,
    rightClickTexture: null,
    scrollTexture: null,
    x: 0,
    y: 0,
    width: 10,
    height: 10,
    alignX: 'LEFT',
    alignY: 'TOP',
    opacity: 100,
    renderOrder: 40
  }
};

/**
 * 功能按钮默认值
 */
export const defaultFunctionButtonValues = {
  type: null,
  texture: null,
  hoverTexture: null,
  x: 0,
  y: 0,
  width: 5,
  height: 8,
  alignX: 'RIGHT',
  alignY: 'BOTTOM',
  opacity: 100,
  renderOrder: 30
}

/**
 * 肖像默认值
 */
export const defaultPortraitValues = {
  type: '',
  value: '',
  customItemData: null,
  animation: 'NONE',
  duration: null,
  easing: 'EASE_IN_SINE',
  scale: 1,
  customAnimation: [],
  loop: false,
  x: 0,
  y: 0,
  width: 10,
  height: 10,
  alignX: 'LEFT',
  alignY: 'TOP',
  opacity: 100,
  renderOrder: 20
}

/**
 * 自定义动画默认值
 */
export const defaultCustomAnimationValues = {
  texture: null,
  time: null,
  x: null,
  y: null,
  scale: null,
  opacity: null,
  easing: null
}

/**
 * ChatBoxDialogues 默认值对象
 */
export const defaultDialoguesValues = {
  dialogues: {},
  isTranslatable: false,
  isEsc: true,
  isPause: true,
  isHistoricalSkip: true,
  maxTriggerCount: -1,
  theme: null
}

/**
 * 单个对话默认值
 */
export const defaultDialogueValues = {
  dialogBox: {
    name: null,
    text: null,
    dialoguesResourceLocation: null,
    group: null,
    index: null
  },
  portrait: [],
  options: [],
  sound: '',
  volume: 1,
  pitch: 1,
  command: null,
  backgroundImage: null,
  video: {
    path: null,
    canControl: true,
    canSkip: true,
    loop: false,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    alignX: 'LEFT',
    alignY: 'TOP',
    opacity: 100,
    renderOrder: -1
  }
}

/**
 * 视频默认值
 */
export const defaultVideoValues = {
  path: null,
  canControl: true,
  canSkip: true,
  loop: false,
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  alignX: 'LEFT',
  alignY: 'TOP',
  opacity: 100,
  renderOrder: -1
}

/**
 * 选项默认值
 */
export const defaultOptionValues = {
  text: null,
  isLock: false,
  lock: {
    objective: null,
    value: null
  },
  hidden: {
    objective: null,
    value: null
  },
  isHidden: false,
  next: null,
  click: {
    type: null,
    value: null
  },
  tooltip: null,
  dialoguesResourceLocation: null,
  group: null,
  index: null
}

/**
 * 通用的清理函数，用于移除默认值和空值
 * @param {Object} json 要清理的JSON对象
 * @param {Object} defaultValues 默认值对象
 * @param {Array} specialKeys 需要特殊处理的键名数组
 * @returns {Object} 清理后的JSON对象
 */
export function cleanJson(json, defaultValues, specialKeys = []) {
  if (!json || typeof json !== 'object') return json

  // 如果是数组，递归处理每个元素
  if (Array.isArray(json)) {
    const result = json.map(item => cleanJson(item, defaultValues, specialKeys))
      .filter(item => item !== undefined && item !== null)
    return result.length > 0 ? result : undefined
  }

  // 处理对象
  const result = {}
  let hasValidProperty = false

  for (const key in json) {
    // 跳过原型链上的属性
    if (!Object.prototype.hasOwnProperty.call(json, key)) continue

    const value = json[key]

    // 排除空值
    if (value === undefined || value === null || value === '' || Number.isNaN(value)) {
      continue
    }

    // 排除空数组
    if (Array.isArray(value) && value.length === 0) {
      continue
    }

    // 特殊处理某些键
    if (specialKeys.includes(key)) {
      // 对于portrait和functionalButton等特殊键，我们需要深度处理
      if (key === 'portrait' || key === 'functionalButton' || key === 'dialogues') {
        const cleanedValue = cleanSpecialKey(key, value, defaultValues[key])
        if (cleanedValue !== undefined) {
          result[key] = cleanedValue
          hasValidProperty = true
        }
        continue
      }
    }

    // 检查是否为默认值
    const defaultValue = defaultValues[key]
    if (defaultValue !== undefined) {
      // 对于对象类型，递归处理
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const cleanedValue = cleanJson(value, defaultValue, specialKeys)
        if (cleanedValue !== undefined && Object.keys(cleanedValue).length > 0) {
          result[key] = cleanedValue
          hasValidProperty = true
        }
      }
      // 对于数组类型，递归处理每个元素
      else if (Array.isArray(value)) {
        const cleanedValue = cleanJson(value, defaultValue, specialKeys)
        if (cleanedValue !== undefined && cleanedValue.length > 0) {
          result[key] = cleanedValue
          hasValidProperty = true
        }
      }
      // 对于基本类型，直接比较
      else if (value !== defaultValue) {
        result[key] = value
        hasValidProperty = true
      }
    } else {
      // 如果没有默认值定义，保留该属性
      result[key] = typeof value === 'object' ? cleanJson(value, {}, specialKeys) : value
      hasValidProperty = true
    }
  }

  return hasValidProperty ? result : undefined
}

/**
 * 特殊键的清理函数
 * @param {string} key 键名
 * @param {Object} value 值
 * @param {Object} defaultValue 默认值
 * @returns {Object} 清理后的值
 */
function cleanSpecialKey(key, value, defaultValue) {
  if (key === 'portrait') {
    // portrait是一个对象，其中键是动态的
    const result = {}
    let hasValidProperty = false

    for (const portraitKey in value) {
      const portraitValue = value[portraitKey]
      const cleanedValue = cleanJson(portraitValue, defaultPortraitValues)
      if (cleanedValue !== undefined) {
        result[portraitKey] = cleanedValue
        hasValidProperty = true
      }
    }

    return hasValidProperty ? result : undefined
  } else if (key === 'functionalButton') {
    // functionalButton是一个数组
    return value.map(button => cleanJson(button, defaultFunctionButtonValues))
      .filter(button => button !== undefined)
  } else if (key === 'dialogues') {
    // dialogues是一个对象，其中键是动态的
    const result = {}
    let hasValidProperty = false

    for (const groupKey in value) {
      const dialoguesArray = value[groupKey]
      const cleanedDialogues = dialoguesArray.map(dialogue => cleanJson(dialogue, defaultDialogueValues))
        .filter(dialogue => dialogue !== undefined)

      if (cleanedDialogues.length > 0) {
        result[groupKey] = cleanedDialogues
        hasValidProperty = true
      }
    }

    return hasValidProperty ? result : undefined
  }

  return value
}

/**
 * 排除ChatBoxTheme里的值
 * @param {Object} json ChatBoxTheme JSON对象
 * @returns {Object} 清理后的JSON对象
 */
export function cleanChatBoxTheme(json) {
  return cleanJson(json, defaultThemeValues, ['portrait', 'functionalButton'])
}

/**
 * 排除ChatBoxDialogues里的值
 * @param {Object} json ChatBoxDialogues JSON对象
 * @returns {Object} 清理后的JSON对象
 */
export function cleanChatBoxDialogues(json) {
  // 预处理对话数据，移除不需要的id字段
  const processedJson = JSON.parse(JSON.stringify(json))

  // 处理每个分组
  if (processedJson.dialogues) {
    Object.keys(processedJson.dialogues).forEach((groupName) => {
      const group = processedJson.dialogues[groupName]

      // 处理每个对话
      group.forEach((dialog) => {
        // 删除对话同级的id字段
        delete dialog.id
      })
    });
  }

  return cleanJson(processedJson, defaultDialoguesValues, ['dialogues'])
}

