<script setup>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { ref, onMounted, computed, watch } from 'vue'
import mermaid from 'mermaid'
import { usePageStore } from '@/stores/index.js'

const props = defineProps(nodeViewProps)
const localCode = ref(props.node.attrs.code)
const previewContainer = ref(null)
const error = ref('')
const isOpen = ref(true)
const isDark = computed(() => usePageStore().isDark)

const initMermaid = () => {
  mermaid.initialize({
    startOnLoad: false,
    theme: isDark.value ? 'dark' : 'default',
    themeVariables: {
      primaryColor: '#80ccff',
      mainBkg: isDark.value ? '#1e293b' : '#f8fafc',
      lineColor: '#80ccff',
      fontSize: '14px',
    }
  })
}

const showSourceArea = computed(() => {
  return props.editor.isEditable && !props.node.attrs.hideCode
})

const renderChart = async () => {
  if (!localCode.value) return
  try {
    error.value = ''
    initMermaid()
    const id = `mmd-${Math.random().toString(36).substring(2, 7)}`
    const { svg } = await mermaid.render(id, localCode.value)
    if (previewContainer.value) {
      previewContainer.value.innerHTML = svg
    }
  } catch (e) {
    error.value = e.message || 'Syntax Error'
  }
}

// 监听主题变化，实时重绘图表
watch(isDark, () => {
  renderChart()
})

const handleUpdate = () => {
  props.updateAttributes({ code: localCode.value })
  renderChart()
}

const confirmPermanentHide = () => {
  if (!props.editor.isEditable) return
  if (window.confirm('永久关闭后，该图表的源码编辑区将不再显示，确定吗？')) {
    props.updateAttributes({ hideCode: true })
  }
}

onMounted(renderChart)
</script>

<template>
  <node-view-wrapper
    class="my-4 overflow-hidden border rounded-lg transition-all"
    :class="[
      isDark
        ? 'border-slate-700 bg-[#0d1117] hover:border-blue-500/50'
        : 'border-blue-100 bg-white hover:border-blue-400 shadow-sm'
    ]"
  >
    <div
      class="flex justify-center p-6 min-h-[100px] relative transition-colors"
      :class="isDark ? 'bg-slate-900/50' : 'bg-slate-50'"
      ref="previewContainer"
    >
      <div v-if="error"
           class="absolute inset-0 flex items-center justify-center backdrop-blur-sm text-sm p-4 text-center font-mono"
           :class="isDark ? 'bg-red-900/20 text-red-400' : 'bg-red-50/80 text-red-600'">
        ⚠️ {{ error }}
      </div>
    </div>

    <div v-if="showSourceArea" class="border-t" :class="isDark ? 'border-slate-700' : 'border-blue-100'">
      <div
        class="flex items-center justify-between px-3 py-2 select-none transition-colors"
        :class="isDark ? 'bg-slate-800/80' : 'bg-blue-50/50'"
      >
        <div class="flex items-center gap-2 cursor-pointer group" @click="isOpen = !isOpen">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 transition-transform duration-200"
            :class="[
              isOpen ? 'rotate-90' : '',
              isDark ? 'text-slate-400 group-hover:text-blue-400' : 'text-blue-400 group-hover:text-blue-600'
            ]"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
          <span
            class="text-[10px] uppercase tracking-wider font-bold transition-colors"
            :class="isDark ? 'text-slate-400 group-hover:text-blue-400' : 'text-blue-400 group-hover:text-blue-600'"
          >
            Mermaid 源码
          </span>
        </div>

        <button
          @click="confirmPermanentHide"
          class="text-[9px] px-2 py-0.5 rounded border transition-all"
          :class="isDark
            ? 'border-slate-600 text-slate-500 hover:border-red-500/50 hover:text-red-400 bg-slate-900'
            : 'border-blue-200 text-blue-400 hover:border-red-300 hover:text-red-500 bg-white'"
        >
          永久关闭
        </button>
      </div>

      <div v-show="isOpen" class="overflow-hidden transition-colors" :class="isDark ? 'bg-[#0d1117]' : 'bg-white'">
        <textarea
          v-model="localCode"
          @input="handleUpdate"
          spellcheck="false"
          class="w-full h-40 p-4 font-mono text-sm resize-y outline-none border-none leading-relaxed bg-transparent focus:ring-0"
          :class="isDark ? 'text-blue-400' : 'text-slate-700'"
          placeholder="Enter mermaid code..."
        ></textarea>
      </div>
    </div>
  </node-view-wrapper>
</template>

<style scoped>
.rotate-90 {
  transform: rotate(90deg);
}
</style>
