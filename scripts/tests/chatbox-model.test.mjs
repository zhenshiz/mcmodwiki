import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

let server
let models
let themeService

before(async () => {
  // Load the real models and importer while replacing browser-only runtime services.
  server = await createServer({
    configFile: false,
    logLevel: 'silent',
    server: { middlewareMode: true, hmr: false, watch: null },
    resolve: {
      alias: [
        { find: /^@\/languages(?:\/index\.js)?$/, replacement: 'test:languages' },
        { find: '@/stores/index.js', replacement: 'test:stores' },
        { find: '@', replacement: fileURLToPath(new URL('../../src', import.meta.url)) }
      ]
    },
    plugins: [{
      name: 'chatbox-model-test-runtime',
      resolveId(id) { if (id.startsWith('test:')) return id },
      load(id) {
        if (id === 'test:languages') return 'export const t = value => value; export const $t = value => value'
        if (id === 'test:stores') return 'export const useChatBoxEditorStore = () => { throw new Error("Unexpected store access") }'
      }
    }]
  })
  models = await server.ssrLoadModule('/src/assets/more/chatbox/chatboxTheme.js')
  ;({ themeService } = await server.ssrLoadModule('/src/views/more/chatbox/component/tree/chatboxSerialization.js'))
})

after(async () => { await server?.close() })

test('importing and exporting a 1.1.5 theme preserves conditional component events', () => {
  const event = { trigger: 'check', condition: 'player.health > 0', type: 'mvel', value: 'player.name' }
  const source = {
    dialogBox: { renderEvents: [event] },
    option: { renderEvents: [event] },
    keyPrompt: { renderEvents: [event] },
    functionalButton: [{ type: 'LOG', renderEvents: [event] }],
    portrait: { actor: { type: 'TEXTURE', widthReference: 'PIXEL', heightReference: 'SCREEN_WIDTH', renderEvents: [event] } }
  }
  const parsed = themeService.parseTheme(JSON.stringify(source))
  const exported = JSON.parse(JSON.stringify(parsed))
  for (const component of [exported.dialogBox, exported.option, exported.keyPrompt, exported.functionalButton[0], exported.portrait.actor]) {
    assert.deepEqual(component.renderEvents, [event])
  }
  assert.equal(exported.portrait.actor.widthReference, 'PIXEL')
  assert.equal(exported.portrait.actor.heightReference, 'SCREEN_WIDTH')
})

test('theme event inspectors expose the conditions and event types supported by the game', () => {
  for (const EventClass of [models.ThemeRenderEvent, models.ThemePortraitRenderEvent]) {
    const fields = EventClass.getFieldConfigs()
    assert.ok(fields.condition)
    for (const value of ['command', 'mvel', 'lock', 'unlock', 'set_normal']) {
      assert.ok(fields.type.props.options.some(option => option.value === value), value)
    }
  }
  const event = new models.ThemeRenderEvent()
  assert.equal(JSON.parse(JSON.stringify(event)).condition, undefined, 'Empty conditions remain optional')
})

test('locked item portraits can edit both item variants and export an explicit unlocked state', () => {
  const event = { trigger: 'check', condition: "player.hasItem('diamond')", type: 'set_normal', value: '@s' }
  const parsed = themeService.parseTheme(JSON.stringify({
    portrait: { item: {
      type: 'item', texture: 'minecraft:diamond_ore', hoverTexture: 'minecraft:coal',
      isLock: true, lockTexture: 'minecraft:barrier', itemCount: 64, renderEvents: [event]
    } }
  }))
  const item = parsed.portrait.item
  const fields = Object.values(item.constructor.getFieldConfigs()).filter(field => !field.showIf || field.showIf(item))
  const lockToggle = fields.find(field => field.modelKey === 'isLock')
  const lockedItem = fields.find(field => field.modelKey === 'lockTexture')
  const normalItem = fields.find(field => field.modelKey === 'texture')
  assert.ok(lockToggle, 'The inspector must expose the lock state that overrides the normal item')
  assert.ok(lockedItem, 'The inspector must expose the currently rendered locked item')
  assert.equal(lockedItem.props.dataSource, normalItem.props.dataSource, 'Both item variants use the game item registry')
  assert.equal(item[lockedItem.modelKey], 'minecraft:barrier')

  item[lockToggle.modelKey] = false
  const exported = JSON.parse(JSON.stringify(parsed)).portrait.item
  assert.equal(exported.isLock, false, 'Unlocking must be sent explicitly to the game')
  assert.equal(exported.texture, 'minecraft:diamond_ore')
  assert.equal(exported.hoverTexture, 'minecraft:coal')
  assert.equal(exported.lockTexture, 'minecraft:barrier')
  assert.equal(exported.itemCount, 64)
  assert.deepEqual(exported.renderEvents, [event], 'Preview state controls must not discard conditional events')
})
