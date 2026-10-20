<script setup>
import { computed, onUnmounted, ref, watch } from 'vue'
import { useChatBoxEditorStore } from '@/stores'
import { useGameBridgeStore } from '@/stores/modules/gameBridge.js'
import { DialogBox, KeyPrompt, Portrait, FunctionButton, Option } from '@/assets/more/chatbox/chatboxTheme.js'
import { t } from '@/languages/index.js'
import { previewComponentRect, previewComponentTarget } from '../../bridge/previewFrames.js'
import { previewTransformStart, resizePreviewComponent, rotatePreviewComponent } from '../../bridge/previewTransforms.js'

const props = defineProps({ dimensions: Object, scale: Number })
const store = useChatBoxEditorStore()
const bridge = useGameBridgeStore()
const stage = ref(null)
const displayed = ref(null)
const handles = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]
const transformFields = ['x', 'y', 'width', 'height', 'scale', 'angle']
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
    width: `${Math.max(1, rect.width) / displayed.value.guiWidth * 100}%`, height: `${Math.max(1, rect.height) / displayed.value.guiHeight * 100}%`,
    transform: `rotate(${rect.angle ?? item.angle ?? 0}deg)`, zIndex: store.selectedComponent === item.target ? 100 : index + 1,
  }
}

// 同一时间最多发送一个请求，并始终发送最新的指针位置。
async function sendMove() {
  moveTimer = null
  if (!dragging.value || disposed || !bridge.connected || !bridge.snapshot?.previewMove) return
  if (pending || moving) { moveTimer = setTimeout(sendMove, 80); return }
  const { kind, key, target } = dragFeedback.value
  const payload = { kind, key, x: target.x || 0, y: target.y || 0 }
  if (bridge.snapshot?.previewTransform) for (const field of transformFields) {
    if (Number.isFinite(target[field])) payload[field] = target[field]
  }
  moving = true
  try { await bridge.movePreview(payload) }
  catch { /* 保留本地落点，松开后的完整预览可恢复画面流。 */ }
  finally {
    moving = false
    if (dragging.value && !disposed && (dragFeedback.value.target !== target || transformFields.some(field => field in payload && (target[field] ?? 0) !== payload[field]))) moveTimer = setTimeout(sendMove, 80)
    else if (queued && !disposed && !dragging.value) { queued = false; clearTimeout(timer); timer = setTimeout(updatePreview, 0) }
  }
}

function transformHandles(item) {
  if (!bridge.snapshot?.previewTransform || !item.sizeMode || item.sizeMode === 'none') return []
  return item.sizeMode === 'box' ? handles : handles.filter(([x, y]) => x && y)
}

function handleStyle(item, handle) {
  const [x, y] = handle
  const angle = (previewComponentRect(item, displayed.value).angle ?? item.angle ?? 0) + Math.atan2(y, x) * 180 / Math.PI
  const cursor = ['ew-resize', 'nwse-resize', 'ns-resize', 'nesw-resize'][((Math.round(angle / 45) % 4) + 4) % 4]
  return { left: `${(x + 1) * 50}%`, top: `${(y + 1) * 50}%`, transform: `translate(-50%, -50%) scale(${1 / props.scale})`, cursor }
}

function selectAndTransform(event, item, mode = 'move', handle = null) {
  if (event.button !== 0) return
  event.preventDefault()
  event.currentTarget.focus({ preventScroll: true })
  dragCleanup?.()
  store.selectComponent(item.target, item.clazz, item.key || null)
  // 等待当前完整预览完成，避免把旧画面的手柄坐标应用到新版本。
  if (pending) return
  const frame = displayed.value
  const stageBounds = stage.value.getBoundingClientRect()
  const point = e => ({ x: (e.clientX - stageBounds.left) / stageBounds.width * frame.guiWidth,
    y: (e.clientY - stageBounds.top) / stageBounds.height * frame.guiHeight })
  const initial = point(event)
  const original = Object.fromEntries(transformFields.filter(key => Object.hasOwn(item.target, key)).map(key => [key, item.target[key]]))
  const x = item.target.x || 0, y = item.target.y || 0
  const bounds = { angle: item.angle, ...previewComponentRect(item, frame) }
  const start = item.sizeMode ? previewTransformStart(item, frame) : null
  dragFeedback.value = { target: item.target, kind: item.kind, key: item.key, x, y, bounds, revision: frame.revision, mode }
  dragging.value = true
  store.beginHistoryTransaction()
  let changed = false
  const move = next => {
    if (next.pointerId !== event.pointerId) return
    const current = point(next)
    const dx = current.x - initial.x, dy = current.y - initial.y
    if (Math.hypot(dx, dy) < 0.1 && !changed) return
    changed = true
    const values = mode === 'resize' ? resizePreviewComponent(start, handle, dx, dy, next.shiftKey) :
      mode === 'rotate' ? rotatePreviewComponent(start, initial, current, next.shiftKey) :
        { x: Number((x + dx / frame.guiWidth * 100).toFixed(3)), y: Number((y + dy / frame.guiHeight * 100).toFixed(3)) }
    Object.assign(item.target, values)
    if (!moveTimer && !moving) moveTimer = setTimeout(sendMove, 0)
  }
  const finish = next => { if (next.pointerId === event.pointerId) cleanup() }
  const cancel = () => cleanup(true)
  const keydown = e => { if (e.code === 'Escape') { e.preventDefault(); e.stopPropagation(); cancel() } }
  const cleanup = (cancelled = false) => {
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', finish)
    window.removeEventListener('pointercancel', cancel)
    window.removeEventListener('blur', cancel)
    window.removeEventListener('keydown', keydown, true)
    if (cancelled) {
      for (const key of transformFields) {
        if (Object.hasOwn(original, key)) item.target[key] = original[key]
        else delete item.target[key]
      }
    }
    dragging.value = false
    store.endHistoryTransaction()
    clearTimeout(moveTimer)
    moveTimer = null
    dragCleanup = null
    if ((changed || queued) && !disposed) { clearTimeout(timer); timer = setTimeout(updatePreview, 0) }
  }
  dragCleanup = cancel
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', finish)
  window.addEventListener('pointercancel', cancel)
  window.addEventListener('blur', cancel)
  window.addEventListener('keydown', keydown, true)
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
  <div ref="stage" class="relative bg-black shadow-xl" :style="{ width: dimensions.width + 'px', height: dimensions.height + 'px' }">
    <template v-if="displayed">
      <img :src="displayed.url" :alt="t('Minecraft 实时渲染画面')" class="absolute inset-0 w-full h-full pointer-events-none" draggable="false" />
      <div v-if="dragging && dragFeedback" class="drag-origin absolute pointer-events-none" :style="rectStyle(dragFeedback.bounds, 0, true)" />
      <div v-for="(item, index) in components" :key="`${item.kind}:${item.key}`" class="absolute cursor-move group game-component touch-none" :class="{ 'dragging-component': dragging && dragFeedback?.target === item.target }" role="button" tabindex="0" :aria-label="t('选择组件：{}', item.key || item.kind)" :style="rectStyle(item, index)" @keydown.enter="store.selectComponent(item.target, item.clazz, item.key || null)" @pointerdown.stop="selectAndTransform($event, item)">
        <div class="absolute inset-0 pointer-events-none border border-dashed border-white/30 opacity-0 group-hover:opacity-100" :class="{ 'selected-component': store.selectedComponent === item.target }" />
        <div v-if="store.selectedComponent === item.target" class="component-label" :style="{ transform: `rotate(${- (previewComponentRect(item, displayed).angle ?? item.angle ?? 0)}deg) scale(${1 / scale})` }" :title="item.key || item.kind">
          {{ item.key || item.kind }} · {{ Number(item.target.x || 0).toFixed(1) }}%, {{ Number(item.target.y || 0).toFixed(1) }}%
          <template v-if="dragging && dragFeedback?.target === item.target && dragFeedback.mode === 'resize'"> · {{ item.sizeMode === 'scale' ? `×${Number(item.target.scale ?? 1).toFixed(2)}` : `${Number(item.target.width ?? 0).toFixed(1)} × ${Number(item.target.height ?? 0).toFixed(1)}` }}</template>
          <template v-else-if="dragging && dragFeedback?.target === item.target && dragFeedback.mode === 'rotate'"> · {{ Number(item.target.angle || 0).toFixed(1) }}°</template>
        </div>
        <template v-if="store.selectedComponent === item.target">
          <button v-for="handle in transformHandles(item)" :key="handle.join(',')" type="button" class="resize-handle" :style="handleStyle(item, handle)"
            :aria-label="t('拖动调整大小')" :title="item.sizeMode === 'scale' ? t('拖动调整缩放比例') : t('拖动调整宽高；按住 Shift 保持比例')"
            @pointerdown.stop="selectAndTransform($event, item, 'resize', handle)" />
          <div v-if="bridge.snapshot?.previewTransform && item.rotatable" class="rotation-control" :style="{ transform: `translateX(-50%) scale(${1 / scale})` }">
            <span class="rotation-stem" />
            <button type="button" class="rotation-handle" :aria-label="t('拖动旋转组件')" :title="t('拖动旋转；按住 Shift 按 15° 对齐；Esc 取消')"
              @pointerdown.stop="selectAndTransform($event, item, 'rotate')"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2 6M20 4v7h-7" /></svg></button>
          </div>
        </template>
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
.resize-handle { position: absolute; width: 10px; height: 10px; border: 2px solid #2563eb; border-radius: 50%; background: white; z-index: 2; touch-action: none; padding: 0; }
.rotation-control { position: absolute; left: 50%; bottom: 100%; transform-origin: bottom center; width: 26px; height: 36px; }
.rotation-stem { position: absolute; left: 12px; top: 24px; width: 2px; height: 12px; background: #3b82f6; pointer-events: none; }
.rotation-handle { display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; border: 2px solid #2563eb; border-radius: 50%; background: white; color: #2563eb; cursor: grab; touch-action: none; }
.resize-handle:hover, .rotation-handle:hover { background: #dbeafe; }
.dragging-component { background: rgb(59 130 246 / 12%); cursor: grabbing; }
.dragging-component .selected-component { box-shadow: 0 0 0 1px rgb(255 255 255 / 70%), 0 0 12px rgb(59 130 246 / 35%); }
</style>
