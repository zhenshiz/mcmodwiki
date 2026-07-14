<script setup>
import { defineAsyncComponent } from 'vue'
import { useMediaQuery } from '@vueuse/core'

const isCompactScreen = useMediaQuery('(max-width: 1023px)')
const ChatBoxVisual = defineAsyncComponent(() => import('./ChatBoxVisual.vue'))
</script>

<template>
  <div v-if="isCompactScreen"
    class="flex min-h-[100dvh] w-full items-center justify-center bg-[#001529] px-6 py-10 text-slate-200">
    <div class="w-full max-w-md rounded-2xl border border-slate-700 bg-[#002941] p-6 text-center shadow-2xl">
      <div class="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl">
        🖥️
      </div>
      <h1 class="text-xl font-bold text-white">{{ t('请使用电脑打开 ChatBox 编辑器') }}</h1>
      <p class="mt-3 text-sm leading-6 text-slate-400">
        {{ t('该编辑器依赖多面板、拖拽与精细指针操作，窄屏设备无法提供可靠的编辑体验。模组文档仍可在手机上正常浏览。') }}
      </p>
      <a href="/"
        class="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg border border-blue-500/50 px-5 py-2 text-sm font-medium text-blue-300 transition-colors hover:bg-blue-500/10">
        {{ t('返回首页') }}
      </a>
    </div>
  </div>

  <ChatBoxVisual v-else />
</template>
