<script setup>
import BaseArrayInspector from './BaseArrayInspector.vue'
import Input from '@/components/form/Input.vue'
import { t } from '@/languages/index.js'

defineProps({
  modelValue: Array,
  label: String
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <BaseArrayInspector
    :model-value="modelValue"
    :label="label"
    default-value=""
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <template #item="{ item, update }">
      <Input
        :model-value="item"
        @update:modelValue="update"
        :placeholder="t('请输入文本...')"
        class="w-full text-xs"
      />
    </template>
  </BaseArrayInspector>
</template>
