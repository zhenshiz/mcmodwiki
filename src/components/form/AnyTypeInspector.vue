<script setup>
import { computed, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Input from './Input.vue'
import NumberInput from './NumberInput.vue'
import Switch from './Switch.vue'
import Inspector from './Inspector.vue'
import AutoComplete from './Autocomplete.vue' // 1. 引入 AutoComplete
import { EditorTypes } from '@/assets/generator/editorType.js' // 2. 引入类型常量

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Object, Array, null],
    default: null
  },
  label: {
    type: String,
    default: ''
  },
  /**
   * types 配置增强：
   * [
   *  'number', // 简写，使用默认 NumberInput
   *  {
   *    value: 'string',
   *    label: '资源ID',
   *    editorType: EditorTypes.AUTOCOMPLETE, // 指定组件
   *    props: { options: ['a', 'b'], placeholder: '搜素...' } // 透传参数
   *  },
   *  { value: 'object', label: '配置' }
   * ]
   */
  types: {
    type: Array,
    default: () => ['string', 'number', 'boolean', 'object']
  },
  // 对象构造器
  objectConstructor: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

// --- 默认配置 ---
const STANDARD_TYPES = {
  string: {
    label: 'String',
    value: 'string',
    icon: 'lucide:type',
    defaultValue: '',
    editorType: EditorTypes.INPUT // 默认为普通 Input
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

// 自动检测类型
const detectType = (val) => {
  if (val === null) return 'string'
  const type = typeof val
  if (type === 'string' || type === 'number' || type === 'boolean') return type
  if (type === 'object') {
    if (Array.isArray(val)) return 'array'
    return 'object'
  }
  return 'string'
}

const currentType = ref('string')

// 监听值变化
watch(() => props.modelValue, (val) => {
  currentType.value = detectType(val)
}, { immediate: true })

// 计算完整的选项列表 (合并默认配置与用户配置)
const typeOptions = computed(() => {
  return props.types.map(t => {
    // 处理简写: 'string'
    if (typeof t === 'string') {
      return STANDARD_TYPES[t] || { label: t, value: t, icon: 'lucide:help-circle' }
    }
    // 处理对象: { value: 'string', editorType: 'autocomplete' ... }
    const standard = STANDARD_TYPES[t.value] || {}
    return {
      ...standard, // 默认值
      ...t,        // 用户覆盖 (editorType, props, label 等)
      // 确保 props 存在
      props: { ...(standard.props || {}), ...(t.props || {}) }
    }
  })
})

// 获取当前激活的配置项 (核心)
// 用于在 template 中判断到底用哪个组件渲染
const activeOption = computed(() => {
  return typeOptions.value.find(opt => opt.value === currentType.value) || STANDARD_TYPES.string
})

// 切换类型
const handleTypeSwitch = (typeOpt) => {
  if (currentType.value === typeOpt.value) return

  let newVal
  if (typeOpt.createDefault) {
    newVal = typeOpt.createDefault()
  } else if (typeOpt.defaultValue !== undefined) {
    newVal = typeOpt.defaultValue
  } else {
    newVal = STANDARD_TYPES[typeOpt.value]?.defaultValue ?? null
  }

  currentType.value = typeOpt.value
  emit('update:modelValue', newVal)
}
</script>

<template>
  <div
    class="w-full border border-gray-200 dark:border-slate-700 rounded bg-white dark:bg-[#002941] mt-2 overflow-hidden shadow-sm">

    <div
      class="flex justify-between items-center px-3 py-1.5 bg-gray-50 dark:bg-[#002033] border-b border-gray-200 dark:border-slate-700">
      <span class="text-xs font-bold text-gray-500 dark:text-gray-400 select-none">
        {{ label }}
      </span>

      <div class="flex bg-gray-200 dark:bg-slate-800 rounded p-0.5 gap-0.5">
        <button
          v-for="opt in typeOptions"
          :key="opt.value"
          @click="handleTypeSwitch(opt)"
          class="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] transition-all"
          :class="[
            currentType === opt.value
              ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm font-bold'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-300/50 dark:hover:bg-white/5'
          ]"
          :title="opt.label"
        >
          <Icon v-if="opt.icon" :icon="opt.icon" width="10" />
          <span>{{ opt.label }}</span>
        </button>
      </div>
    </div>

    <div class="p-2">

      <template v-if="currentType === 'string'">
        <AutoComplete
          v-if="activeOption.editorType === EditorTypes.AUTOCOMPLETE"
          :model-value="modelValue"
          @update:modelValue="emit('update:modelValue', $event)"
          v-bind="activeOption.props"
          class="w-full"
        />
        <Input
          v-else
          :model-value="modelValue"
          @update:modelValue="emit('update:modelValue', $event)"
          v-bind="activeOption.props"
          class="w-full"
        />
      </template>

      <template v-else-if="currentType === 'number'">
        <NumberInput
          :model-value="modelValue"
          @update:modelValue="emit('update:modelValue', $event)"
          v-bind="activeOption.props"
          class="w-full"
        />
      </template>

      <div v-else-if="currentType === 'boolean'" class="flex items-center h-[30px]">
        <Switch
          :model-value="modelValue"
          @update:modelValue="emit('update:modelValue', $event)"
          :width="50"
          v-bind="activeOption.props"
        />
        <span class="ml-3 text-xs text-gray-400 font-mono">{{ modelValue }}</span>
      </div>

      <div v-else-if="currentType === 'object'">
        <Inspector
          v-if="modelValue && typeof modelValue === 'object'"
          :model="modelValue"
          v-bind="activeOption.props"
        />
        <div v-else class="text-xs text-red-400">
          数据结构错误: 预期 Object，实际 {{ typeof modelValue }}
        </div>
      </div>

      <div v-else class="text-xs text-gray-500 italic">
        暂不支持编辑类型: {{ currentType }}
      </div>

    </div>
  </div>
</template>
