import { $t } from '@/languages'

export const formatUtil = {
  //生成一个uuid字符串
  generateUUID: () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  },
  /**
   * 创建增强型枚举
   * @template {Record<string, string>} T
   * @param {T} definition
   * @returns {Readonly<T> & { values: () => { label: string, value: keyof T }[], getLabel: (val: keyof T) => string }}
   */
  createEnum: (definition) => {
    const enumObj = { ...definition }
    const labelMap = { ...definition }
    Object.keys(definition).forEach(key => {
      enumObj[key] = key
    })

    Object.defineProperty(enumObj, 'values', {
      value: function () {
        return Object.entries(labelMap).map(([key, label]) => ({
          label: typeof $t === 'function' ? $t(label) : label,
          value: key
        }))
      },
      enumerable: false
    })

    Object.defineProperty(enumObj, 'getLabel', {
      value: function (value) {
        const label = labelMap[value]
        return label ? (typeof $t === 'function' ? $t(label) : label) : ''
      },
      enumerable: false
    })

    return Object.freeze(enumObj)
  },
  /**
 * 判断两个字符串是否相等（忽略大小写）
   * @param {string|number|null|undefined} str1
   * @param {string|number|null|undefined} str2
 * @returns {boolean}
 */
  equalsIgnoreCase: (str1, str2) => {
    if (str1 === str2) return true

    if (str1 === null || str1 === undefined || str2 === null || str2 === undefined) {
      return false
    }

    return String(str1).toLowerCase() === String(str2).toLowerCase()
  },
  /**
   * 通用属性迁移工具
   * 将对象上的旧属性值迁移到新属性，并删除旧属性
   * @param {Object} target 目标实例对象
   * @param {Object} source JSON 源数据
   * @param {Object} mapping 映射关系 { 旧键名: 新键名 }
   */
  migrateLegacyProperties: (target, source, mapping) => {
    if (!target || !source || !mapping) return

    for (const [oldKey, newKey] of Object.entries(mapping)) {
      if (source[oldKey] !== undefined) {
        if (!target[newKey]) {
          target[newKey] = source[oldKey]
        }

        if (Object.prototype.hasOwnProperty.call(target, oldKey)) {
          delete target[oldKey]
        }
      }
    }
  }
}
