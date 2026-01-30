<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { usePageStore } from '@/stores/index.js'
import Modal from '@/components/Modal.vue'
import Button from '@/components/Button.vue'

const props = defineProps({
  title: String,
  content: String,
  positiveText: {
    type: String,
    default: t('确定')
  },
  negativeText: {
    type: String,
    default: t('取消')
  },
  type: {
    type: String,
    default: 'info',
    validator(value) {
      return ['info', 'warn', 'success', 'error'].includes(value)
    }
  },
  maskClosable: {
    type: Boolean,
    default: true
  },
  escClosable: {
    type: Boolean,
    default: true
  },
  // 回调函数
  onPositiveClick: Function,
  onNegativeClick: Function,
  onMaskClick: Function,
  onEscClick: Function
})

const pageStore = usePageStore()
const isDark = computed(() => pageStore.isDark)

// 控制 Modal 显示
const show = ref(true)

// --- 样式与图标逻辑 ---
const iconConfig = computed(() => {
  const map = {
    info: { icon: 'lucide:info', color: isDark.value ? '#80ccff' : '#0969da' },
    warn: { icon: 'lucide:triangle-alert', color: '#d4a72c' },
    success: { icon: 'lucide:check', color: '#2da44e' },
    error: { icon: 'lucide:x', color: '#fa4549' }
  }
  return map[props.type] || map.info
})

// --- 事件处理 ---
const handleClose = () => {
  show.value = false
}

const handlePositive = () => {
  handleClose()
  props.onPositiveClick?.()
}

const handleNegative = () => {
  handleClose()
  props.onNegativeClick?.()
}

const handleMaskClick = () => {
  props.onMaskClick?.()
}

const handleEscClick = () => {
  props.onEscClick?.()
}
</script>

<template>
  <Modal v-model:show="show" :width="'400px'" :mask-closable="maskClosable" :close-on-esc="escClosable"
    @close="handleMaskClick" @after-leave="$emit('close')">
    <template #header>
      <div class="flex items-center gap-3">
        <Icon :icon="iconConfig.icon" :color="iconConfig.color" width="26" height="26" />
        <span class="font-bold text-lg dark:text-white">{{ title }}</span>
      </div>
    </template>

    <slot>
      <div class="py-2 text-base text-gray-600 dark:text-gray-300">
        {{ content }}
      </div>
    </slot>

    <template #footer>
      <Button @click="handleNegative" :color="'#fa454a'" :background="isDark ? '#032742' : '#fff'" class="w-[80px]">
        {{ negativeText }}
      </Button>

      <Button @click="handlePositive" :background="isDark ? '#032742' : '#fff'" class="w-[80px]">
        {{ positiveText }}
      </Button>
    </template>
  </Modal>
</template>
