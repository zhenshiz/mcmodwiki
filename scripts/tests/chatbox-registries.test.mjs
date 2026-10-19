import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

let server
let bridge
let gameRegistries
const previousWebSocket = globalThis.WebSocket
const registryTypes = ['ITEM', 'BLOCK', 'EFFECT', 'ATTRIBUTE', 'ENTITY', 'LIVING_ENTITY',
  'ENCHANTMENT', 'BIOME', 'SOUND', 'PARTICLE', 'FLUID', 'ITEM_TAG', 'BLOCK_TAG',
  'ENTITY_TAG', 'ENCHANTMENT_TAG', 'BIOME_TAG']

class GameSocket {
  constructor() { queueMicrotask(() => { this.readyState = 1; this.onopen() }) }
  send(text) {
    const request = JSON.parse(text)
    let data = {}
    if (request.type === 'snapshot') data = { protocol: 1, translations: {}, registries: gameRegistries }
    if (request.type === 'files.list') data = { files: [], serverSession: 'registry-test-world' }
    queueMicrotask(() => this.onmessage({ data: JSON.stringify({ id: request.id, ok: true, data }) }))
  }
  close() { this.readyState = 3; this.onclose?.() }
}

before(async () => {
  globalThis.WebSocket = GameSocket
  server = await createServer({
    configFile: false,
    logLevel: 'silent',
    server: { middlewareMode: true, hmr: false, watch: null },
    resolve: { alias: { '@': fileURLToPath(new URL('../../src', import.meta.url)) } }
  })
  const { createPinia } = await server.ssrLoadModule('pinia')
  const { useGameBridgeStore } = await server.ssrLoadModule('/src/stores/modules/gameBridge.js')
  bridge = useGameBridgeStore(createPinia())
})

after(async () => {
  bridge?.disconnect()
  globalThis.WebSocket = previousWebSocket
  await server?.close()
})

test('registry suggestions follow the connected game, refresh and disconnect without a static fallback', async () => {
  for (const type of registryTypes) assert.deepEqual(bridge.options(type), [])
  gameRegistries = Object.fromEntries(registryTypes.map(type => [type, [{
    label: `模组 ${type}`,
    value: `${type.endsWith('_TAG') ? '#' : ''}test_mod:${type.toLowerCase()}`
  }]]))
  gameRegistries.ITEM[0].itemId = 'test_mod:item'
  gameRegistries.EFFECT[0].textureId = 'test_mod:textures/mob_effect/test.png'
  await bridge.connect('ws://127.0.0.1:12345', 'test-pairing-code')
  for (const type of registryTypes) assert.deepEqual(bridge.options(type), gameRegistries[type], type)
  assert.deepEqual(bridge.options('MISSING_REGISTRY'), [])

  gameRegistries = { ITEM: [{ label: '重载后的物品', value: 'new_mod:replacement' }] }
  await bridge.refresh()
  assert.equal(bridge.options('ITEM')[0].value, 'new_mod:replacement')
  assert.deepEqual(bridge.options('BLOCK_TAG'), [], 'Removed tags must not persist after a refresh')

  bridge.disconnect()
  assert.equal(bridge.snapshot, null)
  for (const type of registryTypes) assert.deepEqual(bridge.options(type), [], type)
})
