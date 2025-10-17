<script setup>
import { computed, ref, watch } from 'vue'
import { getTexture } from '@/assets/textures/mcTextures.js'

const props = defineProps({
  placeholder: String,
  modelValue: String,
  suggestions: {
    type: [Array, Function], // 支持数组或函数
    default: () => []
  },
  triggerOnFocus: {
    type: Boolean,
    default: true
  },
  valueKey: {
    type: String,
    default: 'value'
  },
  labelKey: {
    type: String,
    default: 'label'
  },
  iconKey: {
    type: String,
    default: 'icon'
  },
  size: {
    type: String,
    default: 'default',
    validator(value) {
      return ['small', 'default', 'large'].includes(value)
    }
  },
  disabled: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: false
  },
  filterMethod: Function,
  defaultColor: {
    type: Array,
    validator(value) {
      return value.length === 2
    },
    default: () => ['#BAE6FD', '#0EA5E9']
  }
})

const emit = defineEmits(['update:modelValue', 'select', 'change', 'focus', 'blur'])

const inputValue = ref(props.modelValue || '')
const suggestions = ref([])
const showSuggestions = ref(false)
const highlightedIndex = ref(-1)
const inputRef = ref(null)
const suggestionsRef = ref(null)
const borderColor = ref(props.defaultColor[0])

// --- 监听外部值变化 ---
watch(() => props.modelValue, (val) => {
  inputValue.value = val
})

// --- 输入变化时更新建议 ---
watch(inputValue, (val) => {
  emit('update:modelValue', val)

  if (val) {
    showSuggestions.value = true
    debouncedFetchSuggestions(val)
  } else {
    showSuggestions.value = false
    suggestions.value = []
    highlightedIndex.value = -1
  }
})

// 默认过滤方法
const defaultFilterMethod = (value, item) => {
  const itemValue = typeof item === 'object' ? item[props.valueKey] : item
  return itemValue.toLowerCase().includes(value.toLowerCase())
}

// 获取建议源
const getSuggestionsSource = () => {
  return typeof props.suggestions === 'function' ? props.suggestions() : props.suggestions
}

// 模拟防抖（简单 setTimeout）
const debouncedFetchSuggestions = (value) => {
  setTimeout(() => {
    const source = getSuggestionsSource()
    if (value && value.trim()) {
      suggestions.value = source.filter(item => {
        if (props.filterMethod) {
          return props.filterMethod(value, item)
        }
        return defaultFilterMethod(value, item)
      })
    } else {
      suggestions.value = source
    }
    highlightedIndex.value = -1
  }, 300)
}

// 输入事件
const handleInput = (event) => {
  inputValue.value = event.target.value
  emit('change', inputValue.value)
}

// 选择建议项
const handleSelect = (item) => {
  inputValue.value = typeof item === 'object' ? item[props.valueKey] : item
  showSuggestions.value = false
  emit('select', item)
  emit('update:modelValue', inputValue.value)
}

// 键盘控制
const handleKeyDown = (event) => {
  if (!showSuggestions.value || suggestions.value.length === 0) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      highlightedIndex.value = (highlightedIndex.value + 1) % suggestions.value.length
      scrollToItem()
      break
    case 'ArrowUp':
      event.preventDefault()
      highlightedIndex.value =
        highlightedIndex.value - 1 < 0
          ? suggestions.value.length - 1
          : highlightedIndex.value - 1
      scrollToItem()
      break
    case 'Enter':
      if (highlightedIndex.value >= 0) {
        handleSelect(suggestions.value[highlightedIndex.value])
      }
      break
    case 'Escape':
      showSuggestions.value = false
      break
  }
}

// 滚动到当前选项
const scrollToItem = () => {
  if (!suggestionsRef.value) return
  const items = suggestionsRef.value.querySelectorAll('.suggestion-item')
  if (items.length > 0 && highlightedIndex.value >= 0) {
    items[highlightedIndex.value].scrollIntoView({ block: 'nearest' })
  }
}

// 聚焦 / 失焦
const handleFocus = (event) => {
  borderColor.value = props.defaultColor[1]
  emit('focus', event)
  if (props.triggerOnFocus) {
    showSuggestions.value = true
    debouncedFetchSuggestions(inputValue.value)
  }
}
const handleBlur = (event) => {
  borderColor.value = props.defaultColor[0]
  emit('blur', event)
  setTimeout(() => (showSuggestions.value = false), 200)
}

// 清空输入
const clearInput = () => {
  inputValue.value = ''
  showSuggestions.value = false
  suggestions.value = []
}

// 尺寸样式
const sizeClass = computed(() => {
  switch (props.size) {
    case 'small':
      return 'py-1 px-2 text-sm'
    case 'large':
      return 'py-3 px-4 text-lg'
    default:
      return 'py-2 px-3 text-base'
  }
})

// 暴露方法
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur()
})
</script>

<template>
  <div class="relative w-full dark:text-white">
    <!-- 输入框 -->
    <div
      class="w-full relative rounded flex items-center border-2"
      :class="[
        sizeClass,
        disabled ? 'bg-gray-100 cursor-not-allowed opacity-70' : 'bg-transparent'
      ]"
      :style="{ borderColor: borderColor }"
    >
      <input
        ref="inputRef"
        class="w-full bg-transparent focus:outline-none"
        :placeholder="placeholder"
        :value="inputValue"
        :disabled="disabled"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeyDown"
      />

      <div class="flex-shrink-0 ml-2 min-h-4 w-5 flex items-center justify-center">
        <div
          v-if="clearable && inputValue && !disabled"
          class="cursor-pointer text-gray-400 hover:text-gray-600"
          @click="clearInput"
        >
          <slot name="clear">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M6 18L18 6M6 6l12 12" />
            </svg>
          </slot>
        </div>
      </div>
    </div>

    <!-- 建议列表 -->
    <div
      v-show="showSuggestions && suggestions.length > 0"
      ref="suggestionsRef"
      class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg
             max-h-[10rem] overflow-y-auto dark:bg-gray-800 dark:border-gray-700"
    >
      <ul class="py-1">
        <li
          v-for="(item, index) in suggestions"
          :key="index"
          class="suggestion-item px-4 py-2 cursor-pointer flex flex-row gap-5 items-center hover:bg-gray-100 dark:hover:bg-gray-700"
          :class="{ 'bg-blue-50 dark:bg-gray-600': index === highlightedIndex }"
          @click="handleSelect(item)"
        >
          <!-- 左侧图标（若有） -->
          <img
            v-if="typeof item === 'object' && item.icon"
            :src="getTexture(item.icon)"
            class="w-5 h-5 flex-shrink-0 object-contain"
            alt=""
          />

          <slot name="item" :item="item" :index="index">
            {{ typeof item === 'object' ? item[labelKey] || item[valueKey] : item }}
          </slot>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.suggestion-item {
  transition: background-color 0.2s ease;
}
</style>
