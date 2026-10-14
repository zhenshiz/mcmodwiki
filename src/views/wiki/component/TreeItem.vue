<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  item: { type: Object, required: true },
  activeFile: { type: String, default: '' }
})

const emit = defineEmits(['select'])
const isOpen = ref(true)

const handleClick = () => {
  if (props.item.fullPath) emit('select', props.item.fullPath)
  if (props.item.children?.length) isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="tree-item-container">
    <button type="button" @click="handleClick"
         :aria-current="activeFile === item.fullPath ? 'page' : undefined"
         :aria-expanded="item.children?.length ? isOpen : undefined"
         class="w-full text-left border-l-2 border-transparent flex items-center py-2 px-2 rounded-none cursor-pointer text-sm mb-0.5 transition-all"
         :class="activeFile === item.fullPath ? 'bg-ui-secondary/20 text-ui-text !border-ui-link font-semibold' : 'text-ui-muted dark:text-ui-text hover:bg-ui-surface dark:hover:bg-ui-inset/60'">
      <div class="w-4 h-4 flex items-center justify-center mr-1.5">
        <Icon v-if="item.children?.length"
              :icon="isOpen ? 'lucide:chevron-down' : 'lucide:chevron-right'" class="opacity-50" />
      </div>
      <span class="truncate">{{ item.label }}</span>
    </button>

    <div v-if="isOpen && item.children?.length"
         class="ml-3.5 pl-3 border-l border-ui-line dark:border-ui-line">
      <TreeItem v-for="child in item.children" :key="child.label" :item="child"
                :active-file="activeFile" @select="f => emit('select', f)" />
    </div>
  </div>
</template>