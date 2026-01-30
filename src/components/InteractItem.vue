<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  component: { type: Object, required: true },
  containerW: { type: Number, required: true },
  containerH: { type: Number, required: true },
  isSelected: { type: Boolean, default: false },
  label: { type: String, default: '' },
  resizable: { type: Boolean, default: true },
  autoSize: { type: Boolean, default: false },
  scale: { type: Number, default: 1 },
  overrideStyle: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['select'])

const style = computed(() => {
  if (!props.component) return {}

  const W = props.containerW || 1
  const H = props.containerH || 1

  const baseStyle = props.component.getStyle(W, H)

  if (baseStyle.zIndex !== undefined && baseStyle.zIndex !== null) {
    baseStyle.zIndex = Number(baseStyle.zIndex)
  }

  const mergedStyle = {
    ...baseStyle,
    ...(props.overrideStyle || {})
  }

  if (props.autoSize) {
    mergedStyle.width = 'max-content'
    mergedStyle.height = 'max-content'
    mergedStyle.whiteSpace = 'nowrap'
  }
  return mergedStyle
})

// === 拖拽移动逻辑 ===
const isDragging = ref(false)

const handleMouseDown = (e) => {
  e.stopPropagation()
  emit('select')

  const startX = e.clientX
  const startY = e.clientY
  const startCompX = props.component.x || 0
  const startCompY = props.component.y || 0

  isDragging.value = true

  const onMouseMove = (moveEvent) => {
    const rawDx = moveEvent.clientX - startX
    const rawDy = moveEvent.clientY - startY

    const dx = rawDx / props.scale
    const dy = rawDy / props.scale

    // 使用防御性 W/H
    const W = props.containerW || 1
    const H = props.containerH || 1

    const dxPct = (dx / W) * 100
    const dyPct = (dy / H) * 100

    props.component.x = Number((startCompX + dxPct).toFixed(2))
    props.component.y = Number((startCompY + dyPct).toFixed(2))
  }

  const onMouseUp = () => {
    isDragging.value = false
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

// === 调整大小逻辑 ===
const handleResize = (e, type) => {
  if (!props.resizable) return
  e.stopPropagation()

  const startX = e.clientX
  const startY = e.clientY

  // 记录初始数据
  const startW = props.component.width || 0
  const startH = props.component.height || 0
  const startCompX = props.component.x || 0
  const startCompY = props.component.y || 0

  // 获取当前对齐方式 (转小写以防万一)
  const alignX = (props.component.alignX || 'left').toLowerCase()
  const alignY = (props.component.alignY || 'top').toLowerCase()

  const onMouseMove = (moveEvent) => {
    const rawDx = moveEvent.clientX - startX
    const rawDy = moveEvent.clientY - startY

    // 转换为百分比增量
    const W = props.containerW || 1
    const H = props.containerH || 1

    // 注意：这里我们计算的是想要增加的尺寸
    const dWidthPct = (rawDx / props.scale / W) * 100
    const dHeightPct = (rawDy / props.scale / H) * 100

    // --- 处理宽度 (右拉手柄) ---
    if (type.includes('e')) {
      // 1. 计算新宽度 (防止小于0)
      const newWidth = Math.max(0, Number((startW + dWidthPct).toFixed(2)))
      props.component.width = newWidth

      // 2. 计算实际生效的宽度增量 (因为有 Math.max 限制，不能直接用 dWidthPct)
      const actualDeltaW = newWidth - startW

      // 3. 补偿 X 偏移，钉住左边
      // 如果是居中，宽度增加会向左扩一半，所以我们要把 x 往右移一半来抵消
      // 如果是右对齐，宽度增加会向左扩全部，所以我们要把 x 往右移全部来抵消
      if (alignX.includes('center')) {
        props.component.x = Number((startCompX + actualDeltaW / 2).toFixed(2))
      } else if (alignX.includes('right')) {
        props.component.x = Number((startCompX + actualDeltaW).toFixed(2))
      }
      // 左对齐不需要补偿，因为左边本来就是锚点
    }

    // --- 处理高度 (下拉手柄) ---
    if (type.includes('s')) {
      // 1. 计算新高度
      const newHeight = Math.max(0, Number((startH + dHeightPct).toFixed(2)))
      props.component.height = newHeight

      // 2. 计算实际增量
      const actualDeltaH = newHeight - startH

      // 3. 补偿 Y 偏移，钉住顶边
      // 道理同上：抵消掉对齐带来的向上位移
      if (alignY.includes('center')) {
        props.component.y = Number((startCompY + actualDeltaH / 2).toFixed(2))
      } else if (alignY.includes('bottom')) {
        props.component.y = Number((startCompY + actualDeltaH).toFixed(2))
      }
      // 顶对齐不需要补偿
    }
  }

  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}
</script>

<template>
  <div
    class="absolute group select-none"
    :style="style"
    @mousedown="handleMouseDown"
  >
    <div v-show="isSelected"
         class="absolute inset-0 border-2 border-blue-500 pointer-events-none z-50"></div>
    <div v-show="!isSelected"
         class="absolute inset-0 border border-dashed border-white/30 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>

    <div v-if="isSelected || isDragging"
         class="absolute -top-6 left-0 bg-blue-600 text-white text-[10px] px-1 rounded whitespace-nowrap z-50"
         :style="{ transform: `scale(${1/scale})`, transformOrigin: 'bottom left' }">
      {{ label }} ({{ Math.round(component.x) }}%, {{ Math.round(component.y) }}%)
      <span v-if="component.width" class="opacity-70">[{{Math.round(component.width)}}x{{Math.round(component.height)}}]</span>
    </div>

    <div class="w-full h-full overflow-hidden">
      <slot></slot>
    </div>

    <template v-if="isSelected && resizable">
      <div
        class="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-4 bg-white border border-blue-500 cursor-e-resize z-50 hover:scale-125 transition-transform"
        :style="{ transform: `scale(${1/scale}) translateY(-50%)` }"
        @mousedown="(e) => handleResize(e, 'e')"></div>
      <div
        class="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-2 bg-white border border-blue-500 cursor-s-resize z-50 hover:scale-125 transition-transform"
        :style="{ transform: `scale(${1/scale}) translateX(-50%)` }"
        @mousedown="(e) => handleResize(e, 's')"></div>
      <div
        class="absolute bottom-0 right-0 w-3 h-3 bg-white border border-blue-500 cursor-se-resize z-50 hover:scale-125 transition-transform"
        :style="{ transform: `scale(${1/scale})` }"
        @mousedown="(e) => handleResize(e, 'se')"></div>
    </template>
  </div>
</template>
