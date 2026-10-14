<template>
  <node-view-wrapper class="steps-wrapper my-8">
    <div
      class="steps-main-container p-4 border rounded-none transition-all duration-300"
      :class="isDark ? 'bg-ui-surface/40 border-ui-line' : 'bg-ui-surface/50 border-ui-line'"
      @mousedown="handleMouseDown"
    >
      <div class="flex items-center justify-center gap-4 mb-6 select-none">
        <div v-for="(_, index) in stepCount" :key="index" class="flex items-center flex-1">
          <div
            @click.stop="selectStep(index)"
            class="step-trigger w-10 h-10 rounded-none flex items-center justify-center font-bold cursor-pointer transition-all border-2"
            :class="currentStep === index
              ? 'bg-ui-primary border-ui-border text-ui-on-accent'
              : 'bg-white dark:bg-ui-inset border-ui-line dark:border-ui-line text-ui-muted'"
          >
            {{ index + 1 }}
          </div>
          <div v-if="index < stepCount - 1"
               class="flex-1 h-0.5 mx-2 bg-ui-inset dark:bg-ui-inset"></div>
        </div>
        <button v-if="editor.isEditable" @click.stop="addStep"
                class="p-2 hover:bg-ui-secondary dark:hover:bg-ui-secondary/20 text-ui-link rounded-none transition-colors">
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
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { usePageStore } from '@/stores/index.js'

const props = defineProps(nodeViewProps)
const isDark = computed(() => usePageStore().isDark)

const stepCount = computed(() => props.node.childCount)
const readOnlyStep = ref(0)
const currentStep = computed(() => {
  if (!props.editor.isEditable) return readOnlyStep.value
  return props.node.attrs.currentStep || 0
})

const selectStep = (index) => {
  if (!props.editor.isEditable) {
    readOnlyStep.value = index
  } else {
    props.updateAttributes({ currentStep: index })
  }
}

// 核心修复：处理鼠标按下事件以强制聚焦
const handleMouseDown = (event) => {
  // 如果点击的是按钮或导航圆圈，不干预
  if (event.target.closest('button') || event.target.closest('.step-trigger')) return

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
        content: [{ type: 'text', text: t('第{}步', stepCount.value + 1) }]
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
  @apply rounded-none border transition-colors;
  @apply bg-white border-ui-line;
  @apply dark:bg-ui-surface/80 dark:border-ui-line;

  [data-type="admonition-title"] {
    @apply px-4 py-2 font-bold text-sm border-b;
    @apply bg-ui-surface/50 text-ui-text border-ui-line;
    @apply dark:bg-ui-inset/50 dark:text-ui-text dark:border-ui-line;
  }

  [data-type="admonition-content"] {
    @apply p-4 min-h-[80px] text-ui-muted dark:text-ui-muted;
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
