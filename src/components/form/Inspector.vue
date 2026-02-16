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
import ObjectArray from '@/components/form/array/ObjectArray.vue'
import MapInspector from '@/components/form/map/MapInspector.vue'
import AnyTypeInspector from '@/components/form/AnyTypeInspector.vue'
import AnyTypeArray from '@/components/form/array/AnyTypeArray.vue'
import { autoCompleteDataSources, builtinAnimations } from '@/assets/more/chatbox/enumTypes'
import { useChatBoxEditorStore } from '@/stores'
import { blockSuggestions, effectSuggestions, itemSuggestions } from '@/assets/textures/mcTextures'
import { enchantmentSuggestions } from '@/assets/textures/enchantment'
import { attributeSuggestions } from '@/assets/textures/attribute'
import Inspector from '@/components/form/Inspector.vue'

const props = defineProps({
  model: { type: Object, default: null },
  modelValue: { type: Object, default: undefined },
  // 当对象为空时，用于初始化的构造函数
  clazz: { type: Function, default: null },
})

const emit = defineEmits(['init', 'update:modelValue'])

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
  [EditorTypes.OBJECT]: Inspector,
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
      options.push({ label: `${key} (自定义)`, value: key })
    }
  })
  return options
})

const allPortraitsOptions = computed(() => {
  return store.globalPortraits.map(i => {
    return { label: i, value: i }
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

const currentModel = computed(() => {
  return props.model ?? props.modelValue ?? null
})

const targetConstructor = computed(() => {
  return currentModel.value?.constructor || props.clazz
})

const defaultInstance = computed(() => {
  if (!targetConstructor.value) return null
  try {
    return new targetConstructor.value()
  } catch (e) {
    console.warn('Inspector: 无法实例化默认对象', e)
    return {}
  }
})

const fieldConfigs = computed(() => {
  if (!targetConstructor.value || !targetConstructor.value.getFieldConfigs) return {}
  return targetConstructor.value.getFieldConfigs()
})

const isFieldModified = (key) => {
  if (!currentModel.value) return false
  const current = currentModel.value[key]
  const def = defaultInstance.value ? defaultInstance.value[key] : undefined
  return current !== def && current !== null && current !== undefined
}

const resetField = (key) => {
  if (currentModel.value && defaultInstance.value) {
    currentModel.value[key] = defaultInstance.value[key]
  }
}

const sortedFields = computed(() => {
  const list = []
  const modelForCheck = currentModel.value || defaultInstance.value

  Object.entries(fieldConfigs.value).forEach(([key, config]) => {
    if (config.showIf && modelForCheck && !config.showIf(modelForCheck)) {
      return
    }
    list.push({ key, ...config })
  })

  return list
})

const getBindValue = (field) => {
  const key = field.modelKey || field.key
  if (currentModel.value) {
    return currentModel.value[key]
  }
  return defaultInstance.value ? defaultInstance.value[key] : undefined
}

const handleUpdate = (field, val) => {
  const key = field.modelKey || field.key

  if (currentModel.value) {
    currentModel.value[key] = val
  } else if (targetConstructor.value) {
    const newInstance = new targetConstructor.value()
    newInstance[key] = val

    emit('init', newInstance)
    emit('update:modelValue', newInstance)
  }
}
</script>

<template>
  <div class="flex flex-col w-full px-1 pl-2">

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
          @init="(val) => handleUpdate(field, val)"
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
