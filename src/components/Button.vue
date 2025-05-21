<script setup>
const props = defineProps({
  color: {
    type: String,
    default: '#208bff'
  },
  background: {
    type: String,
    default: '#fff'
  },
  isToggleColor: {
    type: Boolean,
    default: false
  },
  //因为主题原因 除非受到isToggleColor的影响 背景默认为透明
  themeTransparent: {
    type: Boolean,
    default: true
  },
  roundedSize: {
    type: Number,
    default: 9999
  }
})

const buttonColor = ref(props.color)
const textColor = ref(props.color)
const buttonBackground = ref(props.themeTransparent ? 'transparent' : props.background)
const toggleColor = (type) => {
  if (props.isToggleColor) {
    if (props.themeTransparent) {
      if (type === 'enter') {
        [textColor.value, buttonBackground.value] = [props.background, textColor.value]
      } else {
        [textColor.value, buttonBackground.value] = [props.color, 'transparent']
      }
    } else {
      [textColor.value, buttonBackground.value] = [buttonBackground.value, textColor.value]
    }
  }
}
</script>

<template>
  <button
    class="text-lg cursor-pointer select-none p-2"
    ref="button"
    :style="{
      borderRadius: `${roundedSize}px`,
      border: `1px solid ${buttonColor}`,
      color: `${textColor}`,
      backgroundColor: `${buttonBackground}`
    }"
    @mouseenter="toggleColor('enter')"
    @mouseleave="toggleColor('leave')"
  >
    <slot></slot>
  </button>
</template>
