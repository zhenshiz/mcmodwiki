<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Modal from '@/components/Modal.vue'
import Button from '@/components/Button.vue'
import { usePageStore } from '@/stores/index.js'
import { t } from '@/languages'
import { mermaidTemplates } from '@/components/markdown/mermaidTemplates.js'
import { renderMermaid } from '@/components/markdown/mermaidRenderer.js'

const emit = defineEmits(['apply', 'close'])
const show = ref(true)
const selectedId = ref(mermaidTemplates[0].id)
const selected = computed(() => mermaidTemplates.find((item) => item.id === selectedId.value))
const previewSvg = ref('')
const error = ref('')
const loading = ref(false)
const isDark = computed(() => usePageStore().isDark)
const teleportTo = document.fullscreenElement || 'body'
let renderVersion = 0

watch(
  [selected, isDark],
  async () => {
    const version = ++renderVersion
    loading.value = true
    error.value = ''
    previewSvg.value = ''
    try {
      const svg = await renderMermaid(selected.value.code, isDark.value)
      if (version === renderVersion) previewSvg.value = svg
    } catch (e) {
      if (version === renderVersion) error.value = e.message
    } finally {
      if (version === renderVersion) loading.value = false
    }
  },
  { immediate: true },
)
onBeforeUnmount(() => {
  renderVersion++
})

const applyTemplate = () => {
  emit('apply', selected.value.code)
  show.value = false
}
</script>

<template>
  <Modal
    v-model:show="show"
    :title="t('Mermaid 图表模板')"
    :width="1040"
    :teleport-to="teleportTo"
    @after-leave="emit('close')"
  >
    <p class="mb-4 text-sm text-ui-muted">
      {{ t('选择图表类型，预览后使用模板，再修改源码中的名称、关系和数值。') }}
    </p>
    <div class="template-workspace">
      <div class="template-list" role="group" :aria-label="t('图表类型')">
        <button
          v-for="item in mermaidTemplates"
          :key="item.id"
          type="button"
          :aria-pressed="selectedId === item.id"
          @click="selectedId = item.id"
        >
          <span>{{ t(item.label) }}</span
          ><Icon v-if="selectedId === item.id" icon="lucide:check" width="16" />
        </button>
      </div>
      <div class="template-details">
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-base font-bold">{{ t(selected.label) }}</h3>
          <span class="mc-tag">{{ selected.keyword }}</span>
        </div>
        <div class="template-preview" :aria-label="t('图表预览')" :aria-busy="loading">
          <p v-if="loading" class="text-sm text-ui-muted">{{ t('正在绘制图表…') }}</p>
          <p v-else-if="error" class="text-sm text-ui-danger" role="alert">{{ error }}</p>
          <div v-else v-html="previewSvg"></div>
        </div>
        <label for="mermaid-template-source" class="mc-label">{{ t('Mermaid 源码') }}</label>
        <textarea
          id="mermaid-template-source"
          :value="selected.code"
          readonly
          spellcheck="false"
          :aria-label="t('模板源码')"
          class="template-source"
        ></textarea>
      </div>
    </div>
    <template #footer>
      <div class="template-footer">
        <span class="text-xs text-ui-muted">{{ t('使用模板将替换当前图表的源码，可撤销。') }}</span>
        <div class="flex gap-3 shrink-0">
          <Button @click="show = false">{{ t('取消') }}</Button
          ><Button variant="primary" :disabled="loading || !!error" @click="applyTemplate">{{
            t('使用模板')
          }}</Button>
        </div>
      </div>
    </template>
  </Modal>
</template>

<style scoped>
.template-workspace {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  gap: 20px;
}
.template-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
  max-height: 480px;
  overflow-y: auto;
  padding: 6px;
  border: 1px solid rgb(var(--ui-line));
  background: rgb(var(--ui-inset));
}
.template-list button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 8px 10px;
  text-align: left;
  font-size: 13px;
}
.template-list button:hover {
  background: rgb(var(--ui-surface));
}
.template-list button[aria-pressed='true'] {
  background: rgb(var(--ui-primary));
  color: rgb(var(--ui-on-accent));
  font-weight: 700;
}
.template-list button:focus-visible {
  outline: 2px solid rgb(var(--ui-link));
  outline-offset: -2px;
}
.template-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}
.template-preview {
  display: grid;
  align-items: center;
  min-height: 200px;
  height: 260px;
  overflow: auto;
  padding: 16px;
  border: 1px solid rgb(var(--ui-line));
  background: rgb(var(--ui-surface));
}
.template-preview > div {
  min-height: 0;
  width: 100%;
  height: 100%;
}
.template-preview > div > :deep(svg) {
  display: block;
  max-width: 100%;
  width: 100%;
  height: 100%;
  margin: auto;
}
.template-source {
  width: 100%;
  min-height: 135px;
  height: 160px;
  resize: vertical;
  padding: 12px;
  border: 1px solid rgb(var(--ui-line));
  background: rgb(var(--ui-inset));
  font-family: monospace;
  font-size: 12px;
  line-height: 1.6;
  color: rgb(var(--ui-text));
}
.template-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
  width: 100%;
}
@media (max-width: 640px) {
  .template-workspace {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .template-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    max-height: 165px;
  }
  .template-list button {
    font-size: 12px;
    padding: 8px 6px;
  }
  .template-preview {
    height: 220px;
  }
  .template-footer > div {
    margin-left: auto;
  }
}
</style>
