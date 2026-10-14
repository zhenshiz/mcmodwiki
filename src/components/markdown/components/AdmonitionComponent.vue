<template>
  <node-view-wrapper class="admonition-wrapper my-5">
    <div
      class="admonition-container border border-ui-line border-l-4 transition-colors"
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
  info: { container: 'admonition-info', textColor: 'text-ui-text', icon: 'lucide:info' },
  warning: { container: 'admonition-warning', textColor: 'text-ui-text', icon: 'lucide:triangle-alert' },
  important: { container: 'admonition-important', textColor: 'text-ui-text', icon: 'lucide:circle-alert' }
}

const theme = computed(() => themeMap[props.node.attrs.type] || themeMap.info)
</script>

<style lang="scss" scoped>
.admonition-info { background: rgb(var(--ui-info-bg)); border-left-color: rgb(var(--ui-link)); }
.admonition-warning { background: rgb(var(--ui-warning-bg)); border-left-color: rgb(var(--ui-warning)); }
.admonition-important { background: rgb(var(--ui-danger-bg)); border-left-color: rgb(var(--ui-danger)); }

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
