class BaseField {
  /**
   * 构造方法
   * @param {String} key
   * @param {String} label
   * @param {String} type
   * @param {any} defaultValue
   * @param {String} tips
   * @param {'horizontal' | 'vertical'} layout
   * @param {Boolean} required
   * @param {function(BaseField,any): boolean} visible 2个参数一个是当前的结构，一个参数是当前字段的值
   */
  constructor({ key, label, type, defaultValue, tips, layout, required, visible }) {
    this.key = key               // 字段名
    this.label = label || ''     // 显示名称
    this.type = type             // 类型 string, number, boolean, color, enum, object, array...
    this.defaultValue = defaultValue
    this.tips = tips || ''
    this.layout = layout || 'horizontal' // horizontal 或者 vertical
    this.required = required || false
    this.visible = visible || null
  }

  getDefault() {
    return typeof this.defaultValue === 'function'
      ? this.defaultValue()
      : structuredClone(this.defaultValue)
  }

  isVisible(field, value) {
    return typeof this.visible === 'function' ? this.visible(field, value) : true
  }
}

export class StringField extends BaseField {
  constructor({ placeholder, ...rest }) {
    super({ type: 'string', ...rest })
    this.placeholder = placeholder
  }
}

export class AutoCompleteField extends StringField {
  constructor({
                suggestions = [],
                valueKey = 'value',
                labelKey = 'label',
                iconKey = 'icon',
                triggerOnFocus = true,
                clearable = true,
                filterMethod = null,
                placeholder = '',
                ...rest
              }) {
    super({
      type: 'autoComplete', // 用于渲染时识别
      placeholder,
      ...rest
    })

    this.suggestions = suggestions         // 建议项列表 [{ label, value, icon }]
    this.valueKey = valueKey               // 值字段
    this.labelKey = labelKey               // 展示字段
    this.iconKey = iconKey                 // 图标字段
    this.triggerOnFocus = triggerOnFocus   // 聚焦时是否展开
    this.clearable = clearable             // 是否可清除
    this.filterMethod = filterMethod       // 自定义过滤函数
  }
}

export class NumberField extends BaseField {
  constructor({ min, max, step, precision, ...rest }) {
    super({ type: 'number', ...rest })
    this.min = min ?? -Infinity
    this.max = max ?? Infinity
    this.step = step ?? 1
    this.precision = precision ?? 0
  }
}

export class EnumField extends BaseField {
  constructor({ options, width, mode, offset, ...rest }) {
    super({ type: 'enum', ...rest })
    this.options = options || []
    this.width = width
    this.mode = mode
    this.offset = offset
  }
}

export class BooleanField extends BaseField {
  constructor(rest) {
    super({ type: 'boolean', ...rest })
  }
}

export class ColorField extends BaseField {
  constructor({ format = 'hex', ...rest }) {
    super({ type: 'color', ...rest })
    this.format = format
  }
}

class ArrayField extends BaseField {
  constructor({ type, itemDefaultValue, title, ...rest }) {
    super({ type, defaultValue: [], ...rest })
    this.itemDefaultValue = itemDefaultValue
    this.title = title || ''
  }

  getItemDefault() {
    return typeof this.itemDefaultValue === 'function'
      ? this.itemDefaultValue()
      : structuredClone(this.itemDefaultValue)
  }
}

export class StrArrFiled extends ArrayField {
  constructor({ itemDefaultValue = '', suggestions, title, ...rest }) {
    super({ type: 'strArr', itemDefaultValue, title, ...rest })
    this.suggestions = suggestions || []
  }
}

export class BoolArrFiled extends ArrayField {
  constructor({ itemDefaultValue = true, title, ...rest }) {
    super({ type: 'boolArr', itemDefaultValue, title, ...rest })
  }
}

export class ObjectArrField extends ArrayField {
  constructor({
                title,
                dialogWidthPercent,
                displayTemplate,
                properties,
                ...rest
              }) {
    const itemDefaultValue = new ObjectField({ properties }).getDefault()
    super({ type: 'objectArr', itemDefaultValue, title, ...rest })
    this.dialogWidthPercent = dialogWidthPercent || 50
    this.displayTemplate = displayTemplate || ''
    this.properties = properties
  }
}

export class ObjectField extends BaseField {
  constructor({ properties, ...rest }) {
    super({ type: 'object', defaultValue: {}, ...rest })
    this.properties = properties // { key: FieldDefinition }
  }

  getDefault() {
    const obj = {}
    for (const [key, field] of Object.entries(this.properties)) {
      obj[key] = field.getDefault()
    }
    return obj
  }
}

export class ObjectDialogField extends ObjectField {
  constructor({ properties, ...rest }) {
    super({ type: 'objectDialog', properties, ...rest })
    this.visible = false
  }
}

export class ObjectMapField extends ObjectField {
  constructor({ properties, ...rest }) {
    super({ type: 'objectMap', properties, ...rest })
  }
}
