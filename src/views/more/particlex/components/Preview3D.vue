<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useParticleEditorStore } from '@/stores/modules/particleEditor'
import { Preview3DManager } from '@/assets/more/particlex/particleRenderer.js'

const canvasRef = ref(null)
let previewManager = null
let lastFrameTime = 0
let frameCount = 0
let fps = 60

const store = useParticleEditorStore()

// 计算粒子数量（优先用 begin/end/calcInterval，否则回退到 count）
const particleCount = computed(() => {
  if (!store.usesExpression) return 0
  const { begin, end, calcInterval, count } = store.particleConfig
  if (typeof begin === 'number' && typeof end === 'number' && typeof calcInterval === 'number' && calcInterval > 0) {
    return Math.floor((end - begin) / calcInterval) + 1
  }
  return count || 0
})

// FPS 计算
const updateFPS = () => {
  const now = performance.now()
  frameCount++

  if (now - lastFrameTime >= 1000) {
    fps = Math.round(frameCount * 1000 / (now - lastFrameTime))
    frameCount = 0
    lastFrameTime = now
  }
}

// 初始化 Three.js
const initThreeJS = () => {
  previewManager = new Preview3DManager(canvasRef.value)
  previewManager.init()
  updateParticles()
  syncShapeGizmo()
}

// 更新粒子
const updateParticles = () => {
  if (!previewManager || !store.usesExpression) return

  const config = {
    expression: store.particleConfig.expression,
    begin: store.particleConfig.begin,
    end: store.particleConfig.end,
    calcInterval: store.particleConfig.calcInterval,
    count: store.particleConfig.count,
    offset: store.particleConfig.pos
  }

  try {
    const result = previewManager.updateParticles(config)
    updateColor()
  } catch (error) {
    console.warn('Failed to update particles:', error)
  }
}

// 更新颜色
const updateColor = () => {
  if (!previewManager) return
  previewManager.updateColor(store.particleConfig.color)
}

// 重置相机
const resetCamera = () => {
  if (!previewManager) return
  previewManager.resetCamera()
}

// 暂停/继续
const togglePause = () => {
  if (!previewManager) return
  const paused = previewManager.togglePause()
  return paused
}

const syncShapeGizmo = () => {
  if (!previewManager) return

  const sb = store.shapeBuilder
  const canUse = sb.enabled && store.canUseShapeBuilder

  previewManager.setCircleGizmo({
    enabled: canUse && sb.shape === 'circle',
    center: sb.circle.center,
    radius: sb.circle.radius,
    onChange: (next) => store.updateCircleShape(next),
  })

  previewManager.setLineGizmo({
    enabled: canUse && sb.shape === 'line',
    start: sb.line.start,
    end: sb.line.end,
    onChange: (next) => store.updateLineShape(next),
  })
}

// 监听配置变化
watch(() => store.particleConfig, () => {
  updateParticles()
}, { deep: true })

watch(() => store.selectedType, () => {
  updateParticles()
})

watch(() => store.shapeBuilder, () => {
  syncShapeGizmo()
}, { deep: true })

onMounted(() => {
  // 延迟初始化，确保容器已经有正确的尺寸
  setTimeout(() => {
    initThreeJS()
  }, 100)

  lastFrameTime = performance.now()

  // FPS 更新循环
  const fpsInterval = setInterval(updateFPS, 100)

  onUnmounted(() => {
    clearInterval(fpsInterval)
  })
})

onUnmounted(() => {
  if (previewManager) {
    previewManager.dispose()
    previewManager = null
  }
})

// 暴露方法给父组件
defineExpose({
  resetCamera,
  togglePause
})
</script>

<template>
  <div class="relative w-full h-full" style="width: 100%; height: 100%;">
    <!-- Three.js 容器 -->
    <div ref="canvasRef" class="w-full h-full" style="width: 100%; height: 100%; min-height: 200px;"></div>

    <!-- 工具栏 -->
    <div class="absolute top-3 left-3 flex gap-2">
      <button
        @click="resetCamera"
        class="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 rounded text-sm backdrop-blur-sm border border-slate-600 transition-colors"
      >
        重置相机
      </button>
      <button
        @click="togglePause"
        class="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 rounded text-sm backdrop-blur-sm border border-slate-600 transition-colors"
      >
        暂停/继续
      </button>
    </div>

    <!-- 预览信息 -->
    <div class="absolute bottom-3 right-3 text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded backdrop-blur-sm">
      粒子数量: <span class="text-blue-400">{{ particleCount }}</span> |
      FPS: <span class="text-green-400">{{ fps }}</span> |
      拖拽旋转 | 滚轮缩放
    </div>

    <!-- 错误提示 -->
    <div
      v-if="!store.validationResult.valid"
      class="absolute top-3 right-3 bg-red-900/80 text-red-300 px-3 py-2 rounded text-xs backdrop-blur-sm max-w-xs"
    >
      <div class="font-medium mb-1">配置错误</div>
      <div class="text-red-200">{{ store.validationResult.errors[0] }}</div>
    </div>
  </div>
</template>

<style scoped>
/* 防止文本选择 */
div {
  user-select: none;
}
</style>
