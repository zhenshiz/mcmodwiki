<template>
  <node-view-wrapper class="steps-wrapper my-8">
    <div
      class="steps-main-container p-4 border rounded-xl transition-all duration-300"
      :class="isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-gray-50/50 border-gray-200'"
      @mousedown="handleMouseDown"
    >
      <div class="flex items-center justify-center gap-4 mb-6 select-none">
        <div v-for="(_, index) in stepCount" :key="index" class="flex items-center flex-1">
          <div
            @click.stop="selectStep(index)"
            class="w-10 h-10 rounded-full flex items-center justify-center font-bold cursor-pointer transition-all border-2"
            :class="currentStep === index
              ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20'
              : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-400'"
          >
            {{ index + 1 }}
          </div>
          <div v-if="index < stepCount - 1"
               class="flex-1 h-0.5 mx-2 bg-gray-200 dark:bg-slate-800"></div>
        </div>
        <button v-if="editor.isEditable" @click.stop="addStep"
                class="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 rounded-full transition-colors">
          <Icon icon="lucide:plus" class="w-5 h-5" />
        </button>
      </div>

      <div class="steps-content-area min-h-[120px]">
        <node-view-content
          class="steps-mount-point"
          :data-active-index="currentStep"
        />
      </div>
    </div>
  </node-view-wrapper>
</template>

<script setup>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { usePageStore } from '@/stores/index.js'

const props = defineProps(nodeViewProps)
const isDark = computed(() => usePageStore().isDark)

const stepCount = computed(() => props.node.childCount)
const currentStep = computed(() => props.node.attrs.currentStep || 0)

const selectStep = (index) => {
  props.updateAttributes({ currentStep: index })
}

// 核心修复：处理鼠标按下事件以强制聚焦
const handleMouseDown = (event) => {
  // 如果点击的是按钮或导航圆圈，不干预
  if (event.target.closest('button') || event.target.closest('.rounded-full')) return

  const { editor, getPos, node } = props
  let offset = 1

  // 计算当前步骤的 Pos 偏移量
  for (let i = 0; i < currentStep.value; i++) {
    offset += node.child(i).nodeSize
  }

  // 强制光标进入当前步骤的内容节点 (跳过 stepItem 开关和 Title 节点)
  const targetPos = getPos() + offset + node.child(currentStep.value).firstChild.nodeSize + 2

  // 使用 requestAnimationFrame 确保在浏览器默认事件后执行聚焦
  requestAnimationFrame(() => {
    editor.commands.focus(targetPos)
  })
}

const addStep = () => {
  const newStep = {
    type: 'stepItem',
    content: [
      {
        type: 'admonitionTitle',
        content: [{ type: 'text', text: `第 ${stepCount.value + 1} 步` }]
      },
      { type: 'admonitionContent', content: [{ type: 'paragraph' }] }
    ]
  }
  props.editor.chain().focus()
    .insertContentAt(props.getPos() + props.node.nodeSize - 1, newStep)
    .run()
}
</script>

<style lang="scss" scoped>
.steps-mount-point {
  display: block;
  position: relative;

  :deep(> *) {
    display: none !important;
  }

  /* 使用属性选择器精准控制当前步骤显示 */
  @for $i from 0 through 15 {
    &[data-active-index="#{$i}"] {
      :deep(> *:nth-child(#{$i + 1})) {
        display: block !important;
        animation: stepFadeIn 0.3s ease-out;
      }
    }
  }
}

/* 深色模式样式优化 */
:deep([data-type="step-item"]) {
  @apply rounded-lg border transition-colors;
  @apply bg-white border-gray-100;
  @apply dark:bg-slate-900/80 dark:border-slate-800;

  [data-type="admonition-title"] {
    @apply px-4 py-2 font-bold text-sm border-b;
    @apply bg-gray-50/50 text-gray-700 border-gray-100;
    @apply dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-800;
  }

  [data-type="admonition-content"] {
    @apply p-4 min-h-[80px] text-gray-600 dark:text-slate-400;
    outline: none !important;
  }
}

@keyframes stepFadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
