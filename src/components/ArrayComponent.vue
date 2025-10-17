<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import Input from '@/components/Input.vue'
import { usePageStore } from '@/stores/index.js'
import { translatable } from '@/assets/translatable/translatable.js'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: ''
  },
  defaultValue: {
    type: [String, Number, Boolean, Object, Array],
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])
const lang = computed(() => usePageStore().setting.language)

// === Methods ===
const updateItem = (index, value) => {
  const list = [...props.modelValue]
  list[index] = value
  emit('update:modelValue', list)
}

const removeItem = (index) => {
  const list = [...props.modelValue]
  list.splice(index, 1)
  emit('update:modelValue', list)
}

const openAdd = () => {
  const newItem = typeof props.defaultValue === 'object'
    ? JSON.parse(JSON.stringify(props.defaultValue))
    : props.defaultValue
  emit('update:modelValue', [...props.modelValue, newItem])
}
</script>

<template>
  <div class="array-field w-full space-y-2">
    <!-- 列表 -->
    <div v-if="modelValue.length" class="space-y-2">
      <div
        v-for="(item, index) in modelValue"
        :key="index"
        class="flex items-center justify-between p-2 border border-gray-200 rounded dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <div class="flex items-center w-full gap-2">
          <span class="text-gray-400 shrink-0">#{{ index + 1 }}</span>

          <slot name="item" :value="item" :index="index" :update="(v) => updateItem(index, v)">
            <!-- 默认Input -->
            <Input
              defaultModel="search"
              class="flex-1"
              :modelValue="item"
              @update:modelValue="updateItem(index, $event)"
            />
          </slot>

          <!-- 删除按钮 -->
          <button
            class="text-red-500 hover:bg-red-100 dark:hover:bg-red-900 p-1 rounded shrink-0"
            @click="removeItem(index)"
          >
            <Icon icon="mdi:delete" />
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div
      v-else
      class="p-3 border border-dashed border-gray-300 dark:border-gray-600 rounded text-center text-gray-500 dark:text-gray-400"
    >
      {{ translatable(lang, 'component.empty') }}{{ title }}
    </div>

    <!-- 添加按钮 -->
    <button
      class="w-full p-2 border border-dashed border-gray-300 dark:border-gray-600 rounded text-center hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center dark:text-white"
      @click="openAdd"
    >
      <Icon icon="mdi:plus" class="mr-1" />
      {{ translatable(lang, 'component.add') }}{{ title }}
    </button>
  </div>
</template>
