<script setup>
import notFound from '@/assets/404.png'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="min-h-[100dvh] w-full center flex flex-col gap-5 px-5 text-center bg-ui-bg text-ui-text">
    <img class="h-auto max-w-[85vw]" :src="notFound" alt="图片加载失败">
    <Translate class="text-2xl sm:text-3xl font-bold" message="小笨蛋，页面跑偏啦～" />
    <Translate class="text-sm" message="您可以选择返回主页" />
    <Button @click="router.push('/')" variant="primary">
      <Translate message="返回主页" />
    </Button>
  </div>
</template>
