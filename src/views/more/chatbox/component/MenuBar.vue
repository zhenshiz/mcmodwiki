<script setup>
import { ref, computed } from 'vue'
import { useChatBoxEditorStore } from '@/stores'
import { useFileSystem } from './tree/useFileSystem.js'
import Dropdown from '@/components/Dropdown.vue'
import { Icon } from '@iconify/vue'

import Modal from '@/components/Modal.vue'
import Button from '@/components/Button.vue'
import ShowJsonCopy from './ShowJsonCopy.vue'
import { usePrompt } from '@/components/register/usePrompt.js'
import Autocomplete from '@/components/form/Autocomplete.vue'
import Input from '@/components/form/Input.vue'
import { useMessage } from '@/components/register/useMessage.js'

const store = useChatBoxEditorStore()
const { openDirectory } = useFileSystem()
const prompt = usePrompt()
const message = useMessage()

// === 状态定义 ===
const translatableVisible = ref(false)
const translatableSearch = ref('')
const languageJson = ref()
const isDragOver = ref(false)
const jsonViewVisible = ref(false) // 源码查看弹窗状态

// === 计算属性 ===
const langOptions = computed(() => {
  return store.translatableKeyColumns.map(i => {
    return { label: i, value: i }
  })
})

const currentJsonString = computed(() => {
  if (!store.currentModel) return ''
  return JSON.stringify(store.currentModel, null, 2)
})

// === 方法 ===

// 打开翻译管理
const openTranslatableModal = () => {
  translatableVisible.value = true
}

// 打开JSON预览
const handleViewJson = () => {
  jsonViewVisible.value = true
}

// 复制JSON
const handleCopyJson = async () => {
  try {
    await navigator.clipboard.writeText(currentJsonString.value)
    message.success('JSON 已复制到剪贴板')
  } catch (err) {
    message.error('复制失败，请手动复制')
    console.error(err)
  }
}

// 添加语言列
const addLang = () => {
  prompt.openInput({
    title: '添加语言列',
    message: '请输入语言代码 (如 ja_jp)',
    onPositiveClick: (value) => {
      store.addColumn(value)
    }
  })
}

// 读取 JSON 文件辅助函数
async function readJsonFile(file, resultObj) {
  try {
    const text = await file.text()
    const data = JSON.parse(text)
    const langCode = file.name.replace(/\.json$/i, '')
    resultObj[langCode] = data
  } catch (e) {
    console.error('读取 JSON 失败', e)
    message.error(`读取文件 ${file.name} 失败`)
  }
}

// 文件导入逻辑 (点击导入)
const loadFiles = async () => {
  try {
    const handles = await window.showOpenFilePicker({
      multiple: true,
      types: [{ description: 'JSON Files', accept: { 'application/json': ['.json'] } }]
    })
    const results = {}
    for (const handle of handles) {
      const file = await handle.getFile()
      await readJsonFile(file, results)
    }
    store.loadFromJson(results)
    message.success('导入成功')
  } catch (err) {
    if (err.name !== 'AbortError') console.error(err)
  }
}

// 拖拽导入逻辑
const onDragOver = (e) => {
  e.preventDefault()
  isDragOver.value = true
}
const onDragLeave = () => (isDragOver.value = false)
const onDrop = async (e) => {
  e.preventDefault()
  isDragOver.value = false
  const files = [...e.dataTransfer.files].filter((f) => f.name.endsWith('.json'))
  if (!files.length) return
  const results = {}
  for (const file of files) {
    await readJsonFile(file, results)
  }
  store.loadFromJson(results)
  message.success(`成功导入 ${files.length} 个语言文件`)
}

// 保存项目
const handleSave = async () => {
  await store.saveProject()
}
</script>

<template>
  <div class="flex items-center px-2 select-none text-xs font-medium text-slate-300">
    <div class="mr-4 flex items-center gap-2 text-blue-400 font-bold">
      <Icon icon="lucide:box" width="16" />
      <span>ChatBox</span>
    </div>

    <div class="flex items-center">

      <Dropdown placement="bottom-start" :offset="4">
        <template #trigger>
          <div class="menu-item">文件 (File)</div>
        </template>
        <div class="flex flex-col py-1 min-w-[180px]">
          
          <button class="menu-action" @click="handleViewJson" :disabled="!store.currentModel">
            <div class="flex items-center gap-2">
              <Icon icon="lucide:file-code" width="14" />
              <span>查看JSON</span>
            </div>
          </button>

          <div class="border-t border-slate-700/50 my-1"></div>

          <button class="menu-action" @click="handleSave" :disabled="!store.currentFile">
            <div class="flex items-center gap-2">
              <Icon icon="lucide:save" width="14" />
              <span>保存</span>
            </div>
            <span class="shortcut">Ctrl+S</span>
          </button>
        </div>
      </Dropdown>

      <Dropdown placement="bottom-start" :offset="4">
        <template #trigger>
          <div class="menu-item">编辑 (Edit)</div>
        </template>
        <div class="flex flex-col py-1 min-w-[180px]">
          <button class="menu-action" @click="openTranslatableModal">
            <div class="flex items-center gap-2">
              <Icon icon="material-symbols:translate" width="14" />
              <span>管理翻译键...</span>
            </div>
          </button>
        </div>
      </Dropdown>

      <Dropdown trigger="hover" placement="bottom-start" :offset="4">
        <template #trigger>
          <div class="menu-item">帮助 (Help)</div>
        </template>
        <div class="p-2 w-[200px]">
          <div class="text-xs text-slate-500 mb-2">关于 ChatBox Editor</div>
          <div class="text-[10px] text-slate-400">
            这是一个用于 Minecraft ChatBox Mod 的可视化配置编辑器。
            <br>编辑器对应模组版本v1.1
          </div>
        </div>
      </Dropdown>

    </div>

    <div class="flex-1"></div>

    <div v-if="store.currentFile" class="text-slate-500 text-[10px] mr-2">
      正在编辑: {{ store.currentFile.name }}
    </div>

    <Modal v-model:show="translatableVisible" title="翻译键" width="60%">
      <div class="flex flex-col gap-3 p-3 w-full text-slate-700 dark:text-slate-200">
        
        <div class="flex flex-row gap-4 items-center">
          <Input v-model="translatableSearch"
                 default-model="search"
                 placeholder="搜索 Key..."
                 class="flex-1" />
          <Button @click="store.addRow()" is-toggle-color>
            <Icon icon="lucide:plus" width="14" class="mr-1"/>添加 Key
          </Button>
          <Button @click="addLang" is-toggle-color>
            <Icon icon="lucide:globe" width="14" class="mr-1"/>添加语言
          </Button>
          
          <ShowJsonCopy :value="store.getTranslatableJSON(languageJson)">
            <template #footer>
              <Autocomplete class="max-w-[100px]" v-model="languageJson"
                            :options="langOptions" placeholder="选择语言导出" clearable />
            </template>
          </ShowJsonCopy>

          <div
            class="flex items-center justify-center border-2 border-dashed border-gray-400 dark:border-gray-600 rounded cursor-pointer px-4 py-2 gap-2 hover:text-blue-400 hover:border-blue-400 transition-all text-slate-500"
            :class="{ 'upload-drag': isDragOver }"
            @click="loadFiles"
            @dragover="onDragOver"
            @dragleave="onDragLeave"
            @drop="onDrop"
            title="点击选择或拖拽 .json 语言文件"
          >
            <div class="flex flex-row items-center gap-2">
              <Icon width="18" icon="material-symbols:upload" />
              <span class="whitespace-nowrap text-xs">导入</span>
            </div>
          </div>
        </div>

        <div
          class="flex flex-col gap-3 border-t border-gray-200 dark:border-gray-700 pt-3"
          style="max-height: calc(80vh - 200px); overflow-y: auto;"
          @wheel.stop
        >
          <div
            v-for="(row, rowIndex) in store.translatableKeyRows.filter(r =>
              !translatableSearch || r.key.includes(translatableSearch)
            )"
            :key="rowIndex"
            class="border border-gray-200 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-[#1e293b]"
          >
            <div class="flex flex-row justify-between items-center mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
              <div class="font-bold text-sm flex flex-row w-full items-center gap-2">
                <span class="text-blue-500 whitespace-nowrap text-xs uppercase font-mono bg-blue-500/10 px-1.5 py-0.5 rounded">Key</span>
                <Input v-model="row.key" class="flex-1 font-mono text-sm" placeholder="输入翻译键名 (例如: item.sword.name)" />
              </div>
              <button
                class="ml-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded transition-colors"
                @click="store.removeRow(rowIndex)" title="删除此 Key">
                <Icon icon="lucide:trash-2" width="16" />
              </button>
            </div>

            <div class="flex flex-col gap-2 pl-2">
              <div
                v-for="(langCode, colIndex) in store.translatableKeyColumns"
                :key="colIndex"
                class="flex flex-row items-center gap-2"
              >
                <div class="min-w-[60px] text-right font-mono text-xs text-slate-500">{{ langCode }}：</div>
                <Input
                  v-model="row.value[colIndex]"
                  class="flex-1 text-xs"
                  :placeholder="`输入 ${langCode} 对应的内容`"
                />
                <button
                  class="text-slate-400 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded transition-colors"
                  @click="store.removeColumn(colIndex)"
                  :title="'删除语言列: ' + langCode"
                >
                  <Icon icon="lucide:x" width="14" />
                </button>
              </div>
            </div>
          </div>

          <div v-if="store.translatableKeyRows.length === 0" class="text-center text-slate-500 py-8 text-xs">
            暂无翻译数据，请添加 Key 或导入文件
          </div>
        </div>
      </div>
    </Modal>

    <Modal v-model:show="jsonViewVisible" title="JSON预览" width="60%">
      <div class="relative flex flex-col h-[70vh] bg-[#1e1e1e] text-slate-300">
        
        <div class="flex items-center justify-between px-4 py-2 border-b border-slate-700 bg-[#252526]">
          <span class="text-xs text-slate-500 font-mono">Current JSON Model</span>
          <button 
            class="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs transition-colors shadow-sm"
            @click="handleCopyJson"
          >
            <Icon icon="lucide:copy" width="12" />
            <span>复制全部</span>
          </button>
        </div>

        <div class="flex-1 overflow-auto p-4 custom-scrollbar bg-[#1e1e1e]">
          <pre v-if="store.currentModel" class="font-mono text-xs leading-relaxed text-[#a6accd] select-text whitespace-pre-wrap break-all">{{ currentJsonString }}</pre>
          <div v-else class="flex h-full items-center justify-center text-slate-600 text-xs gap-2">
            <Icon icon="lucide:file-question" width="24" />
            <span>暂无数据 (请先新建或打开文件)</span>
          </div>
        </div>

      </div>
    </Modal>

  </div>
</template>

<style scoped>
.menu-item {
  @apply px-3 py-1.5 hover:bg-slate-700 rounded cursor-pointer transition-colors;
}

.menu-action {
  @apply flex items-center justify-between px-4 py-1.5 text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-200 w-full;
}

.menu-action .shortcut {
  @apply text-[10px] text-slate-400 ml-4;
}

/* 覆盖 Dropdown 的默认样式以匹配深色主题 */
:deep(.dark .bg-dark-blue) {
  background-color: #002033;
  border-color: #1e293b;
}

/* 拖拽上传高亮样式 */
.upload-drag {
  border-color: #00c0f5 !important;
  color: #00c0f5 !important;
  background-color: rgba(0, 192, 245, 0.1) !important;
}

/* 弹窗内的自定义滚动条 */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #334155;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #1e1e1e;
}
.custom-scrollbar::-webkit-scrollbar-corner {
  background: #1e1e1e;
}
</style>