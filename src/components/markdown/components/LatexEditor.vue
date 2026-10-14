<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { MathfieldElement } from 'mathlive'
import 'mathlive/fonts.css'
import katex from 'katex'
import Modal from '@/components/Modal.vue'
import Button from '@/components/Button.vue'
import { t } from '@/languages'

const props = defineProps({
  editor: { type: Object, required: true },
  initial: { type: Object, required: true },
})
const emit = defineEmits(['close'])
const show = ref(true)
const latex = ref(props.initial.latex)
const displayMode = ref(props.initial.displayMode)
const inputMode = ref('visual')
const category = ref('structure')
const mathHost = ref(null)
const sourceInput = ref(null)
const isEditing = props.initial.pos !== null
const teleportTo = document.fullscreenElement || 'body'
let mathField = null

// Keep fonts in the application bundle and disable optional remote sound assets.
MathfieldElement.fontsDirectory = null
MathfieldElement.soundsDirectory = null

const categories = [
  {
    id: 'structure',
    label: '分数与根式',
    items: [
      ['分数', '\\frac{a}{b}'],
      ['平方', 'x^{2}'],
      ['下标', 'x_{i}'],
      ['平方根', '\\sqrt{x}'],
      ['n 次根', '\\sqrt[n]{x}'],
      ['括号', '\\left(a+b\\right)'],
    ],
  },
  {
    id: 'operators',
    label: '大型运算',
    items: [
      ['求和', '\\sum_{i=1}^{n} x_i'],
      ['连乘', '\\prod_{i=1}^{n} x_i'],
      ['积分', '\\int_{a}^{b} f(x)\\,dx'],
      ['二重积分', '\\iint_D f(x,y)\\,dx\\,dy'],
      ['极限', '\\lim_{x\\to 0} f(x)'],
      ['导数', '\\frac{df}{dx}'],
    ],
  },
  {
    id: 'symbols',
    label: '常用符号',
    items: [
      ['正负号', '\\pm'],
      ['乘号', '\\times'],
      ['不等于', '\\ne'],
      ['小于等于', '\\le'],
      ['大于等于', '\\ge'],
      ['约等于', '\\approx'],
      ['无穷大', '\\infty'],
      ['属于', '\\in'],
      ['箭头', '\\rightarrow'],
    ],
  },
  {
    id: 'greek',
    label: '希腊字母',
    items: [
      ['alpha', '\\alpha'],
      ['beta', '\\beta'],
      ['gamma', '\\gamma'],
      ['delta', '\\delta'],
      ['theta', '\\theta'],
      ['lambda', '\\lambda'],
      ['pi', '\\pi'],
      ['sigma', '\\sigma'],
      ['phi', '\\phi'],
      ['omega', '\\omega'],
      ['Delta', '\\Delta'],
      ['Omega', '\\Omega'],
    ],
  },
  {
    id: 'matrix',
    label: '矩阵与方程',
    items: [
      ['圆括号矩阵', '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}'],
      ['方括号矩阵', '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}'],
      ['行列式', '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}'],
      ['分段函数', 'f(x)=\\begin{cases} x & x\\ge 0 \\\\ -x & x<0 \\end{cases}'],
      ['方程组', '\\begin{cases} x+y=1 \\\\ x-y=0 \\end{cases}'],
      ['对齐方程', '\\begin{aligned} a &= b+c \\\\ d &= e+f \\end{aligned}'],
    ],
  },
]
const templates = computed(() => categories.find((item) => item.id === category.value).items)
const renderTemplate = (value) => katex.renderToString(value, { throwOnError: false, trust: false })
const preview = computed(() => {
  if (!latex.value.trim()) return { html: '', error: '' }
  try {
    return {
      html: katex.renderToString(latex.value, {
        displayMode: displayMode.value,
        throwOnError: true,
        trust: false,
        maxExpand: 1000,
      }),
      error: '',
    }
  } catch (error) {
    return { html: '', error: error.message }
  }
})
const canInsert = computed(() => !!latex.value.trim() && !preview.value.error)
const onMathInput = () => {
  latex.value = mathField.value
}

watch(mathHost, (host) => {
  if (!host) return
  mathField = new MathfieldElement()
  mathField.mathVirtualKeyboardPolicy = 'manual'
  mathField.setAttribute('aria-label', t('可视化公式输入'))
  mathField.setAttribute('tabindex', '0')
  mathField.setValue(latex.value, { silenceNotifications: true })
  mathField.addEventListener('input', onMathInput)
  host.appendChild(mathField)
  mathField.menuItems = []
})
watch(latex, (value) => {
  if (mathField && mathField.value !== value)
    mathField.setValue(value, { silenceNotifications: true })
})
watch(inputMode, async (mode) => {
  await nextTick()
  if (mode === 'visual') mathField?.focus()
  else sourceInput.value?.focus()
})
onBeforeUnmount(() => {
  mathField?.removeEventListener('input', onMathInput)
  mathField?.remove()
})

const insertTemplate = async (value) => {
  if (inputMode.value === 'visual' && mathField) {
    mathField.focus()
    mathField.insert(value, { insertionMode: 'replaceSelection', selectionMode: 'item' })
    latex.value = mathField.value
  } else {
    const input = sourceInput.value
    const start = input?.selectionStart ?? latex.value.length
    const end = input?.selectionEnd ?? start
    latex.value = latex.value.slice(0, start) + value + latex.value.slice(end)
    await nextTick()
    input?.focus()
    input?.setSelectionRange(start, start + value.length)
  }
}
const clear = () => {
  latex.value = ''
  if (inputMode.value === 'visual') mathField?.focus()
  else sourceInput.value?.focus()
}
const insert = async () => {
  if (!canInsert.value) return
  const range = isEditing
    ? {
        from: props.initial.pos,
        to: props.initial.pos + props.editor.state.doc.nodeAt(props.initial.pos).nodeSize,
      }
    : props.initial.selection
  show.value = false
  await nextTick()
  props.editor
    .chain()
    .focus()
    .insertContentAt(range, {
      type: displayMode.value ? 'blockMath' : 'inlineMath',
      attrs: { latex: latex.value.trim() },
    })
    .run()
}
</script>

<template>
  <Modal
    v-model:show="show"
    :title="t(isEditing ? '编辑 LaTeX 公式' : '创建 LaTeX 公式')"
    :width="940"
    :teleport-to="teleportTo"
    @after-leave="emit('close')"
  >
    <div class="latex-editor">
      <div class="formula-settings">
        <p class="text-ui-muted text-sm">
          {{ t('选择模板，再点击公式中的内容直接修改。也可以切换到源码输入。') }}
        </p>
        <div class="mode-switch" role="group" :aria-label="t('公式类型')">
          <button
            type="button"
            :aria-pressed="!displayMode"
            :class="{ active: !displayMode }"
            @click="displayMode = false"
          >
            {{ t('行内公式') }}
          </button>
          <button
            type="button"
            :aria-pressed="displayMode"
            :class="{ active: displayMode }"
            @click="displayMode = true"
          >
            {{ t('独立公式块') }}
          </button>
        </div>
      </div>
      <section class="formula-palette" :aria-label="t('公式模板')">
        <div class="category-tabs" role="group" :aria-label="t('模板分类')">
          <button
            v-for="item in categories"
            :key="item.id"
            type="button"
            :aria-pressed="category === item.id"
            :class="{ active: category === item.id }"
            @click="category = item.id"
          >
            {{ t(item.label) }}
          </button>
        </div>
        <div
          class="template-grid"
          :class="{ 'template-grid-wide': category === 'matrix' || category === 'operators' }"
        >
          <button
            v-for="[label, value] in templates"
            :key="value"
            type="button"
            :title="t(label)"
            :aria-label="t(label)"
            @mousedown.prevent
            @click="insertTemplate(value)"
          >
            <span v-html="renderTemplate(value)"></span>
          </button>
        </div>
      </section>
      <div class="formula-workspace">
        <section class="formula-input">
          <div class="workspace-heading">
            <span class="mc-label">{{ t('输入公式') }}</span>
            <div class="mode-switch" role="group" :aria-label="t('输入模式')">
              <button
                type="button"
                :class="{ active: inputMode === 'visual' }"
                :aria-pressed="inputMode === 'visual'"
                @click="inputMode = 'visual'"
              >
                {{ t('可视化') }}
              </button>
              <button
                type="button"
                :class="{ active: inputMode === 'source' }"
                :aria-pressed="inputMode === 'source'"
                @click="inputMode = 'source'"
              >
                LaTeX
              </button>
            </div>
          </div>
          <div v-show="inputMode === 'visual'" ref="mathHost" class="math-input-host"></div>
          <textarea
            v-if="inputMode === 'source'"
            id="latex-source"
            ref="sourceInput"
            v-model="latex"
            :aria-label="t('LaTeX 源码')"
            :placeholder="t('输入 LaTeX，例如：\\frac{a}{b}')"
            spellcheck="false"
            class="latex-source"
          ></textarea>
          <div class="input-footer">
            <span>{{ t('模板插入到当前光标位置') }}</span
            ><button type="button" @click="clear">{{ t('清空') }}</button>
          </div>
        </section>
        <section class="formula-preview" :aria-label="t('实时预览')">
          <div class="workspace-heading">
            <span class="mc-label">{{ t('实时预览') }}</span
            ><span class="mc-tag">KaTeX</span>
          </div>
          <div class="preview-output">
            <div v-if="preview.html" v-html="preview.html"></div>
            <p v-else class="text-ui-muted text-sm">
              {{ t(latex.trim() ? '请修正公式后查看预览' : '在左侧输入或选择一个模板') }}
            </p>
          </div>
        </section>
      </div>
      <p v-if="preview.error" class="formula-error" role="alert">
        {{ t('公式语法有误') }}: {{ preview.error }}
      </p>
    </div>
    <template #footer>
      <Button @click="show = false">{{ t('取消') }}</Button>
      <Button variant="primary" :disabled="!canInsert" @click="insert">{{
        t(isEditing ? '保存修改' : '插入公式')
      }}</Button>
    </template>
  </Modal>
</template>

<style scoped>
.latex-editor {
  display: grid;
  gap: 18px;
}
.formula-settings {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.formula-settings p {
  flex: 1;
  min-width: 200px;
}
.mode-switch {
  display: inline-flex;
  border: 1px solid rgb(var(--ui-border));
  flex-shrink: 0;
}
.mode-switch button {
  padding: 6px 10px;
  font-size: 12px;
}
.mode-switch .active {
  background: rgb(var(--ui-secondary));
  color: rgb(var(--ui-on-accent));
  font-weight: 700;
}
.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  padding: 5px;
  background: rgb(var(--ui-inset));
  border-bottom: 1px solid rgb(var(--ui-line));
}
.category-tabs button {
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
}
.category-tabs .active {
  background: rgb(var(--ui-primary));
  color: rgb(var(--ui-on-accent));
}
.formula-palette {
  border: 1px solid rgb(var(--ui-border));
}
.template-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
  padding: 12px;
}
.template-grid-wide {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.template-grid button {
  display: grid;
  place-items: center;
  min-height: 64px;
  overflow-x: auto;
  padding: 10px 6px;
  border: 1px solid rgb(var(--ui-line));
  background: rgb(var(--ui-surface));
  font-size: 16px;
}
.template-grid button:hover {
  border-color: rgb(var(--ui-link));
  background: rgb(var(--ui-inset));
}
.formula-workspace {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.formula-workspace > section {
  min-width: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid rgb(var(--ui-border));
}
.workspace-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 50px;
  padding: 8px 12px;
  background: rgb(var(--ui-inset));
  border-bottom: 1px solid rgb(var(--ui-line));
}
.math-input-host {
  flex: 1;
  min-height: 160px;
  padding: 16px 12px;
}
.math-input-host :deep(math-field) {
  display: block;
  width: 100%;
  min-height: 90px;
  padding: 12px 4px;
  border: none;
  background: transparent;
  color: rgb(var(--ui-text));
  font-size: 24px;
  --caret-color: rgb(var(--ui-link));
  --selection-background-color: rgb(var(--ui-secondary) / 0.3);
  --selection-color: rgb(var(--ui-text));
  --contains-highlight-background-color: rgb(var(--ui-secondary) / 0.15);
}
.math-input-host :deep(math-field:focus-within) {
  outline: 2px solid rgb(var(--ui-link));
  outline-offset: 2px;
}
.math-input-host :deep(math-field::part(virtual-keyboard-toggle)),
.math-input-host :deep(math-field::part(menu-toggle)) {
  display: none;
}
.latex-source {
  flex: 1;
  display: block;
  width: 100%;
  min-height: 160px;
  resize: vertical;
  padding: 16px;
  color: rgb(var(--ui-text));
  background: transparent;
  font-family: monospace;
  line-height: 1.8;
  border: none;
  outline: none;
}
.latex-source:focus {
  box-shadow: inset 0 0 0 2px rgb(var(--ui-link));
}
.input-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-top: 1px solid rgb(var(--ui-line));
  padding: 8px 12px;
  color: rgb(var(--ui-muted));
  font-size: 11px;
}
.input-footer button {
  color: rgb(var(--ui-link));
}
.preview-output {
  flex: 1;
  display: grid;
  place-items: center;
  min-height: 195px;
  padding: 20px;
  overflow-x: auto;
  font-size: 20px;
}
.formula-error {
  padding: 10px 12px;
  color: rgb(var(--ui-danger));
  border-left: 3px solid currentColor;
  background: rgb(var(--ui-danger) / 0.08);
  word-break: break-word;
  font-size: 12px;
}
button:focus-visible {
  outline: 2px solid rgb(var(--ui-link));
  outline-offset: 2px;
}
@media (max-width: 640px) {
  .formula-workspace {
    grid-template-columns: 1fr;
  }
  .template-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .template-grid-wide {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .category-tabs button {
    padding: 8px;
  }
  .preview-output {
    min-height: 120px;
  }
}
</style>
