<script setup>
import { computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  // 控制显示隐藏
  show: { type: Boolean, default: false },
  // 标题
  title: { type: String, default: '' },
  // 宽度，支持 '600px', 600, '50%'
  width: { type: [Number, String], default: '600px' },
  // 点击遮罩是否关闭
  maskClosable: { type: Boolean, default: true },
  // 按 ESC 是否关闭
  closeOnEsc: { type: Boolean, default: true },
  // 是否显示右上角关闭按钮
  closable: { type: Boolean, default: true }
})

const emit = defineEmits(['update:show', 'close', 'after-leave'])

// --- 1. 样式计算 ---
const containerStyle = computed(() => {
  const w = typeof props.width === 'number' ? `${props.width}px` : props.width
  return {
    width: w,
    // 移动端适配，两边留出一点空隙
    maxWidth: 'calc(100vw - 32px)'
  }
})

// --- 2. 核心：防抖动的滚动锁定 (Scroll Lock) ---
const lockScroll = () => {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`
  }
  document.body.style.overflow = 'hidden'
  document.body.classList.add('n-modal-open')
}

const unlockScroll = () => {
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
  document.body.classList.remove('n-modal-open')
}

// --- 3. 生命周期与监听 ---
watch(() => props.show, (val) => {
  if (val) {
    lockScroll()
    if (props.closeOnEsc) window.addEventListener('keydown', handleKeydown)
  } else {
    unlockScroll()
    window.removeEventListener('keydown', handleKeydown)
  }
})

onMounted(() => {
  if (props.show) {
    lockScroll()
    if (props.closeOnEsc) window.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  unlockScroll()
  window.removeEventListener('keydown', handleKeydown)
})

// --- 4. 交互处理 ---
const doClose = () => {
  emit('update:show', false)
  emit('close')
}

const handleMaskClick = () => {
  if (props.maskClosable) doClose()
}

const handleKeydown = (e) => {
  if (e.key === 'Escape') doClose()
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[2000] flex items-center justify-center pointer-events-none"
      :class="{ 'pointer-events-auto': show }"
    >

      <Transition
        enter-active-class="transition-opacity duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="show"
          class="absolute inset-0 bg-black/45 backdrop-blur-[1px] pointer-events-auto"
          @click="handleMaskClick"
        ></div>
      </Transition>

      <Transition
        enter-active-class="transition-all duration-300 ease-out-naive"
        enter-from-class="opacity-0 scale-95 translate-y-2"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in-naive"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-2"
        @after-leave="emit('after-leave')"
      >
        <div
          v-if="show"
          class="
            relative flex flex-col pointer-events-auto
            bg-white dark:bg-[#002941]
            text-[#333639] dark:text-gray-200
            rounded-[3px] shadow-xl
            dark:border dark:border-slate-700
            max-h-[90vh]
          "
          :style="containerStyle"
        >
          <div
            v-if="title || $slots.header"
            class="px-6 pt-5 pb-2 text-[18px] font-medium flex justify-between items-start shrink-0"
          >
            <slot name="header">{{ title }}</slot>

            <div
              v-if="closable"
              @click="doClose"
              class="
                -mr-2 -mt-1 rounded transition-colors cursor-pointer
                text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white
                focus:outline-none
              "
            >
              x
            </div>
          </div>

          <div class="px-6 py-4 text-[14px] leading-[1.6] overflow-y-auto custom-scrollbar">
            <slot></slot>
          </div>

          <div
            v-if="$slots.footer || $slots.action"
            class="px-6 pb-5 pt-2 flex justify-end gap-3 shrink-0"
          >
            <slot name="footer"></slot>
          </div>
        </div>
      </Transition>

    </div>
  </Teleport>
</template>

<style scoped>
.ease-out-naive {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.ease-in-naive {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

/* 适配深蓝背景的滚动条颜色 */
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
