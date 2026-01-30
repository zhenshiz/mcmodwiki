<script setup>
import { computed, ref } from 'vue'
import { arrow, autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
  trigger: {
    type: String,
    default: 'hover'
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

const toggle = () => {
  if (props.trigger === 'click') isOpen.value = !isOpen.value
}

const show = () => {
  if (props.trigger === 'hover') isOpen.value = true
}

const hide = () => {
  if (props.trigger === 'hover') isOpen.value = false
}

onClickOutside(referenceRef, (event) => {
  if (floatingRef.value && !floatingRef.value.contains(event.target)) {
    isOpen.value = false
  }
})

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
          class="min-w-max rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-xl dark:bg-dark-blue dark:border-gray-700 dark:text-gray-200"
          @mouseenter="show"
          @mouseleave="hide"
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
