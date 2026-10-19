<script setup>
import { computed } from 'vue'
import { useGameBridgeStore } from '@/stores/modules/gameBridge.js'
import { useChatBoxEditorStore } from '@/stores'
import { Icon } from '@iconify/vue'
import FileTreeItem from './tree/FileTreeItem.vue'
import { t } from '@/languages/index.js'
import { useDialog } from '@/components/register/useDialog.js'

const store = useChatBoxEditorStore()
const bridge = useGameBridgeStore()
const dialog = useDialog()

const handleToggle = (node) => {
  node.isOpen = !node.isOpen
  store.selectTreeNode(node)
}

const handleSelectNode = async (node) => {
  // 只有文件才触发读取，文件夹只触发 toggle
  if (!node.isFolder) {
    if (store.currentFile && store.checkDirty()) {
      dialog.warning({
        title: t('未保存的更改'),
        content: t('当前文件有未保存的更改，是否保存？'),
        positiveText: t('保存'),
        negativeText: t('不保存'),
        onPositiveClick: async () => {
          if (!await store.saveProject()) return
          store.selectTreeNode(node)
          store.loadFile(node)
        },
        onNegativeClick: () => {
          store.selectTreeNode(node)
          store.loadFile(node)
        }
      })
    } else {
      store.selectTreeNode(node)
      store.loadFile(node)
    }
  }
}

const handleSelectAnyNode = (node) => {
  store.selectTreeNode(node)
}

const selectedPath = computed(() => store.selectedTreeNode?.path || store.currentFile?.path || '')

const copySelectedPath = async () => {
  if (!selectedPath.value) return
  try {
    await navigator.clipboard.writeText(selectedPath.value)
  } catch {
    // 忽略，某些环境可能没有权限
  }
}

</script>

<template>
  <div class="flex flex-col h-full bg-ui-surface">
    <div
      class="px-3 py-2 text-xs font-bold uppercase tracking-wider bg-ui-bg text-ui-muted flex justify-between items-center border-b border-ui-line">
      <span>{{ t('游戏文件') }}</span>

      <button type="button" :disabled="!bridge.connected || bridge.syncing" :title="t('刷新游戏文件')" :aria-label="t('刷新游戏文件')" @click="bridge.refresh().catch(() => {})">
        <Icon icon="lucide:refresh-cw" width="14" :class="{ 'animate-spin': bridge.syncing }" />
      </button>
    </div>

    <div
      class="px-3 py-1 text-[10px] font-mono bg-ui-bg text-ui-muted flex items-center justify-between border-b border-ui-line">
      <span class="truncate" :title="selectedPath">{{ selectedPath || t('未选择') }}</span>
      <button
        class="ml-2 shrink-0 hover:text-ui-text transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="!selectedPath"
        :title="t('复制路径')"
        @click="copySelectedPath"
      >
        <Icon icon="lucide:copy" width="12" />
      </button>
    </div>

    <div v-if="store.currentFile" class="px-3 py-2 text-[10px] border-b border-ui-line text-ui-muted break-words">
      <div>{{ t('来源：{}', store.currentFile.source) }}</div>
      <div>{{ store.currentFile.saveMode === 'override' ? t('保存为世界覆盖数据包') : t('保存到原数据包') }}</div>
      <div class="font-mono mt-1">{{ store.currentFile.savePath }}</div>
      <div v-if="!bridge.connected" class="text-red-500 mt-1">{{ t('游戏已断开，编辑内容保留；重新连接后才能保存') }}</div>
    </div>

    <div class="flex-1 overflow-y-auto custom-scrollbar relative">

      <div v-if="store.gameFiles.length === 0"
           class="flex flex-col items-center justify-center h-full text-ui-muted gap-2 p-4 text-center">
        <Icon icon="lucide:hard-drive" width="48" class="opacity-20" />
        <span class="text-xs">{{ bridge.connected ? t('没有已加载的对话或主题文件') : t('请连接游戏以读取对话和主题文件') }}</span>
      </div>

      <div v-else class="py-2">
        <FileTreeItem
          v-for="node in store.gameFiles"
          :key="node.path"
          :node="node"
          :selected-path="store.selectedTreeNode?.path || store.currentFile?.path"
          @toggle="handleToggle"
          @select="handleSelectNode"
          @select-any="handleSelectAnyNode"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 滚动条适配深蓝 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgb(var(--ui-line));
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
</style>
