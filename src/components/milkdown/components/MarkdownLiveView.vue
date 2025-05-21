<script setup>
import MilkDownReadOnly from '@/components/milkdown/MilkDownReadOnly.vue'
import Textarea from '@/components/Textarea.vue'
import gsap from 'gsap'

const content = ref('')
const isPreview = ref(true)
const nav = ref()
const line = ref()

const toggleNav = (value) => {
  if (value !== isPreview.value) {
    if (value) {
      //切换到预览
      gsap.to(line.value, { duration: 0.5, x: 0 })
    } else {
      //切换到代码
      gsap.to(line.value, { duration: 0.5, x: nav.value.getBoundingClientRect().width / 2 })
    }
    isPreview.value = value
  }
}
</script>

<template>
  <div class="flex flex-col rounded border relative view">
    <div ref="nav" class="flex flex-row h-[40px] text-[16px] nav border-b">
      <div @click="toggleNav(true)" class="flex-1 center button-theme-cursor-blue">预览</div>
      <div @click="toggleNav(false)" class="flex-1 center button-theme-cursor-blue">代码</div>
    </div>
    <div ref="line" class="line absolute border-b-2 w-1/2 top-[40px]" />
    <div class="min-h-[100px] w-full">
      <MilkDownReadOnly v-if="isPreview" :content="content" editorHeight="100" />
      <Textarea class="w-full min-h-[94px]" v-else v-model="content" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.view {
  border-color: var(--blue-5);

  .nav {
    border-bottom-color: var(--blue-5);
  }

  .line {
    border-bottom-color: var(--blue-5);
  }
}
</style>
