<script setup>
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import ObjectDialog from '../ObjectDialog.vue'
import { t } from '@/languages'
import { usePrompt } from '@/components/register/usePrompt.js'
import draggable from 'vuedraggable'
import { useDialog } from '@/components/register/useDialog.js'

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
  keyLabel: {
    type: String,
    default: 'Key'
  }
})

const emit = defineEmits(['update:modelValue'])
const { openInput } = usePrompt()

const showModal = ref(false)
const editingKey = ref('')
const editingValue = ref(null)

const dialog = useDialog()


// 将 Map 对象转为数组，用于 Draggable 渲染
// 结构: [{ key: 'id1', value: obj1 }, { key: 'id2', value: obj2 }]
const mapList = computed({
  get: () => {
    return Object.keys(props.modelValue).map(key => ({
      key: key,
      value: props.modelValue[key]
    }))
  },
  set: (newList) => {
    // 拖拽排序后，根据新数组顺序重新生成 Map
    const newMap = {}
    newList.forEach(item => {
      newMap[item.key] = item.value
    })
    emit('update:modelValue', newMap)
  }
})


// 辅助函数：在修改 Map 时，保持原有的 Key 顺序，或者就地重命名
const updateMapStable = (oldKey, newKey, newValue) => {
  const newMap = {}
  // 遍历旧的 Key 列表 (保持顺序)
  Object.keys(props.modelValue).forEach(k => {
    if (k === oldKey) {
      // 找到了当前正在编辑的项，使用新 Key 和新 Value
      newMap[newKey] = newValue
    } else {
      // 其他项保持不变
      newMap[k] = props.modelValue[k]
    }
  })
  emit('update:modelValue', newMap)
}

// 新增 Key (新增的自然在最后，或者你可以改为 unshift 插在最前)
const handleAdd = () => {
  openInput({
    title: t('新建项'),
    placeholder: t('请输入唯一的标识符 (ID)'),
    onPositiveClick: (newKey) => {
      if (!newKey) return
      if (Object.prototype.hasOwnProperty.call(props.modelValue, newKey)) {
        alert(t('该 ID 已存在，请使用其他 ID'))
        return
      }
      // 新增时，直接追加到最后
      const newVal = new props.valueConstructor()
      const newMap = { ...props.modelValue, [newKey]: newVal }
      emit('update:modelValue', newMap)
    }
  })
}

// 删除 Key
const handleRemove = (key) => {
  dialog.warning({
    title: t('删除'),
    content: t(`确定要删除 ${key} 吗？`),
    onPositiveClick: () => {
      const newMap = { ...props.modelValue }
      delete newMap[key]
      emit('update:modelValue', newMap)
    }
  })

}

// 打开编辑 Value
const openEdit = (key, value) => {
  editingKey.value = key
  editingValue.value = value
  showModal.value = true
}

// 保存 Value (关键修改：使用 updateMapStable)
const onSave = (newItem) => {
  // 这里的 Key 没变，只是 Value 变了，但我们依然用这个函数来确保顺序不乱
  updateMapStable(editingKey.value, editingKey.value, newItem)
}

// 重命名 Key (关键修改：使用 updateMapStable)
const handleRename = (oldKey) => {
  openInput({
    title: t('重命名 ID'),
    defaultValue: oldKey,
    onPositiveClick: (newKey) => {
      if (!newKey || newKey === oldKey) return
      if (props.modelValue[newKey]) {
        alert(t('ID 已存在'))
        return
      }
      // 就地替换 Key，保持位置不变
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
                <span class="text-[10px] text-gray-400 dark:text-gray-500 font-mono">
                  {{ element.value.constructor.name || 'Object' }}
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
      :title="`${label}: ${editingKey}`"
      @confirm="onSave"
    />
  </div>
</template>

<style scoped>
/* 拖拽时的幽灵样式 */
.sortable-ghost {
  opacity: 0.5;
  background: rgba(0, 192, 245, 0.1);
}
</style>
