<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: 0
  },
  min: {
    type: Number,
    default: -Infinity
  },
  max: {
    type: Number,
    default: Infinity
  },
  step: {
    type: Number,
    default: 1
  },
  stepStrictly: {
    type: Boolean,
    default: false
  },
  precision: {
    type: Number,
    validator: (val) => val >= 0 && val === parseInt(val, 10)
  },
  size: {
    type: String,
    default: 'default',
    validator: (val) => ['small', 'default', 'large'].includes(val)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  controls: {
    type: Boolean,
    default: true
  },
  controlsPosition: {
    type: String,
    default: '',
    validator: (val) => ['', 'right'].includes(val)
  },
  placeholder: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'blur', 'focus'])

// 内部值
const currentValue = ref(props.modelValue)
const userInput = ref(null)
const inputRef = ref(null)
const isFocused = ref(false)

// 计算输入框样式
const inputSizeClass = computed(() => {
  switch (props.size) {
    case 'small': return 'py-1 px-2 text-sm'
    case 'large': return 'py-3 px-4 text-lg'
    default: return 'py-2 px-3 text-base'
  }
})

// 计算按钮尺寸样式
const getBtnSizeClass = computed(() => {
  switch (props.size) {
    case 'small': return 'w-8 h-8 text-xs'
    case 'large': return 'w-14 h-14 text-base'
    default: return 'w-11 h-11 text-sm'
  }
})

// 计算控制按钮位置样式
const controlsAtRight = computed(() => {
  return props.controlsPosition === 'right'
})

// 计算是否禁用减少按钮
const minDisabled = computed(() => {
  return props.disabled || currentValue.value <= props.min
})

// 计算是否禁用增加按钮
const maxDisabled = computed(() => {
  return props.disabled || currentValue.value >= props.max
})

// 监听modelValue变化
watch(() => props.modelValue, (val) => {
  let newVal = val === undefined ? val : Number(val)
  if (newVal !== undefined) {
    if (isNaN(newVal)) {
      newVal = props.min || 0
    }

    if (props.precision !== undefined) {
      newVal = toPrecision(newVal, props.precision)
    }

    if (newVal > props.max) {
      newVal = props.max
    }
    if (newVal < props.min) {
      newVal = props.min
    }
  }

  currentValue.value = newVal
  userInput.value = null
})

// 处理输入变化
const handleInput = (event) => {
  userInput.value = event.target.value
  setCurrentValue(userInput.value)
}

// 处理失焦
const handleBlur = (event) => {
  emit('blur', event)
  isFocused.value = false

  // 如果用户输入了值，则尝试解析
  if (userInput.value !== null) {
    const value = userInput.value === '' ? undefined : Number(userInput.value)
    setCurrentValue(value)
    userInput.value = null
  }
}

// 处理聚焦
const handleFocus = (event) => {
  emit('focus', event)
  isFocused.value = true
}

// 增加值
const increase = () => {
  if (props.disabled || maxDisabled.value) return

  const value = currentValue.value || 0
  const newVal = add(value, props.step)
  setCurrentValue(newVal)
  inputRef.value?.focus()
}

// 减少值
const decrease = () => {
  if (props.disabled || minDisabled.value) return

  const value = currentValue.value || 0
  const newVal = subtract(value, props.step)
  setCurrentValue(newVal)
  inputRef.value?.focus()
}

// 设置当前值
const setCurrentValue = (value) => {
  let newVal = value

  if (newVal === undefined) {
    newVal = props.min || 0
  } else {
    if (isNaN(newVal)) {
      newVal = props.min || 0
    }

    if (props.stepStrictly) {
      newVal = toPrecision(Math.round(newVal / props.step) * props.step, props.precision)
    }

    if (props.precision !== undefined) {
      newVal = toPrecision(newVal, props.precision)
    }

    if (newVal > props.max) {
      newVal = props.max
    }
    if (newVal < props.min) {
      newVal = props.min
    }
  }

  currentValue.value = newVal
  emit('update:modelValue', newVal)
}

// 精确计算加法
const add = (num1, num2) => {
  let decimal1, decimal2

  try {
    decimal1 = num1.toString().split('.')[1].length
  } catch (e) {
    decimal1 = 0
  }

  try {
    decimal2 = num2.toString().split('.')[1].length
  } catch (e) {
    decimal2 = 0
  }

  const factor = Math.pow(10, Math.max(decimal1, decimal2))
  return (num1 * factor + num2 * factor) / factor
}

// 精确计算减法
const subtract = (num1, num2) => {
  let decimal1, decimal2

  try {
    decimal1 = num1.toString().split('.')[1].length
  } catch (e) {
    decimal1 = 0
  }

  try {
    decimal2 = num2.toString().split('.')[1].length
  } catch (e) {
    decimal2 = 0
  }

  const factor = Math.pow(10, Math.max(decimal1, decimal2))
  return (num1 * factor - num2 * factor) / factor
}

// 设置精度
const toPrecision = (num, precision) => {
  if (precision === undefined) return num

  return parseFloat(Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision))
}

// 暴露方法
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur()
})
</script>

<template>
  <div
    class="relative inline-flex items-stretch w-full group"
    :class="{ 'ring-2 ring-blue-500 rounded': isFocused }"
  >
    <!-- 减小按钮（左侧） -->
    <template v-if="controls">
      <button
        type="button"
        class="flex items-center justify-center border text-gray-500 hover:bg-gray-100 focus:outline-none"
        :class="[
          getBtnSizeClass,
          isFocused ? 'border-blue-500 rounded-l' : 'rounded-l',
          { 'opacity-50 cursor-not-allowed': minDisabled }
        ]"
        :disabled="minDisabled"
        @click="decrease"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </template>

    <!-- 输入框 -->
    <input
      ref="inputRef"
      type="text"
      class="w-full border text-center focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      :class="[
        inputSizeClass,
        controls ? 'rounded-none border-x-0' : 'rounded',
        isFocused ? 'border-blue-500' : '',
        disabled ? 'bg-gray-100 cursor-not-allowed opacity-70' : 'bg-white'
      ]"
      :value="userInput !== null ? userInput : currentValue"
      :disabled="disabled"
      :placeholder="placeholder"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    />

    <!-- 增大按钮（右侧） -->
    <template v-if="controls">
      <button
        type="button"
        class="flex items-center justify-center border text-gray-500 hover:bg-gray-100 focus:outline-none"
        :class="[
          getBtnSizeClass,
          isFocused ? 'border-blue-500 rounded-r' : 'rounded-r',
          { 'opacity-50 cursor-not-allowed': maxDisabled }
        ]"
        :disabled="maxDisabled"
        @click="increase"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </template>
  </div>
</template>
