<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useChatBoxEditorStore } from '@/stores'
import { useGameBridgeStore } from '@/stores/modules/gameBridge.js'
import { Icon } from '@iconify/vue'

// 引入拆分后的组件
import GamePreview from './editors/GamePreview.vue'
import DialogueEditor from './editors/DialoguesEditor.vue'
import { t } from '@/languages/index.js'

const store = useChatBoxEditorStore()
const bridge = useGameBridgeStore()

const BASE_HEIGHT = 1080

const baseDimensions = computed(() => {
  const ratio = bridge.streamFrame ? bridge.streamFrame.width / bridge.streamFrame.height : 16 / 9
  const width = Math.round(BASE_HEIGHT * ratio)
  return { width, height: BASE_HEIGHT }
})

const scale = ref(0.6)
const translateX = ref(0)
const translateY = ref(0)
const isPanning = ref(false)
const workspaceRef = ref(null)

const resetView = () => {
  if (workspaceRef.value) {
    const rect = workspaceRef.value.getBoundingClientRect()
    scale.value = Math.max(0.1, Math.min(1, (rect.width - 48) / baseDimensions.value.width, (rect.height - 100) / baseDimensions.value.height))
    translateX.value = (rect.width - baseDimensions.value.width * scale.value) / 2
    translateY.value = (rect.height - baseDimensions.value.height * scale.value) / 2
  }
}

watch(() => baseDimensions.value.width, resetView)

const handleWheel = (e) => {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault()
    const zoomIntensity = 0.1
    const delta = -Math.sign(e.deltaY) * zoomIntensity
    scale.value = Math.min(Math.max(0.1, scale.value + delta), 5)
  } else {
    e.preventDefault()
    translateX.value -= e.deltaX
    translateY.value -= e.deltaY
  }
}

const handleMouseDown = (e) => {
  if (e.button === 0 || e.button === 1) {
    isPanning.value = true
    e.preventDefault()
  }
  store.selectComponent(null)
}

const handleMouseMove = (e) => {
  if (isPanning.value) {
    translateX.value += e.movementX
    translateY.value += e.movementY
  }
}

const handleMouseUp = () => {
  isPanning.value = false
}

onMounted(() => {
  window.addEventListener('mouseup', handleMouseUp)
  resetView()
})

onUnmounted(() => {
  window.removeEventListener('mouseup', handleMouseUp)
})
</script>

<template>
  <div ref="workspaceRef" class="w-full h-full relative overflow-hidden bg-ui-bg select-none"
       style="overscroll-behavior: none; touch-action: none;" @mousedown="handleMouseDown"
       @mousemove="handleMouseMove"
       @wheel="handleWheel">

    <div class="absolute inset-0 pointer-events-none opacity-20" :style="{
      backgroundImage: 'radial-gradient(rgb(var(--ui-muted)) 1px, transparent 1px)',
      backgroundSize: `${20 * scale}px ${20 * scale}px`,
      backgroundPosition: `${translateX}px ${translateY}px`
    }"></div>

    <div v-if="store.viewMode === 'empty'"
         class="absolute inset-0 flex flex-col items-center justify-center text-ui-muted gap-2 pointer-events-none">
      <div class="text-4xl opacity-20">⌘</div>
      <div>{{ bridge.connected ? t('请在左侧选择一个文件开始编辑') : t('请先通过顶部「连接游戏」连接 Minecraft') }}</div>
    </div>

    <div v-else-if="store.viewMode === 'theme'"
         class="absolute origin-top-left will-change-transform"
         :style="{ transform: `translate(${translateX}px, ${translateY}px) scale(${scale})` }">

      <GamePreview :scale="scale" :dimensions="baseDimensions" />
    </div>

    <div v-else-if="store.viewMode === 'dialogue'" class="w-full h-full">
      <DialogueEditor />
    </div>

    <div
      v-if="store.viewMode === 'theme'"
      class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-ui-bg/90 backdrop-blur border border-ui-line rounded-none px-4 py-2 shadow-xl z-50 transition-opacity hover:opacity-100 opacity-80"
      @mousedown.stop>
      <div class="flex items-center gap-2 group">
        <Icon icon="lucide:minus" class="cursor-pointer hover:text-ui-text text-ui-muted" width="14"
              @click="scale = Math.max(0.1, scale - 0.1)" />
        <input type="range" v-model.number="scale" min="0.1" max="3.0" step="0.05"
               class="w-24 h-1.5 bg-ui-inset rounded-none appearance-none cursor-pointer accent-blue-500" />
        <Icon icon="lucide:plus" class="cursor-pointer hover:text-ui-text text-ui-muted" width="14"
              @click="scale = Math.min(3.0, scale + 0.1)" />
        <span
          class="w-10 text-right cursor-pointer hover:text-ui-link font-mono text-xs text-ui-text select-none"
          @click="resetView">{{ Math.round(scale * 100) }}%</span>
      </div>
      <div class="w-px h-4 bg-ui-inset"></div>
      <span class="text-xs text-ui-muted">{{ t('跟随游戏窗口') }} {{ bridge.streamFrame ? `${bridge.streamFrame.guiWidth} × ${bridge.streamFrame.guiHeight}` : '' }}</span>
    </div>
  </div>
</template>

<style scoped>
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: rgb(var(--ui-link));
  cursor: pointer;
  margin-top: -3px;
}

input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 6px;
  cursor: pointer;
  background: rgb(var(--ui-line));
  border-radius: 3px;
}
</style>
