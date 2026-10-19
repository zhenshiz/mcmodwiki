import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { setImmediate } from 'node:timers'
import { createServer } from 'vite'
import { reactive } from 'vue'
import { removeDialogueTransitions } from '../../src/views/more/chatbox/flow/dialogueFlow.js'

let server, store, dialogueService
const writes = [], notices = []
before(async () => {
  globalThis.__flowStoreTest = {
    bridge: { connected: true, serverSession: 'test-world', snapshot: { translations: {} }, options: () => [],
      request: async (type, payload) => { if (type === 'files.write') writes.push(payload); return { savePath: 'test.json', revision: 'saved' } },
      refresh: async () => {} },
    message: Object.fromEntries(['success', 'warning', 'error'].map(type => [type, text => notices.push([type, text])]))
  }
  server = await createServer({ configFile: false, logLevel: 'silent', server: { middlewareMode: true, hmr: false, watch: null }, resolve: { alias: [
    { find: './gameBridge.js', replacement: 'test:bridge' },
    { find: /^@\/languages(?:\/index\.js)?$/, replacement: 'test:languages' },
    { find: '@/components/register/useMessage.js', replacement: 'test:messages' },
    { find: '@/components/register/useDialog.js', replacement: 'test:dialog' },
    { find: '@/stores/index.js', replacement: 'test:stores' },
    { find: fileURLToPath(new URL('../../src/stores/modules/gameBridge.js', import.meta.url)), replacement: 'test:bridge' },
    { find: '@', replacement: fileURLToPath(new URL('../../src', import.meta.url)) }
  ] }, plugins: [{ name: 'flow-test-runtime', resolveId(id) {
    if (id === './gameBridge.js') return 'test:bridge'
    if (id.startsWith('test:')) return id
  }, load(id) {
    if (id === 'test:languages') return 'export const t = value => value; export const $t = value => value; export const i18nScope = { activeLanguage: "zh-CN" }'
    if (id === 'test:messages') return 'export const useMessage = () => globalThis.__flowStoreTest.message'
    if (id === 'test:dialog') return 'export const useDialog = () => ({ warning: () => {} })'
    if (id === 'test:stores') return 'export const useChatBoxEditorStore = () => globalThis.__flowStoreTest.store'
    if (id === 'test:bridge') return 'export const useGameBridgeStore = () => globalThis.__flowStoreTest.bridge'
  } }] })
  const { createPinia } = await server.ssrLoadModule('pinia')
  globalThis.__flowStoreTest.bridge = reactive(globalThis.__flowStoreTest.bridge)
  const { useChatBoxEditorStore } = await server.ssrLoadModule('/src/stores/modules/chatboxEditor.js')
  ;({ dialogueService } = await server.ssrLoadModule('/src/views/more/chatbox/component/tree/chatboxSerialization.js'))
  store = useChatBoxEditorStore(createPinia())
  globalThis.__flowStoreTest.store = store
})
after(async () => { await server?.close(); delete globalThis.__flowStoreTest })

function open(dialogues) {
  store.currentFile = { resourceId: 'test:story', kind: 'dialogue', revision: 'before', serverSession: 'test-world' }
  store.currentModel = dialogueService.parseDialogue(JSON.stringify({ dialogues }))
  store.viewMode = 'dialogue'
  store.dialogueDiagnosticsOpen = false
}
test('dragging a group edge appends a real editable option on the last frame without changing existing options', () => {
  open({ start: [{ dialogBox: { text: 'first' } }, { options: [{ text: 'stay', next: 'this', custom: 7 }] }], end: [{ dialogBox: { text: 'last' } }] })
  const before = JSON.stringify(store.currentModel.dialogues.start[1].options.options[0])
  assert.equal(store.connectDialogue('start', 'end'), true)
  const options = store.currentModel.dialogues.start[1].options.options
  assert.equal(options.length, 2)
  assert.equal(JSON.stringify(options[0]), before)
  assert.equal(options[1].next, 'end')
  assert.equal(store.selectedComponent, options[1])
  assert.equal(store.currentFrame, store.currentModel.dialogues.start[1])
  assert.equal(store.connectDialogue('start', 'end', 0), true)
  assert.equal(store.currentModel.dialogues.start[0].options.options[0].next, 'end')
})
test('empty groups cannot create dangling edges and reserved names cannot become ambiguous option targets', () => {
  open({ start: [{}], empty: [], this: [{}] })
  assert.equal(store.connectDialogue('start', 'empty'), false)
  assert.equal(store.connectDialogue('start', 'this'), false)
  assert.equal(store.currentModel.dialogues.start[0].options.options.length, 0)
})
test('shared save action rejects invalid targets for buttons and shortcuts, retains draft and writes valid JSON once', async () => {
  writes.length = 0
  open({ start: [{ command: 'chatbox skip test:other end' }], end: [{}] })
  const draft = JSON.stringify(store.currentModel)
  assert.equal(await store.saveProject(), false)
  assert.equal(writes.length, 0)
  assert.equal(JSON.stringify(store.currentModel), draft)
  assert.equal(store.dialogueDiagnosticsOpen, true)
  store.currentModel.dialogues.start[0].command = 'chatbox skip test:story missing'
  assert.equal(await store.saveProject(), false)
  assert.equal(writes.length, 0)
  store.currentModel.dialogues.start[0].command = 'chatbox skip test:story end'
  assert.equal(await store.saveProject(), true)
  assert.equal(writes.length, 1)
  assert.equal(JSON.parse(writes[0].content).dialogues.start[0].command, 'chatbox skip test:story end')
  assert.equal(store.checkDirty(), false)
  store.currentModel = null
  store.currentDialogue = '{"dialogues":{"start":[{"options":[{"next":"missing"}]}]}}'
  assert.equal(await store.saveProject(), false, 'Raw JSON fallback must share validation')
  assert.equal(writes.length, 1)
})
test('hydration preserves clickable option metadata and video events with a valid default start trigger', () => {
  open({ start: [{ options: [{ next: 'start', click: { type: 'command', value: 'say hi' } }], video: { path: 'test.mp4', renderEvents: [{ trigger: 'start', type: 'jump', value: 'start' }] } }] })
  const frame = store.currentModel.dialogues.start[0]
  assert.ok(frame.options.options[0].click.constructor.getFieldConfigs().type)
  assert.equal(JSON.parse(JSON.stringify(frame.video)).renderEvents[0].trigger, 'start')
  assert.ok(frame.video.constructor.getFieldConfigs().renderEvents)
})

test('graph deletion edits hydrated option and portrait wrappers and saves no external jump', async () => {
  open({ start: [{ options: [{ text: 'Keep', next: 'missing' }], portrait: [{ id: 'actor', renderEvents: [{ trigger: 'start', type: 'COMMAND', value: 'chatbox skip other:story start; say keep' }] }] }], end: [{}] })
  const links = store.dialogueAnalysis.transitions.filter(link => ['missing', 'external'].includes(link.kind))
  removeDialogueTransitions(store.currentModel, links)
  assert.equal(store.currentModel.dialogues.start[0].options.options[0].next, 'this')
  assert.equal(store.currentModel.dialogues.start[0].portrait.portrait[0].renderEvents[0].value, ' say keep')
  assert.equal(store.dialogueAnalysis.diagnostics.some(item => item.severity === 'error'), false)
  assert.equal(await store.saveProject(), true)
  const content = JSON.parse(writes.at(-1).content)
  assert.equal(content.dialogues.start[0].options[0].text, 'Keep')
  assert.equal(content.dialogues.start[0].options[0].next, 'this')
  assert.equal(content.dialogues.start[0].portrait[0].renderEvents[0].value, ' say keep')
})

test('deleting a selected frame clears the inspector and preserves following frames', () => {
  open({ start: [{ dialogBox: { text: 'delete' }, renderEvents: [{ type: 'JUMP', value: '0', trigger: 'start' }] }, { dialogBox: { text: 'keep' } }] })
  const [removed, retained] = store.currentModel.dialogues.start
  store.selectDialoguesComponent(removed, removed.constructor, 'basic')
  assert.equal(store.replaceDialogueFrames('start', [retained], true), true)
  assert.equal(store.currentModel.dialogues.start[0], retained)
  assert.equal(store.currentModel.dialogues.start.length, 1)
  assert.equal(store.currentFrame, null)
  assert.equal(store.selectedComponent, null)
})

test('save waits for a referenced theme before validating its read-only event targets', async () => {
  const bridge = globalThis.__flowStoreTest.bridge
  const previous = bridge.request
  let resolveTheme
  bridge.request = (type, payload) => type === 'files.read'
    ? new Promise(resolve => { resolveTheme = resolve }) : previous(type, payload)
  try {
    writes.length = 0
    open({ start: [{}] })
    store.currentModel.theme = 'test:theme'
    const saving = store.saveProject()
    await new Promise(resolve => setImmediate(resolve))
    assert.equal(typeof resolveTheme, 'function')
    assert.equal(writes.length, 0)
    resolveTheme({ content: JSON.stringify({ dialogBox: { renderEvents: [{ trigger: 'start', type: 'command', value: 'chatbox skip other:story start' }] } }) })
    assert.equal(await saving, false)
    assert.equal(writes.length, 0)
    assert.ok(store.dialogueAnalysis.diagnostics.some(item => item.code === 'cross-file'))
  } finally { bridge.request = previous }
})

test('starting node debugging sends an unsaved draft at the requested position and updates text without saving', async () => {
  const bridge = globalThis.__flowStoreTest.bridge
  const sent = []
  bridge.snapshot.dialogueDebug = true
  bridge.startDebug = async payload => {
    sent.push(['start', payload])
    bridge.debugFileId = payload.resourceId; bridge.debugSession = 'debug-test'; bridge.debugActive = true
  }
  bridge.updateDebug = async payload => { sent.push(['update', payload]) }
  bridge.stopDebug = async () => { bridge.debugActive = false }
  open({ start: [{ dialogBox: { text: 'first' } }, { dialogBox: { text: 'second' } }] })
  const writeCount = writes.length
  await store.startDialogueDebug('start', 1)
  assert.equal(sent[0][0], 'start')
  assert.equal(sent[0][1].index, 1)
  assert.equal(sent[0][1].group, 'start')
  store.currentModel.dialogues.start[1].dialogBox.text = 'edited while playing'
  await new Promise(resolve => setTimeout(resolve, 240))
  assert.equal(sent.length, 2)
  assert.equal(JSON.parse(sent[1][1].content).dialogues.start[1].dialogBox.text, 'edited while playing')
  assert.equal(writes.length, writeCount)
  assert.equal(store.checkDirty(), true)
  store.currentModel.dialogues.start[0].options.options.push({ next: 'missing' })
  await new Promise(resolve => setTimeout(resolve, 240))
  assert.equal(sent.length, 2, 'invalid draft must not replace the last playable version')
  assert.ok(store.dialogueDebugIssue)
  bridge.debugActive = false
})
