<script setup>
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import ObjectGenerator from '@/components/ObjectGenerator.vue'
import Modal from '@/components/Modal.vue'
import { translatable } from '@/assets/translatable/translatable.js'
import { usePageStore } from '@/stores/index.js'
import { ObjectArrField } from '@/assets/const/objectClass.js'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  properties: {
    type: ObjectArrField,
    required: true
  },
  displayTemplate: {
    type: [String, Function],
    default: ''
  },
  dialogWidthPercent: {
    type: Number,
    default: 50,
    validator: (value) => value >= 1 && value <= 100
  }
})

const emit = defineEmits(['update:modelValue'])
const lang = computed(() => usePageStore().setting.language)

const editingItem = ref(null)
const editingIndex = ref(-1)
const showDialog = ref(false)

// === 方法 ===
const openEdit = (item, index) => {
  editingItem.value = JSON.parse(JSON.stringify(item || props.properties.getItemDefault()))
  editingIndex.value = index
  showDialog.value = true
}

const saveEdit = () => {
  const arr = [...props.modelValue]
  if (editingIndex.value >= 0) arr[editingIndex.value] = editingItem.value
  else arr.push(editingItem.value)
  emit('update:modelValue', arr)
  showDialog.value = false
}

const removeItem = (index) => {
  const arr = [...props.modelValue]
  arr.splice(index, 1)
  emit('update:modelValue', arr)
}

const renderLabel = (obj) => {
  if (typeof props.displayTemplate === 'function') {
    return props.displayTemplate(obj)
  } else if (typeof props.displayTemplate === 'string') {
    return props.displayTemplate.replace(/\{(.*?)}/g, (_, key) => obj[key] ?? '')
  }
  return ''
}
</script>

<template>
  <div class="object-array-field space-y-2">
    <!-- 空状态 -->
    <div
      v-if="!modelValue?.length"
      class="p-3 border border-dashed border-gray-300 dark:border-gray-700 rounded text-center text-gray-500 dark:text-gray-400"
    >
      {{ translatable(lang, 'component.empty') }}{{ title }}
    </div>

    <!-- 列表 -->
    <div
      v-for="(item, index) in modelValue"
      :key="index"
      class="flex justify-between items-center p-2 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      <div class="flex items-center">
        <span class="mr-2 text-gray-500 dark:text-gray-400">#{{ index + 1 }}</span>
      </div>
      <div>
        <span class="font-medium dark:text-white">{{ renderLabel(item) }}</span>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 p-1 rounded"
          @click="openEdit(item, index)"
        >
          <Icon icon="mdi:pencil" />
        </button>
        <button
          class="text-red-500 hover:bg-red-100 dark:hover:bg-red-900 p-1 rounded"
          @click="removeItem(index)"
        >
          <Icon icon="mdi:delete" />
        </button>
      </div>
    </div>

    <!-- 添加按钮 -->
    <button
      class="w-full p-2 border border-dashed border-gray-300 dark:border-gray-700 rounded text-center hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center dark:text-white"
      @click="openEdit(null, -1)"
    >
      <Icon icon="mdi:plus" class="mr-1" />
      {{ translatable(lang, 'component.add') }}{{ title }}
    </button>

    <Modal
      :show="showDialog"
      :sm-width="dialogWidthPercent"
      :title="editingIndex >= 0
        ? translatable(lang, 'component.update') + title
        : translatable(lang, 'component.add') + title"
      @defaultClose="showDialog = false"
      @onNegativeClick="showDialog = false"
      @onPositiveClick="saveEdit"
    >
      <template #content>
        <div class="p-4">
          <ObjectGenerator v-model="editingItem" :properties="properties" />
        </div>
      </template>
    </Modal>
  </div>
</template>
