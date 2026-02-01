<script setup>
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import BaseArrayInspector from './BaseArrayInspector.vue'
import ObjectDialog from '../ObjectDialog.vue'

import Input from '@/components/form/Input.vue'
import NumberInput from '@/components/form/NumberInput.vue'
import Switch from '@/components/form/Switch.vue'
import AutoComplete from '@/components/form/Autocomplete.vue'
import { EditorTypes } from '@/assets/generator/editorType.js'

const props = defineProps({
  modelValue: {
    type: [Array, null],
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  types: {
    type: Array,
    default: () => ['string', 'number', 'boolean', 'object']
  },
  objectConstructor: {
    type: Function,
    default: null
  },
  displayTemplate: {
    type: [String, Function],
    default: ''
  },
  optionsResolver: {
    type: Function,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const COMPONENT_MAP = {
  [EditorTypes.INPUT]: Input,
  [EditorTypes.NUMBER_INPUT]: NumberInput,
  [EditorTypes.SWITCH]: Switch,
  [EditorTypes.AUTOCOMPLETE]: AutoComplete,
}

const safeModelValue = computed(() => {
  if (Array.isArray(props.modelValue)) return props.modelValue
  return []
})

const STANDARD_TYPES = {
  string: {
    label: 'String',
    value: 'string',
    icon: 'lucide:type',
    defaultValue: '',
    editorType: EditorTypes.INPUT
  },
  number: {
    label: 'Number',
    value: 'number',
    icon: 'lucide:hash',
    defaultValue: 0,
    editorType: EditorTypes.NUMBER_INPUT
  },
  boolean: {
    label: 'Boolean',
    value: 'boolean',
    icon: 'lucide:toggle-left',
    defaultValue: false,
    editorType: EditorTypes.SWITCH
  },
  object: {
    label: 'Object',
    value: 'object',
    icon: 'lucide:braces',
    editorType: EditorTypes.OBJECT_DIALOG,
    createDefault: () => props.objectConstructor ? new props.objectConstructor() : {}
  }
}

const getBoundProps = (typeConfig) => {
  const rawProps = typeConfig.props || {}

  if (rawProps.dataSource && props.optionsResolver) {
    return {
      ...rawProps,
      options: props.optionsResolver(rawProps.dataSource)
    }
  }
  return rawProps
}

// 计算最终的类型选项列表
const typeOptions = computed(() => {
  return props.types.map(t => {
    if (typeof t === 'string') {
      return STANDARD_TYPES[t] || { label: t, value: t, icon: 'lucide:help-circle' }
    }
    const standard = STANDARD_TYPES[t.value] || {}
    return {
      ...standard,
      ...t,
      props: { ...(standard.props || {}), ...(t.props || {}) }
    }
  })
})

const detectType = (val) => {
  if (val === null) return 'string'
  const type = typeof val
  if (type === 'string' || type === 'number' || type === 'boolean') return type
  if (type === 'object') return 'object'
  return 'string'
}

const getActiveOption = (item) => {
  const type = detectType(item)
  return typeOptions.value.find(t => t.value === type) || STANDARD_TYPES.string
}

const switchItemType = (index, typeOpt) => {
  let newVal
  if (typeOpt.createDefault) {
    newVal = typeOpt.createDefault()
  } else if (typeOpt.defaultValue !== undefined) {
    newVal = typeOpt.defaultValue
  } else {
    newVal = STANDARD_TYPES[typeOpt.value]?.defaultValue ?? null
  }

  const list = [...safeModelValue.value]
  list[index] = newVal
  emit('update:modelValue', list)
}

// --- 弹窗与显示逻辑 ---
const showModal = ref(false)
const editingIndex = ref(-1)
const editingItem = ref(null)

const openEditObject = (item, index) => {
  editingItem.value = item
  editingIndex.value = index
  showModal.value = true
}

const onSaveObject = (newItem) => {
  const list = [...safeModelValue.value]
  if (editingIndex.value > -1) {
    list[editingIndex.value] = newItem
  }
  emit('update:modelValue', list)
}

const renderObjectLabel = (item, index) => {
  if (typeof props.displayTemplate === 'function') {
    return props.displayTemplate(item, index)
  }
  if (props.displayTemplate && typeof props.displayTemplate === 'string') {
    return props.displayTemplate.replace(/\{(.*?)\}/g, (_, key) => item[key] ?? '')
  }
  return item.name || item.id || `Object #${index + 1}`
}
</script>

<template>
  <div class="w-full">
    <BaseArrayInspector
      :model-value="safeModelValue"
      :label="label"
      @update:modelValue="emit('update:modelValue', $event)"
    >
      <template #item="{ item, index, update }">
        <div class="flex flex-col w-full gap-1.5 p-1.5 bg-gray-50/50 dark:bg-white/5 rounded border border-gray-100 dark:border-slate-700/50">

          <div class="flex items-center justify-between">
            <div class="flex bg-gray-200 dark:bg-slate-800 rounded p-0.5 gap-0.5">
              <button
                v-for="opt in typeOptions"
                :key="opt.value"
                @click="switchItemType(index, opt)"
                class="p-1 rounded transition-all"
                :class="[
                  detectType(item) === opt.value
                    ? 'bg-white dark:bg-blue-600 text-blue-500 dark:text-white shadow-sm'
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                ]"
                :title="opt.label"
              >
                <Icon :icon="opt.icon" width="12" />
              </button>
            </div>

            <span class="text-[10px] text-gray-400 font-mono opacity-50 pr-1">
              {{ detectType(item) }}
            </span>
          </div>

          <div class="w-full min-h-[28px] flex items-center">

            <div
              v-if="detectType(item) === 'object'"
              class="flex-1 flex items-center justify-between px-2 py-1.5 bg-white dark:bg-slate-900 rounded border border-gray-200 dark:border-slate-700 cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition-colors group"
              @click="openEditObject(item, index)"
            >
              <div class="flex items-center gap-2 truncate">
                <Icon icon="lucide:braces" width="12" class="text-purple-500 shrink-0" />
                <span class="text-xs text-gray-600 dark:text-gray-300 truncate font-medium">
                  {{ renderObjectLabel(item, index) }}
                </span>
              </div>
              <Icon icon="lucide:edit-2" width="10"
                    class="text-gray-400 group-hover:text-blue-500 shrink-0" />
            </div>

            <component
              v-else-if="COMPONENT_MAP[getActiveOption(item).editorType]"
              :is="COMPONENT_MAP[getActiveOption(item).editorType]"
              :model-value="item"
              @update:modelValue="update"
              v-bind="getBoundProps(getActiveOption(item))"
              class="w-full text-xs"
            />

            <div v-else class="text-[10px] text-red-400 flex items-center gap-1">
              <Icon icon="lucide:alert-circle" width="12" />
              <span>不支持的组件类型</span>
            </div>

          </div>
        </div>
      </template>
    </BaseArrayInspector>

    <ObjectDialog
      v-model:show="showModal"
      :model="editingItem"
      :clazz="objectConstructor"
      :title="`编辑对象 #${editingIndex + 1}`"
      @confirm="onSaveObject"
    />
  </div>
</template>
