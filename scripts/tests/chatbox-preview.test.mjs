import { test } from 'node:test'
import assert from 'node:assert/strict'
import { acceptsPreviewFrame, previewComponentRect, previewComponentTarget } from '../../src/views/more/chatbox/bridge/previewFrames.js'

test('preview frames reject stale drafts, duplicate frames and invalid image metadata', () => {
  const frame = { event: 'preview.frame', revision: 'current', sequence: 2, width: 1280, height: 720, guiWidth: 427, guiHeight: 240, components: [], url: 'data:image/png;base64,aA==' }
  assert.equal(acceptsPreviewFrame(frame, 'current', 1), true)
  assert.equal(acceptsPreviewFrame(frame, 'old', 1), false)
  assert.equal(acceptsPreviewFrame(frame, 'current', 2), false)
  assert.equal(acceptsPreviewFrame({ ...frame, guiWidth: 0 }, 'current'), false)
  assert.equal(acceptsPreviewFrame({ ...frame, url: 'https://example.com/frame.png' }, 'current'), false)
})

test('drop bounds follow the latest draft before Minecraft returns a frame and settle without jumping', () => {
  const frame = { guiWidth: 480, guiHeight: 256 }
  const target = { x: 25, y: -5 }
  const old = { x: 96, y: 128, width: 120, height: 40, positionX: 20, positionY: 0, target }
  const expected = { x: 120, y: 115.2, width: 120, height: 40 }
  assert.deepEqual(previewComponentRect(old, frame), expected)
  assert.deepEqual(previewComponentRect({ ...old, ...expected, positionX: 25, positionY: -5 }, frame), expected)
  assert.deepEqual(previewComponentRect({ ...old, positionX: undefined, positionY: undefined }, frame), { x: 96, y: 128, width: 120, height: 40 })
})

test('key prompts map to the editable draft and support immediate drag feedback', () => {
  const model = { keyPrompt: { x: 1, y: 2 }, portrait: { actor: {} }, functionalButton: [{}] }
  const bounds = { kind: 'keyPrompt', key: '', x: 4, y: 6, width: 280, height: 18, positionX: 1, positionY: 2 }
  const target = previewComponentTarget(model, bounds)
  assert.equal(target, model.keyPrompt)
  target.x = 11
  target.y = 7
  assert.deepEqual(previewComponentRect({ ...bounds, target }, { guiWidth: 400, guiHeight: 300 }), { x: 44, y: 21, width: 280, height: 18 })
  assert.equal(previewComponentTarget(model, { kind: 'portrait', key: 'actor' }), model.portrait.actor)
  assert.equal(previewComponentTarget(model, { kind: 'functionalButton', key: '0' }), model.functionalButton[0])
  assert.equal(previewComponentTarget(model, { kind: 'portrait', key: 'missing' }), undefined)
})
