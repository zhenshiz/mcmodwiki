<script setup>
import { computed, ref } from 'vue'
import { arrow, autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
  trigger: {
    type: String,
    default: 'hover' // hover | click
  },
  placement: {
    type: String,
    default: 'bottom'
  },
  offset: {
    type: Number,
    default: 0
  }
})

const isOpen = ref(false)
const referenceRef = ref(null)
const floatingRef = ref(null)
const arrowRef = ref(null)

// 浮动配置
const {
  floatingStyles,
  placement: finalPlacement,
  middlewareData
} = useFloating(referenceRef, floatingRef, {
  placement: props.placement,
  strategy: 'fixed',
  whileElementsMounted: autoUpdate,
  middleware: [
    offset(props.offset),
    flip(),
    shift({ padding: 5 }),
    arrow({ element: arrowRef })
  ]
})

// 事件处理
let timer = null

const toggle = () => {
  if (props.trigger === 'click') isOpen.value = !isOpen.value
}

const show = () => {
  if (props.trigger === 'hover') {
    clearTimeout(timer)
    isOpen.value = true
  }
}

const hide = () => {
  if (props.trigger === 'hover') {
    // 加一个小延迟，防止鼠标快速划过时闪烁
    timer = setTimeout(() => {
      isOpen.value = false
    }, 100)
  }
}

onClickOutside(referenceRef, (event) => {
  // 点击外部且不是点击浮动元素内部时关闭
  if (floatingRef.value && !floatingRef.value.contains(event.target)) {
    isOpen.value = false
  }
})

// 箭头样式计算
const arrowStyle = computed(() => {
  const { x, y } = middlewareData.value.arrow || {}
  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right'
  }[finalPlacement.value.split('-')[0]]

  return {
    left: x != null ? `${x}px` : '',
    top: y != null ? `${y}px` : '',
    [staticSide]: '-4px'
  }
})
</script>

<template>
  <div
    ref="referenceRef"
    class="inline-block"
    @click="toggle"
    @mouseenter="show"
    @mouseleave="hide"
  >
    <slot name="trigger" />
  </div>

  <Teleport to="body">
    <div
      v-if="isOpen"
      ref="floatingRef"
      class="fixed z-[9999] focus:outline-none"
      :style="floatingStyles"
      @mouseenter="show"
      @mouseleave="hide"
    >
      <Transition
        appear
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-1"
      >
        <div
          class="min-w-max rounded-lg border border-gray-200 bg-white text-sm text-gray-700 shadow-xl dark:bg-dark-blue dark:border-gray-700 dark:text-gray-200 overflow-hidden"
        >
          <slot />

          <div
            ref="arrowRef"
            class="absolute h-2 w-2 rotate-45 bg-white border border-gray-200 dark:bg-dark-blue dark:border-gray-700"
            :style="arrowStyle"
            style="border-bottom: 0; border-right: 0;"
          ></div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>