<template>
  <node-view-wrapper
    ref="wrapperRef"
    class="my-4 relative custom-table-node"
    :class="{ 'selectable-readonly': !editor.isEditable }"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @dragstart="!editor.isEditable && $event.preventDefault()"
  >
    <div
      v-if="editor.isEditable"
      class="absolute -top-3 right-0 flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] select-none transition-opacity"
      :class="toolbarClass"
      :style="{ opacity: showToolbar ? 1 : 0 }"
    >
      <button class="tool-btn" type="button" @mousedown.prevent @click.stop="toggleHeader">
        {{ node.attrs.withHeaderRow ? 'TH' : 'TD' }}
      </button>
      <span class="mx-1 opacity-60">|</span>
      <button class="tool-btn" type="button" @mousedown.prevent @click.stop="addRow">+R</button>
      <button class="tool-btn" type="button" @mousedown.prevent @click.stop="removeRow">-R</button>
      <button class="tool-btn" type="button" @mousedown.prevent @click.stop="addCol">+C</button>
      <button class="tool-btn" type="button" @mousedown.prevent @click.stop="removeCol">-C</button>
      <span class="ml-2 opacity-70 tabular-nums">{{ rowCount }}×{{ colCount }}</span>
    </div>

    <table
      class="w-full border-collapse"
      :style="node.attrs.style || null"
      @mousedown="!editor.isEditable && $event.stopPropagation()"
    >
      <tbody>
        <tr v-for="(row, rowIndex) in localData" :key="`r-${rowIndex}`">
          <template v-for="(_, colIndex) in colCount" :key="`c-${rowIndex}-${colIndex}`">
            <th v-if="node.attrs.withHeaderRow && rowIndex === 0">
              <template v-if="editor.isEditable">
                <textarea
                  class="cell-input"
                  :value="cellValue(rowIndex, colIndex)"
                  rows="1"
                  @focus="onCellFocus"
                  @input="onCellInput($event, rowIndex, colIndex)"
                  @blur="commitIfDirty"
                />
              </template>
              <template v-else>
                <div class="cell-read">{{ cellValue(rowIndex, colIndex) }}</div>
              </template>
            </th>
            <td v-else>
              <template v-if="editor.isEditable">
                <textarea
                  class="cell-input"
                  :value="cellValue(rowIndex, colIndex)"
                  rows="1"
                  @focus="onCellFocus"
                  @input="onCellInput($event, rowIndex, colIndex)"
                  @blur="commitIfDirty"
                />
              </template>
              <template v-else>
                <div class="cell-read">{{ cellValue(rowIndex, colIndex) }}</div>
              </template>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </node-view-wrapper>
</template>

<script setup>
import { computed, ref, watch, nextTick, onMounted } from 'vue'
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { usePageStore } from '@/stores/index.js'

const props = defineProps(nodeViewProps)

const hovered = ref(false)
const cellFocused = ref(false)
const dirty = ref(false)
const wrapperRef = ref(null)

const isDark = computed(() => usePageStore().isDark)
const showToolbar = computed(() => hovered.value || props.selected || cellFocused.value)

// 只读模式下移除 draggable，允许表格内文字选择
onMounted(() => {
  if (!props.editor.isEditable && wrapperRef.value) {
    wrapperRef.value.$el?.removeAttribute('draggable')
  }
})

const toolbarClass = computed(() => {
  if (isDark.value) return 'border-slate-700 bg-[#0d1117] text-slate-200'
  return 'border-blue-100 bg-white text-slate-700 shadow-sm'
})

const cloneMatrix = (matrix) => {
  if (!Array.isArray(matrix)) return [['']]
  return matrix.map((row) => (Array.isArray(row) ? row.map((c) => String(c ?? '')) : ['']))
}

const normalizeMatrix = (matrix) => {
  const safe = cloneMatrix(matrix)
  const maxCols = Math.max(1, ...safe.map((r) => r.length || 0))
  if (safe.length === 0) return [new Array(maxCols).fill('')]
  return safe.map((r) => {
    const next = r.slice(0, maxCols)
    while (next.length < maxCols) next.push('')
    return next
  })
}

const localData = ref(normalizeMatrix(props.node.attrs.data))

watch(
  () => props.node.attrs.data,
  (next) => {
    if (!dirty.value) localData.value = normalizeMatrix(next)
  },
  { deep: true }
)

const rowCount = computed(() => localData.value.length || 1)
const colCount = computed(() => {
  const cols = Math.max(1, ...localData.value.map((r) => (Array.isArray(r) ? r.length : 0)))
  return cols
})

const cellValue = (rowIndex, colIndex) => {
  const row = localData.value[rowIndex] ?? []
  return String(row[colIndex] ?? '')
}

const autosize = (el) => {
  if (!(el instanceof HTMLTextAreaElement)) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(240, Math.max(24, el.scrollHeight))}px`
}

const onCellFocus = (event) => {
  cellFocused.value = true
  nextTick(() => autosize(event.target))
}

const onCellInput = (event, rowIndex, colIndex) => {
  const value = event?.target?.value ?? ''
  const next = normalizeMatrix(localData.value)
  while (next.length <= rowIndex) next.push(new Array(colCount.value).fill(''))
  while (next[rowIndex].length < colCount.value) next[rowIndex].push('')
  next[rowIndex][colIndex] = String(value)
  localData.value = next
  dirty.value = true
  autosize(event.target)
}

const commitIfDirty = () => {
  cellFocused.value = false
  if (!dirty.value) return
  props.updateAttributes({ data: normalizeMatrix(localData.value) })
  dirty.value = false
}

const addRow = () => {
  const next = normalizeMatrix(localData.value)
  next.push(new Array(colCount.value).fill(''))
  localData.value = next
  props.updateAttributes({ data: next })
  dirty.value = false
}

const removeRow = () => {
  const next = normalizeMatrix(localData.value)
  if (next.length <= 1) return
  next.pop()
  localData.value = next
  props.updateAttributes({ data: next })
  dirty.value = false
}

const addCol = () => {
  const next = normalizeMatrix(localData.value).map((row) => [...row, ''])
  localData.value = next
  props.updateAttributes({ data: next })
  dirty.value = false
}

const removeCol = () => {
  if (colCount.value <= 1) return
  const next = normalizeMatrix(localData.value).map((row) => row.slice(0, -1))
  localData.value = next
  props.updateAttributes({ data: next })
  dirty.value = false
}

const toggleHeader = () => {
  props.updateAttributes({ withHeaderRow: !props.node.attrs.withHeaderRow })
}
</script>

<style scoped>
.tool-btn {
  padding: 2px 6px;
  border-radius: 6px;
  border: 1px solid transparent;
  line-height: 1.1;
}

.tool-btn:hover {
  border-color: var(--blue-5);
  color: var(--blue-5);
}

.cell-input {
  width: 100%;
  display: block;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  padding: 0;
  margin: 0;
  line-height: 1.4;
  color: inherit;
  min-height: 24px;
  white-space: pre-wrap;
}

.cell-read {
  white-space: pre-wrap;
  word-break: break-word;
}

.selectable-readonly {
  user-select: text;
  -webkit-user-select: text;
  cursor: text;
}
</style>
