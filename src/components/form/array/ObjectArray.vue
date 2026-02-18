<script setup>
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import BaseArrayInspector from './BaseArrayInspector.vue'
import ObjectDialog from '../ObjectDialog.vue'
import { t } from '@/languages/index.js'

const props = defineProps({
  modelValue: {
    type: [Array, null],
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  itemConstructor: {
    type: Function,
    required: true
  },
  itemLabel: {
    type: String,
    default: 'Item'
  },
  displayTemplate: {
    type: [String, Function],
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const safeModelValue = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue
  }
  return []
})

const showModal = ref(false)
const editingIndex = ref(-1)
const editingItem = ref(null)

const openEdit = (item, index) => {
  editingItem.value = item
  editingIndex.value = index
  showModal.value = true
}

const onSave = (newItem) => {
  const list = [...safeModelValue.value]
  if (editingIndex.value > -1) {
    list[editingIndex.value] = newItem
  }
  emit('update:modelValue', list)
}

const renderLabel = (item, index) => {
  if (!item) return 'Null Item'

  if (typeof props.displayTemplate === 'function') {
    return props.displayTemplate(item, index)
  }
  if (props.displayTemplate && typeof props.displayTemplate === 'string') {
    return props.displayTemplate.replace(/\{(.*?)\}/g, (_, key) => {
      return item[key] ?? ''
    })
  }
  if (item.name) return item.name
  if (item.id) return item.id
  if (item.text) return item.text
  if (item.value) return item.value
  return `${props.itemLabel} #${index + 1}`
}
</script>

<template>
  <div class="w-full">
    <BaseArrayInspector
      :model-value="safeModelValue"
      :label="label"
      :item-constructor="itemConstructor"
      @update:modelValue="emit('update:modelValue', $event)"
    >
      <template #item="{ item, index }">
        <div
          class="flex flex-col w-full cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 -ml-2 px-2 py-1.5 rounded transition-colors group"
          @click="openEdit(item, index)"
        >
          <div class="flex items-center gap-2">
            <Icon
              icon="lucide:edit-3"
              width="12"
              class="text-[#00c0f5] opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            />

            <span class="text-xs text-gray-700 dark:text-gray-300 font-medium truncate">
              {{ renderLabel(item, index) }}
            </span>
          </div>
        </div>
      </template>
    </BaseArrayInspector>

    <ObjectDialog
      v-model:show="showModal"
      :model="editingItem"
      :clazz="itemConstructor"
      :title="t('编辑 {}',itemLabel)"
      @confirm="onSave"
    />
  </div>
</template>
