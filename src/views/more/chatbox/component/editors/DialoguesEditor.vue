<script setup>
import { useChatBoxEditorStore } from '@/stores'
import DialogueList from './DialogueList.vue'
import DialogueGraph from './DialogueGraph.vue'
import { t } from '@/languages/index.js'
const store = useChatBoxEditorStore()
</script>

<template>
  <section class="dialogue-editor flex flex-col w-full h-full bg-ui-bg text-ui-text" @mousedown.stop @wheel.stop>
    <header class="flex flex-wrap items-center gap-2 p-2 border-b border-ui-line bg-ui-surface text-xs shrink-0">
      <strong class="mr-auto">{{ t('剧情编辑器') }}</strong>
      <div class="flex border border-ui-line" role="group" :aria-label="t('编辑视图')">
        <button v-for="mode in ['graph', 'list']" :key="mode" class="px-3 py-1.5" :class="store.dialogueEditorView === mode ? 'bg-ui-secondary text-ui-on-accent' : 'hover:bg-ui-inset'" :aria-pressed="store.dialogueEditorView === mode" @click="store.dialogueEditorView = mode">{{ mode === 'graph' ? t('流程图') : t('列表') }}</button>
      </div>
      <button class="px-2 py-1.5 border border-ui-line hover:bg-ui-inset" :aria-expanded="store.dialogueDiagnosticsOpen" @click="store.dialogueDiagnosticsOpen = !store.dialogueDiagnosticsOpen">
        {{ t('检查') }} · {{ store.dialogueAnalysis.diagnostics.filter(item => item.severity === 'error').length }} {{ t('错误') }}
      </button>
    </header>
    <div class="flex-1 min-h-0">
      <DialogueGraph v-if="store.dialogueEditorView === 'graph' && store.currentModel" />
      <DialogueList v-else />
    </div>
  </section>
</template>
