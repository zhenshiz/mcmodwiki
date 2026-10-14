<script setup>
import BaseArrayInspector from './BaseArrayInspector.vue'
import Switch from '../Switch.vue'

defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <BaseArrayInspector
    :model-value="modelValue"
    :label="label"
    :default-value="false"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <template #item="{ item, update }">
      <div class="flex items-center gap-3 h-8">
        <Switch
          :model-value="item"
          @update:modelValue="update"
          :width="50"
        />

        <span
          class="text-xs font-medium select-none transition-colors"
          :class="item ? 'text-ui-text dark:text-ui-text' : 'text-ui-muted dark:text-ui-muted'"
        >
          {{ item ? 'True' : 'False' }}
        </span>
      </div>
    </template>
  </BaseArrayInspector>
</template>
