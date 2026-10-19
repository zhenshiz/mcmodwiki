<script setup>
import { computed, onUnmounted, ref, watch } from 'vue'
import { useChatBoxEditorStore } from '@/stores'
import { useGameBridgeStore } from '@/stores/modules/gameBridge.js'
import { DialogBox, KeyPrompt, Portrait, FunctionButton, Option } from '@/assets/more/chatbox/chatboxTheme.js'
import { t } from '@/languages/index.js'
import { previewComponentRect, previewComponentTarget } from '../../bridge/previewFrames.js'

const props = defineProps({ dimensions: Object, scale: Number })
const store = useChatBoxEditorStore()
const bridge = useGameBridgeStore()
const displayed = ref(null)
const dragging = ref(false)
const dragFeedback = ref(null)
let timer
let moveTimer
let moving = false
let generation = 0
let pending = false
let queued = false
let disposed = false
let dragCleanup

async function updatePreview() {
  if (pending || moving || dragging.value) { queued = true; return }
  queued = false
  if (!bridge.connected || !bridge.snapshot?.previewStream || store.viewMode !== 'theme' || disposed) return
  pending = true
  const current = generation
  try { await store.previewInGame({ stream: true, isCurrent: () => !disposed && current === generation }) }
  catch { /* 连接状态仓库负责在预览中显示错误。 */ }
  finally {
    pending = false
    if (disposed && bridge.connected) { bridge.stopPreview().catch(() => {}) }
    else if (queued && !disposed && !dragging.value) { queued = false; clearTimeout(timer); timer = setTimeout(updatePreview, 0) }
  }
}

watch(() => [bridge.connected, bridge.snapshot?.previewStream, store.currentModel, store.previewAnimationKey], () => {
  generation++
  clearTimeout(timer)
  if (!dragging.value) timer = setTimeout(updatePreview, 220)
}, { deep: true, immediate: true, flush: 'sync' })

// 解码后同时提交画面与命中框，确保坐标元数据与显示内容一致。
watch(() => bridge.streamFrame, async frame => {
  if (!frame) { displayed.value = null; return }
  const image = new window.Image()
  image.src = frame.url
  try {
    await image.decode()
    if (!disposed && bridge.streamFrame === frame) displayed.value = frame
  } catch { /* 解码失败时保留上一张完整画面，等待新帧。 */ }
})

const components = computed(() => (displayed.value?.components || []).map(bounds => {
  const target = previewComponentTarget(store.currentModel, bounds)
  const clazz = { portrait: Portrait, dialogBox: DialogBox, option: Option, functionalButton: FunctionButton, keyPrompt: KeyPrompt }[bounds.kind]
  return { ...bounds, target, clazz }
}).filter(item => item.target).sort((a, b) => a.order - b.order))

function rectStyle(item, index, original = false) {
  let rect = original ? item : previewComponentRect(item, displayed.value)
  const feedback = dragFeedback.value
  // 旧版模组先显示本地落点反馈，松开后再刷新完整预览。
  if (!original && !Number.isFinite(item.positionX) && feedback?.target === item.target && feedback.revision === displayed.value.revision) {
    rect = { ...feedback.bounds, x: feedback.bounds.x + (item.target.x - feedback.x) / 100 * displayed.value.guiWidth, y: feedback.bounds.y + (item.target.y - feedback.y) / 100 * displayed.value.guiHeight }
  }
  return {
    left: `${rect.x / displayed.value.guiWidth * 100}%`, top: `${rect.y / displayed.value.guiHeight * 100}%`,
    width: `${Math.max(8, rect.width) / displayed.value.guiWidth * 100}%`, height: `${Math.max(8, rect.height) / displayed.value.guiHeight * 100}%`,
    transform: `rotate(${item.angle || 0}deg)`, zIndex: store.selectedComponent === item.target ? 100 : index + 1,
  }
}

// 同一时间最多发送一个请求，并始终发送最新的指针位置。
async function sendMove() {
  moveTimer = null
  if (!dragging.value || disposed || !bridge.connected || !bridge.snapshot?.previewMove) return
  if (pending || moving) { moveTimer = setTimeout(sendMove, 80); return }
  const { kind, key, target } = dragFeedback.value
  const x = target.x, y = target.y
  moving = true
  try { await bridge.movePreview({ kind, key, x, y }) }
  catch { /* 保留本地落点，松开后的完整预览可恢复画面流。 */ }
  finally {
    moving = false
    if (dragging.value && !disposed && (dragFeedback.value.target !== target || target.x !== x || target.y !== y)) moveTimer = setTimeout(sendMove, 80)
    else if (queued && !disposed && !dragging.value) { queued = false; clearTimeout(timer); timer = setTimeout(updatePreview, 0) }
  }
}

function selectAndDrag(event, item) {
  if (event.button !== 0) return
  event.preventDefault()
  dragCleanup?.()
  store.selectComponent(item.target, item.clazz, item.key || null)
  const startX = event.clientX, startY = event.clientY
  const x = item.target.x || 0, y = item.target.y || 0
  const bounds = { ...previewComponentRect(item, displayed.value), angle: item.angle }
  dragFeedback.value = { target: item.target, kind: item.kind, key: item.key, x, y, bounds, revision: displayed.value.revision }
  dragging.value = true
  let changed = false
  const move = next => {
    if (next.clientX === startX && next.clientY === startY && !changed) return
    changed = true
    item.target.x = Number((x + (next.clientX - startX) / (props.dimensions.width * props.scale) * 100).toFixed(2))
    item.target.y = Number((y + (next.clientY - startY) / (props.dimensions.height * props.scale) * 100).toFixed(2))
    if (!moveTimer && !moving) moveTimer = setTimeout(sendMove, 0)
  }
  const cleanup = () => {
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', cleanup)
    window.removeEventListener('blur', cleanup)
    dragging.value = false
    clearTimeout(moveTimer)
    moveTimer = null
    dragCleanup = null
    if ((changed || queued) && !disposed) { clearTimeout(timer); timer = setTimeout(updatePreview, 0) }
  }
  dragCleanup = cleanup
  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', cleanup)
  window.addEventListener('blur', cleanup)
}

onUnmounted(() => {
  disposed = true
  generation++
  clearTimeout(timer)
  clearTimeout(moveTimer)
  dragCleanup?.()
  if (bridge.connected && bridge.previewing) bridge.stopPreview().catch(() => {})
})
</script>

<template>
  <div class="relative bg-black shadow-xl" :style="{ width: dimensions.width + 'px', height: dimensions.height + 'px' }">
    <template v-if="displayed">
      <img :src="displayed.url" :alt="t('Minecraft 实时渲染画面')" class="absolute inset-0 w-full h-full pointer-events-none" draggable="false" />
      <div v-if="dragging && dragFeedback" class="drag-origin absolute pointer-events-none" :style="rectStyle(dragFeedback.bounds, 0, true)" />
      <div v-for="(item, index) in components" :key="`${item.kind}:${item.key}`" class="absolute cursor-move group game-component" :class="{ 'dragging-component': dragging && dragFeedback?.target === item.target }" role="button" tabindex="0" :aria-label="t('选择组件：{}', item.key || item.kind)" :style="rectStyle(item, index)" @keydown.enter="store.selectComponent(item.target, item.clazz, item.key || null)" @mousedown.stop="selectAndDrag($event, item)">
        <div class="absolute inset-0 pointer-events-none border border-dashed border-white/30 opacity-0 group-hover:opacity-100" :class="{ 'selected-component': store.selectedComponent === item.target }" />
        <div v-if="store.selectedComponent === item.target" class="component-label" :style="{ transform: `scale(${1 / scale})` }" :title="item.key || item.kind">
          {{ item.key || item.kind }} · {{ Number(item.target.x || 0).toFixed(1) }}%, {{ Number(item.target.y || 0).toFixed(1) }}%
        </div>
      </div>
    </template>
    <div v-else class="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white" :style="{ fontSize: `${14 / scale}px` }">
      <span>{{ bridge.error || (!bridge.connected ? t('连接游戏后显示 Minecraft 实时画面') : !bridge.snapshot?.previewStream ? t('请更新并重启 ChatBox 模组以启用实时画面') : t('正在等待 Minecraft 渲染画面…')) }}</span>
      <button v-if="bridge.connected && bridge.snapshot?.previewStream" class="border border-white/40 px-3 py-1" @mousedown.stop @click="updatePreview">{{ t('重新开始预览') }}</button>
    </div>
    <span class="stream-status absolute top-0 right-0 bg-black/70 text-white px-2 py-1 pointer-events-none" :style="{ transform: `scale(${1 / scale})`, transformOrigin: 'top right' }">{{ t('MC 实时画面') }} · {{ t('游戏窗口用于渲染，Esc 结束预览') }}</span>
    <span v-if="bridge.error && displayed" class="absolute bottom-0 left-0 bg-black/80 text-red-300 p-2" :style="{ fontSize: `${12 / scale}px` }">{{ bridge.error }}</span>
  </div>
</template>

<style scoped>
.component-label { position: absolute; bottom: calc(100% + 4px); left: 0; transform-origin: bottom left; background: #2563eb; color: white; padding: 2px 5px; max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; pointer-events: none; font: 11px/15px ui-monospace, monospace !important; }
.stream-status { font: 11px/15px sans-serif !important; z-index: 100; }
.selected-component { opacity: 1 !important; border: 2px solid #3b82f6; }
.drag-origin { border: 1px dashed rgb(255 255 255 / 65%); z-index: 99; }
.dragging-component { background: rgb(59 130 246 / 12%); cursor: grabbing; }
.dragging-component .selected-component { box-shadow: 0 0 0 1px rgb(255 255 255 / 70%), 0 0 12px rgb(59 130 246 / 35%); }
</style>
