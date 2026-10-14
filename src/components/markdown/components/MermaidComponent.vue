<script setup>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { usePageStore } from '@/stores/index.js'
import { t } from '@/languages'
import { useDialog } from '@/components/register/useDialog.js'
import MermaidTemplatePicker from '@/components/markdown/components/MermaidTemplatePicker.vue'
import { renderMermaid } from '@/components/markdown/mermaidRenderer.js'

const props = defineProps(nodeViewProps)
const localCode = ref(props.node.attrs.code)
const previewSvg = ref('')
const error = ref('')
const isOpen = ref(true)
const templatesVisible = ref(false)
const isDark = computed(() => usePageStore().isDark)

const showSourceArea = computed(() => {
  return props.editor.isEditable && !props.node.attrs.hideCode
})

let renderVersion = 0
const renderChart = async () => {
  const version = ++renderVersion
  error.value = ''
  if (!localCode.value.trim()) {
    previewSvg.value = ''
    return
  }
  try {
    const svg = await renderMermaid(localCode.value, isDark.value)
    if (version === renderVersion) previewSvg.value = svg
  } catch (e) {
    if (version === renderVersion) error.value = e.message || 'Syntax Error'
  }
}

// 监听主题变化，实时重绘图表
watch(isDark, renderChart)
watch(
  () => props.node.attrs.code,
  (code) => {
    localCode.value = code
  },
)
watch(localCode, renderChart, { immediate: true })
onBeforeUnmount(() => {
  renderVersion++
})

const handleUpdate = () => {
  props.updateAttributes({ code: localCode.value })
}
const applyTemplate = (code) => {
  localCode.value = code
  isOpen.value = true
  props.updateAttributes({ code, hideCode: false })
}

const confirmPermanentHide = () => {
  if (!props.editor.isEditable) return
  useDialog().warning({
    title: t('警告'),
    content: t('永久关闭后，该图表的源码编辑区将不再显示，确定吗？'),
    onPositiveClick: () => {
      props.updateAttributes({ hideCode: true })
    },
  })
}
</script>

<template>
  <node-view-wrapper
    class="mermaid-node my-4 overflow-hidden border rounded-none transition-all"
    :class="[
      isDark
        ? 'border-ui-line bg-ui-bg hover:border-ui-link/50'
        : 'border-ui-link bg-white hover:border-ui-link shadow-sm',
    ]"
  >
    <div
      class="flex justify-center p-6 min-h-[100px] relative transition-colors"
      :class="isDark ? 'bg-ui-surface/50' : 'bg-ui-surface'"
      contenteditable="false"
    >
      <div v-html="previewSvg" class="mermaid-preview w-full"></div>
      <div
        v-if="error"
        role="alert"
        class="absolute inset-0 flex items-center justify-center backdrop-blur-sm text-sm p-4 text-center font-mono"
        :class="isDark ? 'bg-red-900/20 text-red-400' : 'bg-red-50/80 text-red-600'"
      >
        ⚠️ {{ error }}
      </div>
    </div>

    <div
      v-if="showSourceArea"
      class="border-t"
      :class="isDark ? 'border-ui-line' : 'border-ui-link'"
    >
      <div
        class="flex flex-wrap gap-2 items-center justify-between px-3 py-2 select-none transition-colors"
        :class="isDark ? 'bg-ui-inset/80' : 'bg-ui-secondary/50'"
      >
        <button
          type="button"
          class="flex items-center gap-2 cursor-pointer group"
          :aria-expanded="isOpen"
          @mousedown.prevent
          @click="isOpen = !isOpen"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 transition-transform duration-200"
            :class="[
              isOpen ? 'rotate-90' : '',
              isDark
                ? 'text-ui-muted group-hover:text-ui-link'
                : 'text-ui-link group-hover:text-ui-link',
            ]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
          <div
            class="text-[10px] uppercase tracking-wider font-bold transition-colors"
            :class="
              isDark
                ? 'text-ui-muted group-hover:text-ui-link'
                : 'text-ui-link group-hover:text-ui-link'
            "
          >
            {{ t('Mermaid 源码') }}
          </div>
        </button>

        <div class="flex items-center gap-2 shrink-0">
          <button
            type="button"
            @mousedown.prevent
            @click="templatesVisible = true"
            class="mermaid-action bg-ui-surface border-ui-link text-ui-link hover:bg-ui-inset"
          >
            {{ t('图表模板') }}
          </button>
          <button
            type="button"
            @mousedown.prevent
            @click="confirmPermanentHide"
            class="mermaid-action transition-all"
            :class="
              isDark
                ? 'border-ui-line text-ui-muted hover:border-red-500/50 hover:text-red-400 bg-ui-surface'
                : 'border-ui-link text-ui-link hover:border-red-300 hover:text-red-500 bg-white'
            "
          >
            {{ t('永久关闭') }}
          </button>
        </div>
      </div>

      <div
        v-show="isOpen"
        class="overflow-hidden transition-colors"
        :class="isDark ? 'bg-ui-bg' : 'bg-white'"
      >
        <textarea
          v-model="localCode"
          :aria-label="t('Mermaid 源码')"
          @input="handleUpdate"
          spellcheck="false"
          class="w-full h-40 p-4 font-mono text-sm resize-y outline-none border-none leading-relaxed bg-transparent focus:ring-0"
          :class="isDark ? 'text-ui-link' : 'text-ui-text'"
          placeholder="Enter mermaid code..."
        ></textarea>
      </div>
    </div>
    <MermaidTemplatePicker
      v-if="templatesVisible"
      @apply="applyTemplate"
      @close="templatesVisible = false"
    />
  </node-view-wrapper>
</template>

<style scoped>
.rotate-90 {
  transform: rotate(90deg);
}
.mermaid-action {
  border-width: 1px;
  padding: 5px 8px;
  font-size: 11px;
  line-height: 1.4;
}
.mermaid-preview :deep(svg) {
  margin: auto;
  display: block;
}

:deep(svg) {
  max-width: 100%;
  height: auto;
}
</style>
