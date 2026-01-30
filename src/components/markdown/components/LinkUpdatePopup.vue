<template>
  <div class="bubble-menu-wrapper">
    <div v-if="editor.isActive('link')" class="link-edit-group">
      <input
        v-model="linkHref"
        class="link-input"
        placeholder="https://..."
        @keydown.enter="updateLink"
      />
      <button @click="updateLink">{{ t('确定') }}</button>
      <button @click="unlink" class="hover:text-red-500">
        <Icon icon="lucide:link-2-off" />
      </button>
    </div>

    <div v-else class="format-group">
      <button
        v-for="item in actions"
        :key="item.icon"
        :class="{ 'is-active': item.isActive() }"
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

const props = defineProps({
  editor: { type: Object, required: true }
})

const linkHref = ref('')

// 监听选区变化，如果是链接则自动填充 URL
watch(() => props.editor.isActive('link'), (active) => {
  if (active) {
    linkHref.value = props.editor.getAttributes('link').href || ''
  }
}, { immediate: true })

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
    action: () => props.editor.chain().focus().toggleBold().run(),
    isActive: () => props.editor.isActive('bold')
  },
  {
    icon: 'lucide:italic',
    action: () => props.editor.chain().focus().toggleItalic().run(),
    isActive: () => props.editor.isActive('italic')
  },
  {
    icon: 'lucide:strikethrough',
    action: () => props.editor.chain().focus().toggleStrike().run(),
    isActive: () => props.editor.isActive('strike')
  },
  {
    icon: 'lucide:superscript',
    action: () => props.editor.chain().focus().toggleSuperscript().run(),
    isActive: () => props.editor.isActive('superscript')
  },
  {
    icon: 'lucide:subscript',
    action: () => props.editor.chain().focus().toggleSubscript().run(),
    isActive: () => props.editor.isActive('subscript')
  },
  {
    icon: 'material-symbols:visibility-off-outline',
    action: () => props.editor.chain().focus().toggleHiddenText().run(),
    isActive: () => props.editor.isActive('hiddenText')
  },
  {
    icon: 'lucide:align-left',
    action: () => props.editor.chain().focus().setTextAlign('left').run(),
    isActive: () => props.editor.isActive({ textAlign: 'left' })
  },
  {
    icon: 'lucide:align-center',
    action: () => props.editor.chain().focus().setTextAlign('center').run(),
    isActive: () => props.editor.isActive({ textAlign: 'center' })
  },
  {
    icon: 'lucide:align-right',
    action: () => props.editor.chain().focus().setTextAlign('right').run(),
    isActive: () => props.editor.isActive({ textAlign: 'right' })
  },
  {
    icon: 'lucide:link',
    action: () => {
      props.editor.chain().focus().setLink({ href: '' }).run()
    },
    isActive: () => props.editor.isActive('link')
  }
]
</script>

<style lang="scss" scoped>
.bubble-menu-wrapper {
  @apply flex items-center bg-white dark:bg-dark-blue border border-text-blue rounded-lg shadow-xl overflow-hidden p-1;

  button {
    @apply p-2 rounded hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors;
    &.is-active {
      @apply text-blue-500 bg-blue-50 dark:bg-slate-800;
    }
  }

  .link-input {
    @apply w-48 px-2 py-1 bg-transparent outline-none text-sm border-none;
  }
}
</style>
