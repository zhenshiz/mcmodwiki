<template>
  <div class="bubble-menu-wrapper" role="toolbar" :aria-label="t('文本样式')">
    <div v-if="editor.isActive('link')" class="link-edit-group">
      <input
        v-model="linkHref"
        class="link-input"
        placeholder="https://..."
        @keydown.enter="updateLink"
      />
      <button type="button" @mousedown.prevent @click="updateLink">{{ t('确定') }}</button>
      <button
        type="button"
        :aria-label="t('移除链接')"
        @mousedown.prevent
        @click="unlink"
        class="hover:text-red-500"
      >
        <Icon icon="lucide:link-2-off" />
      </button>
    </div>

    <div v-else class="format-group">
      <button
        v-for="item in actions"
        :key="item.icon"
        :class="{ 'is-active': item.isActive() }"
        type="button"
        :title="t(item.label)"
        :aria-label="t(item.label)"
        :aria-pressed="item.isActive()"
        @mousedown.prevent
        @click="item.action"
      >
        <Icon :icon="item.icon" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { t } from '@/languages'

const props = defineProps({
  editor: { type: Object, required: true },
})

const linkHref = ref('')

// 监听选区变化，如果是链接则自动填充 URL
watch(
  () => props.editor.isActive('link'),
  (active) => {
    if (active) {
      linkHref.value = props.editor.getAttributes('link').href || ''
    }
  },
  { immediate: true },
)

const updateLink = () => {
  if (linkHref.value) {
    // 使用 extendMarkRange 确保修改的是整个链接
    props.editor.chain().focus().extendMarkRange('link').setLink({ href: linkHref.value }).run()
  } else {
    props.editor.chain().focus().unsetLink().run()
  }
}

const unlink = () => {
  props.editor.chain().focus().unsetLink().run()
}

const actions = [
  {
    icon: 'lucide:bold',
    label: '加粗',
    action: () => props.editor.chain().focus().toggleBold().run(),
    isActive: () => props.editor.isActive('bold'),
  },
  {
    icon: 'lucide:italic',
    label: '斜体',
    action: () => props.editor.chain().focus().toggleItalic().run(),
    isActive: () => props.editor.isActive('italic'),
  },
  {
    icon: 'lucide:strikethrough',
    label: '删除线',
    action: () => props.editor.chain().focus().toggleStrike().run(),
    isActive: () => props.editor.isActive('strike'),
  },
  {
    icon: 'lucide:superscript',
    label: '上标',
    action: () => props.editor.chain().focus().toggleSuperscript().run(),
    isActive: () => props.editor.isActive('superscript'),
  },
  {
    icon: 'lucide:subscript',
    label: '下标',
    action: () => props.editor.chain().focus().toggleSubscript().run(),
    isActive: () => props.editor.isActive('subscript'),
  },
  {
    icon: 'lucide:code-xml',
    label: '行内代码',
    action: () => props.editor.chain().focus().toggleCode().run(),
    isActive: () => props.editor.isActive('code'),
  },
  {
    icon: 'material-symbols:visibility-off-outline',
    label: '隐藏文本',
    action: () => props.editor.chain().focus().toggleHiddenText().run(),
    isActive: () => props.editor.isActive('hiddenText'),
  },
  {
    icon: 'lucide:align-left',
    label: '左对齐',
    action: () => props.editor.chain().focus().setTextAlign('left').run(),
    isActive: () => props.editor.isActive({ textAlign: 'left' }),
  },
  {
    icon: 'lucide:align-center',
    label: '居中对齐',
    action: () => props.editor.chain().focus().setTextAlign('center').run(),
    isActive: () => props.editor.isActive({ textAlign: 'center' }),
  },
  {
    icon: 'lucide:align-right',
    label: '右对齐',
    action: () => props.editor.chain().focus().setTextAlign('right').run(),
    isActive: () => props.editor.isActive({ textAlign: 'right' }),
  },
  {
    icon: 'lucide:link',
    label: '插入超链接',
    action: () => {
      props.editor.chain().focus().setLink({ href: '' }).run()
    },
    isActive: () => props.editor.isActive('link'),
  },
]
</script>

<style lang="scss" scoped>
.bubble-menu-wrapper {
  @apply bg-ui-surface text-ui-text border-2 border-ui-border p-1;
  max-width: calc(100vw - 24px);
  box-shadow: 3px 3px 0 rgb(var(--ui-shadow));

  .format-group,
  .link-edit-group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2px;
  }
  .format-group {
    max-width: 430px;
  }

  button {
    @apply p-2 rounded-none hover:bg-ui-inset transition-colors;
    display: grid;
    place-items: center;
    min-width: 36px;
    min-height: 36px;
    font-size: 18px;
    &.is-active {
      @apply text-ui-on-accent bg-ui-secondary;
    }
    &:focus-visible {
      outline: 2px solid rgb(var(--ui-link));
    }
  }

  .link-input {
    @apply px-2 py-1 bg-transparent outline-none text-sm border-none;
    width: 180px;
    min-width: 0;
    flex: 1;
  }
}
</style>
