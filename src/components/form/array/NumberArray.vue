<script setup>
import BaseArrayInspector from './BaseArrayInspector.vue'
import NumberInput from '@/components/form/NumberInput.vue'

defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  // 可以透传 NumberInput 的参数，比如 min, max, step
  step: { type: Number, default: 1 },
  min: { type: Number, default: -Infinity },
  max: { type: Number, default: Infinity }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <BaseArrayInspector
    :model-value="modelValue"
    :label="label"
    :default-value="0"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <template #item="{ item, update }">
      <NumberInput
        :model-value="item"
        @update:modelValue="update"
        :step="step"
        :min="min"
        :max="max"
        class="w-full text-xs"
      />
    </template>
  </BaseArrayInspector>
</template>
