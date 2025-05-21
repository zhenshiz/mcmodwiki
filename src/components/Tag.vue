<script setup>
const props = defineProps({
  //是否有边框
  bordered: {
    type: Boolean,
    default: true
  },
  //是否有删除按钮
  closable: {
    type: Boolean,
    default: false
  },
  //是否有圆角
  round: {
    type: Boolean,
    default: false
  },
  //背景颜色
  backgroundColor: {
    type: String,
    default: 'transparent'
  },
  //字的颜色
  color: {
    type: String,
    default: '#000'
  },
  //边框的颜色
  borderColor: {
    type: String,
    default: '#e0e0e6'
  }
})

const visible = ref(true)
const emit = defineEmits(['onClose'])

const onClose = () => {
  visible.value = false
  emit('onClose')
}
</script>

<template>
  <div v-if="visible" class="center px-3 py-1 cursor-default"
       :class="{border:bordered,rounded:round}"
       :style="{backgroundColor:backgroundColor,color:color,borderColor:borderColor}">
    <slot name="header" />
    <slot />
    <slot name="footer" />
    <div class="ml-3 cursor-pointer" @click="onClose" v-if="closable">x</div>
  </div>
</template>
