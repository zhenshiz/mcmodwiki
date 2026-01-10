<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  min: { type: Number, default: -Infinity },
  max: { type: Number, default: Infinity },
  step: { type: Number, default: 1 },
  stepStrictly: { type: Boolean, default: false },
  size: { type: String, default: 'small', validator: (val) => ['small', 'default', 'large'].includes(val) },
  disabled: { type: Boolean, default: false },
  controls: { type: Boolean, default: true },
  placeholder: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'change', 'blur', 'focus'])

const currentValue = ref(props.modelValue)
const userInput = ref(null)
const inputRef = ref(null)
const isFocused = ref(false)

// 极致压缩的尺寸适配
const sizeMap = {
  small: { container: 'h-[22px]', btn: 'w-6', text: 'text-[15px]' },
  default: { container: 'h-7', btn: 'w-7', text: 'text-xs' },
  large: { container: 'h-9', btn: 'w-9', text: 'text-sm' }
}

const currentSize = computed(() => sizeMap[props.size] || sizeMap.small)
const minDisabled = computed(() => props.disabled || currentValue.value <= props.min)
const maxDisabled = computed(() => props.disabled || currentValue.value >= props.max)

watch(() => props.modelValue, (val) => {
  let newVal = val === undefined ? 0 : Number(val)
  if (isNaN(newVal)) newVal = props.min !== -Infinity ? props.min : 0
  if (newVal > props.max) newVal = props.max
  if (newVal < props.min) newVal = props.min
  currentValue.value = newVal
  userInput.value = null
}, { immediate: true })

const handleInput = (event) => {
  userInput.value = event.target.value
  const val = Number(event.target.value)
  if (!isNaN(val)) setCurrentValue(val)
}

const handleBlur = (event) => {
  isFocused.value = false
  if (userInput.value !== null) {
    const value = userInput.value === '' ? 0 : Number(userInput.value)
    setCurrentValue(value)
    userInput.value = null
  }
  emit('blur', event)
}

const handleFocus = (event) => {
  isFocused.value = true
  emit('focus', event)
}

const setCurrentValue = (value) => {
  let newVal = value
  if (isNaN(newVal)) newVal = props.min !== -Infinity ? props.min : 0
  if (newVal > props.max) newVal = props.max
  if (newVal < props.min) newVal = props.min
  if (props.stepStrictly) newVal = Math.round(newVal / props.step) * props.step
  currentValue.value = newVal
  emit('update:modelValue', Number(newVal))
}

const increase = () => { if (!maxDisabled.value) setCurrentValue(add(currentValue.value || 0, props.step)) }
const decrease = () => { if (!minDisabled.value) setCurrentValue(subtract(currentValue.value || 0, props.step)) }

const add = (n1, n2) => {
  const f = Math.pow(10, Math.max(getDec(n1), getDec(n2)))
  return (n1 * f + n2 * f) / f
}
const subtract = (n1, n2) => {
  const f = Math.pow(10, Math.max(getDec(n1), getDec(n2)))
  return (n1 * f - n2 * f) / f
}
const getDec = (n) => (n.toString().split('.')[1] || '').length
</script>

<template>
  <div class="inline-flex w-full items-stretch overflow-hidden transition-all duration-200 border group" :class="[
    currentSize.container,
    isFocused
      ? 'border-blue-500 ring-1 ring-blue-500/20'
      : 'border-gray-200 dark:border-[#1a1a1a] bg-gray-50 dark:bg-[#1e1e1e]',
    disabled ? 'opacity-40 cursor-not-allowed' : 'hover:border-gray-300 dark:hover:border-[#444]'
  ]">
    <button v-if="controls" type="button" @click="decrease" :disabled="minDisabled"
      class="flex items-center justify-center transition-colors border-r text-gray-400 border-gray-200 dark:border-[#1a1a1a] bg-gray-100 dark:bg-[#2d2d2d] hover:bg-gray-200 dark:hover:bg-[#3e3e42] active:bg-gray-300 dark:active:bg-[#4e4e52] disabled:opacity-20 disabled:cursor-not-allowed shrink-0"
      :class="currentSize.btn">
      <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4">
        <path d="M5 12h14" />
      </svg>
    </button>

    <input ref="inputRef" type="text" :value="userInput !== null ? userInput : currentValue" :disabled="disabled"
      class="flex-1 min-w-0 bg-transparent text-center focus:outline-none text-gray-700 dark:text-slate-200 font-mono"
      :class="[currentSize.text]" @input="handleInput" @blur="handleBlur" @focus="handleFocus"
      @keydown.up.prevent="increase" @keydown.down.prevent="decrease" />

    <button v-if="controls" type="button" @click="increase" :disabled="maxDisabled"
      class="flex items-center justify-center transition-colors border-l text-gray-400 border-gray-200 dark:border-[#1a1a1a] bg-gray-100 dark:bg-[#2d2d2d] hover:bg-gray-200 dark:hover:bg-[#3e3e42] active:bg-gray-300 dark:active:bg-[#4e4e52] disabled:opacity-20 disabled:cursor-not-allowed shrink-0"
      :class="currentSize.btn">
      <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  </div>
</template>