<script setup>
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import ObjectGenerator from '@/components/ObjectGenerator.vue'
import { translatable } from '@/assets/translatable/translatable.js'
import { usePageStore } from '@/stores/index.js'
import FormItem from '@/components/FormItem.vue'
import Input from '@/components/Input.vue'
import { ArrayField, ObjectField } from '@/assets/const/objectClass.js'
import Modal from '@/components/Modal.vue'
import { useMessage } from '@/components/register/useMessage.js'

const props = defineProps({
  modelValue: { type: Object, required: true },
  title: { type: String, default: '' },
  properties: { type: ObjectField, required: true },
  displayTemplate: { type: [String, Function], default: '' },
  filter: { type: Function, default: null },
  dialogWidthPercent: { type: Number, default: 50 }
})

const emit = defineEmits(['update:modelValue'])
const lang = computed(() => usePageStore().setting.language)
const message = useMessage()

const showDialog = ref(false)
const editingKey = ref('')
const editingValue = ref({})
const editingOldKey = ref(null)

const isArrayMode = computed(() => {
  const inner = props.properties?.properties?.['']
  return inner && inner instanceof ArrayField
})

const openEdit = (key, value) => {
  editingKey.value = key ?? ''
  editingOldKey.value = key

  // 深拷贝，防止直接改动原对象
  let clonedValue = JSON.parse(JSON.stringify(value ?? (isArrayMode.value ? [] : {})))

  if (isArrayMode.value) {
    if (Array.isArray(clonedValue)) {
      clonedValue = { '': clonedValue }
    } else if (
      typeof clonedValue === 'object' &&
      clonedValue !== null &&
      !Array.isArray(clonedValue) &&
      !('' in clonedValue)
    ) {
      clonedValue = { '': [clonedValue] }
    }
  }

  editingValue.value = clonedValue
  showDialog.value = true
}


const saveEdit = () => {
  // 唯一标识符不能为空
  if (!editingKey.value || editingKey.value.trim() === '') {
    message.warning(translatable(lang.value, 'message.warn.no.key'))
    return
  }

  // 复制外部 model（保持不可变习惯）
  const newData = { ...props.modelValue }

  // 如果改了 key 名，删除旧的
  if (editingOldKey.value && editingOldKey.value !== editingKey.value) {
    delete newData[editingOldKey.value]
  }

  if (isArrayMode.value) {
    let toSave = editingValue.value

    if (
      toSave &&
      typeof toSave === 'object' &&
      !Array.isArray(toSave) &&
      Object.prototype.hasOwnProperty.call(toSave, '')
    ) {
      if (Array.isArray(toSave[''])) {
        toSave = toSave['']
      } else {
        toSave = toSave['']
      }
    }

    if (!Array.isArray(toSave) && Array.isArray(editingValue.value)) {
      toSave = editingValue.value
    }

    newData[editingKey.value] = JSON.parse(JSON.stringify(toSave))
  } else {
    newData[editingKey.value] = JSON.parse(JSON.stringify(editingValue.value))
  }

  emit('update:modelValue', newData)
  showDialog.value = false
}


const removeKey = (key) => {
  const newData = { ...props.modelValue }
  delete newData[key]
  emit('update:modelValue', newData)
}

const renderLabel = (key, value) => {
  if (typeof props.displayTemplate === 'function') {
    return props.displayTemplate(key, value)
  } else if (typeof props.displayTemplate === 'string') {
    return props.displayTemplate.replace(/\{(.*?)}/g, (_, token) => {
      if (token === 'key') return key
      return value?.[token] ?? ''
    })
  }
  return ''
}

const filteredEntries = computed(() => {
  const entries = Object.entries(props.modelValue)
  if (typeof props.filter === 'function') {
    return entries.filter(([key, value]) => props.filter(key, value))
  }
  return entries
})
</script>

<template>
  <FormItem :label="properties.label" :layout="properties.layout">
    <div class="space-y-2">
      <!-- 空状态 -->
      <div
        v-if="!filteredEntries.length"
        class="p-3 border border-dashed border-gray-300 dark:border-gray-700 rounded text-center text-gray-500 dark:text-gray-400"
      >
        {{ translatable(lang, 'component.empty') }}{{ title }}
      </div>

      <!-- 列表 -->
      <div
        v-for="([key, value], index) in filteredEntries"
        :key="key"
        class="flex justify-between items-center p-2 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <div class="flex flex-row items-center gap-5 dark:text-white">
          <div class="text-sm text-gray-500 dark:text-gray-400">{{ key }}</div>
          <div class="font-medium">{{ renderLabel(key, value) }}</div>
        </div>

        <div class="flex items-center gap-2">
          <button
            class="text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 p-1 rounded"
            @click="openEdit(key, value)"
          >
            <Icon icon="mdi:pencil" />
          </button>
          <button
            class="text-red-500 hover:bg-red-100 dark:hover:bg-red-900 p-1 rounded"
            @click="removeKey(key)"
          >
            <Icon icon="mdi:delete" />
          </button>
        </div>
      </div>

      <!-- 添加按钮 -->
      <button
        class="w-full p-2 border border-dashed border-gray-300 dark:border-gray-700 rounded text-center hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center dark:text-white"
        @click="openEdit(null, null)"
      >
        <Icon icon="mdi:plus" class="mr-1" />
        {{ translatable(lang, 'component.add') }}{{ title }}
      </button>

      <!-- 弹窗 -->
      <Modal
        :show="showDialog"
        :sm-width="dialogWidthPercent"
        :title="editingOldKey
          ? translatable(lang, 'component.update') + title
          : translatable(lang, 'component.add') + title"
        @defaultClose="showDialog = false"
        @onNegativeClick="showDialog = false"
        @onPositiveClick="saveEdit"
      >
        <template #content>
          <Form>
            <FormItem :label="`${title}${translatable(lang, 'component.key')}`">
              <Input v-model="editingKey" defaultModel="search" />
            </FormItem>

            <ObjectGenerator
              v-model="editingValue"
              :properties="properties"
            />
          </Form>
        </template>
      </Modal>
    </div>
  </FormItem>
</template>
