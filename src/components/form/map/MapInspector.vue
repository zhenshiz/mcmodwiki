<script setup>
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import ObjectDialog from '../ObjectDialog.vue'
import { t } from '@/languages'
import { usePrompt } from '@/components/register/usePrompt.js'
import draggable from 'vuedraggable'
import { useDialog } from '@/components/register/useDialog.js'
import { useMessage } from '@/components/register/useMessage.js'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    default: () => ({})
  },
  label: {
    type: String,
    default: ''
  },
  valueConstructor: {
    type: Function,
    required: true
  },
  displayTemplate: {
    type: [String, Function],
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])
const { openInput } = usePrompt()
const dialog = useDialog()

const showModal = ref(false)
const editingKey = ref('')
const editingValue = ref(null)

const renderLabel = (item, key) => {
  if (!item) return 'Null Item'

  if (typeof props.displayTemplate === 'function') {
    return props.displayTemplate(item, key)
  }

  if (props.displayTemplate && typeof props.displayTemplate === 'string') {
    return props.displayTemplate.replace(/\{(.*?)}/g, (_, k) => {
      // Special case: allow {key} to print the Map key
      if (k === 'key' || k === '$key') return key
      return item[k] ?? ''
    })
  }

  if (item.constructor && item.constructor.name && item.constructor.name !== 'Object') {
    return item.constructor.name
  }
  return 'Object'
}

const mapList = computed({
  get: () => {
    return Object.keys(props.modelValue).map(key => ({
      key: key,
      value: props.modelValue[key]
    }))
  },
  set: (newList) => {
    const newMap = {}
    newList.forEach(item => {
      newMap[item.key] = item.value
    })
    emit('update:modelValue', newMap)
  }
})

const updateMapStable = (oldKey, newKey, newValue) => {
  const newMap = {}
  Object.keys(props.modelValue).forEach(k => {
    if (k === oldKey) {
      newMap[newKey] = newValue
    } else {
      newMap[k] = props.modelValue[k]
    }
  })
  emit('update:modelValue', newMap)
}

const handleAdd = () => {
  openInput({
    title: t('新建项'),
    placeholder: t('请输入唯一的标识符 (ID)'),
    onPositiveClick: (newKey) => {
      if (!newKey) return
      if (Object.prototype.hasOwnProperty.call(props.modelValue, newKey)) {
        useMessage().error(t('该 ID 已存在，请使用其他 ID'))
        return
      }
      const newVal = new props.valueConstructor()
      const newMap = { ...props.modelValue, [newKey]: newVal }
      emit('update:modelValue', newMap)
    }
  })
}

const handleRemove = (key) => {
  dialog.warning({
    title: t('删除'),
    content: t('确定要删除 {} 吗？',key),
    onPositiveClick: () => {
      const newMap = { ...props.modelValue }
      delete newMap[key]
      emit('update:modelValue', newMap)
    }
  })
}

const openEdit = (key, value) => {
  editingKey.value = key
  editingValue.value = value
  showModal.value = true
}

const onSave = (newItem) => {
  updateMapStable(editingKey.value, editingKey.value, newItem)
}

const handleRename = (oldKey) => {
  openInput({
    title: t('重命名 ID'),
    defaultValue: oldKey,
    onPositiveClick: (newKey) => {
      if (!newKey || newKey === oldKey) return
      if (props.modelValue[newKey]) {
        useMessage().error(t('ID 已存在'))
        return
      }
      updateMapStable(oldKey, newKey, props.modelValue[oldKey])
    }
  })
}
</script>

<template>
  <div
    class="w-full border border-gray-200 dark:border-slate-700 rounded bg-white dark:bg-[#002941] mt-2 overflow-hidden shadow-sm">

    <div
      class="flex justify-between items-center px-3 py-1.5 bg-gray-50 dark:bg-[#002033] border-b border-gray-200 dark:border-slate-700">
      <span class="text-xs font-bold text-gray-500 dark:text-gray-400 select-none">
        {{ label }} <span class="text-[10px] opacity-60">(Map)</span>
      </span>
      <button
        class="text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors"
        @click="handleAdd"
        :title="t('新建项')"
      >
        <Icon icon="lucide:plus" width="14" />
      </button>
    </div>

    <div class="flex flex-col">
      <draggable
        v-if="Object.keys(modelValue).length > 0"
        v-model="mapList"
        item-key="key"
        handle=".drag-handle"
        animation="200"
        class="flex flex-col"
      >
        <template #item="{ element }">
          <div
            class="group flex flex-col border-b border-gray-100 dark:border-slate-700/50 last:border-0 bg-white dark:bg-[#002941]">
            <div
              class="flex items-center p-2 gap-2 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">

              <div
                class="drag-handle mt-0.5 cursor-move text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 shrink-0">
                <Icon icon="lucide:grip-vertical" width="14" />
              </div>

              <div class="flex-1 flex items-center gap-2 cursor-pointer min-w-0"
                   @click="openEdit(element.key, element.value)">
                <Icon icon="lucide:key" width="12" class="text-amber-500 shrink-0" />
                <span class="text-xs font-bold text-gray-700 dark:text-gray-200 truncate"
                      :title="element.key">
                  {{ element.key }}
                </span>

                <span class="text-[10px] text-gray-400 dark:text-gray-500 font-mono truncate ml-1">
                  {{ renderLabel(element.value, element.key) }}
                </span>
              </div>

              <div
                class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                        :title="t('重命名 Key')" @click.stop="handleRename(element.key)">
                  <Icon icon="lucide:pencil" width="12" />
                </button>
                <button class="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        :title="t('删除')" @click.stop="handleRemove(element.key)">
                  <Icon icon="lucide:trash-2" width="12" />
                </button>
              </div>
            </div>
          </div>
        </template>
      </draggable>

      <div v-else
           class="py-4 text-center text-xs text-gray-400 dark:text-gray-500 select-none">
        {{ t('暂无键值对') }}
      </div>
    </div>

    <ObjectDialog
      v-model:show="showModal"
      :model="editingValue"
      :title="`${editingKey}`"
      @confirm="onSave"
    />
  </div>
</template>
