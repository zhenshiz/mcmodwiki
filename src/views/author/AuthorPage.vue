<script setup>
import { translatable } from '@/assets/translatable/translatable.js'
import Image from '@/components/Image.vue'
import zhenshiz from '@/assets/author/zhenshiz.jpg'

const authorList = ref([
  {
    lang: 'author.name.1',
    icon: zhenshiz,
    job: 'author.job.1',
    description: 'author.description.1'
  }
])
</script>

<template>
  <div class="size-full flex justify-start items-center flex-col dark:text-white">
    <div class="mt-10 text-[30px] font-bold">{{ translatable('author.title.1') }}</div>

    <div
      class="w-full grid grid-cols-1 sm:grid-cols-3 p-2 m-2">
      <div
        class="center flex-col gap-5 border-2 rounded border-dashed border-text-gray hover:border-text-blue m-5 pt-5 pb-5"
        v-for="item in authorList">
        <Image size="150" :src="item.icon" />
        <div class="title">{{ translatable(item.lang) }}</div>
        <div> {{ translatable(item.job) }}</div>
        <div> {{ translatable(item.description) }}</div>
      </div>
    </div>
  </div>
</template>
