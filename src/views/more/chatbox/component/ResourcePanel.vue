<script setup>
import { computed, onUnmounted, ref, watch } from 'vue'
import GameResourceImage from '@/components/form/GameResourceImage.vue'
import { TEXTURE_DRAG_TYPE } from '@/components/form/textureDrag.js'
import { Icon } from '@iconify/vue'
import { useGameBridgeStore } from '@/stores/modules/gameBridge.js'
import { useChatBoxEditorStore } from '@/stores'
import { useMessage } from '@/components/register/useMessage.js'
import { t } from '@/languages/index.js'

const store = useChatBoxEditorStore()
const bridge = useGameBridgeStore()
const searchQuery = ref('')
const message = useMessage()
const copiedPath = ref('')
let copyTimer
onUnmounted(() => clearTimeout(copyTimer))


// 过滤显示的图片
const limit = ref(80)
watch(searchQuery, () => { limit.value = 80 })
const filteredTextures = computed(() => store.allTextureOptions.filter(item =>
  !searchQuery.value || item.value.toLowerCase().includes(searchQuery.value.toLowerCase())))

const handleDragStart = (event, item) => {
  // 覆盖图片原生拖拽的 URL，只传递游戏使用的资源 ID。
  event.dataTransfer.clearData()
  event.dataTransfer.setData(TEXTURE_DRAG_TYPE, item.value)
  event.dataTransfer.setData('text/plain', item.value)
  event.dataTransfer.effectAllowed = 'copy'
}

const copyPath = async (path) => {
  try {
    await navigator.clipboard.writeText(path)
    copiedPath.value = path
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => { copiedPath.value = '' }, 2000)
    message.success(t('复制成功'))
  } catch { message.error(t('复制失败，请检查浏览器剪贴板权限')) }
}
</script>

<template>
  <div class="flex flex-col h-full bg-ui-surface">
    <div
      class="px-3 py-1 text-xs font-bold uppercase bg-ui-bg text-ui-muted border-b border-ui-line flex justify-between items-center h-[32px] shrink-0">
      <span>{{ t('客户端资源包') }}</span>

      <div class="flex items-center gap-2">
        <div class="relative flex items-center" v-if="store.allTextureOptions.length > 0">
          <Icon icon="lucide:search" width="12" class="absolute left-2 text-ui-muted" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('搜索贴图...')"
            class="bg-ui-inset border border-ui-line rounded-none text-xs pl-6 pr-2 py-0.5 text-ui-text w-32 focus:border-ui-link focus:outline-none placeholder-slate-600"
          >
        </div>

      </div>
    </div>

    <p class="px-3 py-1 text-xs text-ui-muted border-b border-ui-line">
      {{ t('仅列出已启用的本地资源包。模组贴图可直接填写资源 ID，预览由游戏解析。') }}
      {{ t('将图片拖到贴图字段可直接选用。') }}
    </p>

    <div class="flex-1 overflow-y-auto custom-scrollbar relative bg-ui-inset p-2">

      <div v-if="bridge.syncing"
           class="absolute inset-0 flex items-center justify-center bg-ui-inset/80 z-20">
        <span class="text-xs text-ui-link animate-pulse">{{ t('正在同步…') }}</span>
      </div>

      <div v-else-if="store.allTextureOptions.length === 0"
           class="flex flex-col items-center justify-center h-full text-ui-muted gap-2 border-2 border-dashed border-ui-line rounded-none m-2">
        <div class="text-center">
          <div class="text-2xl mb-2 opacity-50">📦</div>
          <div class="text-xs">{{ bridge.connected ? t('没有已启用的本地资源包贴图，可直接填写资源 ID') : t('连接游戏后读取客户端已启用的本地资源包') }}</div>
        </div>
      </div>

      <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2">
        <div
          v-for="item in filteredTextures.slice(0, limit)"
          :key="item.value"
          class="group relative aspect-square bg-ui-bg border border-ui-line rounded-none hover:border-ui-link cursor-grab active:cursor-grabbing select-none flex items-center justify-center overflow-hidden transition-all"
          :title="`${item.value}\n${item.source || ''}`"
          draggable="true"
          @dragstart="handleDragStart($event, item)"
        >
          <GameResourceImage :option="item" preview size="64px" class="max-w-full max-h-full p-1" />
          <button class="absolute top-1 right-1 border border-ui-line bg-ui-bg p-1 text-ui-link opacity-0 group-hover:opacity-100 focus:opacity-100" :class="{ 'opacity-100': copiedPath === item.value }" :aria-label="t('复制图片路径')" :title="copiedPath === item.value ? t('复制成功') : t('复制图片路径')" @click.stop="copyPath(item.value)">
            <Icon :icon="copiedPath === item.value ? 'lucide:check' : 'lucide:copy'" width="14" />
          </button>
          <div
            class="absolute inset-x-0 bottom-0 bg-black/80 text-[10px] text-white truncate px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-center w-full">
            {{ item.value.split('/').pop() }}
          </div>
        </div>
      </div>
      <button v-if="filteredTextures.length > limit" class="w-full border border-ui-line text-xs p-2 mt-2 text-ui-link" @click="limit += 80">{{ t('加载更多资源（共 {} 个）', filteredTextures.length) }}</button>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgb(var(--ui-line)); border-radius: 3px; }
</style>
