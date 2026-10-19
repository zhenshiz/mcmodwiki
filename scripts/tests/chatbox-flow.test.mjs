import { test } from 'node:test'
import assert from 'node:assert/strict'
import { analyzeDialogue, connectionTarget, fieldAt, parseJumpCommands, reindexFrameReferences, renameGroupReferences, removeDialogueTransitions } from '../../src/views/more/chatbox/flow/dialogueFlow.js'
import { projectFlow } from '../../src/views/more/chatbox/flow/flowProjection.js'

const context = { fileId: 'test:story' }
const event = (type, value, trigger = 'start', extra = {}) => ({ type, value, trigger, ...extra })
const frame = (extra = {}) => ({ dialogBox: { text: 'hello' }, ...extra })

test('main graph aggregates every frame and the subgraph keeps exact origins and incoming portals', () => {
  const model = { dialogues: {
    intro: [frame({ options: [{ text: 'a', next: 'end' }, { text: 'b', next: 'end' }] }), frame({ renderEvents: [event('jump', 'end')] })],
    end: [frame()]
  } }
  const before = JSON.stringify(model)
  const analysis = analyzeDialogue(model, context)
  const main = projectFlow(model, analysis)
  assert.equal(main.edges.length, 1)
  assert.equal(main.edges[0].links.length, 3)
  assert.deepEqual(main.edges[0].links.map(link => link.frameIndex), [0, 0, 1])
  const sub = projectFlow(model, analysis, 'intro')
  assert.equal(sub.nodes.filter(node => node.kind === 'frame').length, 2)
  assert.equal(sub.nodes.filter(node => node.kind === 'portal').length, 1)
  assert.ok(projectFlow(model, analysis, 'end').nodes.some(node => node.kind === 'incoming'))
  assert.equal(JSON.stringify(model), before, 'Reading the graph must never change source JSON')
})

test('JUMP, GOTO_NEXT, this, endings and the ignored option click JUMP follow the game', () => {
  const model = { dialogues: { start: [frame({ options: [{ next: 'this', click: { type: 'jump', value: 'missing' } }, { next: '1' }, { next: '99' }] }), frame({ renderEvents: [event('goto_next', '-1'), event('jump', ''), event('jump', 'missing', 'end')] })] } }
  const analysis = analyzeDialogue(model, context)
  const explicit = analysis.transitions.filter(link => !link.implicit)
  assert.deepEqual(explicit.map(link => [link.index, link.kind]), [[0, 'frame'], [1, 'frame'], [99, 'end'], [0, 'frame'], [2, 'end']])
  assert.equal(analysis.diagnostics.filter(item => item.severity === 'error').length, 0)
  assert.ok(analysis.diagnostics.some(item => item.code === 'inactive-trigger'))
})

test('commands parse nested execute, quoted groups, selectors, semicolons, deltas and reject text lookalikes', () => {
  const text = ' execute as @a[nbt={SelectedItem:{id:"x:run"}}] run execute if score @s flag matches 1 run chatbox skip test:story "group with spaces" 2 @s; chatbox command nextDialogue -2; say chatbox skip test:other wrong; tellraw @s {"text":"chatbox skip test:other wrong"}'
  const parsed = parseJumpCommands(text)
  assert.equal(parsed.length, 2)
  assert.equal(parsed[0].group, 'group with spaces')
  assert.equal(parsed[0].conditional, true)
  assert.equal(text.slice(parsed[0].groupToken.start, parsed[0].groupToken.end), '"group with spaces"')
  assert.equal(parsed[1].delta, -2)
  assert.deepEqual(parseJumpCommands('say "chatbox skip test:story end"'), [])
  assert.equal(parseJumpCommands('chatbox skip test:story $(group)')[0].unresolved, true)
  assert.equal(parseJumpCommands('chatbox skip test:story "semi;colon"').length, 0, 'Game splits semicolons even in quoted strings')
})

test('same-file commands connect; cross-file literals block saving; dynamic and MVEL remain warnings', () => {
  const model = { dialogues: { start: [frame({ command: 'chatbox skip test:story end; execute if entity @s run chatbox skip test:other end', renderEvents: [event('mvel', 'skipDialogues("unknown")'), event('command', 'chatbox skip test:story $(target)')] })], end: [frame()] } }
  const result = analyzeDialogue(model, context)
  assert.equal(result.transitions.filter(link => link.kind === 'external').length, 1)
  assert.deepEqual(result.diagnostics.filter(item => item.severity === 'error').map(item => item.code), ['cross-file'])
  assert.ok(result.diagnostics.some(item => item.code === 'dynamic-command'))
  assert.ok(result.diagnostics.some(item => item.code === 'mvel-ignored'))
  assert.equal(result.transitions.some(link => link.group === 'unknown'), false)
})

test('rename updates only exact parseable targets and preserves unknown data and command spelling', () => {
  const model = { custom: { untouched: true }, dialogues: { start: [frame({ options: [{ text: 'old', next: 'old', extra: 7 }], command: 'execute if entity @s run chatbox skip test:story old 0; chatbox skip test:other old 0; say old', renderEvents: [event('jump', 'old'), event('mvel', 'old')] })], old: [frame()] } }
  renameGroupReferences(model, 'old', 'new group', context)
  assert.equal(model.dialogues.start[0].options[0].next, 'new group')
  assert.equal(model.dialogues.start[0].command, 'execute if entity @s run chatbox skip test:story "new group" 0; chatbox skip test:other old 0; say old')
  assert.equal(model.dialogues.start[0].renderEvents[0].value, 'new group')
  assert.equal(model.dialogues.start[0].renderEvents[1].value, 'old')
  assert.deepEqual(model.custom, { untouched: true })
  assert.equal(model.dialogues.start[0].options[0].extra, 7)
})

test('reorder keeps numeric and relative references attached to their original frames', () => {
  const a = frame({ options: [{ next: '2' }], command: 'chatbox skip test:story start 2; chatbox command nextDialogue 2', renderEvents: [event('jump', '2'), event('goto_next', '2')] }), b = frame(), c = frame()
  const model = { dialogues: { start: [a, b, c] } }
  assert.deepEqual(reindexFrameReferences(model, 'start', [b, c, a], context), [])
  assert.equal(a.options[0].next, '1')
  assert.equal(a.command, 'chatbox skip test:story start 1; chatbox command nextDialogue -1')
  assert.equal(a.renderEvents[0].value, '1')
  assert.equal(a.renderEvents[1].value, '-1')
})

test('deleting a referenced frame is atomic and does not silently retarget the next one', () => {
  const a = frame({ options: [{ next: '2' }, { next: '1' }] }), b = frame(), c = frame()
  const model = { dialogues: { start: [a, b, c] } }
  const before = JSON.stringify(model)
  assert.equal(reindexFrameReferences(model, 'start', [a, c], context).length, 1)
  assert.equal(JSON.stringify(model), before)
})

test('deleting a frame ignores its own outgoing references and reindexes surviving targets', () => {
  const a = frame({ options: [{ next: '2' }] }), b = frame({ renderEvents: [event('jump', '1')] }), c = frame()
  const model = { dialogues: { start: [a, b, c] } }
  assert.deepEqual(reindexFrameReferences(model, 'start', [a, c], context), [])
  assert.equal(a.options[0].next, '1')
})

test('deleting an external target removes only its jump commands, retaining other commands and target groups', () => {
  const model = { dialogues: { start: [frame({
    command: 'say before; execute if entity @s run chatbox skip other:story start 0; say after; chatbox skip test:story end',
    renderEvents: [event('command', 'chatbox skip other:story start'), event('command', 'say event; chatbox skip other:story start; say keep')]
  })], end: [frame()] } }
  const targetBefore = JSON.stringify(model.dialogues.end)
  const links = analyzeDialogue(model, context).transitions.filter(link => link.kind === 'external')
  assert.equal(removeDialogueTransitions(model, links), 3)
  const source = model.dialogues.start[0]
  assert.equal(source.command, 'say before; say after; chatbox skip test:story end')
  assert.equal(source.renderEvents.length, 1)
  assert.equal(source.renderEvents[0].value, 'say event; say keep')
  assert.equal(JSON.stringify(model.dialogues.end), targetBefore)
  assert.equal(analyzeDialogue(model, context).diagnostics.filter(item => item.severity === 'error').length, 0)
})

test('deleting one jump in a shared command field leaves other jumps intact and handles repeated targets', () => {
  const model = { dialogues: { start: [frame({ command: 'chatbox skip other:story a; chatbox skip other:story b; chatbox skip other:story a' })] } }
  let links = analyzeDialogue(model, context).transitions
  removeDialogueTransitions(model, links.filter(link => link.group === 'a'))
  assert.equal(model.dialogues.start[0].command, ' chatbox skip other:story b')
  links = analyzeDialogue(model, context).transitions
  removeDialogueTransitions(model, links.filter(link => link.group === 'b'))
  assert.equal(model.dialogues.start[0].command, '')
})

test('deleting event jumps uses descending event indices and never makes a removed condition unconditional', () => {
  const model = { dialogues: { start: [frame({ renderEvents: [
    event('jump', 'end'), event('command', 'say keep'),
    event('goto_next', '0'), event('command', 'say conditional', 'start', { condition: 'execute run chatbox skip other:story start' })
  ] })], end: [frame()] } }
  removeDialogueTransitions(model, analyzeDialogue(model, context).transitions.filter(link => !link.implicit))
  assert.deepEqual(model.dialogues.start[0].renderEvents, [event('command', 'say keep')])
})

test('deleting option jumps retains text and independent click actions, while deleting click jumps clears only the click', () => {
  const model = { dialogues: { start: [frame({ options: [
    { text: 'Keep choice', next: 'end', click: { type: 'COMMAND', value: 'say keep', custom: true } },
    { text: 'Keep next', next: 'end', click: { type: 'COMMAND', value: 'chatbox skip other:story start', custom: 7 } }
  ] })], end: [frame()] } }
  const links = analyzeDialogue(model, context).transitions
  removeDialogueTransitions(model, links.filter(link => link.origin === 'option' && link.optionIndex === 0 || link.origin === 'click'))
  assert.deepEqual(model.dialogues.start[0].options[0], { text: 'Keep choice', next: 'this', click: { type: 'COMMAND', value: 'say keep', custom: true } })
  assert.deepEqual(model.dialogues.start[0].options[1], { text: 'Keep next', next: 'end', click: { type: '', value: '', custom: 7 } })
})

test('readonly or implicit sources prevent the entire deletion without partial mutations', () => {
  const model = { dialogues: { start: [frame({ renderEvents: [event('jump', 'end')] })], end: [frame()] } }
  const theme = { dialogBox: { renderEvents: [event('jump', 'end')] } }
  const analysis = analyzeDialogue(model, { ...context, theme })
  const before = JSON.stringify(model)
  assert.throws(() => removeDialogueTransitions(model, analysis.transitions.filter(link => link.group === 'end' && !link.implicit)), /主题/)
  assert.equal(JSON.stringify(model), before)
  assert.throws(() => removeDialogueTransitions(model, analysis.transitions.filter(link => link.implicit)), /顺序推进/)
  assert.equal(JSON.stringify(model), before)
})

test('group names resembling path fields cannot cause frame or click deletion', () => {
  const model = { dialogues: { renderEvents: [frame({ command: 'chatbox skip other:story start' })], click: [frame({ command: 'chatbox skip other:story start' })] } }
  removeDialogueTransitions(model, analyzeDialogue(model, context).transitions.filter(link => link.kind === 'external'))
  assert.equal(model.dialogues.renderEvents.length, 1)
  assert.equal(model.dialogues.renderEvents[0].command, '')
  assert.equal(model.dialogues.click[0].command, '')
  assert.equal(model.dialogues.click[0].type, undefined)
})

test('theme and inline component events are possible read-only origins; unavailable themes are explicit', () => {
  const model = { theme: 'test:theme', dialogues: { start: [frame({ portrait: [{ id: 'actor', renderEvents: [event('jump', 'end', 'mouse_over')] }], video: { renderEvents: [event('jump', 'end', 'end')] } })], end: [frame()] } }
  const theme = { dialogBox: { renderEvents: [event('jump', 'end', 'end')] } }
  const analysis = analyzeDialogue(model, { ...context, theme })
  assert.ok(analysis.transitions.some(link => link.origin === 'theme' && link.readonly && link.possible))
  assert.ok(analysis.transitions.some(link => link.section === 'portrait'))
  assert.ok(analysis.transitions.some(link => link.section === 'video'))
  assert.ok(analyzeDialogue(model, context).diagnostics.some(item => item.code === 'theme-unavailable'))
})

test('canonical paths resolve editor option and portrait wrappers; reserved group names cannot create ambiguous options', () => {
  const option = { next: 'end' }, portrait = { renderEvents: [event('jump', 'end')] }
  const model = { dialogues: { start: [{ options: { options: [option] }, portrait: { portrait: [portrait] } }] } }
  assert.equal(fieldAt(model, ['dialogues', 'start', 0, 'options', 0, 'next']).owner, option)
  assert.equal(fieldAt(model, ['dialogues', 'start', 0, 'portrait', 0, 'renderEvents', 0, 'value']).value, 'end')
  assert.throws(() => connectionTarget('this'))
  assert.throws(() => connectionTarget('12'))
  assert.equal(connectionTarget('start', 0), '0')
})

test('relative click events use the destination established by option next, retaining the original source', () => {
  const model = { dialogues: { start: [frame({ options: [{ next: 'end', click: { type: 'goto_next', value: '1' } }] })], end: [frame(), frame()] } }
  const analysis = analyzeDialogue(model, context)
  const link = analysis.transitions.find(item => item.origin === 'click')
  assert.equal(link.groupKey, 'start')
  assert.equal(link.group, 'end')
  assert.equal(link.index, 1)
  assert.ok(analysis.diagnostics.some(item => item.code === 'option-event-order'))
})

test('100 groups / 1000 frames retain all branches and cycles without quadratic duplicate edges', () => {
  const dialogues = Object.fromEntries(Array.from({ length: 100 }, (_, g) => [`g${g}`, Array.from({ length: 10 }, () => frame({ options: [{ next: `g${(g + 1) % 100}` }] }))]))
  const model = { dialogues }
  const analysis = analyzeDialogue(model, context)
  const graph = projectFlow(model, analysis)
  assert.equal(graph.nodes.length, 100)
  assert.equal(graph.edges.length, 100)
  assert.equal(graph.edges.reduce((sum, edge) => sum + edge.links.length, 0), 1000)
})
