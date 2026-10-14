<script setup>
import { defineAsyncComponent } from 'vue'
import { useMediaQuery } from '@vueuse/core'

const isCompactScreen = useMediaQuery('(max-width: 1023px)')
const ChatBoxVisual = defineAsyncComponent(() => import('./ChatBoxVisual.vue'))
</script>

<template>
  <div v-if="isCompactScreen"
    class="flex min-h-[100dvh] w-full items-center justify-center bg-ui-bg px-6 py-10 text-ui-text">
    <div class="w-full max-w-md rounded-none border border-ui-line bg-ui-inset p-6 text-center shadow-2xl">
      <div class="mx-auto mb-5 flex size-16 items-center justify-center rounded-none bg-ui-secondary/10 text-3xl">
        🖥️
      </div>
      <h1 class="text-xl font-bold text-ui-text">{{ t('请使用电脑打开 ChatBox 编辑器') }}</h1>
      <p class="mt-3 text-sm leading-6 text-ui-muted">
        {{ t('该编辑器依赖多面板、拖拽与精细指针操作，窄屏设备无法提供可靠的编辑体验。模组文档仍可在手机上正常浏览。') }}
      </p>
      <a href="/"
        class="mt-6 inline-flex min-h-11 items-center justify-center rounded-none border border-ui-link/50 px-5 py-2 text-sm font-medium text-ui-link transition-colors hover:bg-ui-secondary/10">
        {{ t('返回首页') }}
      </a>
    </div>
  </div>

  <ChatBoxVisual v-else />
</template>
