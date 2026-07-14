<script setup>
import Image from '@/components/Image.vue'
import zhenshiz from '@/assets/textures/author/zhenshiz.jpg'
import Amotassic from '@/assets/textures/author/Amotassic.jpg'

const authorList = computed(() => [
  {
    lang: 'zhenshiz',
    icon: zhenshiz,
    job: t('1.21.1 NeoForge 开发者'),
    description: t('写模组是工作，写Web才是生活')
  },
  {
    lang: 'Amotassic',
    icon: Amotassic,
    job: t('主程序大人'),
    description: t('此人很高冷，没有任何留言')
  }
])
</script>

<template>
  <div class="size-full flex justify-start items-center flex-col px-4 py-8 sm:px-6 sm:py-10 dark:text-white">
    <div class="text-center text-2xl sm:text-[30px] font-bold">
      <Translate message="关于我们"></Translate>
    </div>

    <div
      class="mt-6 w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      <div
        class="center min-w-0 flex-col gap-4 border-2 rounded border-dashed border-text-gray hover:border-text-blue px-4 py-5 text-center"
        v-for="item in authorList" :key="item.lang">
        <Image :size="150" :src="item.icon" />
        <div class="title">{{ item.lang }}</div>
        <div class="break-words"> {{ item.job }}</div>
        <div class="break-words"> {{ item.description }}</div>
      </div>
    </div>
  </div>
</template>
