<template>
  <node-view-wrapper class="admonition-wrapper my-5">
    <div
      class="admonition-container rounded-lg border-l-4 shadow-sm transition-all duration-300"
      :class="[theme.container, theme.textColor]"
    >
      <div class="admo-icon-fixed flex items-center px-4 py-2 pointer-events-none">
        <Icon :icon="theme.icon" class="w-5 h-5 mr-2" />
      </div>

      <node-view-content class="admo-editor-root" />
    </div>
  </node-view-wrapper>
</template>

<script setup>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps(nodeViewProps)

const themeMap = {
  info: {
    container: 'bg-cyan-50/50 border-cyan-500 dark:bg-cyan-950/30 dark:border-cyan-800',
    textColor: 'text-cyan-800 dark:text-cyan-300',
    icon: 'material-symbols:info-outline'
  },
  warning: {
    container: 'bg-rose-50/50 border-rose-400 dark:bg-rose-950/30 dark:border-rose-900',
    textColor: 'text-rose-900 dark:text-rose-300',
    icon: 'material-symbols:warning-outline-rounded'
  },
  important: {
    container: 'bg-amber-50/50 border-amber-400 dark:bg-amber-950/30 dark:border-amber-900',
    textColor: 'text-amber-900 dark:text-amber-300',
    icon: 'material-symbols:priority-high-rounded'
  }
}

const theme = computed(() => themeMap[props.node.attrs.type] || themeMap.info)
</script>

<style lang="scss" scoped>
.admonition-container {
  display: flex;
  flex-direction: column;
  position: relative;
}

.admo-icon-fixed {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  color: currentColor;
}

:deep(.admo-editor-root) {
  display: flex;
  flex-direction: column;
  color: inherit;

  & > [data-type="admonition-title"] {
    padding: 0.5rem 1rem 0.5rem 3rem;
    font-weight: bold;
    outline: none;
    min-height: 2.5rem;
    display: flex;
    align-items: center;
    color: inherit;
    border-bottom: 1px solid rgba(var(--border-color, 0, 0, 0), 0.1);
  }

  & > [data-type="admonition-content"] {
    padding: 0.75rem 1rem;
    font-size: 14px;
    line-height: 1.6;
    outline: none;
    min-height: 3rem;
    color: inherit; // 正文也使用匹配的颜色

    p {
      color: inherit;
      margin-bottom: 0.5rem;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
