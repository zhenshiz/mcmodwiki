<script setup>
import notFound from '@/assets/404.png'
import { usePageStore } from '@/stores/index.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const isDark = computed(() => usePageStore().isDark)
</script>

<template>
  <div class="min-h-[100dvh] w-full center flex flex-col gap-5 px-5 text-center"
       :style="{backgroundColor: isDark?'#001f2e':'#fff',color:isDark?'#fff':'#000'}">
    <img class="h-auto max-w-[85vw]" :src="notFound" alt="图片加载失败">
    <Translate class="text-2xl sm:text-3xl font-bold" message="小笨蛋，页面跑偏啦～" />
    <Translate class="text-sm" message="您可以选择返回主页" />
    <Button @click="router.push('/')" :background="isDark?'#000':'#fff'">
      <Translate message="返回主页" />
    </Button>
  </div>
</template>
