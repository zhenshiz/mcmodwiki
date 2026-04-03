<script setup>
import { computed } from 'vue'
import { useChatBoxEditorStore } from '@/stores'
import { Icon } from '@iconify/vue'
import FileTreeItem from './tree/FileTreeItem.vue'
import { t } from '@/languages/index.js'
import { useDialog } from '@/components/register/useDialog.js'
import { usePrompt } from '@/components/register/usePrompt.js'
import { shortcutUtil } from '@/utils/shortcutUtil.js'

const store = useChatBoxEditorStore()
const dialog = useDialog()
const prompt = usePrompt()

const handleOpenFolder = () => {
  store.openProject()
}

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
          await store.saveProject()
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
const modKey = shortcutUtil.getPrimaryModifierKeyLabel()

const copySelectedPath = async () => {
  if (!selectedPath.value) return
  try {
    await navigator.clipboard.writeText(selectedPath.value)
  } catch (e) {
    // 忽略，某些环境可能没有权限
  }
}

const createFolderHere = () => {
  prompt.openInput({
    title: t('新建文件夹'),
    placeholder: t('请输入文件夹名称'),
    defaultValue: 'new_folder',
    onPositiveClick: async (name) => {
      await store.createFolder({ name })
    }
  })
}

const createJsonHere = () => {
  prompt.openInput({
    title: t('新建 JSON 文件'),
    placeholder: t('请输入文件名 (可不带 .json)'),
    defaultValue: 'new_file.json',
    onPositiveClick: async (name) => {
      await store.createJsonFile({ name })
    }
  })
}

const deleteSelected = () => {
  const node = store.selectedTreeNode
  if (!node) return

  dialog.warning({
    title: t('删除'),
    content: node.isFolder
      ? t('确定删除文件夹 "{}" 吗？(将递归删除其内容)', node.name)
      : t('确定删除文件 "{}" 吗？', node.name),
    onPositiveClick: async () => {
      await store.deleteTreeEntry({ node })
    }
  })
}
</script>

<template>
  <div class="flex flex-col h-full bg-[#002033]">
    <div
      class="px-3 py-2 text-xs font-bold uppercase tracking-wider bg-[#001529] text-slate-400 flex justify-between items-center border-b border-slate-700">
      <span>{{ t('数据包(DATA)') }}</span>

      <div class="flex items-center gap-2">
        <button
          class="cursor-pointer hover:text-white flex items-center gap-1 transition-colors"
          :title="t('打开本地 data 文件夹')"
          @click="handleOpenFolder"
        >
          <Icon icon="lucide:folder-open" width="14" />
        </button>
        <button
          class="cursor-pointer hover:text-white flex items-center gap-1 transition-colors"
          :title="t('新建文件夹 (在当前选中目录/文件所在目录)')"
          @click="createFolderHere"
        >
          <Icon icon="lucide:folder-plus" width="14" />
        </button>
        <button
          class="cursor-pointer hover:text-white flex items-center gap-1 transition-colors"
          :title="t('新建 JSON 文件 (在当前选中目录/文件所在目录)')"
          @click="createJsonHere"
        >
          <Icon icon="lucide:file-plus" width="14" />
        </button>
        <button
          class="cursor-pointer hover:text-white flex items-center gap-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="!store.selectedTreeNode"
          :title="t('删除当前选中项')"
          @click="deleteSelected"
        >
          <Icon icon="lucide:trash-2" width="14" />
        </button>
      </div>
    </div>

    <div
      class="px-3 py-1 text-[10px] font-mono bg-[#001529] text-slate-500 flex items-center justify-between border-b border-slate-700">
      <span class="truncate" :title="selectedPath">{{ selectedPath || t('未选择') }}</span>
      <button
        class="ml-2 shrink-0 hover:text-slate-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="!selectedPath"
        :title="t('复制路径')"
        @click="copySelectedPath"
      >
        <Icon icon="lucide:copy" width="12" />
      </button>
    </div>

    <div class="flex-1 overflow-y-auto custom-scrollbar relative">

      <div v-if="store.fileTree.length === 0"
           class="flex flex-col items-center justify-center h-full text-slate-500 gap-2 p-4 text-center">
        <Icon icon="lucide:hard-drive" width="48" class="opacity-20" />
        <span class="text-xs">
          {{ t('请点击右上角') }}<br>{{ t('打开本地') }} <code
          class="bg-slate-800 px-1 rounded text-slate-300">data</code> {{ t('文件夹') }}<br>
          <span class="text-[10px] opacity-60 mt-2 block">{{ t('(支持 Ctrl+S 直接保存)', modKey) }}</span>
        </span>
      </div>

      <div v-else class="py-2">
        <FileTreeItem
          v-for="node in store.fileTree"
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
  background-color: #1e293b;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
</style>
