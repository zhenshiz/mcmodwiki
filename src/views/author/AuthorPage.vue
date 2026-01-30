<script setup>
import Image from '@/components/Image.vue'
import zhenshiz from '@/assets/textures/author/zhenshiz.jpg'
import Amotassic from '@/assets/textures/author/Amotassic.jpg'

const authorList = ref([
  {
    lang: 'zhenshiz',
    icon: zhenshiz,
    job: '1.21.1 NeoForge 开发者',
    description: '写模组是工作，写Web才是生活'
  },
  {
    lang: 'Amotassic',
    icon: Amotassic,
    job: '主程序大人',
    description: '此人很高冷，没有任何留言'
  }
])
</script>

<template>
  <div class="size-full flex justify-start items-center flex-col dark:text-white">
    <Translate class="mt-10 text-[30px] font-bold" message="关于我们"></Translate>

    <div
      class="w-full grid grid-cols-1 sm:grid-cols-3 p-2 m-2">
      <div
        class="center flex-col gap-5 border-2 rounded border-dashed border-text-gray hover:border-text-blue m-5 pt-5 pb-5"
        v-for="item in authorList">
        <Image :size="150" :src="item.icon" />
        <div class="title">{{ item.lang }}</div>
        <div> {{ t(item.job) }}</div>
        <div> {{ t(item.description) }}</div>
      </div>
    </div>
  </div>
</template>
