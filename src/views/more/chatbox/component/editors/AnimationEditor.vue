<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, useId, watch } from 'vue'
import _ from 'lodash'
import { Icon } from '@iconify/vue'
import { Keyframe } from '@/assets/more/chatbox/chatboxTheme.js'
import { useChatBoxEditorStore } from '@/stores'
import { useGameBridgeStore } from '@/stores/modules/gameBridge.js'
import { t } from '@/languages/index.js'
import { animationNumberFields, animationPreviewTheme, animationSegments, validAnimation } from '../../animation/animationTimeline.js'
import PreviewComponents from './PreviewComponents.vue'

const props = defineProps({ modelValue: { type: [Array, null], default: () => [] }, portrait: { type: Object, default: null } })
const emit = defineEmits(['apply', 'close'])
const store = useChatBoxEditorStore()
const bridge = useGameBridgeStore()
const draft = ref(_.cloneDeep(props.modelValue || []).map(frame => Object.assign(new Keyframe(), frame)))
const frameFields = Keyframe.getFieldConfigs()
const textureListId = useId()
const selected = ref(draft.value.length ? 0 : -1)
const playhead = ref(0), playing = ref(false), repeat = ref(false)
const loop = ref(props.portrait?.loop ?? false)
const fps = ref(store.viewMode === 'dialogue' ? store.currentModel?.animationFPS || 60 : 60)
const zoom = ref(5), timeline = ref(null), stage = ref(null), dialog = ref(null), previewArea = ref(null)
const previewSize = ref({ width: 0, height: 0 })
const popupRoot = shallowRef(null)
const displayed = shallowRef(null), pose = shallowRef(null)
const issue = ref(''), ready = ref(false), gesture = ref(false), dragOffset = ref(null)
const sourceTheme = computed(() => store.viewMode === 'theme' ? store.currentModel : store.dialogueTheme)
const portraitKeys = computed(() => Object.keys(sourceTheme.value?.portrait || {}))
const portraitKey = ref(Object.entries(sourceTheme.value?.portrait || {}).find(([, p]) => p === props.portrait)?.[0] || props.portrait?.id || portraitKeys.value[0] || '__animation_editor__')
const previewPortrait = computed(() => props.portrait || sourceTheme.value?.portrait?.[portraitKey.value])
const segments = computed(() => animationSegments(draft.value))
const total = computed(() => segments.value.at(-1)?.end || 0)
const selectedFrame = computed(() => draft.value[selected.value])
const textureSuggestions = computed(() => store.allTextureOptions.filter(option => !selectedFrame.value?.texture || option.value.toLowerCase().includes(selectedFrame.value.texture.toLowerCase())).slice(0, 80))
const valid = computed(() => validAnimation(draft.value))
const supported = computed(() => bridge.connected && bridge.snapshot?.previewAnimation && bridge.snapshot?.previewStream)
const timelineWidth = computed(() => Math.max(640, (total.value + 30) * zoom.value))
const tickStep = computed(() => [1, 5, 10, 30, 60, 120, 300, 600, 3600].find(step => step * zoom.value >= 65) || 3600)
const ticks = computed(() => Array.from({ length: Math.floor((total.value + 30) / tickStep.value) + 1 }, (_, i) => i * tickStep.value))
const targetBounds = computed(() => displayed.value?.components?.find(item => item.kind === 'portrait' && item.key === portraitKey.value))
const stageStyle = computed(() => {
  const ratio = displayed.value ? displayed.value.width / displayed.value.height : 16 / 9
  const width = Math.max(1, Math.min(previewSize.value.width, previewSize.value.height * ratio))
  return { width: `${width}px`, height: `${width / ratio}px` }
})
const selectionStyle = computed(() => {
  const bounds = targetBounds.value, frame = displayed.value
  if (!bounds || !frame) return {}
  return { left: `${(bounds.x + (dragOffset.value?.x || 0)) / frame.guiWidth * 100}%`, top: `${(bounds.y + (dragOffset.value?.y || 0)) / frame.guiHeight * 100}%`,
    width: `${Math.max(1, bounds.width) / frame.guiWidth * 100}%`, height: `${Math.max(1, bounds.height) / frame.guiHeight * 100}%`, transform: `rotate(${bounds.angle || 0}deg)` }
})
let popup, timer, clock, busy = false, queued = false, rebuild = true, disposed = false, generation = 0, cleanupGesture, resizeObserver
const previousFocus = document.activeElement
const openingFile = store.currentFile
const session = crypto.randomUUID()
store.animationEditorSession = session

function schedule(delay = 80) {
  if (disposed) return
  queued = true
  clearTimeout(timer)
  if (!gesture.value) timer = setTimeout(syncPreview, delay)
}

async function syncPreview() {
  timer = null
  if (busy || gesture.value || disposed) return
  queued = false
  if (!supported.value || !valid.value || !previewPortrait.value) return
  busy = true
  const version = generation, frame = playhead.value
  try {
    if (rebuild) {
      rebuild = false
      ready.value = false
      pose.value = null
      await bridge.preview({ kind: 'theme', stream: true,
        content: animationPreviewTheme(sourceTheme.value, previewPortrait.value, draft.value, portraitKey.value),
        sample: { name: sourceTheme.value?.dialogBox?._name, text: sourceTheme.value?.dialogBox?._text, options: sourceTheme.value?.option?._text || [] },
        animation: { key: portraitKey.value, frame } })
      if (version === generation && !disposed) { ready.value = true; queued = true }
    } else if (ready.value) {
      const result = await bridge.seekAnimation({ key: portraitKey.value, frame })
      if (version === generation && !disposed) pose.value = { ...result.pose, frame, generation: version }
    }
    if (version === generation) issue.value = ''
  } catch (error) {
    if (version === generation && !disposed) { issue.value = error.message; playing.value = false; ready.value = false }
  } finally {
    busy = false
    if (disposed) releasePreview()
    else if (queued) schedule()
  }
}

watch([draft, portraitKey, previewPortrait, sourceTheme, supported], () => {
  generation++
  rebuild = true
  ready.value = false
  playing.value = false
  playhead.value = Math.min(playhead.value, total.value)
  schedule(220)
}, { deep: true, immediate: true })
watch(playhead, () => {
  queued = true
  if (!timer && !gesture.value) timer = setTimeout(syncPreview, 80)
})
watch(() => bridge.streamFrame, async frame => {
  if (!frame) { displayed.value = null; return }
  const image = new Image()
  image.src = frame.url
  try { await image.decode(); if (!disposed && bridge.streamFrame === frame) displayed.value = frame } catch { /* 等待下一张完整画面。 */ }
})
watch(() => store.currentFile, file => { if (file !== openingFile) emit('close') })
watch(portraitKeys, keys => { if (!props.portrait && !keys.includes(portraitKey.value)) portraitKey.value = keys[0] || '__animation_editor__' })
watch(() => segments.value[selected.value]?.end, (end, previous) => {
  if (!playing.value && end != null && playhead.value === previous) playhead.value = end
})

watch(playing, active => {
  clearInterval(clock)
  if (!active) return
  if (playhead.value >= total.value) playhead.value = 0
  const start = performance.now(), initial = playhead.value
  clock = setInterval(() => {
    const next = initial + Math.floor((performance.now() - start) / 1000 * fps.value)
    if (next >= total.value && !repeat.value) { playhead.value = total.value; playing.value = false }
    else playhead.value = total.value ? next % total.value : 0
  }, 30)
})

function select(index) {
  playing.value = false
  selected.value = index
  playhead.value = segments.value[index]?.end || 0
}
function add(duplicate = false) {
  const frame = duplicate && selectedFrame.value ? _.cloneDeep(selectedFrame.value) : Object.assign(new Keyframe(), { time: 30 })
  const index = selected.value + 1
  draft.value.splice(index, 0, frame)
  select(index)
}
function remove() {
  if (!selectedFrame.value) return
  draft.value.splice(selected.value, 1)
  select(Math.min(selected.value, draft.value.length - 1))
}
function reorder(direction) {
  const next = selected.value + direction
  if (next < 0 || next >= draft.value.length) return
  const [frame] = draft.value.splice(selected.value, 1)
  draft.value.splice(next, 0, frame)
  select(next)
}
function updateNumber(key, event) {
  selectedFrame.value[key] = event.target.value === '' ? key === 'time' ? 1 : null : event.target.valueAsNumber
}
function seek(frame) {
  playing.value = false
  playhead.value = Math.max(0, Math.min(total.value, Math.round(Number(frame) || 0)))
}
function startGesture(event, move, finish = () => {}) {
  if (event.button !== 0) return
  event.preventDefault()
  cleanupGesture?.()
  const owner = event.currentTarget.ownerDocument.defaultView
  const pointer = next => { if (next.pointerId === event.pointerId) move(next) }
  const end = next => { if (next.pointerId === event.pointerId) cleanup() }
  const cleanup = () => {
    owner.removeEventListener('pointermove', pointer)
    owner.removeEventListener('pointerup', end)
    owner.removeEventListener('pointercancel', end)
    owner.removeEventListener('blur', cleanup)
    cleanupGesture = null
    finish()
  }
  cleanupGesture = cleanup
  owner.addEventListener('pointermove', pointer)
  owner.addEventListener('pointerup', end)
  owner.addEventListener('pointercancel', end)
  owner.addEventListener('blur', cleanup)
}
function scrub(event) {
  const rect = timeline.value.firstElementChild.getBoundingClientRect()
  const move = next => seek((next.clientX - rect.left) / zoom.value)
  move(event)
  startGesture(event, move)
}
function resizeSegment(event, index) {
  select(index)
  const initial = event.clientX, duration = segments.value[index].duration
  gesture.value = true
  startGesture(event, next => {
    draft.value[index].time = Math.max(1, duration + Math.round((next.clientX - initial) / zoom.value))
    playhead.value = segments.value[index].end
  }, () => { gesture.value = false; schedule(0) })
}
function movePortrait(event) {
  if (!ready.value || !selectedFrame.value || pose.value?.generation !== generation || pose.value?.frame !== segments.value[selected.value]?.end || playhead.value !== pose.value?.frame || displayed.value?.animation?.key !== portraitKey.value || displayed.value?.animation?.frame !== playhead.value) return
  const rect = stage.value.getBoundingClientRect(), origin = { ...pose.value }, frame = selectedFrame.value
  const x = event.clientX, y = event.clientY
  gesture.value = true
  startGesture(event, next => {
    const dx = (next.clientX - x) / rect.width, dy = (next.clientY - y) / rect.height
    frame.x = Number((origin.x + dx * 100 - (frame.xOffset || 0)).toFixed(3))
    frame.y = Number((origin.y + dy * 100 - (frame.yOffset || 0)).toFixed(3))
    dragOffset.value = { x: dx * displayed.value.guiWidth, y: dy * displayed.value.guiHeight }
  }, () => { gesture.value = false; dragOffset.value = null; schedule(0) })
}

function apply() {
  if (!valid.value) return
  store.beginHistoryTransaction()
  try { emit('apply', _.cloneDeep(draft.value), loop.value) }
  finally { store.endHistoryTransaction() }
  emit('close')
}
function retry() { rebuild = true; issue.value = ''; schedule(0) }
async function releasePreview() {
  if (store.animationEditorSession !== session) return
  try { if (bridge.connected) await bridge.stopPreview() } catch { /* 断开时保留草稿之外的主编辑内容。 */ }
  finally { if (store.animationEditorSession === session) store.animationEditorSession = '' }
}
function keydown(event) {
  event.stopPropagation()
  if (event.code === 'Tab') {
    const controls = [...dialog.value.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled])')].filter(element => element.getClientRects().length)
    const active = dialog.value.ownerDocument.activeElement
    if (event.shiftKey && (active === controls[0] || active === dialog.value)) { event.preventDefault(); controls.at(-1)?.focus() }
    else if (!event.shiftKey && active === controls.at(-1)) { event.preventDefault(); controls[0]?.focus() }
    return
  }
  if ((event.ctrlKey || event.metaKey) && event.code === 'KeyS') { event.preventDefault(); return }
  if (event.target?.closest('input, textarea, select, [contenteditable="true"]')) return
  if (event.code === 'Space') { event.preventDefault(); if (total.value && valid.value && ready.value) playing.value = !playing.value }
  else if (event.code === 'ArrowLeft') { event.preventDefault(); seek(playhead.value - 1) }
  else if (event.code === 'ArrowRight') { event.preventDefault(); seek(playhead.value + 1) }
  else if (event.code === 'Escape') { event.preventDefault(); emit('close') }
}
function returnToPage() {
  playing.value = false
  cleanupGesture?.()
  popupRoot.value = null
  nextTick(() => dialog.value?.focus())
}
function dock() {
  if (popup) { popup.removeEventListener('beforeunload', returnToPage); popup.close(); popup = null }
  returnToPage()
}
function closePopup() {
  if (popup) { popup.removeEventListener('beforeunload', returnToPage); popup.close() }
}
function detach() {
  if (popup && !popup.closed) { popup.focus(); return }
  popup = window.open('', '_blank', 'popup,width=1320,height=880')
  if (!popup) { issue.value = t('浏览器阻止了独立窗口，可以继续在当前窗口编辑'); return }
  popup.document.title = t('ChatBox 动画编辑器')
  popup.document.documentElement.className = document.documentElement.className
  popup.document.documentElement.style.cssText = document.documentElement.style.cssText
  popup.document.body.className = document.body.className
  for (const style of document.querySelectorAll('style, link[rel="stylesheet"]')) popup.document.head.append(style.cloneNode(true))
  const root = popup.document.createElement('div')
  popup.document.body.append(root)
  popup.addEventListener('beforeunload', returnToPage)
  popupRoot.value = root
  nextTick(() => dialog.value?.focus())
}
watch(previewArea, element => {
  resizeObserver?.disconnect()
  if (!element) return
  resizeObserver = new ResizeObserver(([entry]) => { previewSize.value = { width: entry.contentRect.width, height: entry.contentRect.height } })
  resizeObserver.observe(element)
}, { flush: 'post' })
onMounted(() => { dialog.value?.focus(); window.addEventListener('beforeunload', closePopup) })
onBeforeUnmount(() => {
  disposed = true
  playing.value = false
  clearTimeout(timer)
  clearInterval(clock)
  resizeObserver?.disconnect()
  cleanupGesture?.()
  window.removeEventListener('beforeunload', closePopup)
  closePopup()
  if (!busy) releasePreview()
  previousFocus?.focus?.({ preventScroll: true })
})
</script>

<template>
  <Teleport v-if="popupRoot" to="body">
    <div class="animation-overlay popup-placeholder"><Icon icon="lucide:external-link" width="32" /><p>{{ t('动画编辑器已在独立窗口打开') }}</p><button type="button" @click="popup?.focus()">{{ t('显示动画窗口') }}</button><button type="button" @click="dock">{{ t('返回当前页面编辑') }}</button></div>
  </Teleport>
  <Teleport :key="popupRoot ? 'detached' : 'inline'" :to="popupRoot || 'body'">
    <div class="animation-overlay" @pointerdown.stop @copy.stop @paste.stop>
      <section ref="dialog" class="animation-editor" role="dialog" aria-modal="true" :aria-label="t('ChatBox 动画编辑器')" tabindex="-1" @keydown="keydown">
        <header class="editor-header">
          <Icon icon="lucide:clapperboard" width="19" class="text-ui-link" />
          <strong>{{ t('立绘动画编辑器') }}</strong>
          <span class="text-ui-muted">{{ portraitKey }} · {{ draft.length }} {{ t('关键帧') }}</span>
          <div class="grow" />
          <button v-if="!popupRoot" type="button" @click="detach"><Icon icon="lucide:external-link" width="14" />{{ t('在独立窗口打开') }}</button>
          <button type="button" :aria-label="t('关闭')" @click="emit('close')"><Icon icon="lucide:x" width="18" /></button>
        </header>

        <div class="editor-content">
          <PreviewComponents :theme="sourceTheme" :portrait="previewPortrait" :portrait-key="portraitKey" />
          <main class="preview-column">
            <div class="preview-toolbar">
              <span class="live-dot" :class="{ active: ready }" />{{ t('MC 实时画面') }}
              <span v-if="displayed?.animation" class="text-ui-muted">{{ t('画面帧') }} {{ displayed.animation.frame }} f</span>
              <template v-if="!portrait"><label for="animation-portrait">{{ t('预览立绘') }}</label><select id="animation-portrait" v-model="portraitKey"><option v-for="key in portraitKeys" :key="key" :value="key">{{ key }}</option></select></template>
              <div class="grow" />
              <button type="button" :disabled="!supported" @click="retry">{{ t('刷新预览') }}</button>
            </div>
            <div ref="previewArea" class="preview-area">
              <div v-if="displayed" ref="stage" class="preview-stage" :style="stageStyle">
                <img :src="displayed.url" :alt="t('Minecraft 实时渲染画面')" draggable="false" />
                <div v-if="targetBounds" class="portrait-bounds" :style="selectionStyle" :title="t('在关键帧末尾拖动立绘，设置该帧的目标坐标')" @pointerdown="movePortrait" />
              </div>
              <div v-else class="preview-empty"><Icon icon="lucide:monitor-play" width="38" /><span>{{ !bridge.connected ? t('连接游戏后显示 Minecraft 实时画面') : !supported ? t('请更新并重启 ChatBox 模组以启用动画时间轴预览') : !previewPortrait ? t('请先在主题中添加用于预览的立绘') : t('正在等待 Minecraft 渲染画面…') }}</span></div>
            </div>
            <div class="preview-hint">{{ t('选中关键帧后可在画面中拖动立绘；材质在该帧结束时切换。') }}</div>
            <div v-if="issue || !valid" class="editor-issue" role="status">{{ !valid ? t('时长须为正整数，属性须为有效数字；缩放和亮度不能为负，透明度为 0–100。') : issue }}</div>
          </main>

          <aside class="frame-inspector">
            <div class="inspector-heading">{{ selectedFrame ? `${t('关键帧')} ${selected + 1}` : t('关键帧属性') }}<span v-if="selectedFrame" class="text-ui-muted">{{ segments[selected].start }} → {{ segments[selected].end }} f</span></div>
            <p class="field-hint">{{ t('未设置的属性沿用上一帧；相对偏移会在每段动画开始时重新计算。') }}</p>
            <div v-if="selectedFrame" class="frame-fields">
              <label class="frame-field" :title="frameFields.time.tips"><span>{{ frameFields.time.label }}</span><input :value="selectedFrame.time ?? 1" type="number" min="1" step="1" @input="updateNumber('time', $event)" /></label>
              <label class="frame-field"><span>{{ frameFields.easing.label }}</span><select :value="selectedFrame.easing?.toUpperCase() || ''" @change="selectedFrame.easing = $event.target.value || null"><option value="">{{ t('线性') }}</option><option v-for="option in frameFields.easing.props.options" :key="option.value" :value="option.value">{{ option.label }}</option></select></label>
              <div v-for="key in animationNumberFields" :key="key" class="frame-field" :title="frameFields[key].tips">
                <label :for="`${textureListId}-${key}`">{{ frameFields[key].label }}</label>
                <input :id="`${textureListId}-${key}`" :value="selectedFrame[key]" type="number" :step="frameFields[key].props?.step || 1" :min="['scale', 'opacity', 'brightness'].includes(key) ? 0 : undefined" :max="key === 'opacity' ? 100 : undefined" :placeholder="t('沿用上一帧')" @input="updateNumber(key, $event)" />
                <button type="button" :disabled="selectedFrame[key] == null" :title="t('沿用上一帧')" :aria-label="`${frameFields[key].label} · ${t('沿用上一帧')}`" @click="selectedFrame[key] = null"><Icon icon="lucide:rotate-ccw" width="12" /></button>
              </div>
              <label class="texture-field"><span>{{ frameFields.texture.label }}</span><input :value="selectedFrame.texture" :list="textureListId" type="text" :placeholder="t('沿用上一帧')" @input="selectedFrame.texture = $event.target.value || null" /><datalist :id="textureListId"><option v-for="option in textureSuggestions" :key="option.value" :value="option.value">{{ option.label }}</option></datalist></label>
            </div>
            <div v-else class="field-hint">{{ t('添加一个关键帧开始制作动画') }}</div>
          </aside>
        </div>

        <section class="timeline-panel" :aria-label="t('动画时间轴')">
          <div class="timeline-toolbar">
            <button type="button" :title="t('回到起点')" :aria-label="t('回到起点')" @click="seek(0)"><Icon icon="lucide:skip-back" width="15" /></button>
            <button type="button" :title="t('上一帧')" :aria-label="t('上一帧')" @click="seek(playhead - 1)"><Icon icon="lucide:step-back" width="15" /></button>
            <button type="button" class="play-button" :disabled="!total || !valid || !ready" :aria-label="playing ? t('暂停') : t('播放')" @click="playing = !playing"><Icon :icon="playing ? 'lucide:pause' : 'lucide:play'" width="16" /></button>
            <button type="button" :title="t('下一帧')" :aria-label="t('下一帧')" @click="seek(playhead + 1)"><Icon icon="lucide:step-forward" width="15" /></button>
            <label class="transport-label"><input :value="playhead" type="number" min="0" :max="total" :aria-label="t('当前帧')" @change="seek($event.target.value)" /> / {{ total }} f</label>
            <span class="time-code">{{ (playhead / fps).toFixed(2) }} s</span>
            <label class="transport-label">FPS <input v-model.number="fps" type="number" min="1" max="240" :aria-label="t('预览帧率')" @change="fps = Math.max(1, Math.min(240, Math.round(fps || 60))); playing = false" /></label>
            <label class="transport-label"><input v-model="repeat" type="checkbox" />{{ t('循环预览') }}</label>
            <div class="grow" />
            <label class="transport-label">{{ t('缩放') }}<input v-model.number="zoom" type="range" min="0.05" max="12" step="0.05" /></label>
          </div>
          <div class="timeline-actions">
            <button type="button" @click="add()"><Icon icon="lucide:plus" width="13" />{{ t('添加关键帧') }}</button>
            <button type="button" :disabled="!selectedFrame" @click="add(true)"><Icon icon="lucide:copy" width="13" />{{ t('复制') }}</button>
            <button type="button" :disabled="!selectedFrame" @click="remove"><Icon icon="lucide:trash-2" width="13" />{{ t('删除') }}</button>
            <button type="button" :disabled="selected <= 0" :title="t('前移关键帧')" :aria-label="t('前移关键帧')" @click="reorder(-1)"><Icon icon="lucide:arrow-left" width="13" /></button>
            <button type="button" :disabled="selected < 0 || selected >= draft.length - 1" :title="t('后移关键帧')" :aria-label="t('后移关键帧')" @click="reorder(1)"><Icon icon="lucide:arrow-right" width="13" /></button>
            <span class="text-ui-muted">{{ t('拖动片段右边缘调整时长，后续关键帧随之移动') }}</span>
          </div>
          <div ref="timeline" class="timeline-scroll">
            <div class="timeline-track" :style="{ width: `${timelineWidth}px` }">
              <div class="timeline-ruler" @pointerdown="scrub"><span v-for="tick in ticks" :key="tick" :style="{ left: `${tick * zoom}px` }">{{ tick }} f</span></div>
              <div class="keyframe-track" @pointerdown.self="scrub">
                <button v-for="segment in segments" :key="segment.index" type="button" class="keyframe-segment" :class="{ selected: selected === segment.index }" :style="{ left: `${segment.start * zoom}px`, width: `${segment.duration * zoom}px` }"
                  :aria-label="`${t('关键帧')} ${segment.index + 1}: ${segment.start}–${segment.end} f`" @click="select(segment.index)">
                  <span class="segment-title">{{ segment.index + 1 }} · {{ segment.duration }} f</span>
                  <span class="segment-properties">{{ animationNumberFields.filter(key => draft[segment.index][key] != null).join(' · ') }}{{ draft[segment.index].texture != null ? ' · texture' : '' }}</span>
                  <span class="keyframe-end" :title="t('拖动调整时长')" @click.stop @pointerdown.stop="resizeSegment($event, segment.index)">◆</span>
                </button>
                <span v-if="!draft.length" class="empty-track">{{ t('添加一个关键帧开始制作动画') }}</span>
              </div>
              <div class="playhead" :style="{ left: `${playhead * zoom}px` }"><span @pointerdown.stop="scrub">▼</span></div>
            </div>
          </div>
        </section>

        <footer class="editor-footer">
          <label v-if="portrait" class="transport-label"><input v-model="loop" type="checkbox" />{{ t('立绘循环播放') }}</label>
          <span class="text-ui-muted">{{ t('空格播放 / 暂停 · ← → 逐帧 · 应用后使用主编辑器保存到游戏') }}</span>
          <div class="grow" />
          <button type="button" @click="emit('close')">{{ t('取消') }}</button>
          <button type="button" class="apply-button" :disabled="!valid" @click="apply">{{ t('应用动画') }}</button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.animation-overlay { position: fixed; inset: 0; z-index: 10000; padding: 20px; background: rgb(0 0 0 / 65%); display: flex; font-size: 12px; color: rgb(var(--ui-text)); }
.animation-editor { display: flex; flex-direction: column; width: 100%; height: 100%; min-width: 620px; background: rgb(var(--ui-bg)); border: 1px solid rgb(var(--ui-line)); box-shadow: 0 20px 80px #0008; outline: none; }
.popup-placeholder { flex-direction: column; align-items: center; justify-content: center; gap: 14px; background: rgb(var(--ui-bg) / 95%); }
.editor-header, .editor-footer, .preview-toolbar, .timeline-toolbar, .timeline-actions { display: flex; align-items: center; gap: 10px; padding: 10px 14px; flex-shrink: 0; border-bottom: 1px solid rgb(var(--ui-line)); flex-wrap: wrap; }
.editor-header { min-height: 48px; }
.editor-header strong { font-size: 14px; }
.grow { flex: 1; }
button { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 5px 8px; border: 1px solid rgb(var(--ui-line)); background: rgb(var(--ui-surface)); white-space: nowrap; }
button:hover:not(:disabled) { border-color: rgb(var(--ui-link)); color: rgb(var(--ui-link)); }
button:disabled { opacity: .4; cursor: default; }
button:focus-visible, input:focus-visible, select:focus-visible { outline: 2px solid rgb(var(--ui-link)); outline-offset: 2px; }
.editor-content { display: grid; grid-template-columns: 200px minmax(0, 1fr) 285px; min-height: 120px; flex: 1; }
.preview-column { display: flex; flex-direction: column; min-height: 0; min-width: 0; }
.preview-toolbar { min-height: 42px; background: rgb(var(--ui-surface)); padding: 6px 12px; }
.live-dot { width: 7px; height: 7px; background: rgb(var(--ui-muted)); border-radius: 50%; }
.live-dot.active { background: #22c55e; }
.preview-area { flex: 1; min-height: 0; padding: 16px; display: flex; justify-content: center; align-items: center; overflow: hidden; background: #11151b; }
.preview-stage { position: relative; max-width: 100%; max-height: 100%; width: 100%; overflow: hidden; }
.preview-stage img { display: block; width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
.portrait-bounds { position: absolute; border: 1px dashed #60a5fa; cursor: move; touch-action: none; }
.preview-empty { display: flex; flex-direction: column; align-items: center; gap: 15px; color: #a0aec0; text-align: center; }
.preview-hint, .field-hint { color: rgb(var(--ui-muted)); padding: 8px 12px; font-size: 11px; line-height: 1.6; }
.editor-issue { color: #f59e0b; padding: 8px 12px; }
.frame-inspector { border-left: 1px solid rgb(var(--ui-line)); overflow-y: auto; background: rgb(var(--ui-inset)); }
.inspector-heading { display: flex; justify-content: space-between; padding: 12px; font-weight: 600; border-bottom: 1px solid rgb(var(--ui-line)); }
.frame-fields { padding: 0 12px 16px; }
.frame-field { display: flex; align-items: center; gap: 5px; margin-bottom: 10px; }
.frame-field > label, .frame-field > span { width: 100px; flex-shrink: 0; color: rgb(var(--ui-muted)); }
.frame-field input, .frame-field select { flex: 1; min-width: 0; width: 100%; }
.frame-field button { padding: 5px; }
.texture-field { display: flex; flex-direction: column; gap: 6px; color: rgb(var(--ui-muted)); }
.texture-field input { width: 100%; border: 1px solid rgb(var(--ui-line)); background: rgb(var(--ui-bg)); color: rgb(var(--ui-text)); padding: 6px; }
.timeline-panel { border-top: 1px solid rgb(var(--ui-line)); flex-shrink: 0; }
.timeline-toolbar { gap: 6px; padding: 7px 12px; }
.timeline-actions { gap: 6px; padding: 6px 12px; font-size: 11px; }
.transport-label { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
input[type=number], select { width: 68px; border: 1px solid rgb(var(--ui-line)); padding: 4px; color: rgb(var(--ui-text)); background: rgb(var(--ui-inset)); }
select { width: 130px; }
input[type=range] { width: 85px; accent-color: #3b82f6; }
input[type=checkbox] { accent-color: #3b82f6; }
.time-code { min-width: 55px; color: rgb(var(--ui-muted)); font-family: monospace; }
.play-button, .apply-button { background: #2563eb; color: white; border-color: #3b82f6; }
.timeline-scroll { overflow: auto; height: 120px; padding: 0 12px; background: rgb(var(--ui-inset)); }
.timeline-track { position: relative; height: 100px; }
.timeline-ruler { height: 28px; position: relative; cursor: crosshair; border-bottom: 1px solid rgb(var(--ui-line)); touch-action: none; }
.timeline-ruler > span { position: absolute; padding: 2px 5px; border-left: 1px solid rgb(var(--ui-line)); height: 100%; color: rgb(var(--ui-muted)); font: 10px/22px monospace; pointer-events: none; }
.keyframe-track { position: relative; height: 70px; touch-action: none; }
.keyframe-segment { position: absolute; top: 9px; height: 48px; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 3px; padding: 5px 8px; background: rgb(59 130 246 / 10%); border: 1px solid rgb(59 130 246 / 35%); text-align: left; }
.keyframe-segment.selected { background: rgb(59 130 246 / 25%); border-color: #60a5fa; }
.segment-title, .segment-properties { max-width: 100%; overflow: hidden; text-overflow: ellipsis; pointer-events: none; }
.segment-properties { font-size: 10px; color: rgb(var(--ui-muted)); }
.keyframe-end { position: absolute; right: -6px; top: 0; bottom: 0; width: 12px; z-index: 2; display: flex; align-items: center; color: #60a5fa; cursor: ew-resize; touch-action: none; }
.playhead { position: absolute; top: 0; bottom: 0; border-left: 1px solid #f59e0b; pointer-events: none; z-index: 3; }
.playhead > span { position: absolute; top: 0; left: -7px; color: #f59e0b; cursor: ew-resize; pointer-events: auto; touch-action: none; }
.empty-track { display: block; padding: 23px; color: rgb(var(--ui-muted)); }
.editor-footer { border-top: 1px solid rgb(var(--ui-line)); border-bottom: 0; }
@media (max-width: 900px) { .animation-overlay { padding: 0; overflow: auto; } .editor-content { grid-template-columns: 150px minmax(0, 1fr) 240px; } .editor-footer > .text-ui-muted, .timeline-actions > .text-ui-muted { display: none; } }
</style>
