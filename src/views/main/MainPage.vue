<script setup>
import { translatable } from '@/assets/translatable/translatable.js'
import { modList } from '@/assets/mod/mod.js'
import Image from '@/components/Image.vue'
import { useRouter } from 'vue-router'
import { usePageStore } from '@/stores/index.js'

const language = computed(() => usePageStore().setting.language)
const router =useRouter()
</script>

<template>
  <div class="size-full flex justify-start items-center flex-col dark:text-white">
    <div class="mt-10 text-[30px] font-bold">{{ translatable(language, 'main.title.1') }}</div>

    <div
      class="w-full grid grid-cols-1 sm:grid-cols-3 p-2 m-2">
      <div
        class="center flex-col gap-2 border-2 rounded border-dashed border-text-gray hover:border-text-blue m-5 pt-5 pb-5"
        v-for="item in modList">
        <Image :size="150" :src="item.icon" />
        <div class="title">{{ translatable(language, item.lang) }}</div>
        <div> {{ translatable(language, item.description) }}</div>
        <Button @click="router.push(`/wiki/${translatable(language,item.lang)}`)" :roundedSize="5"
                isToggleColor class="text-sm mt-3">
          {{ translatable(language, 'main.button.1') }}
        </Button>
      </div>
    </div>
  </div>
</template>
