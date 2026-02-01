<script setup>
import { computed } from 'vue'
import { EditorTypes } from '@/assets/generator/editorType'
import InspectorItem from './InspectorItem.vue'

// 引入你的基础输入组件
import NumberInput from './NumberInput.vue'
import Slider from './Slider.vue'
import ColorPicker from './ColorPicker.vue'
import Autocomplete from './Autocomplete.vue'
import Input from './Input.vue'
import Select from './Select.vue'
import Switch from './Switch.vue'
import StringArray from './array/StringArray.vue'
import NumberArray from '@/components/form/array/NumberArray.vue'
import BooleanArray from '@/components/form/array/BooleanArray.vue'
import ObjectDialog from '@/components/form/ObjectDialog.vue'
import ObjectArray from '@/components/form/array/ObjectArray.vue'
import MapInspector from '@/components/form/map/MapInspector.vue'
import AnyTypeInspector from '@/components/form/AnyTypeInspector.vue'
import AnyTypeArray from '@/components/form/array/AnyTypeArray.vue'
import { autoCompleteDataSources, builtinAnimations } from '@/assets/more/chatbox/enumTypes'
import { useChatBoxEditorStore } from '@/stores'
import { blockSuggestions, effectSuggestions, itemSuggestions } from '@/assets/textures/mcTextures'
import { enchantmentSuggestions } from '@/assets/textures/enchantment'
import { attributeSuggestions } from '@/assets/textures/attribute'

const props = defineProps({
  // 允许 model 为 null
  model: { type: Object, default: null },
  // 新增：当 model 为 null 时，用于生成表单的类构造器
  clazz: { type: Function, default: null },
})

const emit = defineEmits(['init'])

const store = useChatBoxEditorStore()

// 组件映射表
const COMPONENT_MAP = {
  [EditorTypes.INPUT]: Input,
  [EditorTypes.NUMBER_INPUT]: NumberInput,
  [EditorTypes.SLIDER]: Slider,
  [EditorTypes.COLOR]: ColorPicker,
  [EditorTypes.SELECT]: Select,
  [EditorTypes.SWITCH]: Switch,
  [EditorTypes.AUTOCOMPLETE]: Autocomplete,
  [EditorTypes.OBJECT_DIALOG]: ObjectDialog,
  [EditorTypes.MAP]: MapInspector,
  [EditorTypes.ANY]: AnyTypeInspector,
  [EditorTypes.STRING_ARR]: StringArray,
  [EditorTypes.NUMBER_ARR]: NumberArray,
  [EditorTypes.BOOL_ARR]: BooleanArray,
  [EditorTypes.OBJECT_ARR]: ObjectArray,
  [EditorTypes.ANY_ARR]: AnyTypeArray
}

const allAnimationOptions = computed(() => {
  const options = [...builtinAnimations]

  const allKeys = new Set()

  store.globalAnimations.forEach(key => allKeys.add(key))

  if (store.currentModel && store.currentModel.customAnimation) {
    Object.keys(store.currentModel.customAnimation).forEach(key => allKeys.add(key))
  }

  allKeys.forEach(key => {
    if (!options.some(opt => opt.value === key)) {
      options.push({
        label: `${key} (自定义)`,
        value: key
      })
    }
  })

  return options
})

const allPortraitsOptions = computed(() => {
  return store.globalPortraits.map(i => {
    return {
      label: i,
      value: i
    }
  })
})

const dataSourceMap = computed(() => ({
  [autoCompleteDataSources.TEXTURE]: store.allTextureOptions,
  [autoCompleteDataSources.ITEM]: itemSuggestions,
  [autoCompleteDataSources.BLOCK]: blockSuggestions,
  [autoCompleteDataSources.EFFECT]: effectSuggestions,
  [autoCompleteDataSources.ENCHANTMENT]: enchantmentSuggestions,
  [autoCompleteDataSources.ATTRIBUTE]: attributeSuggestions,
  [autoCompleteDataSources.PRESET_ANIMATION]: allAnimationOptions.value,
  [autoCompleteDataSources.TRANSLATABLE_KEYS]: store.translatableSuggestions,
  [autoCompleteDataSources.PORTRAIT]: allPortraitsOptions.value
}))

const getDynamicOptions = (field) => {
  if (field.props?.dataSource) {
    const key = field.props.dataSource
    return dataSourceMap.value[key] || []
  }
  return undefined
}

// 1. 获取目标构造函数 (优先实例，其次类)
const targetConstructor = computed(() => {
  return props.model?.constructor || props.clazz
})

// 2. 获取默认实例 (用于 showIf 判断和空值初始显示)
const defaultInstance = computed(() => {
  if (!targetConstructor.value) return null
  try {
    return new targetConstructor.value()
  } catch (e) {
    console.warn('Inspector: 无法实例化默认对象', e)
    return {}
  }
})

// 3. 获取元数据
const fieldConfigs = computed(() => {
  if (!targetConstructor.value || !targetConstructor.value.getFieldConfigs) return {}
  return targetConstructor.value.getFieldConfigs()
})

// 4. 字段是否被修改
const isFieldModified = (key) => {
  // 如果 model 为空，视为未修改（或者默认状态）
  if (!props.model) return false

  const current = props.model[key]
  const def = defaultInstance.value ? defaultInstance.value[key] : undefined
  return current !== def && current !== null && current !== undefined
}

// 5. 重置字段
const resetField = (key) => {
  if (props.model && defaultInstance.value) {
    props.model[key] = defaultInstance.value[key]
  }
}

// 6. 排序后的字段列表
const sortedFields = computed(() => {
  const list = []
  // 用于 showIf 判断的对象：有 model 用 model，没 model 用默认空实例
  const modelForCheck = props.model || defaultInstance.value

  Object.entries(fieldConfigs.value).forEach(([key, config]) => {
    // 检查 showIf，如果没有 model 也会基于默认值检查
    if (config.showIf && modelForCheck && !config.showIf(modelForCheck)) {
      return
    }

    list.push({
      key,
      ...config
    })
  })

  return list
})

// === 核心逻辑：空值处理代理 ===

// 获取绑定值：有 model 取 model，无 model 取默认值
const getBindValue = (field) => {
  const key = field.modelKey || field.key
  if (props.model) {
    return props.model[key]
  }
  return defaultInstance.value ? defaultInstance.value[key] : undefined
}

// 更新值：有 model 直接改，无 model 则实例化并 emit
const handleUpdate = (field, val) => {
  const key = field.modelKey || field.key

  if (props.model) {
    // 正常模式
    props.model[key] = val
  } else if (targetConstructor.value) {
    // 空对象模式：用户开始输入 -> 初始化对象
    const newInstance = new targetConstructor.value()
    newInstance[key] = val // 写入当前修改的值
    emit('init', newInstance) // 抛出给父组件赋值
  }
}
</script>

<template>
  <div class="flex flex-col w-full px-1">

    <template v-for="field in sortedFields" :key="field.key">
      <InspectorItem
        :label="field.label"
        :tips="field.tips"
        :is-modified="isFieldModified(field.modelKey || field.key)"
        @reset="resetField(field.modelKey || field.key)"
      >
        <component
          :is="COMPONENT_MAP[field.type] || 'input'"
          :model-value="getBindValue(field)"
          @update:modelValue="(val) => handleUpdate(field, val)"
          v-bind="{
            ...field.props,
            options: getDynamicOptions(field) || field.props?.options,
            optionsResolver: (key) => getDynamicOptions({ props: { dataSource: key } })
          }"
          class="w-full"
        />
      </InspectorItem>
    </template>

    <div v-if="sortedFields.length === 0" class="text-xs text-slate-500 p-2 text-center">
      无配置项
    </div>
  </div>
</template>
