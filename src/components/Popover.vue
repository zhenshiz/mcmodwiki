<script setup>
defineOptions({ name: 'McPopover', inheritAttrs: false })
import { computed, ref } from 'vue'
import {
  arrow,
  autoUpdate,
  flip,
  offset as floatingOffset,
  shift,
  size,
  useFloating,
} from '@floating-ui/vue'
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
  disabled: Boolean,
  matchTriggerWidth: Boolean,
  trigger: {
    type: String,
    default: 'hover',
  },
  placement: {
    type: String,
    default: 'bottom',
  },
  offset: {
    type: Number,
    default: 0,
  },
})

const isOpen = defineModel('isOpen', { type: Boolean, default: false })
const referenceRef = ref(null)
const floatingRef = ref(null)
const arrowRef = ref(null)

const {
  floatingStyles,
  placement: finalPlacement,
  middlewareData,
} = useFloating(referenceRef, floatingRef, {
  placement: props.placement,
  strategy: 'fixed',
  whileElementsMounted: autoUpdate,
  middleware: [
    floatingOffset(props.offset),
    flip(),
    shift({ padding: 5 }),
    arrow({ element: arrowRef }),
    size({
      apply({ rects, elements }) {
        if (props.matchTriggerWidth) elements.floating.style.width = `${rects.reference.width}px`
      },
    }),
  ],
})

const toggle = () => {
  if (!props.disabled && props.trigger === 'click') isOpen.value = !isOpen.value
}

const show = () => {
  if (!props.disabled && props.trigger === 'hover') isOpen.value = true
}

const hide = () => {
  if (!props.disabled && props.trigger === 'hover') isOpen.value = false
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
    left: 'right',
  }[finalPlacement.value.split('-')[0]]

  return {
    left: x != null ? `${x}px` : '',
    top: y != null ? `${y}px` : '',
    [staticSide]: '-4px',
  }
})
</script>

<template>
  <div
    ref="referenceRef"
    v-bind="$attrs"
    class="inline-block"
    @click="toggle"
    @mouseenter="show"
    @mouseleave="hide"
    @keydown.esc="isOpen = false"
  >
    <slot name="trigger" />
  </div>

  <Teleport to="body">
    <div
      v-if="isOpen"
      ref="floatingRef"
      class="fixed z-[9999] focus:outline-none"
      @keydown.esc.stop="isOpen = false"
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
          class="mc-panel px-3 py-2 text-sm"
          :class="matchTriggerWidth ? 'w-full min-w-0' : 'min-w-max'"
          @mouseenter="show"
          @mouseleave="hide"
        >
          <slot />

          <div
            ref="arrowRef"
            class="absolute h-2 w-2 rotate-45 bg-ui-surface border border-ui-border"
            :style="arrowStyle"
            style="border-bottom: 0; border-right: 0"
          ></div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>
