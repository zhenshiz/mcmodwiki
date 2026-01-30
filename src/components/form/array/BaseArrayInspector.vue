<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import draggable from 'vuedraggable'
import { t } from '@/languages'

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
    default: null
  },
  defaultValue: {
    type: [String, Number, Boolean, Object, Array],
    default: null
  },
  itemLabel: {
    type: String,
    default: 'Item'
  }
})

const emit = defineEmits(['update:modelValue'])

const safeList = computed({
  get: () => Array.isArray(props.modelValue) ? props.modelValue : [],
  set: (val) => emit('update:modelValue', val)
})

// === Methods ===

const updateItem = (index, value) => {
  const list = [...safeList.value] 
  list[index] = value
  emit('update:modelValue', list)
}

const removeItem = (index) => {
  const list = [...safeList.value] 
  list.splice(index, 1)
  emit('update:modelValue', list)
}

const handleAdd = () => {
  let newItem

  if (props.itemConstructor) {
    newItem = new props.itemConstructor()
  } else if (props.defaultValue !== null) {
    if (typeof props.defaultValue === 'object') {
      newItem = JSON.parse(JSON.stringify(props.defaultValue))
    } else {
      newItem = props.defaultValue
    }
  } else {
    newItem = ''
  }

  const list = [...safeList.value, newItem]
  emit('update:modelValue', list)
}

const onDragEnd = () => {
}
</script>

<template>
  <div class="w-full border border-gray-200 dark:border-slate-700 rounded bg-white dark:bg-[#002941] mt-2 overflow-hidden shadow-sm">

    <div class="flex justify-between items-center px-3 py-1.5 bg-gray-50 dark:bg-[#002033] border-b border-gray-200 dark:border-slate-700">
      <span class="text-xs font-bold text-gray-500 dark:text-gray-400 select-none">
        {{ label }} <span class="text-[10px] opacity-60">({{ safeList.length }})</span>
      </span>
      <button
        class="text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors"
        @click="handleAdd"
      >
        <Icon icon="lucide:plus" width="14" />
      </button>
    </div>

    <div class="flex flex-col">
      <draggable
        v-if="safeList.length > 0"
        v-model="safeList" 
        item-key="index"
        handle=".drag-handle"
        animation="200"
        @end="onDragEnd"
        class="flex flex-col"
      >
        <template #item="{ element, index }">
          <div class="group flex flex-col border-b border-gray-100 dark:border-slate-700/50 last:border-0 bg-white dark:bg-[#002941]">

            <div class="flex items-center p-2 gap-2">

              <div class="drag-handle mt-0.5 cursor-move text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 shrink-0">
                <Icon icon="lucide:grip-vertical" width="14" />
              </div>

              <span class="text-[10px] text-gray-400 dark:text-gray-500 font-mono w-4 shrink-0 select-none">
                {{ index + 1 }}
              </span>

              <div class="flex-1 min-w-0">
                <slot
                  name="item"
                  :item="element"
                  :index="index"
                  :update="(v) => updateItem(index, v)"
                >
                  <pre class="text-[10px] text-red-400">Missing Slot</pre>
                </slot>
              </div>

              <button
                class="text-gray-400 hover:text-red-500 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                :title="t('component.delete')"
                @click="removeItem(index)"
              >
                <Icon icon="lucide:trash-2" width="14" />
              </button>
            </div>
          </div>
        </template>
      </draggable>

      <div v-else class="py-4 text-center text-xs text-gray-400 dark:text-gray-500 select-none">
        {{ t('空') }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.sortable-ghost {
  opacity: 0.5;
  background: rgba(0, 192, 245, 0.1); 
}
</style>