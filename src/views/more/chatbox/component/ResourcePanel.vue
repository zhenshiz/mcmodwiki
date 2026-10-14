<script setup>
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useChatBoxEditorStore } from '@/stores'
import { t } from '@/languages/index.js'

const store = useChatBoxEditorStore()
const searchQuery = ref('')

// 过滤显示的图片
const filteredTextures = computed(() => {
  const list = []
  store.textureMap.forEach((url, path) => {
    if (!searchQuery.value || path.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      list.push({ path, url })
    }
  })
  return list
})

const handleImportClick = () => {
  store.importAssets()
}

const copyPath = (path) => {
  navigator.clipboard.writeText(path)
}
</script>

<template>
  <div class="flex flex-col h-full bg-ui-surface">
    <div
      class="px-3 py-1 text-xs font-bold uppercase bg-ui-bg text-ui-muted border-b border-ui-line flex justify-between items-center h-[32px] shrink-0">
      <span>{{ t('资源包(ASSETS)') }}</span>

      <div class="flex items-center gap-2">
        <div class="relative flex items-center" v-if="store.textureMap.size > 0">
          <Icon icon="lucide:search" width="12" class="absolute left-2 text-ui-muted" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('搜索贴图...')"
            class="bg-ui-inset border border-ui-line rounded-none text-xs pl-6 pr-2 py-0.5 text-ui-text w-32 focus:border-ui-link focus:outline-none placeholder-slate-600"
          >
        </div>

        <button
          class="cursor-pointer hover:text-ui-text flex items-center gap-1 transition-colors"
          @click="handleImportClick"
        >
          <Icon icon="lucide:image-plus" width="14" />
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto custom-scrollbar relative bg-ui-inset p-2">

      <div v-if="store.isProcessingResources"
           class="absolute inset-0 flex items-center justify-center bg-ui-inset/80 z-20">
        <span class="text-xs text-ui-link animate-pulse">{{ t('正在扫描资源...') }}</span>
      </div>

      <div v-else-if="store.textureMap.size === 0"
           class="flex flex-col items-center justify-center h-full text-ui-muted gap-2 border-2 border-dashed border-ui-line rounded-none m-2">
        <div class="text-center">
          <div class="text-2xl mb-2 opacity-50">📦</div>
          <div class="text-xs">
            {{ t('点击右上角导入') }}<br>
            <code class="bg-ui-inset px-1 rounded-none text-ui-muted">assets</code> {{ t('文件夹') }}
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2">
        <div
          v-for="item in filteredTextures"
          :key="item.path"
          class="group relative aspect-square bg-ui-bg border border-ui-line rounded-none hover:border-ui-link cursor-pointer flex items-center justify-center overflow-hidden transition-all"
          @click="copyPath(item.path)"
          :title="item.path"
        >
          <img :src="item.url" class="max-w-full max-h-full object-contain p-1" loading="lazy" />
          <div
            class="absolute inset-x-0 bottom-0 bg-black/80 text-[10px] text-white truncate px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-center w-full">
            {{ item.path.split('/').pop() }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgb(var(--ui-line)); border-radius: 3px; }
</style>
