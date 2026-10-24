<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { t } from '@/languages'

const props = defineProps({
  editor: { required: true },
})

const widthInput = ref('')

const selectedImage = () => {
  const { selection } = props.editor.state
  return selection.node?.type.name === 'image' ? selection.node : null
}

const imageElement = () => {
  const { from } = props.editor.state.selection
  const element = props.editor.view.nodeDOM(from)

  if (element instanceof HTMLImageElement) return element
  return element?.querySelector?.('img') || null
}

const naturalWidth = () => {
  const node = selectedImage()
  const element = imageElement()
  const savedWidth = Number(node?.attrs.width)

  if (Number.isFinite(savedWidth) && savedWidth > 0) return savedWidth
  return element?.naturalWidth || element?.getBoundingClientRect().width || 0
}

const syncWidth = () => {
  const width = naturalWidth()
  widthInput.value = width ? String(Math.round(width)) : ''
}

const updateWidth = (width) => {
  const normalized = Math.round(Number(width))
  if (!Number.isFinite(normalized) || normalized < 1) return

  props.editor.chain().focus().updateAttributes('image', { width: normalized }).run()
  syncWidth()
}

const applyWidth = () => updateWidth(widthInput.value)

const setScale = (scale) => {
  const node = selectedImage()
  if (!node) return

  const element = imageElement()
  const originalWidth = element?.naturalWidth || Number(node.attrs.width) || naturalWidth()
  if (!originalWidth) return

  if (scale === 1) {
    props.editor.chain().focus().updateAttributes('image', { width: null }).run()
    syncWidth()
    return
  }

  updateWidth(originalWidth * scale)
}

const resetWidth = () => {
  props.editor.chain().focus().updateAttributes('image', { width: null }).run()
  syncWidth()
}

onMounted(() => {
  props.editor.on('selectionUpdate', syncWidth)
  props.editor.on('transaction', syncWidth)
  syncWidth()
})

onBeforeUnmount(() => {
  props.editor.off('selectionUpdate', syncWidth)
  props.editor.off('transaction', syncWidth)
})
</script>

<template>
  <div class="image-resize-menu" @mousedown.stop>
    <div class="image-resize-menu__title">
      <Icon icon="lucide:scaling" width="15" />
      <span>{{ t('图片缩放') }}</span>
    </div>
    <div class="image-resize-menu__presets" role="group" :aria-label="t('图片缩放')">
      <button type="button" :title="t('缩放到 50%')" @mousedown.prevent @click="setScale(0.5)">
        50%
      </button>
      <button type="button" :title="t('缩放到 75%')" @mousedown.prevent @click="setScale(0.75)">
        75%
      </button>
      <button type="button" :title="t('恢复原始大小')" @mousedown.prevent @click="setScale(1)">
        100%
      </button>
      <button type="button" :title="t('缩放到 125%')" @mousedown.prevent @click="setScale(1.25)">
        125%
      </button>
    </div>
    <label class="image-resize-menu__width">
      <span>{{ t('宽度') }}</span>
      <input
        v-model="widthInput"
        type="number"
        min="1"
        step="1"
        :aria-label="t('图片宽度（像素）')"
        @keydown.enter.prevent="applyWidth"
        @blur="applyWidth"
      />
      <span>px</span>
    </label>
    <button
      type="button"
      class="image-resize-menu__reset"
      :title="t('恢复原始大小')"
      @mousedown.prevent
      @click="resetWidth"
    >
      <Icon icon="lucide:rotate-ccw" width="14" />
      {{ t('原始') }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.image-resize-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 8px;
  border: 2px solid rgb(var(--ui-border));
  box-shadow: 3px 3px 0 rgb(var(--ui-shadow));
  background: rgb(var(--ui-surface));
  color: rgb(var(--ui-text));
  font-size: 12px;
  white-space: nowrap;
}

.image-resize-menu__title,
.image-resize-menu__presets,
.image-resize-menu__width,
.image-resize-menu__reset {
  display: inline-flex;
  align-items: center;
}

.image-resize-menu__title {
  gap: 5px;
  color: rgb(var(--ui-muted));
  font-weight: 700;
}

.image-resize-menu__presets {
  gap: 3px;

  button {
    min-width: 36px;
    padding: 4px 5px;
    border: 1px solid rgb(var(--ui-line));
    background: rgb(var(--ui-inset));
    color: inherit;
    cursor: pointer;

    &:hover {
      border-color: rgb(var(--ui-link));
      color: rgb(var(--ui-link));
    }
  }
}

.image-resize-menu__width {
  gap: 4px;
  color: rgb(var(--ui-muted));

  input {
    width: 64px;
    padding: 4px 5px;
    border: 1px solid rgb(var(--ui-line));
    background: rgb(var(--ui-bg));
    color: inherit;
    outline: none;

    &:focus {
      border-color: rgb(var(--ui-link));
    }
  }
}

.image-resize-menu__reset {
  gap: 4px;
  padding: 4px 6px;
  border: 1px solid transparent;
  color: rgb(var(--ui-muted));
  cursor: pointer;

  &:hover {
    border-color: rgb(var(--ui-line));
    color: rgb(var(--ui-link));
  }
}

@media (max-width: 640px) {
  .image-resize-menu {
    flex-wrap: wrap;
    max-width: min(94vw, 360px);
  }
}
</style>
