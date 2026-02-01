<script setup>
import { ref, onMounted } from 'vue'
import { useChatBoxEditorStore, usePageStore } from '@/stores'
import MenuBar from './component/MenuBar.vue'
import FileExplorer from './component/FileExplorer.vue'
import ResourcePanel from './component/ResourcePanel.vue'
import Workspace from './component/Workspace.vue'
import HierarchyPanel from './component/HierarchyPanel.vue'
import InspectorPanel from './component/InspectorPanel.vue'

const editorStore = useChatBoxEditorStore()

const handleGlobalKeydown = async (e) => {
  if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
    e.preventDefault()
    await editorStore.saveProject()
    await editorStore.refreshGlobalIndex()
  }
}

// === 布局拖拽逻辑 ===
const leftWidth = ref(260)
const rightWidth = ref(320)
const bottomHeight = ref(180)
const hierarchyHeight = ref(300)

const startResize = (direction, e) => {
  e.preventDefault()
  const startX = e.clientX
  const startY = e.clientY

  // 记录初始值
  const startLeft = leftWidth.value
  const startRight = rightWidth.value
  const startBottom = bottomHeight.value
  const startHierarchy = hierarchyHeight.value

  const onMouseMove = (moveEvent) => {
    const dx = moveEvent.clientX - startX
    const dy = moveEvent.clientY - startY

    // 根据方向计算新尺寸 (增加了最小/最大值限制)
    if (direction === 'left') {
      leftWidth.value = Math.max(150, Math.min(500, startLeft + dx))
    } else if (direction === 'right') {
      rightWidth.value = Math.max(200, Math.min(600, startRight - dx)) // 向左拖是减小 x，所以宽度增加
    } else if (direction === 'bottom') {
      bottomHeight.value = Math.max(100, Math.min(600, startBottom - dy)) // 向上拖是减小 y，所以高度增加
    } else if (direction === 'hierarchy') {
      hierarchyHeight.value = Math.max(100, Math.min(800, startHierarchy + dy))
    }
  }

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    // 恢复鼠标样式
    document.body.style.cursor = ''
  }

  // 设置全局鼠标样式，提升体验
  if (direction === 'left' || direction === 'right') document.body.style.cursor = 'col-resize'
  else document.body.style.cursor = 'row-resize'

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

onMounted(() => {
  usePageStore().isDark = true
  document.body.classList.add('dark')
  window.addEventListener('keydown', handleGlobalKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<template>
  <div class="flex flex-col h-screen w-screen bg-[#001529] text-slate-300 overflow-hidden font-sans select-none">

    <MenuBar class="h-[30px] shrink-0 border-b border-slate-700 bg-[#001529]" />

    <div class="flex flex-1 overflow-hidden">

      <div
        :style="{ width: leftWidth + 'px' }"
        class="flex flex-col border-r border-slate-700 bg-[#002033] relative shrink-0"
      >
        <div class="flex-1 overflow-hidden flex flex-col">
          <FileExplorer />
        </div>

        <div
          class="absolute top-0 right-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 transition-colors z-20 opacity-0 hover:opacity-100"
          @mousedown="startResize('left', $event)"
        ></div>
      </div>

      <div class="flex-1 flex flex-col min-w-0 bg-[#001529]">

        <div class="flex-1 relative overflow-hidden bg-[#000d1a]">
          <Workspace />
        </div>

        <div
          :style="{ height: bottomHeight + 'px' }"
          class="border-t border-slate-700 bg-[#002033] relative shrink-0"
        >
          <div
            class="absolute top-[-3px] left-0 right-0 h-1.5 cursor-row-resize hover:bg-blue-500 transition-colors z-20 opacity-0 hover:opacity-100"
            @mousedown="startResize('bottom', $event)"
          ></div>

          <ResourcePanel />
        </div>
      </div>

      <div
        :style="{ width: rightWidth + 'px' }"
        class="flex flex-col border-l border-slate-700 bg-[#002033] relative shrink-0"
      >
        <div
          class="absolute top-0 left-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 transition-colors z-20 opacity-0 hover:opacity-100"
          @mousedown="startResize('right', $event)"
        ></div>

        <div
          :style="{ height: hierarchyHeight + 'px' }"
          class="border-b border-slate-700 flex flex-col relative shrink-0"
        >
          <HierarchyPanel />

          <div
            class="absolute bottom-[-2px] left-0 right-0 h-1 cursor-row-resize hover:bg-blue-500 transition-colors z-20 opacity-0 hover:opacity-100"
            @mousedown="startResize('hierarchy', $event)"
          ></div>
        </div>

        <div class="flex-1 flex flex-col overflow-hidden bg-[#002941]">
          <InspectorPanel />
        </div>
      </div>

    </div>
  </div>
</template>
