<script setup>
import { modList } from '@/assets/info/mod.js'
import Image from '@/components/Image.vue'
import { useRouter } from 'vue-router'

const router =useRouter()
</script>

<template>
  <div class="size-full flex justify-start items-center flex-col dark:text-white">
    <div class="mt-10 text-[30px] font-bold">{{ t('我们的 Minecraft 模组') }}</div>

    <div
      class="w-full grid grid-cols-1 sm:grid-cols-3 p-2 m-2">
      <div
        class="center flex-col gap-2 border-2 rounded border-dashed border-text-gray hover:border-text-blue m-5 pt-5 pb-5"
        v-for="item in modList">
        <Image :size="150" :src="item.icon" />
        <div class="title">{{ item.lang }}</div>
        <div> {{ t(item.description) }}</div>
        <Button @click="router.push(`/wiki/${item.lang}`)" :roundedSize="5"
                isToggleColor class="text-sm mt-3">
          {{ t('了解更多') }}
        </Button>
      </div>
    </div>
  </div>
</template>
