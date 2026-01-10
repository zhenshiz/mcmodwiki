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
    <div @click="handleClick"
         class="flex items-center py-1.5 px-2 rounded-md cursor-pointer text-sm mb-0.5 transition-all"
         :class="activeFile === item.fullPath ? 'bg-blue-500/10 text-blue-500' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/60'">
      <div class="w-4 h-4 flex items-center justify-center mr-1.5">
        <Icon v-if="item.children?.length"
              :icon="isOpen ? 'lucide:chevron-down' : 'lucide:chevron-right'" class="opacity-50" />
      </div>
      <span class="truncate">{{ item.label }}</span>
    </div>

    <div v-if="isOpen && item.children?.length"
         class="ml-3.5 pl-3 border-l border-gray-100 dark:border-slate-800">
      <TreeItem v-for="child in item.children" :key="child.label" :item="child"
                :active-file="activeFile" @select="f => emit('select', f)" />
    </div>
  </div>
</template>
