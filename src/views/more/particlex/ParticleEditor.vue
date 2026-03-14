<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { usePageStore, useParticleEditorStore } from '@/stores'
import { useMessage } from '@/components/register/useMessage.js'
import MenuBar from './components/MenuBar.vue'
import ParticleTypePanel from './components/ParticleTypePanel.vue'
import TemplateLibrary from './components/TemplateLibrary.vue'
import Preview3D from './components/Preview3D.vue'
import ParameterPanel from './components/ParameterPanel.vue'
import ExpressionEditor from './components/ExpressionEditor.vue'
import CommandPreview from './components/CommandPreview.vue'
import ShapeBuilder from './components/ShapeBuilder.vue'

const pageStore = usePageStore()
const editorStore = useParticleEditorStore()
const message = useMessage()

const bottomTab = ref('expression')

const handleGlobalKeydown = async (e) => {
  if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
    e.preventDefault()
    await handleExportMcFunction()
  }
  if ((e.ctrlKey || e.metaKey) && e.code === 'KeyE') {
    e.preventDefault()
    await handleExportCommand()
  }
}

// === 布局拖拽逻辑 ===
const leftWidth = ref(280)
const rightWidth = ref(320)
const bottomHeight = ref(200)

const startResize = (direction, e) => {
  e.preventDefault()
  const startX = e.clientX
  const startY = e.clientY

  const startLeft = leftWidth.value
  const startRight = rightWidth.value
  const startBottom = bottomHeight.value

  const onMouseMove = (moveEvent) => {
    const dx = moveEvent.clientX - startX
    const dy = moveEvent.clientY - startY

    if (direction === 'left') {
      leftWidth.value = Math.max(200, Math.min(500, startLeft + dx))
    } else if (direction === 'right') {
      rightWidth.value = Math.max(250, Math.min(600, startRight - dx))
    } else if (direction === 'bottom') {
      bottomHeight.value = Math.max(150, Math.min(500, startBottom - dy))
    }
  }

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    document.body.style.cursor = ''
  }

  if (direction === 'left' || direction === 'right') document.body.style.cursor = 'col-resize'
  else document.body.style.cursor = 'row-resize'

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

// === 功能函数 ===

const handleExportMcFunction = async () => {
  editorStore.exportMcFunction()
  message.success('mcfunction 文件已导出')
}

const handleExportCommand = async () => {
  const command = editorStore.generateCurrentCommand()
  if (command) {
    navigator.clipboard.writeText(command)
    message.success('指令已复制到剪贴板')
  } else {
    message.error('无法生成指令，请检查配置')
  }
}

const handleImportMcFunction = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.mcfunction'
  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        await editorStore.importMcFunction(file)
        message.success('mcfunction 文件已导入')
      } catch (error) {
        message.error('导入失败: ' + error.message)
      }
    }
  }
  input.click()
}

const handleNewProject = () => {
  editorStore.resetConfig()
  message.success('已新建项目')
}

onMounted(() => {
  pageStore.isDark = true
  document.body.classList.add('dark')
  window.addEventListener('keydown', handleGlobalKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<template>
  <div class="flex flex-col h-screen w-screen bg-[#0a0e1a] text-slate-200 overflow-hidden font-sans">
    <!-- 顶部菜单栏 -->
    <div class="h-9 shrink-0 border-b border-slate-700 bg-[#0a0e1a]">
      <MenuBar
        @new-project="handleNewProject"
        @import="handleImportMcFunction"
        @export="handleExportMcFunction"
      />
    </div>

    <!-- 主体区域 -->
    <div class="flex flex-1 overflow-hidden">

      <!-- 左侧面板：粒子类型 + 模板库 -->
      <div
        :style="{ width: leftWidth + 'px' }"
        class="flex flex-col border-r border-slate-700 bg-[#0d1225] relative shrink-0"
      >
        <!-- 粒子类型选择器 -->
        <div class="shrink-0 border-b border-slate-700">
          <ParticleTypePanel />
        </div>

        <!-- 模板库 -->
        <div class="flex-1 overflow-hidden flex flex-col min-h-0">
          <TemplateLibrary />
        </div>

        <!-- 调整大小手柄 -->
        <div
          class="absolute top-0 right-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 transition-colors z-20 opacity-0 hover:opacity-100"
          @mousedown="startResize('left', $event)"
        ></div>
      </div>

      <!-- 中间区域：3D 预览 + 底部编辑器 -->
      <div class="flex-1 flex flex-col min-w-0 bg-[#0a0e1a]">
        <!-- 3D 预览区 -->
        <div class="flex-1 relative overflow-hidden bg-[#050810] min-h-0">
          <Preview3D />

          <!-- 预览区工具栏 -->
          <div class="absolute top-3 left-3 flex gap-2">
            <button class="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 rounded text-sm backdrop-blur-sm border border-slate-600 transition-colors">
              重置相机
            </button>
            <button class="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 rounded text-sm backdrop-blur-sm border border-slate-600 transition-colors">
              暂停/继续
            </button>
          </div>

          <!-- 预览信息 -->
          <div class="absolute bottom-3 right-3 text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded backdrop-blur-sm">
            粒子数量: <span class="text-blue-400">{{ editorStore?.particleConfig?.count || 'N/A' }}</span>
            | FPS: <span class="text-green-400">60</span>
          </div>
        </div>

        <!-- 底部编辑器：表达式编辑器 + 指令预览 -->
        <div
          :style="{ height: bottomHeight + 'px' }"
          class="border-t border-slate-700 bg-[#0d1225] relative shrink-0 flex flex-col"
        >
          <!-- 调整大小手柄 -->
          <div
            class="absolute top-[-3px] left-0 right-0 h-1.5 cursor-row-resize hover:bg-blue-500 transition-colors z-20 opacity-0 hover:opacity-100"
            @mousedown="startResize('bottom', $event)"
          ></div>

          <!-- 标签页切换 -->
          <div class="flex border-b border-slate-700 shrink-0">
            <button
              @click="bottomTab = 'expression'"
              :class="[
                'px-4 py-2 text-sm transition-colors',
                bottomTab === 'expression'
                  ? 'bg-slate-800 border-b-2 border-blue-500 text-blue-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              ]"
            >
              表达式编辑器
            </button>
            <button
              @click="bottomTab = 'shapes'"
              :class="[
                'px-4 py-2 text-sm transition-colors',
                bottomTab === 'shapes'
                  ? 'bg-slate-800 border-b-2 border-blue-500 text-blue-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              ]"
            >
              形状构建器
            </button>
            <button
              @click="bottomTab = 'command'"
              :class="[
                'px-4 py-2 text-sm transition-colors',
                bottomTab === 'command'
                  ? 'bg-slate-800 border-b-2 border-blue-500 text-blue-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              ]"
            >
              指令预览
            </button>
          </div>

          <!-- 编辑器内容区 -->
          <div class="flex-1 overflow-hidden min-h-0">
            <ExpressionEditor v-if="bottomTab === 'expression'" />
            <ShapeBuilder v-else-if="bottomTab === 'shapes'" />
            <CommandPreview v-else />
          </div>
        </div>
      </div>

      <!-- 右侧面板：参数配置 -->
      <div
        :style="{ width: rightWidth + 'px' }"
        class="flex flex-col border-l border-slate-700 bg-[#0d1225] relative shrink-0"
      >
        <!-- 调整大小手柄 -->
        <div
          class="absolute top-0 left-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 transition-colors z-20 opacity-0 hover:opacity-100"
          @mousedown="startResize('right', $event)"
        ></div>

        <!-- 参数配置面板 -->
        <div class="flex-1 overflow-hidden flex flex-col min-h-0">
          <ParameterPanel />
        </div>

        <!-- 指令生成按钮 -->
        <div class="shrink-0 p-3 border-t border-slate-700 bg-[#0a0e1a] space-y-2">
          <button
            @click="handleExportCommand"
            :disabled="!editorStore?.canGenerate"
            class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed rounded font-medium transition-colors"
          >
            生成并复制指令
          </button>
          <button
            @click="handleExportMcFunction"
            :disabled="!editorStore?.canGenerate"
            class="w-full py-2.5 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed rounded font-medium transition-colors"
          >
            导出 mcfunction 文件
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* 自定义滚动条 */
:deep(*)::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

:deep(*)::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
}

:deep(*)::-webkit-scrollbar-thumb {
  background: rgba(71, 85, 105, 0.5);
  border-radius: 4px;
}

:deep(*)::-webkit-scrollbar-thumb:hover {
  background: rgba(71, 85, 105, 0.8);
}
</style>
