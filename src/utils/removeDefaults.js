/**
 * 深度比较两个值是否相等（忽略 undefined 和键顺序）
 */
function deepEqual(a, b) {
  if (a === b) return true
  if (a == null || b == null) return a === b
  if (typeof a !== typeof b) return false

  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false
    return a.every((v, i) => deepEqual(v, b[i]))
  }

  if (typeof a === 'object') {
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)
    if (keysA.length !== keysB.length) return false
    return keysA.every(k => deepEqual(a[k], b[k]))
  }

  return a === b
}

/**
 * 用模板结构去除对象中的默认值。
 * @param {any} value - 实际对象
 * @param {any} template - 默认模板对象
 * @returns {any} - 去除默认值后的对象
 */
export function removeDefaultsByTemplate(value, template) {
  // 值不存在
  if (value == null) return value

  // === 数组 ===
  if (Array.isArray(template) && Array.isArray(value)) {
    const itemTemplate = template[0]
    const cleaned = value
      .map(v => removeDefaultsByTemplate(v, itemTemplate))
      .filter(v => v !== undefined)
    return cleaned.length ? cleaned : undefined
  }

  // === Map 类型 ===
  // 用 { map: {...} } 形式定义
  if (
    template &&
    typeof template === 'object' &&
    'map' in template &&
    typeof template.map === 'object' &&
    !Array.isArray(template.map)
  ) {
    if (typeof value !== 'object' || Array.isArray(value)) return value
    const cleanedMap = {}
    for (const [key, val] of Object.entries(value)) {
      const cleaned = removeDefaultsByTemplate(val, template.map)
      if (!deepEqual(cleaned, template.map) && cleaned !== undefined) {
        cleanedMap[key] = cleaned
      }
    }
    return Object.keys(cleanedMap).length ? cleanedMap : undefined
  }

  // === 对象 ===
  if (typeof template === 'object' && typeof value === 'object' && !Array.isArray(template)) {
    const result = {}
    for (const key of Object.keys(value)) {
      const cleaned = removeDefaultsByTemplate(value[key], template[key])
      if (!deepEqual(cleaned, template[key])) {
        result[key] = cleaned
      }
    }
    return Object.keys(result).length ? result : undefined
  }

  // === 基础类型 ===
  return deepEqual(value, template) ? undefined : value
}
