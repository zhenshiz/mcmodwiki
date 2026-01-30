<script setup>
import { Icon } from '@iconify/vue'
import Popover from '@/components/Popover.vue' 

defineProps({
  label: { type: String, required: true },
  tips: { type: String, default: '' },
  isModified: { type: Boolean, default: false }
})

const emit = defineEmits(['reset'])
</script>

<template>
  <div class="flex items-center justify-between min-h-[28px] mb-2 group">
    
    <div class="flex items-center w-1/3 min-w-[80px] pr-2 select-none relative">
      
      <div 
        v-if="isModified" 
        class="absolute -left-2 top-1/2 -translate-y-1/2 w-[3px] h-full bg-blue-500 rounded-r"
      ></div>

      <Popover 
        v-if="tips" 
        trigger="hover" 
        placement="top-start" 
        :offset="10"
        class="flex-1 min-w-0" 
      >
        <template #trigger>
          <span 
            class="
              block text-xs font-medium truncate transition-colors cursor-help
              decoration-dashed underline underline-offset-4 decoration-slate-500/30
            "
            :class="isModified ? 'text-blue-400 font-bold' : 'text-gray-400 dark:text-gray-400 group-hover:text-gray-300'"
          >
            {{ label }}
          </span>
        </template>
        
        <div class="max-w-[200px] text-xs leading-5 break-words">
          {{ tips }}
        </div>
      </Popover>

      <span 
        v-else
        class="text-xs font-medium truncate transition-colors cursor-default"
        :class="isModified ? 'text-blue-400 font-bold' : 'text-gray-400 dark:text-gray-400 group-hover:text-gray-300'"
      >
        {{ label }}
      </span>

    </div>

    <div class="flex-1 flex items-center relative min-w-0">
      <slot></slot>

      <button
        v-if="isModified"
        @click="$emit('reset')"
        class="
          absolute -right-5 opacity-0 group-hover:opacity-100 transition-opacity
          p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700
          text-gray-400 hover:text-white z-10
        "
        title="重置为默认值"
      >
        <Icon icon="lucide:rotate-ccw" width="12" />
      </button>
    </div>
  </div>
</template>