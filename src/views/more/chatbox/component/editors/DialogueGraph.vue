<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { VueFlow, Handle, MarkerType, Position, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import ELK from 'elkjs/lib/elk-api.js'
import ElkWorker from 'elkjs/lib/elk-worker.min.js?worker'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/minimap/dist/style.css'
import { Icon } from '@iconify/vue'
import { useChatBoxEditorStore } from '@/stores'
import { useGameBridgeStore } from '@/stores/modules/gameBridge.js'
import { debugNodeState } from '../../bridge/dialogueDebug.js'
import { usePrompt } from '@/components/register/usePrompt.js'
import { useMessage } from '@/components/register/useMessage.js'
import { useDialog } from '@/components/register/useDialog.js'
import { ChatBoxDialogues, DialogueFrame, DialogueDialogBox, DialogueOption, DialoguePortrait, DialogueVideo } from '@/assets/more/chatbox/chatboxDialogues.js'
import { connectionTarget, fieldAt, removeDialogueTransitions } from '../../flow/dialogueFlow.js'
import { projectFlow } from '../../flow/flowProjection.js'
import { diagnosticText } from '../../flow/flowMessages.js'
import StoryEdge from './StoryEdge.vue'
import { t } from '@/languages/index.js'

const store = useChatBoxEditorStore()
const bridge = useGameBridgeStore()
const prompt = usePrompt(), message = useMessage(), dialog = useDialog()
const scope = computed(() => store.dialogueGraphGroupKey)
const groups = computed(() => store.currentModel?.dialogues || {})
const analysis = computed(() => store.dialogueAnalysis)
const projection = computed(() => projectFlow(store.currentModel, analysis.value, scope.value))
const nodes = ref([]), edges = ref([]), search = ref(''), selectedEdgeId = ref(null), selectedLinkId = ref(null)
const graphElement = ref(null), selectedNodeId = ref(null)
const layingOut = ref(false)
const contextMenu = ref(null)
const currentRun = computed(() => bridge.debugState?.resourceId === store.currentFile?.resourceId ? bridge.debugState : null)
const outgoing = computed(() => store.debuggingCurrentFile && currentRun.value ? analysis.value.transitions.filter(link =>
  link.groupKey === currentRun.value.group && link.frameIndex === currentRun.value.index && !link.stay) : [])
const runtimeNext = data => outgoing.value.some(link => link.kind === 'frame' && link.group === data.group && (data.kind === 'group' || data.index === link.index))
const debugIssue = computed(() => store.dialogueDebugIssue || bridge.debugError)
const needsFit = ref(false)
const flow = useVueFlow('chatbox-dialogue-flow')
const elk = new ELK({ workerFactory: () => new ElkWorker() })
const layoutKey = computed(() => JSON.stringify([store.currentFile?.resourceId, scope.value]))
const cache = () => store.dialogueGraphLayouts[layoutKey.value] ||= { positions: {}, viewport: null }
const selectedBundle = computed(() => projection.value.edges.find(edge => edge.id === selectedEdgeId.value))
const selectedLink = computed(() => selectedBundle.value?.links.find(link => link.id === selectedLinkId.value))
const selectedNode = computed(() => projection.value.nodes.find(node => node.id === selectedNodeId.value))
const deleteLabel = computed(() => selectedNode.value?.kind === 'frame' ? t('删除对话') : selectedNode.value?.kind === 'group' ? t('删除剧情片段') : t('删除跳转'))
const sourceEvent = computed(() => selectedLink.value?.readonly && selectedLink.value.origin === 'theme'
  ? fieldAt(store.dialogueTheme, selectedLink.value.path).owner : null)
const targetGroup = ref(''), targetIndex = ref('')
let generation = 0
const groupKeys = computed(() => Object.keys(groups.value).filter(key => key.toLowerCase().includes(search.value.toLowerCase())))
const partTypes = { basic: DialogueFrame, dialogBox: DialogueDialogBox, option: DialogueOption, portrait: DialoguePortrait, video: DialogueVideo }
const partNames = { basic: t('基本设置'), dialogBox: t('对话内容'), option: t('选项'), portrait: t('立绘'), video: t('视频') }

function selectFrame(group, index, part = 'basic', keepEdge = false) {
  const frame = groups.value[group]?.[index]
  if (!frame) return
  selectedNodeId.value = projection.value.nodes.find(node => node.kind === 'frame' && node.frame === frame)?.id || null
  if (!keepEdge) selectedEdgeId.value = null
  store.activeDialogueGroupKey = group
  const target = part === 'basic' ? frame : part === 'option' ? frame.options : frame[part]
  store.selectDialoguesComponent(target, partTypes[part], part, frame)
}
function enterGroup(group) {
  if (!Array.isArray(groups.value[group])) return
  store.dialogueGraphGroupKey = group
  store.activeDialogueGroupKey = group
  selectedEdgeId.value = null
  if (groups.value[group].length) selectFrame(group, 0)
  else store.selectDialoguesComponent(store.currentModel, ChatBoxDialogues, 'Global Settings')
}
function selectNode({ node, event }) {
  if (event.target.closest('.vue-flow__handle')) return
  const data = node.data
  selectedEdgeId.value = null
  if (data.kind === 'frame') selectFrame(data.group, data.index)
  else if (groups.value[data.group]) {
    store.activeDialogueGroupKey = data.group
    store.selectDialoguesComponent(store.currentModel, ChatBoxDialogues, 'Global Settings')
  }
  selectedNodeId.value = node.id
}
function openContext(event, data) {
  contextMenu.value = { data, group: data.group, index: data.kind === 'group' || data.kind === 'incoming' ? 0 : data.index,
    x: Math.min(event.clientX, window.innerWidth - 270), y: Math.min(event.clientY, window.innerHeight - 145) }
  graphElement.value?.focus({ preventScroll: true })
}
async function jumpToDialogue() {
  const target = contextMenu.value
  contextMenu.value = null
  try { await store.startDialogueDebug(target.group, target.index) }
  catch (error) { message.error(t(error.message)) }
}
async function stopDebug() {
  try { await bridge.stopDebug() }
  catch (error) { message.error(t(error.message)) }
}
function focusRuntime() {
  if (!currentRun.value) return
  enterGroup(currentRun.value.group)
  selectFrame(currentRun.value.group, currentRun.value.index)
  store.dialogueDebugFollow = true
  lastFollowPosition = ''
}
function closeContext(event) {
  if (event.type === 'keydown' ? event.key === 'Escape' : !event.target.closest('.story-context')) contextMenu.value = null
}
function locate(source) {
  if (source.groupKey === undefined) {
    store.selectDialoguesComponent(store.currentModel, ChatBoxDialogues, 'Global Settings')
    return
  }
  selectFrame(source.groupKey, source.frameIndex, source.section || 'basic', true)
  if (source.readonly || source.implicit) return
  const { owner } = fieldAt(store.currentModel, source.path)
  if (owner?.constructor?.getFieldConfigs) store.selectDialoguesComponent(owner, owner.constructor, source.section, groups.value[source.groupKey]?.[source.frameIndex])
}
function selectLink(link) {
  selectedLinkId.value = link.id
  targetGroup.value = link.group
  targetIndex.value = link.group === link.groupKey ? String(link.index) : ''
  locate(link)
  selectedNodeId.value = null
}
function selectEdge({ edge }) {
  selectedNodeId.value = null
  selectedEdgeId.value = edge.id
  selectedLinkId.value = null
  const links = selectedBundle.value?.links
  if (links?.length === 1) selectLink(links[0])
  selectedNodeId.value = null
}
function clearGraphSelection() {
  selectedNodeId.value = null
  selectedEdgeId.value = null
  selectedLinkId.value = null
}
function deleteLinks(links) {
  try {
    if (!removeDialogueTransitions(store.currentModel, links)) return
    clearGraphSelection()
    store.clearSelection()
    message.success(t('已删除跳转，保留其他对话内容'))
  } catch (error) { message.warning(t(error.message)) }
}
function deleteNode(data) {
  if (data.kind === 'frame') deleteFrame(data)
  else if (data.kind === 'group') deleteGroup(data.group)
  else deleteLinks(projection.value.edges.filter(edge => data.kind === 'incoming' ? edge.source === data.id : edge.target === data.id).flatMap(edge => edge.links))
}
function deleteSelection() {
  if (selectedBundle.value) deleteLinks(selectedLink.value ? [selectedLink.value] : selectedBundle.value.links)
  else if (selectedNode.value) deleteNode(selectedNode.value)
}
function deleteFromContext() {
  const data = contextMenu.value.data
  contextMenu.value = null
  deleteNode(data)
}
function onGraphKeydown(event) {
  if (!['Delete', 'Backspace'].includes(event.key) || event.defaultPrevented || event.repeat || event.isComposing || event.ctrlKey || event.metaKey || event.altKey) return
  if (event.target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"], [role="combobox"]')) return
  if (!contextMenu.value && !selectedNode.value && !selectedBundle.value) return
  event.preventDefault()
  event.stopPropagation()
  if (contextMenu.value) deleteFromContext()
  else deleteSelection()
}
function focusGraph(event) {
  if (!event.target.closest('button, input, textarea, select, a, [contenteditable]:not([contenteditable="false"]), [role="combobox"]')) graphElement.value?.focus({ preventScroll: true })
}
function locateDiagnostic(item) {
  if (item.groupKey !== undefined) enterGroup(item.groupKey)
  locate(item)
}
function connect({ source, target }) {
  const from = projection.value.nodes.find(node => node.id === source)
  const to = projection.value.nodes.find(node => node.id === target)
  if (!from || !to || !['group', 'frame'].includes(from.kind) || !['group', 'frame', 'portal'].includes(to.kind)) return
  store.connectDialogue(from.group, to.group, from.kind === 'frame' ? from.index : null, to.kind === 'frame' ? to.index : null)
}
function reroute() {
  const link = selectedLink.value
  if (!link || link.origin !== 'option' || link.readonly) return
  try {
    const sameGroup = targetGroup.value === link.groupKey
    const index = sameGroup && targetIndex.value !== '' ? Number(targetIndex.value) : null
    if (index !== null && (!Number.isInteger(index) || index < 0 || index >= groups.value[link.groupKey].length)) {
      message.warning(t('请选择有效的对话序号（从 0 开始）')); return
    }
    const next = connectionTarget(targetGroup.value, index)
    const field = fieldAt(store.currentModel, link.path)
    field.owner[field.key] = next
    selectedEdgeId.value = null
    message.success(t('已更新跳转目标'))
  } catch (error) { message.warning(t(error.message)) }
}
function edgeUpdate({ edge, connection }) {
  const links = projection.value.edges.find(item => item.id === edge.id)?.links
  if (links?.length !== 1 || links[0].origin !== 'option' || links[0].readonly || connection.source !== edge.source) return
  const target = projection.value.nodes.find(node => node.id === connection.target)
  if (!target || !['frame', 'group', 'portal'].includes(target.kind)) return
  selectedEdgeId.value = edge.id
  selectLink(links[0])
  targetGroup.value = target.group
  targetIndex.value = target.kind === 'frame' ? String(target.index) : ''
  reroute()
}
function removeJump() {
  const link = selectedLink.value
  if (!link || link.origin !== 'option' || link.readonly) return
  const field = fieldAt(store.currentModel, link.path)
  field.owner[field.key] = 'this'
  selectedEdgeId.value = null
  message.success(t('已取消跳转，选项保留并停在当前对话'))
}
function addGroup() {
  prompt.openInput({ title: t('新建剧情片段 (组)'), placeholder: 'chapter_1', onPositiveClick: value => {
    const key = value?.trim()
    if (!key) return
    if (Object.hasOwn(groups.value, key)) { message.warning(t('该组名已存在')); return }
    store.syncDialogueGroupOrder(groups.value)
    store.currentModel.dialogues = { ...groups.value, [key]: [] }
    enterGroup(key)
  } })
}
function renameGroup(key) {
  prompt.openInput({ title: t('重命名 Key'), defaultValue: key, placeholder: key, onPositiveClick: value => {
    const result = store.renameDialogueGroup(key, value)
    if (!result.ok) message.warning(t('该组名已存在或为空'))
    else if (analysis.value.diagnostics.some(item => ['mvel-ignored', 'dynamic-command'].includes(item.code))) message.warning(t('已更新静态跳转，请手动检查动态指令和 MVEL 中的组名'))
  } })
}
function deleteGroup(key) {
  const model = store.currentModel
  dialog.warning({ title: t('删除剧情片段'), content: t('删除后，指向该组的连线将标记为错误，修复后才能保存。'), onPositiveClick: () => {
    if (store.currentModel !== model) return
    if (store.deleteDialogueGroup(key)) { clearGraphSelection(); store.clearSelection() }
  } })
}
function addFrame() {
  if (scope.value === null) return
  const frame = new DialogueFrame()
  groups.value[scope.value].push(frame)
  selectFrame(scope.value, groups.value[scope.value].length - 1)
}
function copyFrame(data) {
  store.copyDialogueFrameToClipboard(data.frame)
  message.success(t('已复制对话'))
}
function pasteFrame() {
  if (scope.value === null) return
  const frame = store.getDialogueFrameFromClipboard()
  if (!frame) return
  frame._editorId = new DialogueFrame()._editorId
  if (store.replaceDialogueFrames(scope.value, [...groups.value[scope.value], frame])) selectFrame(scope.value, groups.value[scope.value].length - 1)
}
function deleteFrame(data) {
  const next = groups.value[data.group].filter((_, index) => index !== data.index)
  if (store.replaceDialogueFrames(data.group, next)) { clearGraphSelection(); store.clearSelection() }
}
function nodeText(data) {
  const frame = data.frame || data.frames?.[0]
  return store.getTranslatableLabel(frame?.dialogBox?.text) || t('( 空对话内容 )')
}
function rememberPosition({ nodes: moved }) {
  for (const node of moved) cache().positions[node.id] = { ...node.position }
}
async function fitInitialized() {
  if (!needsFit.value || !flow.getNodes.value.length || flow.getNodes.value.some(node => !node.dimensions.width)) return
  needsFit.value = false
  await flow.fitView({ padding: 0.22, maxZoom: 1, duration: 180 })
}
function rememberViewport(viewport) {
  if (!layingOut.value && !needsFit.value) cache().viewport = viewport
}
async function layout(force = false, fit = false) {
  const revision = ++generation
  const snapshot = projection.value
  const saved = cache()
  layingOut.value = true
  try {
    const hasPositions = !force && snapshot.nodes.every(node => saved.positions[node.id])
    const result = hasPositions ? null : await elk.layout({ id: 'root', layoutOptions: {
      'elk.algorithm': 'layered', 'elk.direction': scope.value === null ? 'RIGHT' : 'DOWN',
      'elk.spacing.nodeNode': '55', 'elk.layered.spacing.nodeNodeBetweenLayers': '100',
      'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX'
    }, children: snapshot.nodes.map(node => ({ id: node.id, width: 244, height: node.kind === 'frame' ? 185 : 145 })),
    edges: snapshot.edges.map(edge => ({ id: edge.id, sources: [edge.source], targets: [edge.target] })) })
    if (revision !== generation) return
    const positions = new Map(result?.children.map(node => [node.id, { x: node.x, y: node.y }]))
    nodes.value = snapshot.nodes.map(node => ({ id: node.id, type: 'story', data: node, position: !force && saved.positions[node.id] || positions.get(node.id), width: 244, height: node.kind === 'frame' ? 185 : 145, draggable: true }))
    edges.value = snapshot.edges.map(edge => ({ ...edge, type: 'story', data: { links: edge.links },
      label: edge.links.length > 1 ? `${edge.links.length} ${t('处跳转')}` : edge.links[0].implicit ? t('顺序推进') : edge.links[0].origin === 'option' ? t('选项') : t('可能跳转'),
      markerEnd: MarkerType.ArrowClosed, animated: false,
      updatable: edge.links.length === 1 && edge.links[0].origin === 'option' && !edge.links[0].readonly ? 'target' : false,
      class: edge.links.some(link => ['missing', 'external'].includes(link.kind)) ? 'invalid-edge' : edge.links.every(link => link.implicit) ? 'sequence-edge' : edge.links.some(link => link.possible) ? 'possible-edge' : '' }))
    saved.positions = Object.fromEntries(nodes.value.map(node => [node.id, node.position]))
    await nextTick()
    if (fit || !saved.viewport) { needsFit.value = true; await fitInitialized() }
    else await flow.setViewport(saved.viewport)
  } finally { if (revision === generation) layingOut.value = false }
}
watch(projection, () => layout(), { immediate: true })
watch(scope, () => { clearGraphSelection(); contextMenu.value = null })
watch([outgoing, edges], () => {
  const links = new Set(outgoing.value.map(link => link.id))
  for (const edge of edges.value) edge.data.runtimeNext = edge.links.some(link => links.has(link.id))
})
let lastFollowPosition = ''
watch(() => store.dialogueDebugFollow, () => { lastFollowPosition = '' })
watch(() => [bridge.debugState, nodes.value, store.dialogueDebugFollow, store.debuggingCurrentFile], async () => {
  if (!store.debuggingCurrentFile || !store.dialogueDebugFollow || !currentRun.value) return
  const state = currentRun.value
  if (scope.value !== null && scope.value !== state.group && groups.value[state.group]) {
    // Follow the runtime without stealing the inspector from a text field being edited.
    store.dialogueGraphGroupKey = state.group
    return
  }
  const key = JSON.stringify([layoutKey.value, state.group, state.index])
  if (key === lastFollowPosition) return
  const node = nodes.value.find(node => debugNodeState(node.data, state, store.currentFile?.resourceId, true))
  if (!node) return
  lastFollowPosition = key
  await nextTick()
  const zoom = Math.max(flow.getViewport().zoom, 0.55)
  await flow.setCenter(node.position.x + 122, node.position.y + 80, { zoom, duration: 220 })
})
watch(() => store.dialogueGraphFocus, async source => {
  if (!source) return
  if (source.groupKey !== undefined) enterGroup(source.groupKey)
  locate(source)
  await nextTick()
})
onMounted(() => { window.addEventListener('pointerdown', closeContext); window.addEventListener('keydown', closeContext) })
onBeforeUnmount(() => { generation++; elk.terminateWorker(); window.removeEventListener('pointerdown', closeContext); window.removeEventListener('keydown', closeContext) })
</script>

<template>
  <div ref="graphElement" class="story-graph flex h-full min-w-0 outline-none" tabindex="0" @mousedown.stop @wheel.stop @keydown="onGraphKeydown" @pointerdown="focusGraph">
    <aside class="story-sidebar bg-ui-surface border-r border-ui-line flex flex-col shrink-0">
      <div class="flex items-center justify-between gap-2 p-3 border-b border-ui-line">
        <strong class="text-xs">{{ t('对话组') }}</strong>
        <button class="story-icon" :title="t('新建剧情片段 (组)')" @click="addGroup"><Icon icon="lucide:plus" /></button>
      </div>
      <input v-model="search" class="story-search m-2" :placeholder="t('搜索对话组')" :aria-label="t('搜索对话组')" />
      <button class="story-group mx-2" :class="{ active: scope === null }" @click="store.dialogueGraphGroupKey = null">↗ {{ t('全部剧情') }}</button>
      <div class="flex-1 min-h-0 overflow-y-auto p-2 space-y-1">
        <div v-for="key in groupKeys" :key="key" class="story-group flex items-center gap-1" :class="{ active: scope === key, 'runtime-group': store.debuggingCurrentFile && currentRun?.group === key }" @contextmenu.prevent="openContext($event, { kind: 'group', group: key })">
          <button class="text-left min-w-0 flex-1 truncate py-1" @click="enterGroup(key)">{{ key }} <small class="text-ui-muted">{{ groups[key].length }}</small></button>
          <button class="story-icon" :title="t('重命名 Key')" @click="renameGroup(key)"><Icon icon="lucide:pencil" width="12" /></button>
          <button class="story-icon" :title="t('删除剧情片段')" @click="deleteGroup(key)"><Icon icon="lucide:trash-2" width="12" /></button>
        </div>
      </div>
      <p class="p-3 text-[11px] leading-relaxed text-ui-muted border-t border-ui-line">{{ t('拖动右侧连接点创建继续选项。拖动节点只调整布局。双击对话组进入子图。') }}</p>
      <p class="px-3 pb-3 text-[11px] leading-relaxed text-ui-muted">{{ t('选中节点或连线后按 Delete / Backspace 删除。跳转目标节点只删除对应跳转。') }}</p>
    </aside>
    <div class="flex-1 min-w-0 flex flex-col">
      <nav class="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-ui-line text-xs bg-ui-bg">
        <button class="text-ui-link" @click="store.dialogueGraphGroupKey = null">{{ t('全部剧情') }}</button>
        <span v-if="scope !== null" class="font-mono truncate">/ {{ scope }}</span>
        <span class="flex-1"></span>
        <button class="story-button flex items-center gap-1" :disabled="!selectedNode && !selectedBundle" :title="`${deleteLabel} · Delete / Backspace`" @click="deleteSelection"><Icon icon="lucide:trash-2" width="12" />{{ deleteLabel }}</button>
        <button v-if="scope !== null" class="story-button" @click="addFrame">+ {{ t('添加对话') }}</button>
        <button v-if="scope !== null && store.hasDialogueFrameClipboard" class="story-button" @click="pasteFrame">{{ t('粘贴') }}</button>
        <button class="story-button" :disabled="layingOut" @click="layout(true, true)">{{ t('自动布局') }}</button>
        <button class="story-button" :aria-label="t('缩小')" @click="flow.zoomOut({ duration: 120 })">−</button>
        <button class="story-button" :aria-label="t('放大')" @click="flow.zoomIn({ duration: 120 })">+</button>
        <button class="story-button" @click="flow.fitView({ padding: 0.2, duration: 180 })">{{ t('适应画布') }}</button>
      </nav>
      <section v-if="bridge.debugActive || bridge.debugState || debugIssue" class="story-debug border-b border-ui-line px-3 py-2 text-xs bg-ui-surface" aria-live="polite">
        <div class="flex flex-wrap items-center gap-2">
          <strong class="flex items-center gap-1"><Icon :icon="bridge.debugActive ? 'lucide:radio' : 'lucide:circle-stop'" />{{ bridge.debugStarting ? t('正在启动调试…') : bridge.debugActive ? t('调试中') : t('调试已结束') }}</strong>
          <code v-if="bridge.debugState" class="truncate">{{ bridge.debugState.resourceId }} / {{ bridge.debugState.group }} #{{ bridge.debugState.index }}</code>
          <span class="flex-1"></span>
          <span v-if="store.debuggingCurrentFile" class="text-ui-muted">{{ bridge.debugSyncing ? t('正在同步草稿…') : store.dialogueDebugPending ? t('草稿待同步') : t('草稿已同步') }}</span>
          <button v-if="store.debuggingCurrentFile" class="story-button" :class="{ active: store.dialogueDebugFollow }" :aria-pressed="store.dialogueDebugFollow" @click="store.dialogueDebugFollow = !store.dialogueDebugFollow">{{ t('跟随游戏') }}</button>
          <button v-if="currentRun && bridge.debugActive" class="story-button" @click="focusRuntime">{{ t('定位当前对话') }}</button>
          <button v-if="bridge.debugActive" class="story-button" @click="stopDebug">{{ t('结束调试') }}</button>
        </div>
        <p v-if="debugIssue" class="text-amber-600 mt-2">{{ debugIssue }} <button v-if="store.debuggingCurrentFile" class="story-button" @click="store.syncDialogueDebug">{{ t('重试同步') }}</button></p>
        <p v-if="bridge.debugActive && bridge.debugState && !currentRun" class="text-amber-600 mt-2">{{ t('游戏已跳到其他文件，当前图仅显示本文件') }}</p>
        <p v-if="store.debuggingCurrentFile" class="text-[10px] text-ui-muted mt-1">{{ t('实心标记是当前对话，虚线标记是可能的下一步，条件仍由游戏判断。文本即时更新，其他参数再次进入对话后生效。') }}</p>
        <details v-if="bridge.debugHistory.length" class="mt-2">
          <summary class="cursor-pointer text-ui-link">{{ t('运行路径') }} · {{ bridge.debugHistory.length }}</summary>
          <div class="flex flex-wrap gap-1 mt-2 max-h-20 overflow-auto"><code v-for="(step, index) in bridge.debugHistory" :key="step.sequence" class="story-trace">{{ index ? '→ ' : '' }}{{ step.group }} #{{ step.index }}</code></div>
        </details>
      </section>
      <div class="flex-1 min-h-0 relative">
        <VueFlow id="chatbox-dialogue-flow" v-model:nodes="nodes" v-model:edges="edges" :min-zoom="0.015" :max-zoom="2" :delete-key-code="null" :pan-on-scroll="false" :zoom-on-scroll="true" :zoom-on-pinch="true" :selection-on-drag="false" :elevate-edges-on-select="true" :only-render-visible-elements="true" @connect="connect" @edge-update="edgeUpdate" @node-click="selectNode" @node-double-click="({ node }) => enterGroup(node.data.group)" @edge-click="selectEdge" @pane-click="clearGraphSelection" @node-drag-stop="rememberPosition" @viewport-change-end="rememberViewport" @nodes-initialized="fitInitialized">
          <Background :gap="20" :size="1" pattern-color="rgb(var(--ui-line))" />
          <MiniMap pannable zoomable :width="130" :height="85" />
          <template #edge-story="edge"><StoryEdge v-bind="edge" /></template>
          <template #node-story="{ data }">
            <article class="story-node" :class="[data.kind, { selected: selectedNodeId === data.id, 'current-frame': data.frame && store.currentFrame === data.frame, 'runtime-current': debugNodeState(data, currentRun, store.currentFile?.resourceId, store.debuggingCurrentFile), 'runtime-next': runtimeNext(data) }]" @contextmenu.prevent.stop="openContext($event, data)">
              <Handle v-if="data.kind !== 'incoming'" type="target" :position="Position.Left" :connectable="['group', 'frame', 'portal'].includes(data.kind)" :aria-label="t('连线入口')" />
              <Handle v-if="['group', 'frame', 'incoming'].includes(data.kind)" type="source" :position="Position.Right" :connectable="data.kind !== 'incoming'" :aria-label="t('拖出连线')" />
              <div class="story-node-heading flex gap-2 items-center">
                <Icon v-if="debugNodeState(data, currentRun, store.currentFile?.resourceId, store.debuggingCurrentFile)" icon="lucide:play" class="runtime-marker" width="14" />
                <Icon :icon="data.kind === 'frame' ? 'lucide:message-square' : data.kind === 'end' ? 'lucide:flag' : 'lucide:folder-tree'" width="14" />
                <strong class="truncate flex-1">{{ data.kind === 'frame' ? `#${data.index}` : data.kind === 'end' ? t('结束对话') : data.group }}</strong>
                <span v-if="data.kind === 'group'" class="text-[10px]">{{ data.frames.length }}</span>
              </div>
              <template v-if="['group', 'frame'].includes(data.kind)">
                <p class="story-excerpt">{{ nodeText(data) }}</p>
                <div v-if="data.kind === 'frame'" class="flex flex-wrap gap-1 nodrag px-3 pb-2">
                  <button v-for="(label, part) in partNames" :key="part" class="story-part" @click.stop="selectFrame(data.group, data.index, part)">{{ label }}</button>
                </div>
                <div class="story-node-footer nodrag flex gap-2 items-center">
                  <span v-if="analysis.diagnostics.some(item => item.groupKey === data.group && (data.index === undefined || item.frameIndex === data.index))" class="text-amber-600" :title="t('检查此处的跳转')">△</span>
                  <button v-if="data.kind === 'group'" class="text-ui-link" @click.stop="enterGroup(data.group)">{{ t('进入组内') }} →</button>
                  <template v-else>
                    <button :title="t('复制')" @click.stop="copyFrame(data)"><Icon icon="lucide:copy" width="13" /></button>
                    <button :title="t('删除对话')" @click.stop="deleteFrame(data)"><Icon icon="lucide:trash-2" width="13" /></button>
                    <small class="ml-auto text-ui-muted">{{ (data.frame.options?.options || []).length }} {{ t('选项') }}</small>
                  </template>
                </div>
              </template>
              <div v-else class="p-3 text-xs text-ui-muted">
                <p>{{ data.kind === 'portal' ? t('跳转到其他组') : data.kind === 'incoming' ? t('来自其他组') : data.kind === 'missing' ? t('目标组不存在或为空') : data.kind === 'external' ? t('暂不支持跨文件跳转') : t('推进后关闭对话框') }}</p>
                <button v-if="['portal', 'incoming'].includes(data.kind)" class="story-button mt-2 nodrag" @click.stop="enterGroup(data.group)">{{ t('查看对话组') }} →</button>
              </div>
            </article>
          </template>
        </VueFlow>
        <div v-if="!nodes.length && !layingOut" class="absolute inset-0 flex flex-col gap-3 items-center justify-center pointer-events-none text-ui-muted text-sm">
          <span>{{ scope === null ? t('暂无剧情片段') : t('此片段暂无对话') }}</span>
          <button class="story-button pointer-events-auto" @click="scope === null ? addGroup() : addFrame()">+ {{ scope === null ? t('新建剧情片段 (组)') : t('添加对话') }}</button>
        </div>
        <div class="absolute bottom-3 left-3 flex items-center gap-2 text-[10px] text-ui-muted bg-ui-surface border border-ui-line p-2 pointer-events-none"><span>━ {{ t('选项') }}</span><span>┄ {{ t('可能跳转') }}</span><span>· {{ t('顺序推进') }}</span></div>
      </div>
      <section v-if="selectedBundle" class="story-detail border-t-2 border-ui-link bg-ui-surface p-3 text-xs overflow-auto">
        <div class="flex justify-between items-center mb-2"><strong>{{ t('连线来源') }} · {{ selectedBundle.links.length }}</strong><button class="story-icon" :aria-label="t('关闭')" @click="selectedEdgeId = null">×</button></div>
        <div class="flex flex-wrap gap-1 mb-2">
          <button v-for="link in selectedBundle.links" :key="link.id" class="story-button" :class="{ active: selectedLinkId === link.id }" @click="selectLink(link)">{{ link.groupKey }} #{{ link.frameIndex }} · {{ link.origin }} {{ link.optionIndex === undefined ? '' : `#${link.optionIndex}` }}</button>
        </div>
        <template v-if="selectedLink">
          <p class="font-mono text-[10px] break-all text-ui-muted mb-2">{{ selectedLink.themeId ? `${selectedLink.themeId} / ` : '' }}{{ selectedLink.path.join(' / ') }}</p>
          <div v-if="selectedLink.origin === 'option' && !selectedLink.readonly" class="flex flex-wrap gap-2 items-center">
            <label>{{ t('目标组') }} <select v-model="targetGroup" class="story-search"><option v-for="key in Object.keys(groups)" :key="key" :value="key">{{ key }}</option></select></label>
            <label v-if="targetGroup === selectedLink.groupKey">{{ t('对话序号') }} <input v-model="targetIndex" type="number" min="0" class="story-search w-20" /></label>
            <button class="story-button" @click="reroute">{{ t('更新目标') }}</button><button class="story-button" @click="removeJump">{{ t('取消跳转') }}</button>
          </div>
          <p v-else>{{ selectedLink.implicit ? t('顺序推进由游戏决定，无需写入 JSON。') : selectedLink.readonly ? t('此跳转来自主题，请在主题文件中修改。') : t('已定位右侧原始参数，可直接修改事件或指令。') }}</p>
          <button v-if="!selectedLink.readonly" class="story-button mt-2" @click="deleteLinks([selectedLink])">{{ t('删除跳转') }}</button>
          <pre v-if="sourceEvent" class="mt-2 text-[10px] whitespace-pre-wrap break-all">{{ JSON.stringify(sourceEvent, null, 2) }}</pre>
        </template>
        <p v-else class="text-ui-muted">{{ t('这条线汇总了多处跳转，请先选择具体来源。') }}</p>
      </section>
      <section v-if="store.dialogueDiagnosticsOpen" class="story-diagnostics border-t border-ui-line bg-ui-bg text-xs">
        <div class="flex justify-between p-2 border-b border-ui-line"><strong>{{ t('跳转检查') }} · {{ analysis.diagnostics.length }}</strong><button @click="store.dialogueDiagnosticsOpen = false">×</button></div>
        <p class="px-3 py-2 text-ui-muted">{{ t('实线表示已知选项目标，虚线表示事件或条件可能触发。MVEL 不参与分析。') }}</p>
        <div class="overflow-auto max-h-36">
          <button v-for="(item, index) in analysis.diagnostics" :key="index" class="block w-full text-left px-3 py-2 border-t border-ui-line hover:bg-ui-surface" @click="locateDiagnostic(item)">
            <span :class="item.severity === 'error' ? 'text-red-500' : 'text-amber-600'">{{ item.severity === 'error' ? '⛔' : '△' }}</span> {{ item.groupKey || '' }} {{ item.frameIndex === undefined ? '' : `#${item.frameIndex}` }} · {{ diagnosticText(item) }}
            <code class="block text-[10px] text-ui-muted mt-1 break-all">{{ item.path.join(' / ') }}</code>
          </button>
        </div>
      </section>
    </div>
  </div>
  <Teleport to="body">
    <div v-if="contextMenu" class="story-context" role="menu" :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }" @contextmenu.prevent @keydown="onGraphKeydown" @keydown.esc="contextMenu = null">
      <code class="block text-xs text-ui-muted mb-2 truncate">{{ contextMenu.group }} {{ contextMenu.index === undefined ? '' : `#${contextMenu.index}` }}</code>
      <button v-if="['group', 'frame', 'portal', 'incoming'].includes(contextMenu.data.kind)" role="menuitem" class="story-context-action" :disabled="!bridge.connected || bridge.debugStarting || !groups[contextMenu.group]?.[contextMenu.index]" @click="jumpToDialogue"><Icon icon="lucide:play" width="15" />{{ t('跳转对话') }}</button>
      <button role="menuitem" class="story-context-action" @click="deleteFromContext"><Icon icon="lucide:trash-2" width="15" />{{ contextMenu.data.kind === 'frame' ? t('删除对话') : contextMenu.data.kind === 'group' ? t('删除剧情片段') : t('删除跳转') }} <kbd class="ml-auto text-[10px] text-ui-muted">Delete</kbd></button>
      <p v-if="['group', 'frame', 'portal', 'incoming'].includes(contextMenu.data.kind)" class="text-[10px] text-ui-muted mt-2 leading-relaxed">{{ t('使用当前草稿在游戏中交互测试，会执行对话中的指令与脚本。') }}</p>
    </div>
  </Teleport>
</template>

<style scoped>
.story-sidebar { width: 190px; }
.story-search { background: rgb(var(--ui-bg)); border: 1px solid rgb(var(--ui-line)); padding: 6px 8px; font-size: 12px; min-width: 0; color: rgb(var(--ui-text)); }
.story-search:focus { outline: 2px solid rgb(var(--ui-link)); outline-offset: -1px; }
.story-icon { display: inline-flex; align-items: center; justify-content: center; min-width: 22px; min-height: 24px; }
.story-icon:hover { background: rgb(var(--ui-inset)); color: rgb(var(--ui-link)); }
.story-button { border: 1px solid rgb(var(--ui-line)); background: rgb(var(--ui-bg)); padding: 4px 7px; font-size: 11px; }
.story-button:hover, .story-button.active { border-color: rgb(var(--ui-link)); color: rgb(var(--ui-link)); }
.story-button:disabled { opacity: .5; }
.story-group { padding: 5px 7px; font-size: 12px; border: 1px solid transparent; }
.story-group:hover { background: rgb(var(--ui-inset)); }
.story-group.active { border-color: rgb(var(--ui-link)); background: rgb(var(--ui-secondary) / .18); color: rgb(var(--ui-link)); }
.story-node { width: 244px; background: rgb(var(--ui-bg)); border: 2px solid rgb(var(--ui-border)); box-shadow: 4px 4px 0 rgb(var(--ui-border)); color: rgb(var(--ui-text)); font-size: 12px; }
.story-node.selected, .story-node.current-frame { border-color: rgb(var(--ui-link)); box-shadow: 4px 4px 0 rgb(var(--ui-link) / .6); }
.story-node.runtime-current { border-color: rgb(var(--ui-link)); outline: 4px solid rgb(var(--ui-secondary) / .7); outline-offset: 4px; }
.story-node.runtime-current .story-node-heading, .runtime-group { background: rgb(var(--ui-secondary) / .25); }
.story-node.runtime-next:not(.runtime-current) { outline: 2px dashed rgb(var(--ui-link) / .65); outline-offset: 4px; }
.runtime-marker { fill: currentColor; color: rgb(var(--ui-link)); }
.story-trace { padding: 3px 5px; background: rgb(var(--ui-inset)); }
.story-context { position: fixed; z-index: 1000; width: 260px; padding: 12px; background: rgb(var(--ui-bg)); color: rgb(var(--ui-text)); border: 2px solid rgb(var(--ui-border)); box-shadow: 5px 5px 0 rgb(var(--ui-border)); }
.story-context-action { display: flex; align-items: center; gap: 8px; padding: 8px; width: 100%; text-align: left; font-size: 13px; background: rgb(var(--ui-secondary) / .25); }
.story-context-action:disabled { opacity: .4; cursor: not-allowed; }
.story-node-heading { padding: 10px 12px; border-bottom: 1px solid rgb(var(--ui-line)); background: rgb(var(--ui-surface)); font-family: monospace; }
.story-node.group .story-node-heading { background: rgb(var(--ui-primary) / .18); }
.story-node.portal, .story-node.incoming { border-style: dashed; }
.story-node.missing, .story-node.external { border-color: #d15b52; }
.story-excerpt { padding: 12px; height: 58px; overflow: hidden; line-height: 18px; overflow-wrap: anywhere; }
.story-node-footer { border-top: 1px solid rgb(var(--ui-line)); padding: 7px 12px; }
.story-part { padding: 3px 4px; background: rgb(var(--ui-inset)); border: 1px solid rgb(var(--ui-line)); font-size: 10px; }
.story-part:hover { color: rgb(var(--ui-link)); }
.story-detail { max-height: 215px; }
.story-diagnostics { max-height: 245px; flex-shrink: 0; }
:deep(.vue-flow__handle) { width: 12px; height: 12px; background: rgb(var(--ui-secondary)); border: 2px solid rgb(var(--ui-border)); border-radius: 0; }
:deep(.vue-flow__edge-path) { stroke: rgb(var(--ui-link)); stroke-width: 2px; }
:deep(.vue-flow__edge.selected .vue-flow__edge-path) { stroke-width: 4px; }
:deep(.possible-edge .vue-flow__edge-path) { stroke-dasharray: 7 4; }
:deep(.sequence-edge .vue-flow__edge-path) { stroke: rgb(var(--ui-muted)); stroke-dasharray: 2 5; }
:deep(.invalid-edge .vue-flow__edge-path) { stroke: #d15b52; }
:deep(.vue-flow__edge-text) { fill: rgb(var(--ui-text)); font-size: 10px; }
:deep(.vue-flow__edge-textbg) { fill: rgb(var(--ui-bg)); }
:deep(.vue-flow__minimap) { background: rgb(var(--ui-surface)); border: 1px solid rgb(var(--ui-line)); }
:deep(.vue-flow__minimap-mask) { fill: rgb(var(--ui-muted) / .15); }
:deep(.vue-flow__minimap-node) { fill: rgb(var(--ui-secondary)); }
@media (max-width: 1100px) { .story-sidebar { width: 140px; } }
</style>
