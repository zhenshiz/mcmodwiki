<script setup>
import { useChatBoxEditorStore } from '@/stores'
import { Icon } from '@iconify/vue'
import FileTreeItem from './tree/FileTreeItem.vue'

const store = useChatBoxEditorStore()

const handleOpenFolder = () => {
  store.openProject()
}

const handleToggle = (node) => {
  node.isOpen = !node.isOpen
}

const handleSelectNode = (node) => {
  // 只有文件才触发读取，文件夹只触发 toggle
  if (!node.isFolder) {
    store.loadFile(node)
  }
}
</script>

<template>
  <div class="flex flex-col h-full bg-[#002033]">
    <div
      class="px-3 py-2 text-xs font-bold uppercase tracking-wider bg-[#001529] text-slate-400 flex justify-between items-center border-b border-slate-700">
      <span>WORK SPACE</span>

      <button
        class="cursor-pointer hover:text-white flex items-center gap-1 transition-colors"
        @click="handleOpenFolder"
      >
        <Icon icon="lucide:folder-open" width="14" />
      </button>
    </div>

    <div class="flex-1 overflow-y-auto custom-scrollbar relative">

      <div v-if="store.fileTree.length === 0"
           class="flex flex-col items-center justify-center h-full text-slate-500 gap-2 p-4 text-center">
        <Icon icon="lucide:hard-drive" width="48" class="opacity-20" />
        <span class="text-xs">
          请点击右上角<br>打开本地 <code
          class="bg-slate-800 px-1 rounded text-slate-300">data</code> 文件夹<br>
          <span class="text-[10px] opacity-60 mt-2 block">(支持 Ctrl+S 直接保存)</span>
        </span>
      </div>

      <div v-else class="py-2">
        <FileTreeItem
          v-for="node in store.fileTree"
          :key="node.path"
          :node="node"
          :selected-path="store.currentFile?.path"
          @toggle="handleToggle"
          @select="handleSelectNode"
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
  background-color: #1e293b;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
</style>
