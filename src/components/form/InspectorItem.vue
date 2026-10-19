<script setup>
import { ref, useId } from 'vue'
import { Icon } from '@iconify/vue'
import Popover from '@/components/Popover.vue'

defineProps({
  label: { type: String, required: true },
  tips: { type: String, default: '' },
  isModified: { type: Boolean, default: false }
})

defineEmits(['reset'])
const tipsOpen = ref(false)
const tipsId = useId()
</script>

<template>
  <div class="flex items-center justify-between min-h-[28px] mb-2 group">

    <div class="flex items-center w-1/3 min-w-[80px] pr-2 select-none relative">

      <div
        v-if="isModified"
        class="absolute -left-2 top-1/2 -translate-y-1/2 w-[3px] h-full bg-ui-secondary rounded-r"
      ></div>

      <Popover
        v-if="tips"
        v-model:is-open="tipsOpen"
        trigger="hover"
        placement="top-start"
        :offset="10"
        class="flex-1 min-w-0"
      >
        <template #trigger>
          <span class="flex min-w-0 items-center gap-1 cursor-help">
            <span
              class="min-w-0 truncate text-xs font-medium transition-colors"
              :class="isModified ? 'text-ui-link font-bold' : 'text-ui-muted dark:text-ui-muted group-hover:text-ui-text'"
            >{{ label }}</span>
            <button
              type="button"
              :aria-label="label"
              :aria-describedby="tipsOpen ? tipsId : undefined"
              class="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center border border-ui-link/40 bg-ui-link/5 text-ui-link hover:border-ui-link hover:bg-ui-link/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ui-link cursor-help"
              @click.stop="tipsOpen = true"
              @focus="tipsOpen = true"
              @blur="tipsOpen = false"
            ><span aria-hidden="true" class="text-[11px] font-bold leading-none">?</span></button>
          </span>
        </template>

        <div :id="tipsId" role="tooltip" class="max-w-[240px] text-xs leading-5 break-words">
          {{ tips }}
        </div>
      </Popover>

      <span
        v-else
        class="text-xs font-medium truncate transition-colors cursor-default"
        :class="isModified ? 'text-ui-link font-bold' : 'text-ui-muted dark:text-ui-muted group-hover:text-ui-text'"
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
          p-1 rounded-none hover:bg-ui-inset dark:hover:bg-ui-inset
          text-ui-muted hover:text-ui-text z-10
        "
      >
        <Icon icon="lucide:rotate-ccw" width="12" />
      </button>
    </div>
  </div>
</template>
