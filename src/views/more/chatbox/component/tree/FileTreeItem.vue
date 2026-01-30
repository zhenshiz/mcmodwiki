<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  node: { type: Object, required: true },
  level: { type: Number, default: 0 },
  selectedPath: { type: String, default: '' }
})

const emit = defineEmits(['toggle', 'select'])

// 缩进计算
const indentStyle = computed(() => ({
  paddingLeft: `${props.level * 12 + 12}px`
}))

// 图标逻辑
const iconName = computed(() => {
  if (props.node.isFolder) {
    return props.node.isOpen ? 'lucide:folder-open' : 'lucide:folder'
  }
  // 根据我们的解析类型返回图标
  if (props.node.type === 'theme') return 'lucide:palette' // 主题文件
  if (props.node.type === 'dialogue') return 'lucide:message-square-more' // 对话文件
  return 'lucide:file'
})

const iconColor = computed(() => {
  if (props.node.isFolder) return 'text-yellow-500'
  if (props.node.type === 'theme') return 'text-purple-400'
  if (props.node.type === 'dialogue') return 'text-blue-400'
  return 'text-gray-400'
})

const handleClick = () => {
  if (props.node.isFolder) {
    emit('toggle', props.node)
  } else {
    emit('select', props.node)
  }
}
</script>

<template>
  <div>
    <div
      class="flex items-center py-1 cursor-pointer select-none hover:bg-[#2a2d2e] transition-colors text-sm border-l-2 border-transparent"
      :class="{ 'bg-[#37373d] border-blue-500': !node.isFolder && selectedPath === node.path }"
      :style="indentStyle"
      @click="handleClick"
    >
      <Icon
        v-if="node.isFolder"
        icon="lucide:chevron-right"
        class="w-3 h-3 mr-1 text-gray-500 transition-transform duration-200 shrink-0"
        :class="{ 'rotate-90': node.isOpen }"
      />
      <div v-else class="w-4 h-4 shrink-0"></div>

      <Icon :icon="iconName" class="w-4 h-4 mr-2 shrink-0" :class="iconColor" />

      <span class="truncate text-gray-300" :class="{ 'text-white font-medium': selectedPath === node.path }">
        {{ node.name }}
      </span>
    </div>

    <div v-if="node.isFolder && node.isOpen">
      <FileTreeItem
        v-for="child in node.children"
        :key="child.path"
        :node="child"
        :level="level + 1"
        :selected-path="selectedPath"
        @toggle="emit('toggle', $event)"
        @select="emit('select', $event)"
      />
    </div>
  </div>
</template>
