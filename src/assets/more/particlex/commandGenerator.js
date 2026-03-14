/**
 * ExParticle 指令生成器
 * 将配置对象转换为 /particlex 指令
 */

import { PARTICLE_TYPES, PARAM_DEFINITIONS } from './particleTypes.js'

/**
 * 生成单个粒子指令
 * @param {string} type - 粒子类型
 * @param {object} params - 粒子参数
 * @returns {string} 生成的指令
 */
export function generateCommand(type, params) {
  const particleType = PARTICLE_TYPES[type]
  if (!particleType) {
    throw new Error(`Unknown particle type: ${type}`)
  }

  const commandParts = [`/particlex`, particleType.command]

  // 添加必需参数
  for (const paramName of particleType.params.required) {
    const paramValue = params[paramName]
    if (paramValue === undefined || paramValue === null) {
      throw new Error(`Missing required parameter: ${paramName}`)
    }
    commandParts.push(formatParam(paramName, paramValue))
  }

  // 添加可选参数（如果存在）
  for (const paramName of particleType.params.optional) {
    const paramValue = params[paramName]
    if (paramValue !== undefined && paramValue !== null && paramValue !== '') {
      commandParts.push(formatParam(paramName, paramValue))
    }
  }

  return commandParts.join(' ')
}

/**
 * 格式化参数值
 * @param {string} name - 参数名
 * @param {any} value - 参数值
 * @returns {string} 格式化后的参数值
 */
function formatParam(name, value) {
  const definition = PARAM_DEFINITIONS[name]

  switch (name) {
    case 'name':
      return value

    case 'pos':
      return `~${value.x} ~${value.y} ~${value.z}`

    case 'color':
      return `${value.r} ${value.g} ${value.b} ${value.a}`

    case 'speed':
      return `${value.vx} ${value.vy} ${value.vz}`

    case 'range':
      return `${value.dx} ${value.dy} ${value.dz}`

    case 'expression':
    case 'speedExpression':
      if (!value) return ''
      return `"${value}"`

    case 'path':
      return `"${value}"`

    case 'matrix':
      if (!value) return ''
      return `"${value}"`

    default:
      // 数字和其他类型直接返回字符串
      return String(value)
  }
}

/**
 * 生成 mcfunction 文件内容
 * @param {object} project - 项目配置
 * @returns {string} mcfunction 文件内容
 */
export function generateMcFunction(project) {
  const lines = []

  // 文件头部注释
  lines.push('# ExParticle 粒子效果配置')
  lines.push(`# 粒子类型: ${project.type}`)
  lines.push(`# 创建时间: ${new Date().toLocaleString('zh-CN')}`)
  lines.push(`# 描述: ${project.description || '未命名'}`)
  lines.push('')

  // 项目配置 JSON（注释形式）
  lines.push('# === 项目配置 ===')
  lines.push('# ' + JSON.stringify(project.config).replace(/\n/g, '\n# '))
  lines.push('')

  // 生成指令
  if (project.commands && project.commands.length > 0) {
    project.commands.forEach((cmdConfig, index) => {
      if (cmdConfig.comment) {
        lines.push(`# ${cmdConfig.comment}`)
      }
      lines.push(generateCommand(cmdConfig.type, cmdConfig.params))
      lines.push('')
    })
  } else {
    // 单个指令
    lines.push(generateCommand(project.type, project.params))
    lines.push('')
  }

  return lines.join('\n')
}

/**
 * 解析 mcfunction 文件内容
 * @param {string} content - mcfunction 文件内容
 * @returns {object} 解析后的项目配置
 */
export function parseMcFunction(content) {
  const lines = content.split('\n')
  const project = {
    type: 'normal',
    description: '',
    config: null,
    commands: []
  }

  let currentCommand = null
  let configLines = []

  for (let line of lines) {
    line = line.trim()

    // 跳过空行
    if (!line) continue

    // 注释行
    if (line.startsWith('#')) {
      const commentContent = line.substring(1).trim()

      // 解析项目配置
      if (commentContent.startsWith('粒子类型:')) {
        project.type = commentContent.replace('粒子类型:', '').trim()
      } else if (commentContent.startsWith('描述:')) {
        project.description = commentContent.replace('描述:', '').trim()
      } else if (commentContent.startsWith('创建时间:')) {
        project.createTime = commentContent.replace('创建时间:', '').trim()
      } else if (commentContent.startsWith('{') || configLines.length > 0) {
        // 收集配置 JSON 行
        configLines.push(commentContent)
      } else if (currentCommand) {
        currentCommand.comment = commentContent
      }

      continue
    }

    // 指令行
    if (line.startsWith('/particlex ')) {
      const parsed = parseCommand(line)
      if (parsed) {
        currentCommand = parsed
        project.commands.push(currentCommand)
      }
    }
  }

  // 解析配置 JSON
  if (configLines.length > 0) {
    try {
      const configJson = configLines.join('').replace(/^#\s*/gm, '')
      project.config = JSON.parse(configJson)
    } catch (e) {
      console.warn('Failed to parse project config:', e)
    }
  }

  return project
}

/**
 * 解析单条指令
 * @param {string} command - 指令字符串
 * @returns {object|null} 解析后的指令配置
 */
function parseCommand(command) {
  const parts = command.trim().split(/\s+/)
  if (parts[0] !== '/particlex') return null

  const type = parts[1]
  const particleType = Object.values(PARTICLE_TYPES).find(t => t.command === type)

  if (!particleType) return null

  const params = {}
  let partIndex = 2

  // 解析参数
  for (const paramName of particleType.params.required) {
    if (partIndex >= parts.length) break

    const value = parseParamValue(paramName, parts[partIndex])
    if (value !== null) {
      params[paramName] = value
      partIndex++
    }
  }

  return {
    type: particleType.id,
    params
  }
}

/**
 * 解析参数值
 * @param {string} name - 参数名
 * @param {string} value - 参数值字符串
 * @returns {any} 解析后的值
 */
function parseParamValue(name, value) {
  if (!value) return null

  switch (name) {
    case 'pos':
      const posMatch = value.match(/^~(-?\d+\.?\d*)?\s+~(-?\d+\.?\d*)?\s+~(-?\d+\.?\d*)?$/)
      if (posMatch) {
        return {
          x: parseFloat(posMatch[1]) || 0,
          y: parseFloat(posMatch[2]) || 0,
          z: parseFloat(posMatch[3]) || 0
        }
      }
      break

    case 'color':
      const colorMatch = value.split(' ')
      if (colorMatch.length === 4) {
        return {
          r: parseFloat(colorMatch[0]),
          g: parseFloat(colorMatch[1]),
          b: parseFloat(colorMatch[2]),
          a: parseFloat(colorMatch[3])
        }
      }
      break

    case 'speed':
      const speedMatch = value.split(' ')
      if (speedMatch.length >= 3) {
        return {
          vx: parseFloat(speedMatch[0]),
          vy: parseFloat(speedMatch[1]),
          vz: parseFloat(speedMatch[2])
        }
      }
      break

    case 'range':
      const rangeMatch = value.split(' ')
      if (rangeMatch.length >= 3) {
        return {
          dx: parseFloat(rangeMatch[0]),
          dy: parseFloat(rangeMatch[1]),
          dz: parseFloat(rangeMatch[2])
        }
      }
      break

    default:
      // 尝试解析数字
      const num = parseFloat(value)
      if (!isNaN(num)) return num
      // 返回字符串（去除引号）
      return value.replace(/^["']|["']$/g, '')
  }

  return null
}

/**
 * 验证指令参数
 * @param {string} type - 粒子类型
 * @param {object} params - 粒子参数
 * @returns {object} 验证结果 { valid: boolean, errors: string[] }
 */
export function validateCommand(type, params) {
  const errors = []
  const particleType = PARTICLE_TYPES[type]

  if (!particleType) {
    return { valid: false, errors: [`未知的粒子类型: ${type}`] }
  }

  // 检查必需参数
  for (const paramName of particleType.params.required) {
    const value = params[paramName]
    if (value === undefined || value === null || value === '') {
      errors.push(`缺少必需参数: ${paramName}`)
    }
  }

  // 参数范围验证
  if (params.color) {
    const c = params.color
    if (c.r < 0 || c.r > 1) errors.push('颜色 R 值超出范围 (0-1)')
    if (c.g < 0 || c.g > 1) errors.push('颜色 G 值超出范围 (0-1)')
    if (c.b < 0 || c.b > 1) errors.push('颜色 B 值超出范围 (0-1)')
    if (c.a < 0 || c.a > 1) errors.push('颜色 A 值超出范围 (0-1)')
  }

  if (params.range) {
    const r = params.range
    if (r.dx < 0) errors.push('范围 DX 必须大于等于 0')
    if (r.dy < 0) errors.push('范围 DY 必须大于等于 0')
    if (r.dz < 0) errors.push('范围 DZ 必须大于等于 0')
  }

  if (params.begin !== undefined && params.end !== undefined) {
    if (params.begin >= params.end) {
      errors.push('参数起始值必须小于结束值')
    }
  }

  if (params.count !== undefined && params.count < 1) {
    errors.push('粒子数量必须大于 0')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

export default {
  generateCommand,
  generateMcFunction,
  parseMcFunction,
  validateCommand
}