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
  }
})

const emit = defineEmits(['update:modelValue'])

const safeModelValue = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue
  }
  return []
})

// --- 类型定义与配置 ---
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

// 切换某一项的类型
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

// --- 弹窗编辑逻辑 ---
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
      default-value=""
      @update:modelValue="emit('update:modelValue', $event)"
    >
      <template #item="{ item, index, update }">
        <div class="flex items-center gap-2 w-full">

          <div class="flex bg-gray-100 dark:bg-slate-800 rounded p-0.5 gap-0.5 shrink-0">
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

          <div class="flex-1 min-w-0">

            <template v-if="detectType(item) === 'string'">
              <AutoComplete
                v-if="getActiveOption(item).editorType === EditorTypes.AUTOCOMPLETE"
                :model-value="item"
                @update:modelValue="update"
                v-bind="getActiveOption(item).props"
                class="w-full"
              />
              <Input
                v-else
                :model-value="item"
                @update:modelValue="update"
                v-bind="getActiveOption(item).props"
                class="w-full text-xs"
                placeholder="请输入..."
              />
            </template>

            <NumberInput
              v-else-if="detectType(item) === 'number'"
              :model-value="item"
              @update:modelValue="update"
              v-bind="getActiveOption(item).props"
              class="w-full text-xs"
            />

            <div v-else-if="detectType(item) === 'boolean'" class="flex items-center h-8">
              <Switch
                :model-value="item"
                @update:modelValue="update"
                :width="40"
                v-bind="getActiveOption(item).props"
              />
              <span class="ml-2 text-[10px] font-mono text-gray-400">
                {{ item }}
              </span>
            </div>

            <div
              v-else-if="detectType(item) === 'object'"
              class="flex items-center justify-between px-2 py-1 bg-gray-50 dark:bg-white/5 rounded border border-gray-200 dark:border-slate-700 cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition-colors group"
              @click="openEditObject(item, index)"
            >
              <div class="flex items-center gap-2 truncate">
                <Icon icon="lucide:braces" width="12" class="text-purple-500" />
                <span class="text-xs text-gray-600 dark:text-gray-300 truncate">
                  {{ renderObjectLabel(item, index) }}
                </span>
              </div>
              <Icon icon="lucide:edit-2" width="10"
                    class="text-gray-400 group-hover:text-blue-500" />
            </div>

            <div v-else class="text-[10px] text-red-400">
              未知类型
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