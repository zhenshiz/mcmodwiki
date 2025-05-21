<script setup>
import notFound from '@/assets/404.png'
import { usePageStore } from '@/stores/index.js'
import { useRouter } from 'vue-router'
import { translatable } from '@/assets/translatable/translatable.js'

const router = useRouter()
const isDark = computed(() => usePageStore().isDark)
</script>

<template>
  <div class="w-lvw h-lvh center flex flex-col gap-5"
       :style="{backgroundColor: isDark?'#001f2e':'#fff',color:isDark?'#fff':'#000'}">
    <img :src="notFound" alt="图片加载失败">
    <div class="text-3xl font-bold">{{ translatable('error.404.1')}}</div>
    <div class="text-sm">{{ translatable('error.404.2')}}</div>
    <Button @click="router.push('/')" :background="isDark?'#000':'#fff'" is-toggle-color :rounded-size="4">
      {{ translatable('error.404.3')}}
    </Button>
  </div>
</template>
