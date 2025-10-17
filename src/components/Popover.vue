<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
  trigger: {
    type: String,
    default: 'hover',
    validator(value) {
      return ['hover', 'click'].includes(value)
    }
  },
  mode: {
    type: String,
    default: 'top',
    validator(value) {
      return ['top', 'bottom'].includes(value)
    }
  },
  offset: {
    type: Number,
    default: 0
  },
  backgroundColor: {
    type: String,
    default: '#ffffff'
  },
  isPopoverTrigger: {
    type: Boolean,
    default: true
  }
})

const showPopover = ref(false)
const trigger = ref(null)
const popover = ref(null)

let handlers = {}

const animateShowHover = () => {
  if (!popover.value) return
  gsap.killTweensOf(popover.value)
  gsap.to(popover.value, {
    duration: 0.1,
    y: 0,
    opacity: 1,
    onComplete: () => (showPopover.value = true)
  })
}
const animateHideHover = () => {
  if (!popover.value) return
  gsap.killTweensOf(popover.value)
  gsap.to(popover.value, {
    duration: 0.1,
    y: 10,
    opacity: 0,
    onComplete: () => (showPopover.value = false)
  })
}
const animateShowClick = () => {
  if (!popover.value) return
  gsap.killTweensOf(popover.value)
  gsap.to(popover.value, {
    duration: 0.1,
    scale: 1,
    opacity: 1,
    onComplete: () => (showPopover.value = true)
  })
}
const animateHideClick = () => {
  if (!popover.value) return
  gsap.killTweensOf(popover.value)
  gsap.to(popover.value, {
    duration: 0.1,
    scale: 0.8,
    opacity: 0,
    onComplete: () => (showPopover.value = false)
  })
}

const updatePosition = () => {
  if (!trigger.value || !popover.value) return
  const trigRect = trigger.value.getBoundingClientRect()
  const popRect = popover.value.getBoundingClientRect()
  const offsetPx = Number(props.offset) || 0

  let top = props.mode === 'top'
    ? trigRect.top - popRect.height - offsetPx
    : trigRect.bottom + offsetPx

  let left = trigRect.left + trigRect.width / 2 - popRect.width / 2

  const margin = 8
  top = Math.max(margin, Math.min(top, window.innerHeight - popRect.height - margin))
  left = Math.max(margin, Math.min(left, window.innerWidth - popRect.width - margin))

  popover.value.style.position = 'absolute'
  popover.value.style.top = `${top + window.scrollY}px`
  popover.value.style.left = `${left + window.scrollX}px`
  popover.value.style.transformOrigin = 'center top'
  popover.value.style.zIndex = '9999'
}

const handleDocumentClick = (e) => {
  if (!trigger.value || !popover.value) return
  if (trigger.value.contains(e.target) || popover.value.contains(e.target)) return
  if (props.trigger === 'click' && showPopover.value) {
    animateHideClick()
  }
}

onMounted(async () => {
  await nextTick()
  // 直接把 slot 第一个根节点作为 trigger
  const el = trigger.value?.firstElementChild
  if (!el) return
  trigger.value = el

  const bindHover = () => {
    handlers.enter = () => {
      showPopover.value = true
      nextTick(() => {
        updatePosition()
        animateShowHover()
      })
    }
    handlers.leave = () => animateHideHover()
    el.addEventListener('mouseenter', handlers.enter)
    el.addEventListener('mouseleave', handlers.leave)

    if (props.isPopoverTrigger) {
      nextTick(() => {
        if (popover.value) {
          handlers.popEnter = () => animateShowHover()
          handlers.popLeave = () => animateHideHover()
          popover.value.addEventListener('mouseenter', handlers.popEnter)
          popover.value.addEventListener('mouseleave', handlers.popLeave)
        }
      })
    }
  }

  const bindClick = () => {
    handlers.clickToggle = (e) => {
      e.stopPropagation()
      if (!showPopover.value) {
        showPopover.value = true
        nextTick(() => {
          updatePosition()
          animateShowClick()
        })
      } else {
        animateHideClick()
      }
    }
    el.addEventListener('click', handlers.clickToggle)
    document.addEventListener('click', handleDocumentClick)
  }

  handlers.resize = () => showPopover.value && updatePosition()
  handlers.scroll = () => showPopover.value && updatePosition()

  window.addEventListener('resize', handlers.resize)
  window.addEventListener('scroll', handlers.scroll, { passive: true })

  props.trigger === 'hover' ? bindHover() : bindClick()
})

onBeforeUnmount(() => {
  const el = trigger.value
  if (!el) return
  if (handlers.enter) el.removeEventListener('mouseenter', handlers.enter)
  if (handlers.leave) el.removeEventListener('mouseleave', handlers.leave)
  if (handlers.clickToggle) el.removeEventListener('click', handlers.clickToggle)
  if (handlers.popEnter && popover.value) popover.value.removeEventListener('mouseenter', handlers.popEnter)
  if (handlers.popLeave && popover.value) popover.value.removeEventListener('mouseleave', handlers.popLeave)
  if (handlers.resize) window.removeEventListener('resize', handlers.resize)
  if (handlers.scroll) window.removeEventListener('scroll', handlers.scroll)
  document.removeEventListener('click', handleDocumentClick)
})

watch(showPopover, (v) => {
  if (v) nextTick(() => updatePosition())
})
</script>

<template>
  <div ref="trigger" class="inline-block">
    <slot name="trigger"></slot>
  </div>

  <teleport to="body">
    <div
      v-show="showPopover"
      ref="popover"
      class="center rounded absolute shadow whitespace-nowrap"
      :style="{ backgroundColor: backgroundColor }"
    >
      <slot></slot>
    </div>
  </teleport>
</template>

<style scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
