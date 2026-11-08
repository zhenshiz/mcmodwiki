<script setup>
import { computed, ref } from 'vue'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Mark } from '@tiptap/core'
import { Color, TextStyle } from '@tiptap/extension-text-style'
import { Icon } from '@iconify/vue'
import Select from '@/components/form/Select.vue'
import { t } from '@/languages'
import { cloneText, componentToDocument, documentToComponent, canEditRichText, setTypewriterOptions, validateTextComponent, textColor, MINECRAFT_COLORS } from './textComponent.js'

const props = defineProps({
  modelValue: { type: [String, Object, Array, Number, Boolean], default: '' },
  options: { type: Array, default: () => [] },
  defaultTypewriter: { type: Boolean, default: false },
})
const emit = defineEmits(['apply', 'cancel'])
const original = ref(cloneText(props.modelValue))
const knownTranslation = value => typeof value === 'string' && props.options.some(option => option.value === value && option.label !== value)
const richAvailable = computed(() => canEditRichText(original.value) && !knownTranslation(original.value))
const mode = ref(richAvailable.value ? 'rich' : 'json')
const json = ref(JSON.stringify(original.value, null, 2))
const error = ref('')
const dirty = ref(false)
const settingsDirty = ref(false)
const typewriter = ref('default')
const speed = ref('')
const color = ref('#ffffff')
const colorOptions = Object.entries(MINECRAFT_COLORS).map(([label, value]) => ({ label, value }))
const typewriterOptions = computed(() => [
  { label: props.defaultTypewriter ? t('默认（开启）') : t('默认（关闭）'), value: 'default' },
  { label: t('开启'), value: 'true' },
  { label: t('关闭'), value: 'false' },
])
function applyColor(value) {
  color.value = value
  editor.value.chain().focus().setColor(value).run()
}
function readSettings(value) {
  typewriter.value = typeof value?.typewriter === 'boolean' ? String(value.typewriter) : 'default'
  speed.value = value?.charPerSecond ?? ''
  settingsDirty.value = false
}
readSettings(original.value)
const Obfuscated = Mark.create({
  name: 'obfuscated',
  parseHTML: () => [{ tag: 'span[data-obfuscated]' }],
  renderHTML: () => ['span', { 'data-obfuscated': '', title: t('混淆效果在游戏中显示') }, 0],
})
const editor = useEditor({
  extensions: [StarterKit.configure({ heading: false, blockquote: false, bulletList: false, orderedList: false,
    listItem: false, listKeymap: false, code: false, codeBlock: false, horizontalRule: false, link: false, trailingNode: false }), TextStyle, Color, Obfuscated],
  content: componentToDocument(original.value) || { type: 'doc', content: [{ type: 'paragraph' }] },
  editorProps: { attributes: { role: 'textbox', 'aria-label': t('富文本内容'), 'aria-multiline': 'true', spellcheck: 'false', tabindex: '0' } },
  onCreate: ({ editor }) => { color.value = textColor(editor.getAttributes('textStyle').color) || '#ffffff' },
  onSelectionUpdate: ({ editor }) => { color.value = textColor(editor.getAttributes('textStyle').color) || '#ffffff' },
  onUpdate: () => { dirty.value = true },
})
const marks = [
  { name: 'bold', label: t('粗体'), icon: 'lucide:bold' },
  { name: 'italic', label: t('斜体'), icon: 'lucide:italic' },
  { name: 'underline', label: t('下划线'), icon: 'lucide:underline' },
  { name: 'strike', label: t('删除线'), icon: 'lucide:strikethrough' },
  { name: 'obfuscated', label: t('混淆文本'), icon: 'lucide:shuffle' },
]
function parseJson() {
  let value
  try { value = JSON.parse(json.value) } catch { throw new Error('JSON 格式错误，请检查引号和逗号') }
  validateTextComponent(value)
  return value
}
function richValue() {
  let value = dirty.value ? documentToComponent(editor.value.getJSON(), original.value) : cloneText(original.value)
  if (settingsDirty.value) {
    const cps = String(speed.value).trim() === '' ? undefined : Number(speed.value)
    if (knownTranslation(value)) value = { translate: value }
    value = setTypewriterOptions(value, typewriter.value === 'default' ? undefined : typewriter.value === 'true', cps)
  }
  validateTextComponent(value)
  return value
}
function switchMode(next) {
  if (next === mode.value) return
  try {
    if (mode.value === 'json' && settingsDirty.value && !applyJsonSettings()) return
    const value = mode.value === 'json' ? parseJson() : richValue()
    original.value = cloneText(value)
    readSettings(value)
    dirty.value = false
    if (next === 'rich') {
      if (!richAvailable.value) throw new Error('此组件包含翻译、事件或其他高级字段，请在 JSON 模式编辑以保留完整内容')
      editor.value.commands.setContent(componentToDocument(value), { emitUpdate: false })
    } else json.value = JSON.stringify(value, null, 2)
    mode.value = next
    error.value = ''
  } catch (cause) { error.value = t(cause.message) }
}
function apply() {
  try {
    if (mode.value === 'json' && settingsDirty.value) {
      if (!applyJsonSettings()) return
    }
    emit('apply', mode.value === 'json' ? parseJson() : richValue())
  }
  catch (cause) { error.value = t(cause.message) }
}
function applyJsonSettings() {
  try {
    let value = parseJson()
    if (knownTranslation(value)) value = { translate: value }
    value = setTypewriterOptions(value, typewriter.value === 'default' ? undefined : typewriter.value === 'true', String(speed.value).trim() === '' ? undefined : Number(speed.value))
    json.value = JSON.stringify(value, null, 2)
    readSettings(value)
    error.value = ''
    return true
  } catch (cause) { error.value = t(cause.message); return false }
}
function syncJsonSettings() {
  try { readSettings(parseJson()); error.value = '' } catch { /* Keep incomplete JSON local until applied. */ }
}
function changeSettings() {
  settingsDirty.value = true
  if (mode.value === 'json') applyJsonSettings()
}
function handleKeydown(event) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
    event.preventDefault()
    event.stopPropagation()
    apply()
  }
}
</script>

<template>
  <div class="minecraft-text-editor" @keydown.esc.stop.prevent="emit('cancel')" @keydown="handleKeydown">
    <div class="mode-bar" role="group" :aria-label="t('文本编辑模式')">
      <button type="button" :aria-pressed="mode === 'rich'" @click="switchMode('rich')">{{ t('富文本') }}</button>
      <button type="button" :aria-pressed="mode === 'json'" @click="switchMode('json')">{{ t('原版 JSON') }}</button>
      <a href="https://misode.github.io/text-component/?version=1.21" target="_blank" rel="noopener noreferrer">{{ t('文本组件生成器') }} ↗</a>
    </div>
    <template v-if="mode === 'rich'">
      <div v-if="editor" class="format-bar" role="group" :aria-label="t('文本样式')">
        <button v-for="mark in marks" :key="mark.name" type="button" :title="mark.label" :aria-label="mark.label"
          :aria-pressed="editor.isActive(mark.name)" @mousedown.prevent @click="editor.chain().focus().toggleMark(mark.name).run()"><Icon :icon="mark.icon" width="16" /></button>
        <label :title="t('文字颜色')"><input v-model="color" type="color" :aria-label="t('文字颜色')" @input="editor.chain().focus().setColor(color).run()" /></label>
        <div class="color-select" @keydown.esc.stop>
          <Select :options="colorOptions" :placeholder="t('原版颜色')" width="140px" @update:model-value="applyColor" />
        </div>
        <button type="button" @mousedown.prevent @click="editor.chain().focus().unsetAllMarks().run()">{{ t('清除样式') }}</button>
        <button type="button" :aria-label="t('撤销')" :disabled="!editor.can().undo()" @mousedown.prevent @click="editor.chain().focus().undo().run()"><Icon icon="lucide:undo-2" width="16" /></button>
        <button type="button" :aria-label="t('重做')" :disabled="!editor.can().redo()" @mousedown.prevent @click="editor.chain().focus().redo().run()"><Icon icon="lucide:redo-2" width="16" /></button>
      </div>
      <EditorContent :editor="editor" class="rich-content" />
      <p class="hint">{{ t('选中文字后设置样式。换行会保存为文本中的换行符；混淆、字体和动态内容以游戏效果为准。') }}</p>
    </template>
    <template v-else>
      <p class="hint">{{ t('可粘贴原版文本组件 JSON，保留 translate、extra、字体、点击和悬浮事件等字段。生成器请选择与游戏匹配的版本。') }}</p>
      <p v-if="!richAvailable" class="hint">{{ t('此组件包含翻译、事件或其他高级字段，请在 JSON 模式编辑以保留完整内容') }}</p>
      <textarea v-model="json" @input="syncJsonSettings" :aria-label="t('原版文本组件 JSON')" spellcheck="false" rows="12" />
    </template>
    <div class="typewriter-settings">
      <div class="typewriter-setting" @keydown.esc.stop>
        <span>{{ t('打字机效果') }}</span>
        <Select v-model="typewriter" :options="typewriterOptions" :placeholder="t('打字机效果')" width="160px" @change="changeSettings" />
      </div>
      <label>{{ t('每秒字符数') }}<input v-model="speed" type="number" min="0" step="any" :placeholder="t('留空使用游戏配置')" @input="changeSettings" /></label>
    </div>
    <p class="hint">{{ t('速度支持小数。默认选项不写入 typewriter，留空不写入 charPerSecond。') }}</p>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <div class="actions"><button type="button" @click="emit('cancel')">{{ t('取消') }}</button><button type="button" class="apply" @click="apply">{{ t('应用文本') }}</button></div>
  </div>
</template>

<style scoped>
.minecraft-text-editor { color: rgb(var(--ui-text)); }
.mode-bar, .format-bar, .actions { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-bottom: 10px; }
button, input, textarea { border: 1px solid rgb(var(--ui-line)); background: rgb(var(--ui-inset)); color: inherit; }
button { padding: 5px 8px; }
button:hover, button[aria-pressed="true"] { background: rgb(var(--ui-secondary)); color: rgb(var(--ui-on-accent)); }
button:disabled { opacity: .4; cursor: default; }
.mode-bar a { margin-left: auto; color: rgb(var(--ui-link)); font-size: 12px; }
.format-bar input[type="color"] { width: 30px; height: 30px; cursor: pointer; padding: 2px; }
.color-select { width: 140px; }
.rich-content { border: 1px solid rgb(var(--ui-line)); background: rgb(var(--ui-inset)); }
.rich-content :deep(.tiptap) { min-height: 160px; max-height: 300px; overflow-y: auto; padding: 12px; outline: none; white-space: pre-wrap; user-select: text; }
.rich-content :deep(p) { margin: 0; min-height: 1.5em; }
.rich-content :deep([data-obfuscated]) { text-decoration: underline dotted; }
textarea { display: block; width: 100%; resize: vertical; padding: 10px; font: 12px/1.6 monospace; user-select: text; }
.hint { color: rgb(var(--ui-muted)); font-size: 12px; margin: 8px 0; }
.typewriter-settings { display: flex; gap: 12px; flex-wrap: wrap; align-items: end; margin-top: 16px; }
.typewriter-settings label, .typewriter-setting { display: flex; flex-direction: column; gap: 5px; font-size: 12px; }
.typewriter-settings input { padding: 6px; width: 180px; min-height: 40px; }
.actions { justify-content: flex-end; margin: 16px 0 0; }
.actions .apply { background: rgb(var(--ui-secondary)); color: rgb(var(--ui-on-accent)); }
.error { color: #ef4444; font-size: 13px; }
:deep(:focus-visible) { outline: 2px solid rgb(var(--ui-link)); outline-offset: 2px; }
</style>
