<script setup>
import _ from 'lodash'
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  placeholder: String,
  type: {
    type: String,
    default: 'text',
  },
  variant: {
    type: String,
    default: 'outline', // 默认改为最常用的全边框模式
    validator(value) {
      return ['outline', 'underline', 'filled', 'ghost'].includes(value)
    },
  },
  inputClass: {
    type: String,
    default: ''
  },
  isDebounce: {
    type: Boolean,
    default: false,
  },
  debounceTime: {
    type: Number,
    default: 500,
  },
})

const emit = defineEmits(['update:modelValue', 'change', 'input'])
const inputRef = ref()

const variantClasses = computed(() => {
  const base = 'transition-colors duration-300 ease-in-out'

  const variants = {
    // 默认：全边框，聚焦变色
    outline: `border-2 rounded-md px-3 py-2 bg-transparent border-gray-200 dark:border-gray-700
              focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500`,

    // 下划线风格：底部边框
    underline: `border-b-2 rounded-t-md px-1 py-2 bg-transparent border-gray-300 dark:border-gray-600 rounded-none
                focus-within:border-blue-500`,

    // 填充风格：灰色背景，无边框（或隐形边框）
    filled: `border-2 border-transparent rounded-md px-3 py-2 bg-gray-100 dark:bg-gray-800
             focus-within:bg-white dark:focus-within:bg-black focus-within:border-blue-500`,

    // 幽灵风格：无边框（适合嵌入在其他复杂组件中）
    ghost: `bg-transparent px-0 py-0`
  }

  return `${base} ${variants[props.variant] || variants.outline}`
})

// --- 防抖逻辑 ---
const handleInput = (event) => {
  const val = event.target.value

  emit('update:modelValue', val)

  if (props.isDebounce) {
    debouncedEmit(val)
  } else {
    emit('change', val)
  }
}

const debouncedEmit = _.debounce((val) => {
  emit('change', val)
}, props.debounceTime)

const getInput = () => inputRef.value

defineExpose({ getInput })
</script>

<template>
  <div
    class="w-full relative flex items-center group"
    :class="[variantClasses]"
  >
    <div v-if="$slots.header"
         class="mr-2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
      <slot name="header"></slot>
    </div>

    <input
      ref="inputRef"
      class="w-full h-full bg-transparent border-none outline-none text-base
             text-gray-900 dark:text-white placeholder-gray-400"
      :class="inputClass"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="handleInput"
    />

    <div v-if="$slots.footer" class="ml-2 text-gray-400">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
