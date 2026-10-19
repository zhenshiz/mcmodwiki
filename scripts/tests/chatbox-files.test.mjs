import { test } from 'node:test'
import assert from 'node:assert/strict'
import { gameFileTree, gameFileRequest } from '../../src/views/more/chatbox/bridge/gameFiles.js'

test('game files retain their server IDs and source metadata in the namespaced tree', () => {
  const files = [
    { kind: 'theme', resourceId: 'example:menu/default', source: 'mod/example', saveMode: 'override' },
    { kind: 'dialogue', resourceId: 'example:menu/start' },
    { kind: 'theme', resourceId: 'other:menu/default' },
  ]
  const tree = gameFileTree(files, 'world-a')
  const themes = tree[0].children[0].children.find(node => node.name === 'theme')
  const theme = themes.children[0].children[0]
  assert.equal(theme.path, 'example/chatbox/theme/menu/default.json')
  assert.equal(theme.source, 'mod/example')
  assert.equal(theme.saveMode, 'override')
  assert.deepEqual(gameFileRequest(theme, 'world-a'), { kind: 'theme', resourceId: 'example:menu/default', serverSession: 'world-a' })
  assert.equal(tree.length, 2)
})

test('a stale editor buffer cannot be written to another game server session', () => {
  const file = { kind: 'theme', resourceId: 'test:default', serverSession: 'world-a' }
  assert.throws(() => gameFileRequest(file, 'world-b'), /重新读取/)
  assert.throws(() => gameFileRequest(file, ''), /重新读取/)
})
