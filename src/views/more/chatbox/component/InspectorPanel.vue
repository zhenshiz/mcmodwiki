<script setup>
import { computed } from 'vue'
import { useChatBoxEditorStore } from '@/stores'
import { Icon } from '@iconify/vue'
import Inspector from '@/components/form/Inspector.vue'

const store = useChatBoxEditorStore()

const target = computed(() => store.selectedComponent)
const isArrayTarget = computed(() => Array.isArray(target.value))
const clazz = computed(() => store.selectedComponentClass)
const rootModel = computed(() => store.currentModel)
</script>

<template>
  <div class="flex flex-col h-full bg-ui-inset text-ui-text select-none">

    <div
      class="px-3 py-1 text-xs font-bold uppercase bg-ui-bg text-ui-muted border-b border-ui-line flex justify-between items-center h-[30px] shrink-0">
      <span>Inspector</span>

      <span v-if="target"
        class="text-[10px] text-ui-link bg-ui-secondary/10 px-1.5 py-0.5 rounded-none border border-ui-link/20">
        {{ clazz?.name || target.constructor.name }}
        <span v-if="isArrayTarget" class="text-ui-muted ml-1">[List]</span>
      </span>
      <span v-else-if="rootModel"
        class="text-[10px] text-purple-400 bg-purple-400/10 px-1.5 py-0.5 rounded-none border border-purple-400/20">
        Global Settings
      </span>
    </div>

    <div class="flex-1 overflow-y-auto custom-scrollbar p-2">

      <template v-if="target">
        <Inspector :model="target" :clazz="clazz" />
      </template>

      <template v-else-if="rootModel">
        <Inspector :model="rootModel" :clazz="clazz" />
      </template>

      <div v-else class="flex-1 flex flex-col items-center justify-center text-ui-muted gap-2 opacity-50 h-full">
        <Icon icon="lucide:box-select" width="40" stroke-width="1" />
        <span class="text-xs">{{ t('请先打开一个主题/对话文件') }}</span>
      </div>

    </div>

  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgb(var(--ui-line));
  border-radius: 2px;
}
</style>
