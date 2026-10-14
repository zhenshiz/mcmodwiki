<script setup>
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'

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
  precision: {
    type: Number,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '100%'
  },
  controls: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'blur', 'focus'])

const inputRef = ref(null)
const displayValue = ref('')

const getPrecisionFactor = (val) => {
  if (props.precision !== null) return Math.pow(10, props.precision)
  const stepString = props.step.toString()
  const dotIndex = stepString.indexOf('.')
  if (dotIndex === -1) return 1
  return Math.pow(10, stepString.length - dotIndex - 1)
}

const safeAdd = (num1, num2) => {
  const factor = getPrecisionFactor()
  const result = (Math.round(num1 * factor) + Math.round(num2 * factor)) / factor
  return toPrecision(result)
}

const toPrecision = (num) => {
  if (props.precision === null) return num
  return parseFloat(Number(num).toFixed(props.precision))
}

const clampValue = (val) => {
  let newVal = Number(val)
  if (Number.isNaN(newVal)) return props.modelValue
  if (props.precision !== null) {
    newVal = toPrecision(newVal)
  }
  if (newVal < props.min) newVal = props.min
  if (newVal > props.max) newVal = props.max
  return newVal
}

const updateModel = (val) => {
  const clamped = clampValue(val)
  displayValue.value = clamped.toString()
  if (clamped !== props.modelValue) {
    emit('update:modelValue', clamped)
    emit('change', clamped)
  }
}

const increase = () => {
  if (props.disabled || props.modelValue >= props.max) return
  const next = safeAdd(props.modelValue || 0, props.step)
  updateModel(Math.min(props.max, next))
}

const decrease = () => {
  if (props.disabled || props.modelValue <= props.min) return
  const next = safeAdd(props.modelValue || 0, -props.step)
  updateModel(Math.max(props.min, next))
}

let intervalId = null
let timeoutId = null

const clearTimer = () => {
  if (timeoutId) clearTimeout(timeoutId)
  if (intervalId) clearInterval(intervalId)
  timeoutId = null
  intervalId = null
}

const handleMouseDown = (action) => {
  if (props.disabled) return
  action()
  timeoutId = setTimeout(() => {
    intervalId = setInterval(() => {
      action()
    }, 100)
  }, 200)
}

const handleInput = (e) => {
  const val = e.target.value
  displayValue.value = val
  if (val === '' || val === '-' || val.endsWith('.')) return
  const parsed = parseFloat(val)
  if (!Number.isNaN(parsed)) {
    emit('update:modelValue', parsed)
  }
}

const handleBlur = (e) => {
  const val = e.target.value
  let num = parseFloat(val)
  if (Number.isNaN(num) || val === '') {
    displayValue.value = props.modelValue.toString()
  } else {
    updateModel(num)
  }
  emit('blur', e)
}

const handleFocus = (e) => emit('focus', e)

const handleKeydown = (e) => {
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    increase()
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    decrease()
  }
}

watch(() => props.modelValue, (val) => {
  if (parseFloat(displayValue.value) !== val) {
    displayValue.value = val === null || val === undefined ? '' : val.toString()
  }
}, { immediate: true })

</script>

<template>
  <div
    class="
      inline-flex rounded-none border transition-colors box-border
      bg-white border-ui-line
      dark:bg-ui-surface dark:border-ui-line
      group overflow-hidden
    "
    :class="{
      'opacity-60 cursor-not-allowed': disabled,
      'hover:border-ui-link dark:hover:border-ui-link': !disabled,
      'focus-within:border-ui-link focus-within:ring-1 focus-within:ring-blue-500/20': !disabled
    }"
    :style="{ width: width }"
  >
    <button
      v-if="controls"
      class="
        flex items-center justify-center w-8 bg-ui-surface dark:bg-ui-inset
        border-r border-ui-line dark:border-ui-line
        text-ui-muted dark:text-ui-muted cursor-pointer
        hover:text-ui-link dark:hover:text-ui-link
        active:bg-ui-inset dark:active:bg-ui-inset
        transition-colors
      "
      :class="{ 'cursor-not-allowed text-ui-text dark:text-ui-muted': disabled || modelValue <= min }"
      @mousedown.prevent="handleMouseDown(decrease)"
      @mouseup="clearTimer"
      @mouseleave="clearTimer"
    >
      <Icon icon="lucide:minus" width="14" />
    </button>

    <div class="flex-1 relative h-full min-w-0">
      <input
        ref="inputRef"
        type="text"
        :value="displayValue"
        :disabled="disabled"
        :placeholder="placeholder"
        class="
          w-full h-[32px] px-2 text-center bg-transparent border-none outline-none
          text-ui-text dark:text-ui-text text-sm font-medium
          placeholder-gray-400
        "
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @keydown="handleKeydown"
      />
    </div>

    <button
      v-if="controls"
      class="
        flex items-center justify-center w-8 bg-ui-surface dark:bg-ui-inset
        border-l border-ui-line dark:border-ui-line
        text-ui-muted dark:text-ui-muted cursor-pointer
        hover:text-ui-link dark:hover:text-ui-link
        active:bg-ui-inset dark:active:bg-ui-inset
        transition-colors
      "
      :class="{ 'cursor-not-allowed text-ui-text dark:text-ui-muted': disabled || modelValue >= max }"
      @mousedown.prevent="handleMouseDown(increase)"
      @mouseup="clearTimer"
      @mouseleave="clearTimer"
    >
      <Icon icon="lucide:plus" width="14" />
    </button>
  </div>
</template>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>