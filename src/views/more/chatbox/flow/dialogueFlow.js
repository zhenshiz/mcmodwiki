// Graphs are projections of the game's JSON. Paths always refer to that JSON,
// including when the editor wraps options/portraits in model classes.
export const normalizeId = value => String(value || '').includes(':') ? String(value) : `minecraft:${value}`
const integer = value => /^[-+]?\d+$/.test(String(value)) && Number(value) >= -2147483648 && Number(value) <= 2147483647
const commandInteger = value => /^-?\d+$/.test(String(value)) && integer(value)
const raw = value => JSON.parse(JSON.stringify(value))
const triggerName = value => {
  const name = String(value || '').toUpperCase()
  return ['START', 'END', 'CLICK', 'TICK', 'CHECK', 'MOUSE_OVER', 'MOUSE_OUT'].find(key => name.includes(key)) || 'NONE'
}

export function fieldAt(root, path) {
  let owner = root
  for (const key of path.slice(0, -1)) {
    if (key === 'options' && !Array.isArray(owner?.options) && owner?.options?.options) owner = owner.options
    if (key === 'portrait' && !Array.isArray(owner?.portrait) && owner?.portrait?.portrait) owner = owner.portrait
    owner = owner?.[key]
  }
  return { owner, key: path.at(-1), value: owner?.[path.at(-1)] }
}

// Token positions let rename/reorder replace only the argument, preserving the
// original command, whitespace, conditions, selectors and unrelated commands.
function tokensOf(command, offset) {
  const tokens = []
  let i = 0
  while (i < command.length) {
    if (/\s/.test(command[i])) { i++; continue }
    const start = i
    let quote = false, escaped = false, depth = 0
    for (; i < command.length; i++) {
      const c = command[i]
      if (escaped) { escaped = false; continue }
      if (c === '\\' && quote) { escaped = true; continue }
      if (c === '"') quote = !quote
      if (!quote) {
        if ('[{'.includes(c)) depth++
        if (']}'.includes(c)) depth--
        if (/\s/.test(c) && depth === 0) break
      }
    }
    const text = command.slice(start, i)
    let value = text
    if (text.startsWith('"')) {
      try { value = JSON.parse(text) } catch { return [] }
    }
    tokens.push({ value, start: start + offset, end: i + offset, quoted: text.startsWith('"') })
  }
  return tokens
}

export function parseJumpCommands(value) {
  if (typeof value !== 'string') return []
  const found = []
  let offset = 0
  // The mod itself splits on EVERY semicolon, even inside quoted arguments.
  for (const [commandIndex, command] of value.split(';').entries()) {
    const tokens = tokensOf(command, offset)
    offset += command.length + 1
    let at = 0, conditional = false
    while (tokens[at]?.value.replace(/^\//, '') === 'execute') {
      const run = tokens.findIndex((token, index) => index > at && !token.quoted && token.value === 'run')
      if (run < 0) { at = tokens.length; break }
      conditional = true
      at = run + 1
    }
    const commandName = tokens[at]?.value.replace(/^\//, '')
    if (!['chatbox', 'chatbox:chatbox'].includes(commandName)) continue
    const args = tokens.slice(at + 1)
    if (args[0]?.value === 'skip') {
      if (!args[1] || !args[2]) { found.push({ unresolved: true }); continue }
      const file = args[1].value, group = args[2].value
      if (!/^(?:[a-z0-9_.-]+:)?[a-z0-9_./-]+$/.test(file) || /[$@{}]/.test(group) || (args[3] && !commandInteger(args[3].value))) {
        found.push({ unresolved: true }); continue
      }
      found.push({ file: normalizeId(file), group, index: args[3] ? Number(args[3].value) : 0,
        groupToken: args[2], indexToken: args[3], commandIndex, conditional: conditional || args.length > 4 })
    } else if (args[0]?.value === 'command' && args[1]?.value === 'nextDialogue') {
      if (args[2] && !commandInteger(args[2].value)) found.push({ unresolved: true })
      else found.push({ delta: args[2] ? Number(args[2].value) : 1, deltaToken: args[2], commandIndex, conditional })
    }
  }
  return found
}

export function analyzeDialogue(model, { fileId = '', theme = null, themeState = '' } = {}) {
  const document = raw(model || {})
  const groups = document.dialogues && typeof document.dialogues === 'object' && !Array.isArray(document.dialogues) ? document.dialogues : {}
  const transitions = [], diagnostics = []
  const issue = (code, source, severity = 'warning', detail = '') => diagnostics.push({ code, severity, ...source, detail })
  const add = (source, group, index, extras = {}) => {
    const transition = { ...source, group, index, ...extras, id: `${source.groupKey}:${source.frameIndex}:${source.path.join('/')}:${transitions.length}` }
    if (extras.file && normalizeId(extras.file) !== normalizeId(fileId)) {
      transition.kind = 'external'
      issue('cross-file', source, 'error', extras.file)
    } else if (!Array.isArray(groups[group]) || !groups[group].length) {
      transition.kind = 'missing'
      issue('missing-group', source, 'error', group)
    } else if (index < 0 || index >= groups[group].length) transition.kind = 'end'
    else transition.kind = 'frame'
    transitions.push(transition)
  }
  const jump = (value, source, extras = {}) => {
    const text = String(value ?? '')
    if (text.toLowerCase() === 'this') add(source, source.groupKey, source.frameIndex, { ...extras, stay: true })
    else if (text === '') add(source, source.groupKey, source.frameIndex + 1, { ...extras, relative: true })
    else if (integer(text)) add(source, source.groupKey, Number(text), { ...extras, absolute: true })
    else add(source, text, 0, { ...extras, groupJump: true })
  }
  const commands = (value, source) => {
    const parsed = parseJumpCommands(value)
    for (const command of parsed) {
      if (command.unresolved) issue('dynamic-command', source)
      else if (command.delta !== undefined) {
        if (source.unknownContext) issue('dynamic-command', source)
        else add(source, source.contextGroup ?? source.groupKey, (source.contextIndex ?? source.frameIndex) + command.delta, { command, relative: true, possible: true })
      }
      else add(source, command.group, command.index, { command, file: command.file, possible: true, absolute: true })
    }
    return parsed.length
  }
  const event = (item, source, screen = false) => {
    if (!item) return
    const type = String(item.type || '').toUpperCase()
    if (type === 'MVEL') { issue('mvel-ignored', source); return }
    const trigger = triggerName(item.trigger)
    const valid = screen ? ['START', 'TICK'].includes(trigger) : trigger !== 'NONE'
    if (!valid) {
      if (['JUMP', 'GOTO_NEXT', 'COMMAND'].includes(type)) issue('inactive-trigger', source, 'warning', item.trigger)
      return
    }
    const context = { ...source, trigger: item.trigger, possible: true }
    if (String(item.condition || '').startsWith('execute')) commands(item.condition, { ...context, path: [...source.path.slice(0, -1), 'condition'] })
    if (type === 'JUMP') jump(item.value, context)
    if (type === 'GOTO_NEXT') {
      if (source.unknownContext) issue('dynamic-command', source)
      else add(context, source.contextGroup ?? source.groupKey, (source.contextIndex ?? source.frameIndex) + (integer(item.value) ? Number(item.value) : 1), { relative: true })
    }
    if (type === 'COMMAND') commands(item.value, context)
  }
  const events = (component, path, context, screen = false) => {
    component?.renderEvents?.forEach((item, index) => event(item, { ...context, path: [...path, 'renderEvents', index, 'value'], section: context.section || 'basic' }, screen))
  }
  if (!document.dialogues || typeof document.dialogues !== 'object' || Array.isArray(document.dialogues)) issue('invalid-document', { path: [] }, 'error')
  for (const [groupKey, frames] of Object.entries(groups)) {
    if (!Array.isArray(frames)) { issue('invalid-group', { groupKey, path: ['dialogues', groupKey] }, 'error'); continue }
    frames.forEach((frame, frameIndex) => {
      const base = { groupKey, frameIndex, path: ['dialogues', groupKey, frameIndex], section: 'basic' }
      if (!frame || typeof frame !== 'object') { issue('invalid-frame', base, 'error'); return }
      const options = frame.options || []
      if (!Array.isArray(options)) { issue('invalid-options', base, 'error'); return }
      if (!options.length) add({ ...base, path: [...base.path, 'next'], origin: 'sequence', readonly: true }, groupKey, frameIndex + 1, { implicit: true, possible: true })
      options.forEach((option, index) => {
        const source = { ...base, path: [...base.path, 'options', index, 'next'], section: 'option', origin: 'option', optionIndex: index }
        if (!option || typeof option !== 'object') { issue('invalid-options', source, 'error'); return }
        jump(option.next, source)
        const nextLink = transitions.at(-1)
        const type = String(option.click?.type || '').toUpperCase()
        // setNext already installs JUMP; setClickEvent explicitly ignores custom JUMP.
        if (type && type !== 'JUMP') {
          event({ ...option.click, trigger: 'click' }, { ...source, path: [...base.path, 'options', index, 'click', 'value'], origin: 'click', readonly: false,
            contextGroup: nextLink.group, contextIndex: nextLink.index, unknownContext: nextLink.kind !== 'frame' })
          if (['COMMAND', 'GOTO_NEXT'].includes(type)) issue('option-event-order', source)
        }
        if (String(option.unlockCommand || '').startsWith('execute')) commands(option.unlockCommand, { ...source, path: [...base.path, 'options', index, 'unlockCommand'], origin: 'condition' })
      })
      if (frame.command) commands(frame.command, { ...base, path: [...base.path, 'command'], origin: 'command' })
      events(frame, base.path, { ...base, origin: 'event' }, true)
      events(frame.video, [...base.path, 'video'], { ...base, section: 'video', origin: 'event' })
      ;(Array.isArray(frame.portrait) ? frame.portrait : []).forEach((portrait, index) => {
        if (typeof portrait === 'object') events(portrait, [...base.path, 'portrait', index], { ...base, section: 'portrait', origin: 'event' })
      })
      if (theme) {
        const context = { ...base, origin: 'theme', readonly: true, possible: true, themeId: document.theme }
        for (const key of ['dialogBox', 'option', 'keyPrompt']) {
          if (key === 'option' && !options.length) continue
          events(theme[key], [key], context)
        }
        ;(theme.functionalButton || []).forEach((button, index) => events(button, ['functionalButton', index], context))
        // Conservative: portraits can survive earlier frames or be shown by events.
        Object.entries(theme.portrait || {}).forEach(([key, portrait]) => events(portrait, ['portrait', key], context))
      }
    })
  }
  if (document.theme && !theme && themeState !== 'loading') issue('theme-unavailable', { path: ['theme'] }, 'warning', document.theme)
  if (!document.theme) issue('runtime-theme', { path: ['theme'] })
  return { transitions, diagnostics }
}

const quoteArgument = value => /^[A-Za-z0-9_.+-]+$/.test(value) ? value : JSON.stringify(value)
function replaceTokens(value, edits) {
  for (const { token, text } of edits.sort((a, b) => b.token.start - a.token.start)) value = value.slice(0, token.start) + text + value.slice(token.end)
  return value
}

// All rewrites are collected before mutation: one command field may contain
// several jumps, and their token offsets refer to the same original string.
function rewrite(model, analysis, edit) {
  const fields = new Map()
  analysis.transitions.filter(link => !link.readonly).forEach(link => {
    const result = edit(link)
    if (!result) return
    const id = JSON.stringify(link.path)
    const field = fields.get(id) || { ...fieldAt(model, link.path), edits: [] }
    if (result.token) field.edits.push(result)
    else field.next = result.text
    fields.set(id, field)
  })
  for (const field of fields.values()) if (field.owner) field.owner[field.key] = field.next ?? replaceTokens(field.value, field.edits)
}

export function renameGroupReferences(model, oldKey, newKey, options) {
  rewrite(model, analyzeDialogue(model, options), link => {
    if (link.group !== oldKey || link.kind === 'external') return
    if (link.command?.groupToken) return { token: link.command.groupToken, text: quoteArgument(newKey) }
    if (link.groupJump) return { text: newKey }
  })
}

export function reindexFrameReferences(model, groupKey, nextFrames, options) {
  const before = model.dialogues[groupKey]
  const indexMap = before.map(frame => nextFrames.indexOf(frame))
  const problems = []
  const analysis = analyzeDialogue(model, options)
  const changes = new Map()
  analysis.transitions.forEach(link => {
    if (link.groupKey === groupKey && indexMap[link.frameIndex] < 0) return
    if (link.group !== groupKey || link.kind !== 'frame' || link.implicit || link.stay) return
    const target = indexMap[link.index]
    // Removing a referenced frame must not silently retarget the following frame.
    if (target < 0) { problems.push(link); return }
    if (!link.absolute && !link.relative) return
    const contextGroup = link.contextGroup ?? link.groupKey
    const contextIndex = link.contextIndex ?? link.frameIndex
    const sourceIndex = contextGroup === groupKey ? indexMap[contextIndex] : contextIndex
    if (sourceIndex < 0) return
    if (link.readonly && (target !== link.index || sourceIndex !== link.frameIndex)) { problems.push(link); return }
    if (link.command) {
      const token = link.command.indexToken || link.command.deltaToken
      if (!token) {
        if (target !== link.index || sourceIndex !== link.frameIndex) problems.push(link)
        return
      }
      changes.set(link.id, { token, text: String(link.relative ? target - sourceIndex : target) })
      return
    }
    // Explicit blank JUMP/option next also has an index target; pin it on reorder.
    if (link.relative && ['event', 'click'].includes(link.origin)) {
      const type = fieldAt(model, [...link.path.slice(0, -1), 'type']).value
      changes.set(link.id, { text: String(String(type).toUpperCase() === 'GOTO_NEXT' ? target - sourceIndex : target) })
      return
    }
    changes.set(link.id, { text: String(target) })
  })
  if (!problems.length) rewrite(model, analysis, link => changes.get(link.id))
  return problems
}

// Plan every source edit before mutating. Shared target nodes can represent several
// commands or events; readonly sources must never leave a half-deleted bundle.
export function removeDialogueTransitions(model, links) {
  if (!links.length) return 0
  if (links.some(link => link.implicit)) throw new Error('顺序推进由游戏决定，不能删除；请修改对话或添加选项。')
  if (links.some(link => link.readonly)) throw new Error('此跳转来自主题，请在主题文件中修改。')
  const writes = new Map(), removals = new Map()
  for (const link of links) {
    const id = JSON.stringify(link.path)
    const field = fieldAt(model, link.path)
    if (!field.owner) throw new Error('跳转来源已变化，请重新选择节点或连线')
    const eventAt = link.path.findIndex((key, index) => index >= 3 && key === 'renderEvents' && Number.isInteger(link.path[index + 1]))
    const eventPath = eventAt < 0 ? null : link.path.slice(0, eventAt + 2)
    const write = writes.get(id) || { ...field, path: link.path, eventPath, commands: new Set() }
    if (link.command) {
      if (!Number.isInteger(link.command.commandIndex) || typeof field.value !== 'string') throw new Error('跳转来源已变化，请重新选择节点或连线')
      write.commands.add(link.command.commandIndex)
      writes.set(id, write)
    } else if (link.origin === 'option') {
      write.next = 'this'
      writes.set(id, write)
    } else if (eventPath) removals.set(JSON.stringify(eventPath), eventPath)
    else if (link.origin === 'click') {
      write.clearClick = true
      writes.set(id, write)
    } else throw new Error('跳转来源已变化，请重新选择节点或连线')
  }
  for (const write of writes.values()) {
    if (write.commands.size) {
      write.next = write.value.split(';').filter((_, index) => !write.commands.has(index)).join(';')
      if (!write.next.trim()) {
        write.next = ''
        // Removing the only condition must also remove its event, rather than
        // turning the remaining action into an unconditional one.
        if (write.eventPath) removals.set(JSON.stringify(write.eventPath), write.eventPath)
        else if (write.path.at(-2) === 'click') write.clearClick = true
      }
    }
  }
  const eventRemovals = [...removals.values()].map(path => fieldAt(model, path))
  if (eventRemovals.some(field => !Array.isArray(field.owner) || !field.value)) throw new Error('跳转来源已变化，请重新选择节点或连线')
  for (const write of writes.values()) {
    if (write.eventPath && removals.has(JSON.stringify(write.eventPath))) continue
    if (write.clearClick) { write.owner.type = ''; write.owner.value = '' }
    else write.owner[write.key] = write.next
  }
  // Descending indices preserve the original paths when multiple events share an array.
  for (const field of eventRemovals.sort((a, b) => b.key - a.key)) field.owner.splice(field.key, 1)
  return links.length
}

export function connectionTarget(group, index = null) {
  if (index !== null) return String(index)
  if (integer(group) || String(group).toLowerCase() === 'this') throw new Error('该组名是保留跳转值，请先重命名或手动编写指令')
  return group
}
