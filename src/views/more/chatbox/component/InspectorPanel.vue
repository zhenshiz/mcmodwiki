<script setup>
import { computed } from 'vue'
import { useChatBoxEditorStore } from '@/stores'
import { Icon } from '@iconify/vue'
import Inspector from '@/components/form/Inspector.vue'

const store = useChatBoxEditorStore()

const target = computed(() => store.selectedComponent)
const clazz = computed(() => store.selectedComponentClass)
const rootModel = computed(() => store.currentModel)
</script>

<template>
  <div class="flex flex-col h-full bg-[#002941] text-slate-300 select-none">

    <div
      class="px-3 py-1 text-xs font-bold uppercase bg-[#001529] text-slate-400 border-b border-slate-700 flex justify-between items-center h-[30px] shrink-0">
      <span>Inspector</span>

      <span v-if="target"
        class="text-[10px] text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded border border-blue-400/20">
        {{ clazz?.name || target.constructor.name }}
        <span v-if="isArrayTarget" class="text-slate-500 ml-1">[List]</span>
      </span>
      <span v-else-if="rootModel"
        class="text-[10px] text-purple-400 bg-purple-400/10 px-1.5 py-0.5 rounded border border-purple-400/20">
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

      <div v-else class="flex-1 flex flex-col items-center justify-center text-slate-500 gap-2 opacity-50 h-full">
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
  background-color: #334155;
  border-radius: 2px;
}
</style>
