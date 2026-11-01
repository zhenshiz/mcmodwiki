<script setup>
import { computed, onUnmounted, ref, watch } from 'vue'
import GameResourceImage from '@/components/form/GameResourceImage.vue'
import { TEXTURE_DRAG_TYPE } from '@/components/form/textureDrag.js'
import { Icon } from '@iconify/vue'
import { useGameBridgeStore } from '@/stores/modules/gameBridge.js'
import { useChatBoxEditorStore } from '@/stores'
import { useMessage } from '@/components/register/useMessage.js'
import { t } from '@/languages/index.js'
import { useLocalResourcePacksStore } from '@/stores/modules/localResourcePacks.js'

const store = useChatBoxEditorStore()
const bridge = useGameBridgeStore()
const localResources = useLocalResourcePacksStore()
const archiveInput = ref(null), directoryInput = ref(null)
const importError = ref('')
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

async function importPack(event, directory = false) {
  const input = event.target
  importError.value = ''
  try {
    const imported = await localResources.importPack(input.files, directory)
    for (const pack of imported) {
      message.success(t('已导入资源包 {}：{} 张贴图', [pack.name, pack.count]))
      if (pack.skipped) message.warning(t('已跳过 {} 张超过 8 MiB 的贴图', pack.skipped))
    }
  } catch (error) { importError.value = t(error.message) }
  finally { input.value = '' }
}

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
      class="px-3 py-1 text-xs font-bold uppercase bg-ui-bg text-ui-muted border-b border-ui-line flex justify-between items-center min-h-[32px] shrink-0 gap-2 flex-wrap">
      <span>{{ t('客户端资源包') }}</span>

      <div class="flex items-center gap-2">
        <input ref="archiveInput" type="file" accept=".zip,.jar,application/zip,application/java-archive" multiple class="hidden" @change="importPack($event)" />
        <input ref="directoryInput" type="file" webkitdirectory multiple class="hidden" @change="importPack($event, true)" />
        <button type="button" class="resource-import" :disabled="localResources.importing || localResources.loading" @click="archiveInput.click()"><Icon icon="lucide:archive" width="13" />{{ t('导入 ZIP / JAR') }}</button>
        <button type="button" class="resource-import" :disabled="localResources.importing || localResources.loading" @click="directoryInput.click()"><Icon icon="lucide:folder-open" width="13" />{{ t('导入文件夹') }}</button>
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
      {{ t('合并显示游戏贴图和本地导入资源，同名资源优先显示后导入的图片。') }}
      {{ t('将图片拖到贴图字段可直接选用。') }}
    </p>

    <div v-if="localResources.packs.length" class="flex items-center flex-wrap gap-2 px-3 py-1 text-xs border-b border-ui-line text-ui-muted">
      <span>{{ t('本地资源包') }}</span>
      <span v-for="pack in localResources.packs" :key="pack.id" class="inline-flex gap-1 items-center bg-ui-inset border border-ui-line px-1.5 py-0.5" :title="pack.name">
        <span class="max-w-40 truncate">{{ pack.name }}</span><span>({{ pack.textures.length }})</span>
        <button type="button" :disabled="localResources.importing" :title="t('移除本地资源包')" :aria-label="t('移除资源包：{}', pack.name)" class="hover:text-red-400" @click="localResources.removePack(pack.id)"><Icon icon="lucide:x" width="12" /></button>
      </span>
      <span>{{ t('本地导入用于浏览和补全，游戏预览需加载相同资源包。') }}</span>
    </div>
    <p v-if="importError" role="alert" class="px-3 py-1 text-xs text-red-500">{{ importError }}</p>
    <p v-if="localResources.storageError" role="status" class="px-3 py-1 text-xs text-amber-500">{{ t('浏览器无法缓存资源包，当前页面仍可使用，刷新后需要重新导入。') }}</p>
    <p v-if="localResources.importing" role="status" class="px-3 py-1 text-xs text-ui-link">{{ t('正在读取本地资源包…') }}</p>

    <div class="flex-1 overflow-y-auto custom-scrollbar relative bg-ui-inset p-2">

      <div v-if="(bridge.syncing || localResources.loading) && !store.allTextureOptions.length"
           class="absolute inset-0 flex items-center justify-center bg-ui-inset/80 z-20">
        <span class="text-xs text-ui-link animate-pulse">{{ t('正在同步…') }}</span>
      </div>

      <div v-else-if="store.allTextureOptions.length === 0"
           class="flex flex-col items-center justify-center h-full text-ui-muted gap-2 border-2 border-dashed border-ui-line rounded-none m-2">
        <div class="text-center">
          <div class="text-2xl mb-2 opacity-50">📦</div>
          <div class="text-xs">{{ t('连接游戏获取贴图，或导入本地资源包文件夹、ZIP、JAR。') }}</div>
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
.resource-import { display: inline-flex; align-items: center; gap: 4px; padding: 3px 6px; border: 1px solid rgb(var(--ui-line)); font-weight: 400; color: rgb(var(--ui-link)); }
.resource-import:hover:not(:disabled) { background: rgb(var(--ui-inset)); }
.resource-import:disabled { opacity: .5; }
</style>
