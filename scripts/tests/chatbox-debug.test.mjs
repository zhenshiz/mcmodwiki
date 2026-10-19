import { test } from 'node:test'
import assert from 'node:assert/strict'
import { acceptsDebugState, sameDebugPosition, debugNodeState } from '../../src/views/more/chatbox/bridge/dialogueDebug.js'

test('debug positions reject stale sessions, duplicate sequences and malformed runtime coordinates', () => {
  const packet = { event: 'debug.state', session: 'run', sequence: 2, version: 1, resourceId: 'test:story', group: 'start', index: 0 }
  assert.equal(acceptsDebugState(packet, 'run', 1), true)
  for (const patch of [{ session: 'old' }, { sequence: 1 }, { index: -1 }, { index: '0' }, { version: 0 }, { resourceId: null }]) {
    assert.equal(acceptsDebugState({ ...packet, ...patch }, 'run', 1), false)
  }
})

test('runtime highlighting is independent of inspector selection and only applies to the active file', () => {
  const state = { resourceId: 'test:story', group: 'start', index: 1 }
  assert.equal(debugNodeState({ kind: 'group', group: 'start' }, state, 'test:story', true), true)
  assert.equal(debugNodeState({ kind: 'frame', group: 'start', index: 1 }, state, 'test:story', true), true)
  assert.equal(debugNodeState({ kind: 'frame', group: 'start', index: 0 }, state, 'test:story', true), false)
  assert.equal(debugNodeState({ kind: 'frame', group: 'start', index: 1 }, state, 'test:other', true), false)
  assert.equal(debugNodeState({ kind: 'portal', group: 'start', index: 1 }, state, 'test:story', true), false)
  assert.equal(debugNodeState({ kind: 'group', group: 'start' }, state, 'test:story', false), false)
  assert.equal(sameDebugPosition(state, { ...state, version: 2 }), true)
  assert.equal(sameDebugPosition(state, { ...state, group: 'end' }), false)
})
