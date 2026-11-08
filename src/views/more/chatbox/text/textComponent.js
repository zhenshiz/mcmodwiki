// ChatBox delegates JSON components to Minecraft; only a lossless literal subset is
// converted to rich text. Everything else stays editable as the original JSON.
export const MINECRAFT_COLORS = {
  black: '#000000', dark_blue: '#0000aa', dark_green: '#00aa00', dark_aqua: '#00aaaa',
  dark_red: '#aa0000', dark_purple: '#aa00aa', gold: '#ffaa00', gray: '#aaaaaa',
  dark_gray: '#555555', blue: '#5555ff', green: '#55ff55', aqua: '#55ffff',
  red: '#ff5555', light_purple: '#ff55ff', yellow: '#ffff55', white: '#ffffff',
}
const styleMarks = { bold: 'bold', italic: 'italic', underlined: 'underline', strikethrough: 'strike', obfuscated: 'obfuscated' }
const contentKeys = ['text', 'translate', 'score', 'selector', 'keybind', 'nbt']
const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key)
const objectValue = value => value !== null && typeof value === 'object' && !Array.isArray(value)
export const cloneText = value => JSON.parse(JSON.stringify(value ?? ''))
export const textColor = value => own(MINECRAFT_COLORS, value) ? MINECRAFT_COLORS[value] : (/^#[\da-f]{6}$/i.test(value) ? value : null)

// Validate common component shapes, without filtering unknown vanilla/mod fields.
export function validateTextComponent(value, root = true) {
  if (typeof value === 'string' || typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value))) return
  if (Array.isArray(value)) {
    if (!value.length) throw new Error('文本组件数组不能为空')
    value.forEach(item => validateTextComponent(item, false))
    return
  }
  if (!objectValue(value) || !contentKeys.some(key => own(value, key))) throw new Error('文本组件需要 text、translate、score、selector、keybind 或 nbt 内容')
  for (const key of ['text', 'translate', 'selector', 'keybind', 'nbt']) {
    if (own(value, key) && typeof value[key] !== 'string') throw new Error('文本组件的内容字段必须是字符串')
  }
  if (own(value, 'score') && (!objectValue(value.score) || typeof value.score.name !== 'string' || typeof value.score.objective !== 'string')) throw new Error('score 需要 name 和 objective 字符串')
  for (const key of Object.keys(styleMarks)) {
    if (own(value, key) && typeof value[key] !== 'boolean') throw new Error('文本样式开关必须是布尔值')
  }
  for (const key of ['extra', 'with']) {
    if (!own(value, key)) continue
    if (!Array.isArray(value[key]) || (key === 'extra' && !value[key].length)) throw new Error('extra 必须是非空数组，with 必须是数组')
    value[key].forEach(item => validateTextComponent(item, false))
  }
  if (own(value, 'separator')) validateTextComponent(value.separator, false)
  if (root) {
    if (own(value, 'typewriter') && typeof value.typewriter !== 'boolean') throw new Error('typewriter 必须是布尔值')
    if (own(value, 'charPerSecond') && (typeof value.charPerSecond !== 'number' || !Number.isFinite(value.charPerSecond) || value.charPerSecond <= 0)) throw new Error('打字速度必须是大于 0 的有限数字')
  }
}

export function canEditRichText(value, root = true) {
  if (typeof value === 'string') return true
  if (Array.isArray(value)) return value.length > 0 && value.every(item => canEditRichText(item, false))
  if (!objectValue(value) || typeof value.text !== 'string') return false
  const allowed = ['text', 'extra', 'color', ...Object.keys(styleMarks), ...(root ? ['typewriter', 'charPerSecond'] : [])]
  return Object.keys(value).every(key => allowed.includes(key))
    && (!own(value, 'color') || !!textColor(value.color))
    && Object.keys(styleMarks).every(key => !own(value, key) || typeof value[key] === 'boolean')
    && (!own(value, 'extra') || (Array.isArray(value.extra) && value.extra.length > 0 && value.extra.every(item => canEditRichText(item, false))))
}

// Arrays inherit from their first component, just like Component.Serializer.
function literalRuns(value, inherited = {}, output = []) {
  if (typeof value === 'string') { output.push({ text: value, style: inherited }); return inherited }
  if (Array.isArray(value)) {
    const parent = literalRuns(value[0], inherited, output)
    value.slice(1).forEach(item => literalRuns(item, parent, output))
    return parent
  }
  const style = { ...inherited }
  for (const key of [...Object.keys(styleMarks), 'color']) if (own(value, key)) style[key] = value[key]
  output.push({ text: value.text, style })
  value.extra?.forEach(item => literalRuns(item, style, output))
  return style
}

export function componentToDocument(value) {
  if (!canEditRichText(value)) return null
  const paragraphs = [{ type: 'paragraph', content: [] }]
  const runs = []
  literalRuns(value, {}, runs)
  for (const run of runs) {
    const marks = Object.entries(styleMarks).filter(([key]) => run.style[key]).map(([, type]) => ({ type }))
    if (run.style.color) marks.push({ type: 'textStyle', attrs: { color: textColor(run.style.color) } })
    run.text.split('\n').forEach((text, index) => {
      if (index) paragraphs.push({ type: 'paragraph', content: [] })
      if (text) paragraphs.at(-1).content.push({ type: 'text', text, ...(marks.length ? { marks } : {}) })
    })
  }
  return { type: 'doc', content: paragraphs }
}

export function documentToComponent(doc, original = '') {
  const runs = []
  const append = (text, marks = []) => {
    if (!text) return
    const style = {}
    for (const [key, type] of Object.entries(styleMarks)) if (marks.some(mark => mark.type === type)) style[key] = true
    const color = marks.find(mark => mark.type === 'textStyle')?.attrs?.color
    if (color && textColor(color)) style.color = textColor(color)
    const previous = runs.at(-1)
    if (previous && JSON.stringify(previous.style) === JSON.stringify(style)) previous.text += text
    else runs.push({ text, style })
  }
  doc.content?.forEach((paragraph, index) => {
    if (index) append('\n')
    paragraph.content?.forEach(node => append(node.type === 'hardBreak' ? '\n' : node.text, node.marks))
  })
  const options = {}
  if (objectValue(original)) for (const key of ['typewriter', 'charPerSecond']) if (own(original, key)) options[key] = original[key]
  if (typeof original === 'string' && !Object.keys(options).length && runs.every(run => !Object.keys(run.style).length)) return runs.map(run => run.text).join('')
  if (runs.length <= 1) return { text: runs[0]?.text || '', ...runs[0]?.style, ...options }
  return { text: '', extra: runs.map(run => ({ text: run.text, ...run.style })), ...options }
}

export function setTypewriterOptions(value, enabled, speed) {
  const result = cloneText(value)
  if (!objectValue(result) && enabled === undefined && speed === undefined) return result
  const component = objectValue(result) ? result : typeof result === 'string' ? { text: result } : { text: '', extra: [result] }
  if (enabled === undefined) delete component.typewriter
  else component.typewriter = enabled
  if (speed === undefined) delete component.charPerSecond
  else component.charPerSecond = speed
  validateTextComponent(component)
  return component
}

// Summaries only; never used to serialize data or execute click/hover actions.
export function componentLabel(value, translate = key => key, root = true) {
  if (value == null) return ''
  if (typeof value !== 'object') return root ? translate(String(value)) : String(value)
  if (Array.isArray(value)) return value.map(item => componentLabel(item, translate, false)).join('')
  let label = ''
  if (own(value, 'text')) label = String(value.text)
  else if (own(value, 'translate')) {
    const translated = translate(value.translate)
    const template = translated === value.translate ? (value.fallback ?? translated) : translated
    let next = 0
    label = String(template).replace(/%%|%(?:(\d+)\$)?s/g, (match, index) => match === '%%' ? '%' : componentLabel(value.with?.[index ? Number(index) - 1 : next++], translate, false))
  } else if (value.selector) label = value.selector
  else if (value.keybind) label = value.keybind
  else if (value.score) label = `[${value.score.name}: ${value.score.objective}]`
  else if (value.nbt) label = `[NBT: ${value.nbt}]`
  return label + (value.extra || []).map(item => componentLabel(item, translate, false)).join('')
}
