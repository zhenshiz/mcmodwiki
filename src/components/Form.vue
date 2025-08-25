<script setup>
import { provide, reactive, toRefs, watch } from 'vue'

const props = defineProps({
  model: {
    type: Object
  },
  rules: {
    type: Object,
    default: () => ({})
  },
  labelPosition: {
    type: String,
    default: 'right',
    validator: (val) => ['left', 'right', 'top'].includes(val)
  },
  labelWidth: {
    type: [String, Number],
    default: ''
  },
  labelSuffix: {
    type: String,
    default: ''
  },
  inline: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'default',
    validator: (val) => ['small', 'default', 'large'].includes(val)
  },
  showMessage: {
    type: Boolean,
    default: true
  },
  validateOnRuleChange: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['validate'])

// 表单状态
const formState = reactive({
  fields: [],
  model: props.model,
  rules: props.rules,
  size: props.size,
  disabled: props.disabled,
  labelPosition: props.labelPosition,
  labelWidth: props.labelWidth,
  labelSuffix: props.labelSuffix,
  showMessage: props.showMessage,
  inline: props.inline
})

// 监听属性变化
watch(() => props.model, (val) => {
  formState.model = val
})

watch(() => props.rules, (val) => {
  formState.rules = val
  if (props.validateOnRuleChange) {
    validate().catch(error => console.error(error))
  }
})

watch(() => props.size, (val) => {
  formState.size = val
})

watch(() => props.disabled, (val) => {
  formState.disabled = val
})

watch(() => props.labelPosition, (val) => {
  formState.labelPosition = val
})

watch(() => props.labelWidth, (val) => {
  formState.labelWidth = val
})

watch(() => props.labelSuffix, (val) => {
  formState.labelSuffix = val
})

watch(() => props.showMessage, (val) => {
  formState.showMessage = val
})

watch(() => props.inline, (val) => {
  formState.inline = val
})

// 添加表单项
const addField = (field) => {
  formState.fields.push(field)
}

// 移除表单项
const removeField = (field) => {
  if (field.prop) {
    formState.fields = formState.fields.filter(item => item.prop !== field.prop)
  }
}

// 重置表单
const resetFields = () => {
  if (!props.model) {
    console.warn('Form 组件的 model 属性是必填的!')
    return
  }

  formState.fields.forEach(field => {
    field.resetField()
  })
}

// 清除验证
const clearValidate = (props = []) => {
  const fields = props.length
    ? typeof props === 'string'
      ? formState.fields.filter(field => props === field.prop)
      : formState.fields.filter(field => props.indexOf(field.prop) > -1)
    : formState.fields

  fields.forEach(field => {
    field.clearValidate()
  })
}

// 验证表单
const validate = async (callback) => {
  if (!props.model) {
    console.warn('Form 组件的 model 属性是必填的!')
    return Promise.reject('Form 组件的 model 属性是必填的!')
  }

  let promise
  // 如果传入回调函数，使用回调方式
  if (typeof callback === 'function') {
    promise = new Promise((resolve, reject) => {
      const results = []
      let valid = true
      let count = 0

      if (formState.fields.length === 0) {
        callback(true)
        resolve(true)
      }

      formState.fields.forEach(field => {
        field.validate('', (message, state) => {
          if (!state) valid = false
          results.push({ field: field.prop, state, message })

          if (++count === formState.fields.length) {
            callback(valid, results)
            valid ? resolve(true) : reject(results)
          }
        })
      })
    })
  } else {
    // 否则使用 Promise 方式
    if (formState.fields.length === 0) {
      return Promise.resolve(true)
    }

    const promises = formState.fields.map(field => field.validate(''))
    promise = Promise.all(promises)
      .then(() => true)
      .catch(results => {
        return Promise.reject(results)
      })
  }

  return promise
}

// 验证表单项
const validateField = async (props, callback) => {
  const fields = formState.fields.filter(field => {
    if (Array.isArray(props)) {
      return props.indexOf(field.prop) !== -1
    }
    return props === field.prop
  })

  if (fields.length === 0) {
    console.warn(`表单项 ${props} 不存在!`)
    return
  }

  fields.forEach(field => {
    field.validate('', callback)
  })
}

// 滚动到指定表单项
const scrollToField = (prop) => {
  const field = formState.fields.find(field => field.prop === prop)
  if (field) {
    field.$el.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }
}

// 提供表单上下文
provide('form', {
  ...toRefs(formState),
  addField,
  removeField,
  resetFields,
  clearValidate,
  validate,
  validateField,
  scrollToField
})

// 暴露方法
defineExpose({
  validate,
  validateField,
  resetFields,
  clearValidate,
  scrollToField
})
</script>

<template>
  <form
    class="form"
    :class="{
      'form-inline': inline,
      [`form-${labelPosition}`]: labelPosition,
      [`form-${size}`]: size
    }"
    @submit.prevent
  >
    <slot></slot>
  </form>
</template>

<style scoped>
.form {
  @apply w-full;
}

.form-inline {
  @apply flex flex-wrap items-start;
}

.form-left .form-item-label {
  @apply text-right justify-end pr-2;
}

.form-right .form-item-label {
  @apply text-left justify-start pl-2;
}

.form-top .form-item-label {
  @apply pb-1;
}

.form-small .form-item {
  @apply text-sm;
}

.form-large .form-item {
  @apply text-lg;
}
</style>
