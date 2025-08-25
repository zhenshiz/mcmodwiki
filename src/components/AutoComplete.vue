<script setup>
import { computed, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  placeholder: String,
  modelValue: String,
  suggestions: {
    type: Array,
    default: () => []
  },
  // 触发建议显示的最小字符数
  triggerOnFocus: {
    type: Boolean,
    default: true
  },
  // 自定义建议项的渲染方式
  valueKey: {
    type: String,
    default: 'value'
  },
  // 自定义标签显示的键名
  labelKey: {
    type: String,
    default: 'label'
  },
  // 最大显示建议数量，-1表示显示全部
  maxSuggestions: {
    type: Number,
    default: -1
  },
  // 输入框尺寸
  size: {
    type: String,
    default: 'default',
    validator(value) {
      return ['small', 'default', 'large'].includes(value)
    }
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 输入框前缀图标
  prefixIcon: String,
  // 是否显示清除按钮
  clearable: {
    type: Boolean,
    default: false
  },
  // 自定义建议过滤方法
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
const loading = ref(false)
const showSuggestions = ref(false)
const highlightedIndex = ref(-1)
const inputRef = ref(null)
const suggestionsRef = ref(null)
const borderColor = ref(props.defaultColor[0])

// 监听modelValue变化
watch(() => props.modelValue, (val) => {
  inputValue.value = val
})

// 监听输入值变化
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

// 防抖处理搜索建议
const debouncedFetchSuggestions = (value) => {
  loading.value = true
  setTimeout(() => {
    if (value) {
      // 先过滤符合条件的建议项
      const filteredSuggestions = props.suggestions.filter(item => {
        if (props.filterMethod) {
          return props.filterMethod(value, item)
        }
        return defaultFilterMethod(value, item)
      })
      
      // 根据maxSuggestions限制显示数量
      if (props.maxSuggestions > 0 && filteredSuggestions.length > props.maxSuggestions) {
        suggestions.value = filteredSuggestions.slice(0, props.maxSuggestions)
      } else {
        suggestions.value = filteredSuggestions
      }
    } else {
      suggestions.value = []
    }
    highlightedIndex.value = -1
    loading.value = false
  }, 300)
}

// 处理输入变化
const handleInput = (event) => {
  inputValue.value = event.target.value
  emit('change', inputValue.value)
}

// 处理建议项点击
const handleSelect = (item) => {
  inputValue.value = typeof item === 'object' ? item[props.valueKey] : item
  showSuggestions.value = false
  emit('select', item)
  emit('update:modelValue', typeof item === 'object' ? item[props.valueKey] : item)
}

// 处理键盘导航
const handleKeyDown = (event) => {
  if (!showSuggestions.value) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      highlightedIndex.value = (highlightedIndex.value + 1) % suggestions.value.length
      scrollToItem()
      break
    case 'ArrowUp':
      event.preventDefault()
      highlightedIndex.value = highlightedIndex.value - 1 < 0
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

// 滚动到选中项
const scrollToItem = () => {
  if (!suggestionsRef.value) return

  const suggestionItems = suggestionsRef.value.querySelectorAll('.suggestion-item')
  if (suggestionItems.length > 0 && highlightedIndex.value >= 0) {
    suggestionItems[highlightedIndex.value].scrollIntoView({ block: 'nearest' })
  }
}

// 处理焦点
const handleFocus = (event) => {
  borderColor.value = props.defaultColor[1]
  emit('focus', event)
  if (props.triggerOnFocus) {
    showSuggestions.value = true
    debouncedFetchSuggestions(inputValue.value)
  }
}

// 处理失焦
const handleBlur = (event) => {
  borderColor.value = props.defaultColor[0]
  emit('blur', event)
  // 延迟隐藏建议列表，以便可以点击建议项
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

// 清除输入
const clearInput = () => {
  inputValue.value = ''
  showSuggestions.value = false
  suggestions.value = []
}

// 计算输入框尺寸类
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

// 获取输入框引用
const getInput = () => {
  return inputRef.value
}

defineExpose({
  getInput,
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
      <!-- 前缀图标 -->
      <Icon v-if="prefixIcon" class="flex-shrink-0 mr-2 text-black dark:text-white"
            :class="sizeClass.split(' ')[2]"
            :icon="prefixIcon" />

      <!-- 输入框 -->
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

      <!-- 清除按钮 -->
      <div
        v-if="clearable && inputValue && !disabled"
        class="flex-shrink-0 ml-2 cursor-pointer text-gray-400 hover:text-gray-600"
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

      <!-- 加载指示器 -->
      <div v-if="loading" class="flex-shrink-0 ml-2">
        <slot name="loading">
          <svg class="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg"
               fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                    stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </slot>
      </div>
    </div>

    <!-- 建议列表 -->
    <div
      v-show="showSuggestions && suggestions.length > 0"
      ref="suggestionsRef"
      class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto dark:bg-gray-800 dark:border-gray-700"
    >
      <ul class="py-1">
        <li
          v-for="(item, index) in suggestions"
          :key="index"
          class="suggestion-item px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
          :class="{ 'bg-blue-50 dark:bg-gray-600': index === highlightedIndex }"
          @click="handleSelect(item)"
        >
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
