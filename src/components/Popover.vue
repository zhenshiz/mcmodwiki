<script setup>
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
  //弹出框是否包含事件 指的是hover,click不可能会绑定事件
  isPopoverTrigger: {
    type: Boolean,
    default: true
  }
})

const showPopover = ref(false)
let popoverTop = ref(0)
let popoverBottom = ref(0)
let key = 0

const trigger = ref()
const popover = ref()
const toggleShowPopover = (pattern, bool) => {
  if (pattern === 'hover') {
    if (bool) {
      //显示
      gsap.to(popover.value, { duration: 0.1, y: 0, opacity: 1, onComplete: () => showPopover.value = bool })
    } else {
      //隐藏
      gsap.to(popover.value, { duration: 0.1, y: 10, opacity: 0, onComplete: () => showPopover.value = bool })
    }
  } else if (pattern === 'click') {
    if (bool) {
      //显示
      gsap.to(popover.value, { duration: 0.1, scale: 1, opacity: 1, onComplete: () => showPopover.value = bool })
    } else {
      //隐藏
      gsap.to(popover.value, { duration: 0.1, scale: 0.8, opacity: 0, onComplete: () => showPopover.value = bool })
    }
  }

}
onMounted(() => {
  if (trigger.value) {
    if (props.trigger === 'hover') {
      trigger.value.addEventListener('mousemove', () => toggleShowPopover('hover', true))
      trigger.value.addEventListener('mouseleave', () => toggleShowPopover('hover', false))
      if (props.isPopoverTrigger) {
        popover.value.addEventListener('mousemove', () => toggleShowPopover('hover', true))
        popover.value.addEventListener('mouseleave', () => toggleShowPopover('hover', false))
      }
    } else if (props.trigger === 'click') {
      trigger.value.addEventListener('click', () => toggleShowPopover('click', !showPopover.value))
    }
  }
  if (trigger.value.offsetParent){
    popoverTop.value = trigger.value.offsetParent.offsetHeight - props.offset
    popoverBottom.value = trigger.value.offsetParent.offsetHeight - props.offset
    key++
  }
})

onBeforeUnmount(() => {
  if (trigger.value) {
    if (props.trigger === 'hover') {
      trigger.value.removeEventListener('mousemove', () => toggleShowPopover('hover', true))
      trigger.value.removeEventListener('mouseleave', () => toggleShowPopover('hover', true))
      if (props.isPopoverTrigger) {
        popover.value.removeEventListener('mousemove', () => toggleShowPopover('hover', true))
        popover.value.removeEventListener('mouseleave', () => toggleShowPopover('hover', false))
      }
    } else if (props.trigger === 'click') {
      trigger.value.removeEventListener('click', () => toggleShowPopover('click', !showPopover.value))
    }
  }
})
</script>

<template>
  <div class="size-full flex-col center relative">
    <div ref="trigger" class="size-full center">
      <slot name="trigger"></slot>
    </div>
    <div v-show="showPopover" ref="popover" class="center rounded absolute shadow whitespace-nowrap z-10"
         :style="{backgroundColor:backgroundColor,top:mode==='top'?popoverTop+'px':'',bottom:mode==='bottom'?popoverBottom+'px':''}">
      <slot></slot>
    </div>
  </div>
</template>
