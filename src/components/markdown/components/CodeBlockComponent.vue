<template>
  <node-view-wrapper class="my-6 relative">
    <div
      class="rounded-xl border transition-all duration-300 overflow-hidden"
      :class="isDark ? 'border-slate-700 bg-[#0d1117]' : 'border-blue-100 bg-white'"
      :style="isFocused ? 'border-color: var(--blue-5); box-shadow: 0 0 12px var(--trans-blue-1);' : ''"
    >
      <div
        class="flex items-center justify-between px-4 py-2 border-b transition-colors select-none"
        :class="isDark ? 'border-slate-700 bg-slate-800/40' : 'border-blue-50 bg-blue-50/50'"
      >
        <div class="flex items-center gap-3">
          <div class="flex gap-1.5 mr-2">
            <div class="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
          </div>
          <span
            class="text-[10px] font-black tracking-widest uppercase italic opacity-80"
            style="color: var(--blue-5)"
          >
            {{ node.attrs.language }}
          </span>
        </div>

        <div class="flex items-center gap-4">
          <button
            @click="copyCode"
            class="flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded transition-all border border-transparent dark:hover:border-slate-600 dark:hover:bg-slate-700/50"
            :class="isDark ? 'text-slate-400' : 'text-blue-500 hover:bg-blue-50'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            {{ copied ? t('已复制') : t('复制代码') }}
          </button>

          <button
            @click="toggleClose"
            class="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-slate-400"
          >
            <svg class="w-3.5 h-3.5 transition-transform duration-200"
                 :class="{'rotate-180': node.attrs.isClosed}" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                    d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        v-show="!node.attrs.isClosed"
        class="relative overflow-hidden transition-colors"
        :class="isDark ? 'bg-[#0d1117]' : 'bg-slate-50/50'"
      >
        <code class="p-3 block min-w-full">
          <node-view-content />
        </code>
      </div>
    </div>
  </node-view-wrapper>
</template>

<script setup>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { computed, ref } from 'vue'
import { usePageStore } from '@/stores/index.js'
import { t } from '@/languages/index.js'

const props = defineProps(nodeViewProps)
const copied = ref(false)

const isDark = computed(() => usePageStore().isDark)
const isFocused = computed(() => props.selected || false)

const toggleClose = () => {
  props.updateAttributes({ isClosed: !props.node.attrs.isClosed })
}

const copyCode = () => {
  const code = props.node.textContent
  navigator.clipboard.writeText(code)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<style lang="scss" scoped>
</style>
