<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useChatBoxEditorStore } from '@/stores'
import { Icon } from '@iconify/vue'

// 引入拆分后的组件
import ThemeEditor from './editors/ThemeEditor.vue'
import DialogueEditor from './editors/DialoguesEditor.vue'
import { t } from '@/languages/index.js'

const store = useChatBoxEditorStore()

const BASE_HEIGHT = 1080

const currentRatio = ref('16:9')
const ratios = [
  { label: t('16:9 (标准)'), value: '16:9' },
  { label: t('16:10 (宽屏)'), value: '16:10' },
  { label: t('4:3 (旧式)'), value: '4:3' },
  { label: t('21:9 (超宽)'), value: '21:9' }
]

const baseDimensions = computed(() => {
  const [w, h] = currentRatio.value.split(':').map(Number)
  const width = Math.round(BASE_HEIGHT * (w / h))
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
    translateX.value = (rect.width - baseDimensions.value.width * scale.value) / 2
    translateY.value = (rect.height - baseDimensions.value.height * scale.value) / 2
  }
}

watch(currentRatio, () => {
  resetView()
})

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
  <div ref="workspaceRef" class="w-full h-full relative overflow-hidden bg-[#1e1e1e] select-none"
       style="overscroll-behavior: none; touch-action: none;" @mousedown="handleMouseDown"
       @mousemove="handleMouseMove"
       @wheel="handleWheel">

    <div class="absolute inset-0 pointer-events-none opacity-20" :style="{
      backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
      backgroundSize: `${20 * scale}px ${20 * scale}px`,
      backgroundPosition: `${translateX}px ${translateY}px`
    }"></div>

    <div v-if="store.viewMode === 'empty'"
         class="absolute inset-0 flex flex-col items-center justify-center text-slate-600 gap-2 pointer-events-none">
      <div class="text-4xl opacity-20">⌘</div>
      <div>{{ t('请在左侧选择一个文件开始编辑') }}</div>
    </div>

    <div v-else-if="store.viewMode === 'theme'"
         class="absolute origin-top-left will-change-transform"
         :style="{ transform: `translate(${translateX}px, ${translateY}px) scale(${scale})` }">

      <ThemeEditor :initialScale="scale" :dimensions="baseDimensions" />
    </div>

    <div v-else-if="store.viewMode === 'dialogue'" class="w-full h-full">
      <DialogueEditor />
    </div>

    <div
      v-if="store.viewMode === 'theme'"
      class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-[#001529]/90 backdrop-blur border border-slate-700 rounded-full px-4 py-2 shadow-xl z-50 transition-opacity hover:opacity-100 opacity-80"
      @mousedown.stop>
      <div class="flex items-center gap-2 group">
        <Icon icon="lucide:minus" class="cursor-pointer hover:text-white text-slate-400" width="14"
              @click="scale = Math.max(0.1, scale - 0.1)" />
        <input type="range" v-model.number="scale" min="0.1" max="3.0" step="0.05"
               class="w-24 h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500" />
        <Icon icon="lucide:plus" class="cursor-pointer hover:text-white text-slate-400" width="14"
              @click="scale = Math.min(3.0, scale + 0.1)" />
        <span
          class="w-10 text-right cursor-pointer hover:text-blue-400 font-mono text-xs text-slate-300 select-none"
          @click="resetView">{{ Math.round(scale * 100) }}%</span>
      </div>
      <div class="w-px h-4 bg-slate-600"></div>
      <div class="flex items-center gap-2">
        <span class="text-xs text-slate-500">{{ t('比例') }}</span>
        <select v-model="currentRatio"
                class="bg-transparent text-xs text-slate-300 outline-none cursor-pointer hover:text-white border-b border-transparent hover:border-slate-500 transition-colors">
          <option v-for="r in ratios" :key="r.value" :value="r.value" class="bg-[#002033]">
            {{ r.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  margin-top: -3px;
}

input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 6px;
  cursor: pointer;
  background: #334155;
  border-radius: 3px;
}
</style>
