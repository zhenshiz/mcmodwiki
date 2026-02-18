<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import Popover from '@/components/Popover.vue'
import { Icon } from '@iconify/vue'
import { t } from '@/languages/index.js'

const props = defineProps({
  // 双向绑定的值
  modelValue: {
    type: [String, Number],
    default: ''
  },
  // 选项列表 [{ label: '', value: '', icon: '' }]
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: t('请输入或选择')
  },
  disabled: {
    type: Boolean,
    default: false
  },
  width: {
    type: String,
    default: '100%'
  },
  clearable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'clear'])

const isOpen = ref(false)
const inputRef = ref(null)

// 内部维护的输入值
const query = ref('')

// 当前选中的选项 (如果能在 options 里找到的话)
const selectedOption = computed(() => {
  return props.options.find(opt => opt.value === props.modelValue)
})

// 过滤选项
const filteredOptions = computed(() => {
  if (!query.value) return props.options
  return props.options.filter(opt =>
    String(opt.label).toLowerCase().includes(String(query.value).toLowerCase()) ||
    String(opt.value).toLowerCase().includes(String(query.value).toLowerCase())
  )
})

watch(() => props.modelValue, (val) => {
  const opt = props.options.find(o => o.value === val)

  if (opt) {
    query.value = opt.label
  } else {
    query.value = val === null || val === undefined ? '' : String(val)
  }
}, { immediate: true })

watch(isOpen, (val) => {
  if (val) {
    nextTick(() => {
      inputRef.value?.focus()
    })
  } else {
    if (!query.value && props.modelValue) {
      emit('update:modelValue', '')
      emit('change', '')
    }
  }
})

const handleInput = () => {
  if (!isOpen.value) isOpen.value = true

  emit('update:modelValue', query.value)
  emit('change', query.value)
}

// 处理选项点击
const handleSelect = (option) => {
  emit('update:modelValue', option.value)
  emit('change', option.value)
  // 选中后 query 显示 label
  query.value = option.label
  isOpen.value = false
}

const handleClear = (e) => {
  e.stopPropagation()
  emit('update:modelValue', '')
  emit('change', '')
  emit('clear')
  query.value = ''
  // 清除后可能希望聚焦，或者不聚焦
}
</script>

<template>
  <Popover
    placement="bottom-start"
    trigger="click"
    :offset="4"
    class="w-full"
    v-model:isOpen="isOpen"
  >
    <template #trigger>
      <div
        class="
          relative flex items-center justify-between
          px-3 py-2 rounded border transition-colors
          bg-white border-gray-200
          dark:bg-[#051e2f] dark:border-dark-blue
          group
        "
        :class="{
          'opacity-60 cursor-not-allowed': disabled,
          'border-blue-500 ring-1 ring-blue-500/20': isOpen,
          'hover:border-blue-400 dark:hover:border-blue-500': !disabled && !isOpen
        }"
        :style="{ width: width }"
      >
        <div class="flex items-center gap-2 flex-1 overflow-hidden">
          <img
            v-if="selectedOption?.icon"
            :src="selectedOption.icon"
            class="w-5 h-5 object-contain flex-shrink-0"
            alt="icon"
          />
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            :placeholder="placeholder"
            :disabled="disabled"
            class="
              w-full bg-transparent border-none outline-none p-0
              text-gray-700 dark:text-gray-200 placeholder-gray-400
              text-sm
            "
            @input="handleInput"
          />
        </div>

        <div class="flex items-center ml-2">
          <Icon
            v-if="clearable && query && !disabled"
            icon="lucide:x"
            class="
              w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
              cursor-pointer transition-colors hidden group-hover:block
            "
            @click="handleClear"
          />

          <Icon
            icon="lucide:chevron-down"
            class="
              w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0
            "
            :class="{
              'rotate-180': isOpen,
              'block group-hover:hidden': clearable && query && !disabled
            }"
          />
        </div>
      </div>
    </template>

    <div
      class="max-h-[250px] overflow-y-auto custom-scrollbar -m-2 p-1 min-w-[120px]"
      :style="{ width: width === '100%' ? 'auto' : width }"
    >
      <template v-if="filteredOptions.length > 0">
        <div
          v-for="item in filteredOptions"
          :key="item.value"
          class="
            flex items-center gap-2 px-2 py-2 rounded cursor-pointer transition-colors text-sm
            hover:bg-blue-50 dark:hover:bg-slate-700
          "
          :class="{
            'text-blue-500 font-medium bg-blue-50 dark:bg-slate-800': modelValue === item.value,
            'text-gray-700 dark:text-gray-200': modelValue !== item.value
          }"
          @click="handleSelect(item)"
        >
          <img
            v-if="item.icon"
            :src="item.icon"
            class="w-5 h-5 object-contain"
            alt="icon"
          />

          <span class="flex-1 truncate" v-html="item.label"></span>

          <span v-if="item.value !== item.label"
                class="text-xs text-gray-400 truncate max-w-[100px]">
            {{ item.value }}
          </span>

          <Icon
            v-if="modelValue === item.value"
            icon="lucide:check"
            class="w-4 h-4 text-blue-500"
          />
        </div>
      </template>

      <div v-else class="text-center text-gray-400 py-2 text-xs">
        <span class="block mb-1">{{ t('无匹配预设') }}</span>
        <span class="text-blue-400">{{ t('使用: {}', query) }}</span>
      </div>
    </div>
  </Popover>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
