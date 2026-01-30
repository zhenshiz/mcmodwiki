import _ from 'lodash'

const METADATA_STORAGE = new Map()

export class AutoClean {
  /**
   * 这是一个魔法方法。
   * 当你调用 JSON.stringify(instance) 时，JS 引擎会自动调用这个方法。
   */
  toJSON() {
    const defaults = new this.constructor()

    const result = {}
    let hasData = false

    // 遍历当前对象的所有属性
    for (const key of Object.keys(this)) {
      const currentValue = this[key]
      const defaultValue = defaults[key]

      // 忽略以 _ 开头的私有字段
      if (key.startsWith('_')) continue

      // 如果当前值是 AutoClean 的子类（嵌套对象），递归调用它的 toJSON
      if (Array.isArray(currentValue)) {
        if (currentValue.length > 0) {
          result[key] = currentValue
          hasData = true
        }
        continue
      }

      // 如果是对象（且不是 null）
      if (currentValue && typeof currentValue === 'object') {
        if (!_.isEqual(currentValue, defaultValue)) {
          result[key] = currentValue
          hasData = true
        }
        continue
      }

      // 基础类型 (String, Number, Boolean)
      // 只有当值不等于默认值，且不为 null/undefined 时才保留
      if (currentValue !== defaultValue && currentValue !== null && currentValue !== undefined) {
        result[key] = currentValue
        hasData = true
      }
    }

    // 如果整个对象所有字段都是默认值，返回 undefined，这样 JSON.stringify 会直接忽略这个键
    return hasData ? result : undefined
  }

  /**
   * 定义字段 UI 配置
   */
  static defineField(key, config) {
    this._ensureMetadata()
    const meta = METADATA_STORAGE.get(this)
    meta.fields[key] = config
  }

  /**
   * 【新增】定义覆写字段 (继承父类配置并修改部分属性)
   * @param {string} key 字段名
   * @param {object} overrideConfig 要修改的配置项
   */
  static defineOverride(key, overrideConfig) {
    this._ensureMetadata()

    // 1. 向上查找父类链，寻找最近的一个该字段配置
    let parentConfig = null
    let proto = Object.getPrototypeOf(this)

    // 遍历原型链直到找到配置或者到达基类
    while (proto && proto !== AutoClean) {
      const meta = METADATA_STORAGE.get(proto)
      if (meta && meta.fields && meta.fields[key]) {
        // 找到了父类定义，进行深拷贝以防引用污染
        // 注意：这里简单的解构只能浅拷贝，对于 props 这种嵌套对象需要特殊处理
        parentConfig = meta.fields[key]
        break
      }
      proto = Object.getPrototypeOf(proto)
    }

    if (!parentConfig) {
      this.defineField(key, overrideConfig)
      return
    }

    const mergedConfig = {
      ...parentConfig,
      ...overrideConfig,
      props: {
        ...(parentConfig.props || {}),
        ...(overrideConfig.props || {})
      }
    }

    const meta = METADATA_STORAGE.get(this)
    meta.fields[key] = mergedConfig
  }

  /**
   * 核心：定义要排除的父类字段
   * @param {string[]} keys 要隐藏的字段名数组
   */
  static excludeFields(keys) {
    this._ensureMetadata()
    const meta = METADATA_STORAGE.get(this)
    meta.excludes.push(...keys)
  }

  static _ensureMetadata() {
    if (!METADATA_STORAGE.has(this)) {
      METADATA_STORAGE.set(this, { fields: {}, excludes: [] })
    }
  }

  /**
   * 智能获取当前类的最终 UI 配置列表（处理继承和排除）
   */
  static getFieldConfigs() {
    const configMap = {}
    const excludeSet = new Set()

    let proto = this
    const chain = []
    while (proto && proto !== AutoClean) {
      chain.push(proto)
      proto = Object.getPrototypeOf(proto)
    }

    for (const cls of chain) {
      const meta = METADATA_STORAGE.get(cls)
      if (!meta) continue

      // 记录当前类想要排除的字段
      if (meta.excludes) {
        meta.excludes.forEach(k => excludeSet.add(k))
      }

      for (const [key, config] of Object.entries(meta.fields)) {
        const isOverriddenByChild = Object.prototype.hasOwnProperty.call(configMap, key)

        if (excludeSet.has(key) && !isOverriddenByChild) {
          continue
        }

        // 如果子类已经有了（覆写），就不接受父类的
        if (!configMap[key]) {
          configMap[key] = config
        }
      }
    }

    return configMap
  }
}
