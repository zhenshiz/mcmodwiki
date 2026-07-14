<script setup>
import { modList } from '@/assets/info/mod.js'
import Image from '@/components/Image.vue'
import { useRouter } from 'vue-router'

const router =useRouter()
</script>

<template>
  <div class="size-full flex justify-start items-center flex-col px-4 py-8 sm:px-6 sm:py-10 dark:text-white">
    <div class="text-center text-2xl sm:text-[30px] font-bold">{{ t('我们的 Minecraft 模组') }}</div>

    <div
      class="mt-6 w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      <div
        class="center min-w-0 flex-col gap-2 border-2 rounded border-dashed border-text-gray hover:border-text-blue px-4 py-5 text-center"
        v-for="item in modList()" :key="item.lang">
        <Image :size="150" :src="item.icon" />
        <div class="title">{{ item.lang }}</div>
        <div class="break-words"> {{ t(item.description) }}</div>
        <Button @click="router.push(`/wiki/${item.lang}`)" :roundedSize="5"
                isToggleColor class="text-sm mt-3">
          {{ t('了解更多') }}
        </Button>
      </div>
    </div>
  </div>
</template>
