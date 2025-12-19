<script setup>
import { computed, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import draggable from 'vuedraggable'
import ObjectGenerator from '@/components/ObjectGenerator.vue'
import Modal from '@/components/Modal.vue'
import { translatable } from '@/assets/translatable/translatable.js'
import { usePageStore } from '@/stores/index.js'
import { UnionArrField } from '@/assets/const/objectClass.js'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  properties: {
    type: UnionArrField,
    required: true
  },
  dialogWidthPercent: Number
})
const emit = defineEmits(['update:modelValue'])

const lang = computed(() => usePageStore().setting.language)
const showDialog = ref(false)
const editingItem = ref(null)
const editingIndex = ref(-1)
const selectedType = ref(null)

// === 内部渲染用值 ===
const renderModelValue = ref([])

const isMultiType = computed(() => !!props.properties.itemTypes)

// === modelValue -> renderModelValue 转换 ===
const toRenderValue = (val) => {
  if (!Array.isArray(val)) return []
  return val.map((item) => {
    // 遍历 itemTypes 来匹配类型
    for (const [typeKey, typeTemplate] of Object.entries(props.properties.itemTypes)) {
      const field = typeTemplate.field
      if (typeTemplate.isObjectField) {
        // 对象类型：直接判断结构
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          return { type: typeKey, ...item }
        }
      } else {
        // 非对象类型：包成 { type, value }
        if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') {
          return { type: typeKey, value: item }
        }
      }
    }
    // 没匹配上，fallback
    return { type: Object.keys(props.properties.itemTypes)[0], value: item }
  })
}

// === renderModelValue -> modelValue 转换 ===
const toPureValue = (val) => {
  return val.map((item) => {
    const template = props.properties.itemTypes[item.type]
    if (!template) return item
    if (template.isObjectField) {
      const { type, ...rest } = item
      return rest
    } else {
      return item.value
    }
  })
}

// === 初始化 & 同步 ===
watch(
  () => props.modelValue,
  (val) => {
    renderModelValue.value = toRenderValue(val)
  },
  { immediate: true, deep: true }
)

// === 保存到外部 ===
const syncToParent = () => {
  const pure = toPureValue(renderModelValue.value)
  emit('update:modelValue', pure)
}

// === 打开编辑 ===
const openEdit = (item, index) => {
  editingIndex.value = index

  if (item) {
    selectedType.value = item.type
    editingItem.value = JSON.parse(JSON.stringify(item))
  } else {
    // 默认第一个类型
    const firstType = Object.keys(props.properties.itemTypes)[0]
    const typeTemplate = props.properties.itemTypes[firstType]
    const defaultValue = typeTemplate.field?.getDefault?.() ?? {}
    editingItem.value = { type: firstType, ...defaultValue }
    selectedType.value = firstType
  }

  showDialog.value = true
}

// === 保存编辑 ===
const saveEdit = () => {
  const arr = [...renderModelValue.value]
  if (editingIndex.value >= 0) arr[editingIndex.value] = editingItem.value
  else arr.push(editingItem.value)
  renderModelValue.value = arr
  syncToParent()
  showDialog.value = false
}

// === 删除 ===
const removeItem = (index) => {
  const arr = [...renderModelValue.value]
  arr.splice(index, 1)
  renderModelValue.value = arr
  syncToParent()
}

const handleDragUpdate = () => {
  // 拖拽完成后更新 modelValue
  syncToParent()
}

// === 根据类型模板渲染标签 ===
const renderLabel = (obj) => {
  const typeField = props.properties.itemTypes?.[obj.type]
  if (!typeField) return JSON.stringify(obj)
  const tpl = typeField.displayTemplate
  if (typeof tpl === 'function') return tpl(obj)
  if (typeof tpl === 'string') return tpl.replace(/\{(.*?)}/g, (_, k) => obj[k] ?? '')
  return JSON.stringify(obj)
}

// === 切换类型 ===
watch(selectedType, (newType) => {
  if (!newType) return
  const typeTemplate = props.properties.itemTypes[newType]
  if (!typeTemplate) return

  if (editingIndex.value >= 0) return

  const field = typeTemplate.field
  const defaultValue = field?.getDefault?.() ?? {}

  // 新增时才重建默认结构
  editingItem.value = { type: newType, ...defaultValue }
})
</script>

<template>
  <div class="object-array-field space-y-2 w-full">
    <!-- 空状态 -->
    <div
      v-if="!renderModelValue?.length"
      class="p-3 border border-dashed border-gray-300 dark:border-gray-700 rounded text-center text-gray-500 dark:text-gray-400"
    >
      {{ translatable(lang, 'component.empty') }}{{ title }}
    </div>

    <!-- 列表 -->
    <draggable
      v-model="renderModelValue"
      item-key="id"
      class="space-y-2"
      @update:modelValue="handleDragUpdate"
    >
      <template #item="{ element: item, index }">
        <div
          class="flex justify-between items-center p-2 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <div class="flex items-center">
            <Icon icon="mdi:drag-vertical" class="mr-2 cursor-move text-gray-400 drag-handle" />
            <div class="flex items-center gap-2">
              <span class="text-gray-500 dark:text-gray-400">#{{ index + 1 }}</span>
              <span class="font-medium dark:text-white">{{ renderLabel(item) }}</span>
            </div>
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
      </template>
    </draggable>

    <!-- 添加按钮 -->
    <button
      class="w-full p-2 border border-dashed border-gray-300 dark:border-gray-700 rounded text-center hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center dark:text-white"
      @click="openEdit(null, -1)"
    >
      <Icon icon="mdi:plus" class="mr-1" />
      {{ translatable(lang, 'component.add') }}{{ title }}
    </button>

    <!-- 弹窗 -->
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
        <div class="p-4 space-y-3">
          <!-- 类型选择 -->
          <div v-if="isMultiType" class="flex gap-2 border-b pb-2">
            <button
              v-for="(typeField, typeKey) in properties.itemTypes"
              :key="typeKey"
              class="px-3 py-1 rounded-md text-sm relative group"
              :class="{
                'bg-blue-500 text-white': selectedType === typeKey,
                'bg-gray-200 dark:bg-gray-700': selectedType !== typeKey,
                'cursor-not-allowed opacity-70': editingIndex >= 0 && selectedType !== typeKey
              }"
              @click="selectedType = typeKey"
              :disabled="editingIndex >= 0 && selectedType !== typeKey"
              :title="editingIndex >= 0 ? translatable(lang, 'component.cannot_change_type_when_editing') : ''"
            >
              {{ typeField.groupName || typeKey }}
              <!-- 编辑模式下的提示 -->
              <span v-if="editingIndex >= 0 && selectedType !== typeKey" class="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {{ translatable(lang, 'component.cannot_change_type_when_editing') }}
              </span>
            </button>
          </div>

          <!-- 编辑内容 -->
          <div v-if="selectedType">
            <ObjectGenerator
              v-model="editingItem"
              :properties="properties.itemTypes[selectedType].field"
            />
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>
