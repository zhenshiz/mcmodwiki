<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useParticleEditorStore } from '@/stores/modules/particleEditor'
import { useMessage } from '@/components/register/useMessage.js'
import { usePrompt } from '@/components/register/usePrompt.js'

const emit = defineEmits(['new-project', 'import', 'export'])

const store = useParticleEditorStore()
const message = useMessage()
const prompt = usePrompt()

const showMenu = ref(false)
const menuRef = ref(null)

// 点击外部关闭菜单
const handleClickOutside = (event) => {
  if (showMenu.value && menuRef.value && !menuRef.value.contains(event.target)) {
    showMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleNewProject = async () => {
  emit('new-project')
}

const handleImport = () => {
  emit('import')
}

const handleExport = () => {
  emit('export')
}

const handleExportCommand = async () => {
  const command = store.generateCurrentCommand()
  if (command) {
    navigator.clipboard.writeText(command)
    message.success('指令已复制到剪贴板')
  } else {
    message.error('无法生成指令，请检查配置')
  }
}

const handleHelp = () => {
  window.open('https://www.mcmod.cn/post/4889.html', '_blank')
}

const handleAbout = async () => {
  message.info('ExParticle 可视化编辑器 v1.0.0')
}
</script>

<template>
  <div class="flex items-center justify-between px-3 h-full">
    <!-- 左侧：标题 -->
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded"></div>
        <span class="font-semibold text-sm">ExParticle 编辑器</span>
      </div>
    </div>

    <!-- 中间：菜单 -->
    <div class="flex items-center gap-1">
      <div class="relative" ref="menuRef">
        <button
          @click="showMenu = !showMenu"
          class="px-3 py-1 text-sm hover:bg-slate-800 rounded transition-colors"
        >
          文件
        </button>
        <div
          v-if="showMenu"
          class="absolute top-full left-0 mt-1 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50"
        >
          <button
            @click="handleNewProject(); showMenu = false"
            class="w-full px-4 py-2 text-left text-sm hover:bg-slate-700 flex items-center justify-between"
          >
            <span>新建项目</span>
            <span class="text-xs text-slate-500">Ctrl+N</span>
          </button>
          <button
            @click="handleImport(); showMenu = false"
            class="w-full px-4 py-2 text-left text-sm hover:bg-slate-700 flex items-center justify-between"
          >
            <span>导入 mcfunction</span>
            <span class="text-xs text-slate-500">Ctrl+O</span>
          </button>
          <button
            @click="handleExport(); showMenu = false"
            class="w-full px-4 py-2 text-left text-sm hover:bg-slate-700 flex items-center justify-between"
          >
            <span>导出 mcfunction</span>
            <span class="text-xs text-slate-500">Ctrl+S</span>
          </button>
          <div class="border-t border-slate-700 my-1"></div>
          <button
            @click="handleExportCommand(); showMenu = false"
            class="w-full px-4 py-2 text-left text-sm hover:bg-slate-700 flex items-center justify-between"
          >
            <span>复制指令</span>
            <span class="text-xs text-slate-500">Ctrl+E</span>
          </button>
        </div>
      </div>
      <button
        @click="handleHelp"
        class="px-3 py-1 text-sm hover:bg-slate-800 rounded transition-colors"
      >
        帮助
      </button>
      <button
        @click="handleAbout"
        class="px-3 py-1 text-sm hover:bg-slate-800 rounded transition-colors"
      >
        关于
      </button>
    </div>

    <!-- 右侧：工具按钮 -->
    <div class="flex items-center gap-2">
      <button
        @click="store.resetConfig()"
        class="p-1.5 hover:bg-slate-800 rounded transition-colors"
        title="重置"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  </div>
</template>
