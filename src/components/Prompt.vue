<script setup>
import { computed, ref } from 'vue'
import Modal from '@/components/Modal.vue'
import AutoComplete from '@/components/form/Autocomplete.vue'
import Input from '@/components/form/Input.vue'
import { t } from '@/languages'

const props = defineProps({
  title: String,
  placeholder: {
    type: String,
    default: ''
  },
  // 如果传入 options，则渲染 AutoComplete，否则渲染 Input
  options: {
    type: [Array, Function],
    default: () => []
  },
  defaultValue: {
    type: String,
    default: ''
  },
  positiveText: {
    type: String,
    default: undefined
  },
  negativeText: {
    type: String,
    default: undefined
  },
  maskClosable: {
    type: Boolean,
    default: true
  },
  onPositiveClick: Function,
  onNegativeClick: Function
})

const inputValue = ref(props.defaultValue)
const show = ref(true)

const confirmText = computed(() => props.positiveText || t('确认'))
const cancelText = computed(() => props.negativeText || t('取消'))

// 判断是否使用自动补全模式
const isAutoComplete = computed(() => {
  return Array.isArray(props.options) ? props.options.length > 0 : !!props.options
})

const handleClose = () => {
  show.value = false
  // 稍微延迟销毁，让动画播放完（由 usePrompt 控制销毁）
  setTimeout(() => {
    props.onNegativeClick?.()
  }, 300)
}

const handlePositive = () => {
  show.value = false
  setTimeout(() => {
    props.onPositiveClick?.(inputValue.value)
  }, 100) // 这里的延迟是为了让 Modal 先开始关闭动画，避免视觉突变
}

const handleNegative = () => {
  handleClose()
}
</script>

<template>
  <Modal
    v-model:show="show"
    :title="title"
    :mask-closable="maskClosable"
    width="450px"
    @close="handleClose"
  >
    <div class="py-4 w-full px-1">
      <AutoComplete
        v-if="isAutoComplete"
        v-model="inputValue"
        :options="options"
        :placeholder="placeholder"
        clearable
        width="100%"
      />

      <Input
        v-else
        v-model="inputValue"
        :placeholder="placeholder"
        class="w-full"
        auto-focus
        @keydown.enter="handlePositive"
      />
    </div>

    <template #footer>
      <button
        class="
          px-4 py-1.5 rounded transition-colors text-sm
          text-gray-600 hover:bg-gray-100
          dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white
        "
        @click="handleNegative"
      >
        {{ cancelText }}
      </button>

      <button
        class="
          px-4 py-1.5 rounded transition-colors text-sm font-medium
          text-white bg-[#00c0f5] hover:bg-[#00ace6]
        "
        @click="handlePositive"
      >
        {{ confirmText }}
      </button>
    </template>
  </Modal>
</template>
