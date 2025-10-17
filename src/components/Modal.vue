<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { usePageStore } from '@/stores/index.js'
import { translatable } from '@/assets/translatable/translatable.js'
import Button from '@/components/Button.vue'

const props = defineProps({
  show: { type: Boolean, required: true },
  isShowMask: { type: Boolean, default: true },
  isShowClose: { type: Boolean, default: true },
  title: String,
  smWidth: { type: Number, default: 50 },
  negativeVisible: { type: Boolean, default: true },
  positiveVisible: { type: Boolean, default: true },
  negativeText: {
    type: String,
    default: translatable(usePageStore().setting.language, 'component.modal.negative')
  },
  positiveText: {
    type: String,
    default: translatable(usePageStore().setting.language, 'component.modal.positive')
  },
  buttonJustify: {
    type: String,
    default: 'end',
    validator(value) {
      return ['start', 'center', 'end'].includes(value)
    }
  },
  defaultCloseEvent: {
    type: Array,
    default: ['onClose', 'onNegativeClick', 'onPositiveClick', 'onMaskClick', 'onEsc']
  }
})

const pageStore = usePageStore()
const emit = defineEmits([
  'onNegativeClick',
  'onPositiveClick',
  'onClose',
  'onMaskClick',
  'onEsc',
  'defaultClose'
])

// ================== 事件逻辑 ==================
const emitEvent = (event) => {
  if (props.defaultCloseEvent.includes(event)) emit('defaultClose')
  emit(event)
}

// ESC 关闭
const escEvent = (event) => {
  if (event.key === 'Escape') {
    if (props.defaultCloseEvent.includes('onEsc')) emit('defaultClose')
    emit('onEsc')
  }
}

onMounted(() => {
  document.addEventListener('keydown', escEvent)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', escEvent)
})
</script>

<template>
  <teleport to="body">
    <div v-if="show" class="fixed top-0 left-0 size-full center z-[998]">
      <div
        class="relative max-h-[95%] bg-white center flex-col rounded dark:bg-dark-blue z-[1000] w-[95%] modal-container"
        :style="{ '--sm-width': `${props.smWidth}%` }">
        <div class="flex flex-row justify-between mt-5 w-[90%] text-[20px]">
          <div class="flex items-center font-bold dark:text-white">{{ title }}</div>
          <div v-if="isShowClose" @click="emitEvent('onClose')"
               class="flex items-center w-5 h-5 select-none cursor-pointer dark:text-white hover:text-[#fa454a]">
            ×
          </div>
        </div> <!-- 内容区域 -->
        <div ref="modalContentRef"
             class="min-h-[150px] max-h-[700px] w-[90%] flex justify-start items-start my-3 overflow-y-auto scrollbar scrollbar-track-transparent scrollbar-thumb-text-gray dark:scrollbar-thumb-text-blue">
          <slot name="content"></slot>
        </div> <!-- 底部按钮 -->
        <div class="flex w-full items-center mb-5" :class="[`justify-${buttonJustify}`]">
          <Button v-if="negativeVisible" @click="emitEvent('onNegativeClick')" is-toggle-color
                  :color="'#fa454a'" :background="pageStore.isDark ? '#032742' : '#fff'"
                  class="w-[100px] h-11"> {{ negativeText }}
          </Button>
          <Button v-if="positiveVisible" @click="emitEvent('onPositiveClick')" is-toggle-color
                  :background="pageStore.isDark ? '#032742' : '#fff'"
                  class="w-[100px] ml-5 mr-5 h-11"> {{ positiveText }}
          </Button>
        </div>
      </div> <!-- 遮罩 -->
      <div v-if="isShowMask" class="mask z-[999]" @click="emitEvent('onMaskClick')" />
    </div>
  </teleport>
</template>

<style lang="scss" scoped> .modal-container {
  @media (min-width: 640px) {
    max-width: var(--sm-width, 50%);
  }
} </style>
