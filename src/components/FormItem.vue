<script setup>
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AsyncValidator from 'async-validator'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  labelWidth: {
    type: [String, Number],
    default: ''  // 默认不设置固定宽度，让标签宽度自适应
  },
  prop: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  rules: {
    type: [Object, Array],
    default: () => ({})
  },
  error: {
    type: String,
    default: ''
  },
  validateStatus: {
    type: String,
    default: ''
  },
  forAttr: {
    type: String,
    default: ''
  },
  inlineMessage: {
    type: Boolean,
    default: false
  },
  showMessage: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: 'medium'  // 默认中等大小
  },
  fontSize: {
    type: [String, Number],
    default: ''  // 自定义字体大小
  },
  layout: {
    type: String,
    default: 'horizontal'  // 布局方式：horizontal(左右分隔) 或 vertical(上下排列)
  },
  labelAlign: {
    type: String,
    default: 'right'  // 标签对齐方式：left, right, center
  },
  fixedWidth: {
    type: Boolean,
    default: false  // 是否使用固定宽度布局
  }
})

const emit = defineEmits(['validate'])

// 注入表单上下文
const form = inject('form', {})

// 状态变量
const validateState = ref('')
const validateMessage = ref('')
const isValidating = ref(false)
const fieldValue = ref(null)
const formItemRef = ref(null)

// 计算属性
const labelStyle = computed(() => {
  // 只有在fixedWidth为true时才应用固定宽度
  if (props.fixedWidth) {
    const labelWidth = props.labelWidth || form.labelWidth?.value
    return labelWidth ? { width: typeof labelWidth === 'number' ? `${labelWidth}px` : labelWidth } : {}
  }
  return {}
})

const contentStyle = computed(() => {
  if (form.labelPosition?.value === 'top' || form.inline?.value || props.layout === 'vertical') {
    return {}
  }
  // 不再使用marginLeft来定位内容区域
  return {}
})

const formItemSize = computed(() => {
  return props.size || form.size?.value || 'medium'
})

// 计算字体大小样式
const fontSizeStyle = computed(() => {
  if (!props.fontSize) return {}

  const size = typeof props.fontSize === 'number'
    ? `${props.fontSize}px`
    : props.fontSize

  return { fontSize: size }
})

const isRequired = computed(() => {
  if (props.required) {
    return true
  }

  if (!props.prop) {
    return false
  }

  const rules = getRules()
  if (!rules || rules.length === 0) {
    return false
  }

  return rules.some(rule => rule.required)
})

const shouldShowError = computed(() => {
  return validateState.value === 'error' && props.showMessage && form.showMessage?.value
})

const currentLabel = computed(() => {
  return props.label + (form.labelSuffix?.value || '')
})

// 获取表单项规则
const getRules = () => {
  const formRules = form.rules?.value
  const selfRules = props.rules

  const prop = props.prop
  if (!prop || !formRules) {
    return selfRules
  }

  const rules = formRules[prop]
  const result = [].concat(selfRules || rules || [])
  return result
}

// 获取表单项值
const getFieldValue = () => {
  const model = form.model?.value
  if (!model || !props.prop) {
    return
  }

  const path = props.prop.split('.')
  let value = model
  for (const key of path) {
    if (value == null) {
      break
    }
    value = value[key]
  }
  return value
}

// 设置表单项值
const setFieldValue = (value) => {
  const model = form.model?.value
  if (!model || !props.prop) {
    return
  }

  const path = props.prop.split('.')
  const length = path.length

  let i = 0
  let val = model
  while (i < length - 1) {
    const key = path[i]
    if (val[key] === undefined) {
      val[key] = {}
    }
    val = val[key]
    i++
  }
  val[path[i]] = value
}

// 清除验证状态
const clearValidate = () => {
  validateState.value = ''
  validateMessage.value = ''
  isValidating.value = false
}

// 重置表单项
const resetField = () => {
  const model = form.model?.value
  const value = fieldValue.value

  if (!model || !props.prop) {
    return
  }

  const path = props.prop.split('.')
  let i = 0
  let last = model
  while (i < path.length - 1) {
    const key = path[i]
    if (last[key] === undefined) {
      last[key] = {}
    }
    last = last[key]
    i++
  }

  const lastKey = path[path.length - 1]
  last[lastKey] = Array.isArray(value) ? [...value] : value

  nextTick(() => {
    clearValidate()
  })
}

// 验证表单项
const validate = async (trigger, callback) => {
  if (!props.prop) {
    return false
  }

  const rules = getRules()
  if (!rules || rules.length === 0) {
    if (callback) callback('', true)
    return true
  }

  const value = getFieldValue()
  isValidating.value = true

  const descriptor = {}
  if (rules && rules.length > 0) {
    const filteredRules = rules.filter(rule => {
      if (!rule.trigger || !trigger) return true
      if (Array.isArray(rule.trigger)) {
        return rule.trigger.includes(trigger)
      } else {
        return rule.trigger === trigger
      }
    })

    if (filteredRules.length > 0) {
      descriptor[props.prop] = filteredRules
    }
  }

  if (Object.keys(descriptor).length === 0) {
    isValidating.value = false
    if (callback) callback('', true)
    return true
  }

  const validator = new AsyncValidator(descriptor)
  const model = {}
  model[props.prop] = value

  try {
    await validator.validate(model)
    validateState.value = 'success'
    validateMessage.value = ''
    isValidating.value = false
    if (callback) callback('', true)
    return true
  } catch (errors) {
    validateState.value = 'error'
    validateMessage.value = errors[0].message || '验证失败'
    isValidating.value = false
    if (callback) callback(validateMessage.value, false)
    return false
  }
}

// 监听值变化
watch(() => getFieldValue(), () => {
  if (isValidating.value) {
    isValidating.value = false
  }
}, { deep: true })

// 生命周期钩子
onMounted(() => {
  if (props.prop) {
    form.addField?.({
      prop: props.prop,
      validate,
      resetField,
      clearValidate,
      $el: formItemRef.value
    })

    fieldValue.value = getFieldValue()
  }
})

onBeforeUnmount(() => {
  form.removeField?.({ prop: props.prop })
})

// 监听验证状态
watch(() => props.error, (val) => {
  validateMessage.value = val
  validateState.value = val ? 'error' : ''
})

watch(() => props.validateStatus, (val) => {
  validateState.value = val
})
</script>

<template>
  <div
    ref="formItemRef"
    class="form-item"
    :class="[
      {
        'is-error': validateState === 'error',
        'is-success': validateState === 'success',
        'is-validating': isValidating,
        'is-required': isRequired,
        'is-no-asterisk': form.hideRequiredAsterisk,
        'form-item-horizontal': props.layout === 'horizontal',
        'form-item-vertical': props.layout === 'vertical',
        'form-item-fixed-width': props.fixedWidth,
        [`label-align-${props.labelAlign}`]: props.labelAlign
      },
      formItemSize ? `form-item-${formItemSize}` : ''
    ]"
    :style="fontSizeStyle"
  >
    <div
      v-if="label || $slots.label"
      class="form-item-label"
      :style="labelStyle"
    >
      <label :for="forAttr || (form.labelPosition === 'top' ? null : props.prop)">
        <slot name="label">{{ currentLabel }}</slot>
      </label>
    </div>

    <div class="form-item-content" :style="contentStyle">
      <slot></slot>
      <transition name="form-fade">
        <div
          v-if="shouldShowError"
          class="form-item-error"
          :class="{ 'form-item-error-inline': inlineMessage }"
        >
          {{ validateMessage }}
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.form-item {
  @apply mb-5 relative;
}

.form-item:last-child {
  @apply mb-0;
}

/* 水平布局 - 左右分隔 */
.form-item-horizontal {
  @apply flex flex-row items-center gap-2; /* 使用gap来控制间距 */
}

/* 固定宽度布局 */
.form-item-fixed-width {
  @apply flex flex-row items-center;
}

/* 垂直布局 - 上下排列 */
.form-item-vertical {
  @apply flex flex-col;
}

.form-inline .form-item {
  @apply mr-4 mb-0 align-top;
}

.form-item-label {
  @apply leading-8 text-black dark:text-white whitespace-nowrap flex items-center; /* 添加flex和垂直居中 */
}

/* 标签对齐方式 */
.label-align-left .form-item-label {
  @apply text-left;
}

.label-align-right .form-item-label {
  @apply text-right;
}

.label-align-center .form-item-label {
  @apply text-center;
}

/* 水平布局时标签样式 */
.form-item-horizontal .form-item-label {
  @apply flex-shrink-0;
}

/* 固定宽度布局时标签样式 */
.form-item-fixed-width .form-item-label {
  @apply pr-2; /* 设置右边距为2（约8px） */
}

/* 垂直布局时标签样式 */
.form-item-vertical .form-item-label {
  @apply mb-1;
}

.form-item-content {
  @apply relative leading-8 flex items-center; /* 添加flex和垂直居中 */
}

/* 水平布局时内容区样式 */
.form-item-horizontal .form-item-content {
  @apply flex-grow;
}

.form-item-error {
  @apply text-xs text-red-500 leading-normal mt-1;
}

.form-item-error-inline {
  @apply inline-block ml-2;
}

.form-item.is-required > .form-item-label::before {
  @apply content-['*'] text-red-500 mr-1 not-italic;
}

.form-item.is-error .form-item-content input,
.form-item.is-error .form-item-content textarea,
.form-item.is-error .form-item-content select {
  @apply border-red-500 focus:ring-red-500;
}

.form-item.is-success .form-item-content input,
.form-item.is-success .form-item-content textarea,
.form-item.is-success .form-item-content select {
  @apply border-green-500 focus:ring-green-500;
}

/* 尺寸变体 */
.form-item-small {
  @apply text-sm;
}

.form-item-small .form-item-label {
  @apply leading-7;
}

.form-item-medium {
  @apply text-base;
}

.form-item-medium .form-item-label {
  @apply leading-8;
}

.form-item-large {
  @apply text-lg;
}

.form-item-large .form-item-label {
  @apply leading-9;
}

.form-fade-enter-active,
.form-fade-leave-active {
  @apply transition-opacity duration-300;
}

.form-fade-enter-from,
.form-fade-leave-to {
  @apply opacity-0;
}
</style>
