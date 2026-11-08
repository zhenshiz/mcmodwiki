<script setup>
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import Autocomplete from '@/components/form/Autocomplete.vue'
import Modal from '@/components/Modal.vue'
import { componentLabel } from './textComponent.js'
import { t } from '@/languages'
const TextEditor = defineAsyncComponent(() => import('./MinecraftTextEditor.vue'))
const props = defineProps({
  modelValue: { type: [String, Object, Array, Number, Boolean], default: '' },
  options: { type: Array, default: () => [] },
  owner: { type: Object, default: null },
  label: { type: String, default: '' },
  defaultTypewriter: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])
const open = ref(false)
const summary = computed(() => componentLabel(props.modelValue, key => props.options.find(option => option.value === key)?.label || key))
watch(() => props.owner, () => { open.value = false })
function apply(value) { emit('update:modelValue', value); open.value = false }
</script>

<template>
  <div class="min-w-0">
    <Autocomplete v-if="typeof modelValue === 'string'" :model-value="modelValue" :options="options"
      @update:model-value="emit('update:modelValue', $event)" />
    <button v-else type="button" class="text-summary" :title="summary" @click="open = true">{{ summary || t('空文本') }}</button>
    <button type="button" class="text-edit-button" @click="open = true">{{ t('编辑文本样式') }}</button>
    <Modal v-if="open" :show="true" :title="label ? `${t('编辑文本样式')} · ${label}` : t('编辑文本样式')" width="760px"
      :mask-closable="false" :close-on-esc="false" @update:show="open = $event">
      <TextEditor :model-value="modelValue" :options="options" :default-typewriter="defaultTypewriter"
        @apply="apply" @cancel="open = false" />
    </Modal>
  </div>
</template>

<style scoped>
.text-summary { width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: left; border: 1px solid rgb(var(--ui-line)); padding: 7px; background: rgb(var(--ui-inset)); }
.text-edit-button { margin-top: 4px; color: rgb(var(--ui-link)); font-size: 12px; }
</style>
