<script setup>
import { computed, ref, toRaw } from 'vue'
import { Icon } from '@iconify/vue'
import Form from './Form.vue'
import FormItem from './FormItem.vue'
import Input from './Input.vue'
import InputNumber from './InputNumber.vue'
import Select from './Select.vue'
import Switch from './Switch.vue'
import ColorPicker from './ColorPicker.vue'
import AutoComplete from './AutoComplete.vue'
import Color from '../assets/more/chatBox/class.js'
import { translatable } from '../assets/translatable/translatable.js'
import { usePageStore } from '@/stores/index.js'

const lang = computed(() => usePageStore().setting.language)
const props = defineProps({
  // 数组值
  modelValue: {
    type: Array,
    default: () => [],
  },
  // 字段描述，用于显示更友好的标签和提示
  fieldDescriptions: {
    type: Object,
    default: () => ({}),
  },
  // 列表项显示的模板，支持{fieldName}格式的占位符
  displayTemplate: {
    type: String,
    default: '',
  },
  // 列表项的标题
  title: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

// 深拷贝函数
const deepClone = (obj) => {
  try {
    // 先将响应式对象转换为普通对象
    const rawObj = toRaw(obj)

    // 尝试使用structuredClone
    if (typeof structuredClone === 'function') {
      try {
        return structuredClone(rawObj)
      } catch (e) {
        console.warn('structuredClone failed, falling back to JSON method', e)
      }
    }

    // 如果structuredClone不可用或失败，使用JSON方法
    return JSON.parse(JSON.stringify(rawObj))
  } catch (e) {
    console.error('Deep clone failed', e)
    // 如果所有方法都失败，返回一个空对象或数组
    return Array.isArray(obj) ? [] : {}
  }
}

// 当前编辑的项目
const currentEditingItem = ref(null)
const currentEditingIndex = ref(-1)
const showEditModal = ref(false)

// 从字段描述中获取所有字段
const getAllFields = () => {
  const fields = []
  Object.keys(props.fieldDescriptions).forEach((key) => {
    // 支持两种格式: [].xxx 和 arrayName[].xxx
    if (key.includes('[].')) {
      const field = key.substring(key.indexOf('[].') + 3) // 去掉 '[].'' 前缀
      if (!fields.includes(field)) {
        fields.push(field)
      }
    }
  })
  return fields
}

// 获取字段描述
const getFieldDesc = (field) => {
  // 先尝试 [].xxx 格式
  let path = `[].${field}`
  let fieldDesc = props.fieldDescriptions[path]

  // 如果找不到，尝试 arrayName[].xxx 格式
  if (!fieldDesc) {
    // 查找所有可能的数组名前缀
    const possibleKey = Object.keys(props.fieldDescriptions).find((key) =>
      key.endsWith(`[].${field}`),
    )
    if (possibleKey) {
      fieldDesc = props.fieldDescriptions[possibleKey]
    }
  }

  return fieldDesc
}

// 从字段描述中获取默认值
const getDefaultValue = (field) => {
  const fieldDesc = getFieldDesc(field)

  if (!fieldDesc) return undefined

  // 支持 defaultValue 和 default 两种属性名
  if (fieldDesc.defaultValue !== undefined) {
    return fieldDesc.defaultValue
  }

  if (fieldDesc.default !== undefined) {
    return fieldDesc.default
  }

  // 根据类型提供合理的默认值
  switch (fieldDesc.type) {
    case 'string':
      return ''
    case 'integer':
      return 0
    case 'float':
      return 0.0
    case 'boolean':
      return false
    case 'enum':
      return fieldDesc.enumOptions && fieldDesc.enumOptions.length > 0
        ? fieldDesc.enumOptions[0].value || fieldDesc.enumOptions[0]
        : ''
    case 'color':
      return '#FFFFFF'
    default:
      return undefined
  }
}

// 创建新项目
const createNewItem = () => {
  const newItem = {}
  const fields = getAllFields()

  // 使用字段描述中的默认值
  fields.forEach((field) => {
    newItem[field] = getDefaultValue(field)
  })

  return newItem
}

// 添加新项目
const addItem = () => {
  const newItem = createNewItem()
  currentEditingItem.value = newItem
  currentEditingIndex.value = -1
  showEditModal.value = true
}

// 编辑项目
const editItem = (item, index) => {
  currentEditingItem.value = deepClone(item)
  currentEditingIndex.value = index
  showEditModal.value = true
}

// 删除项目
const removeItem = (index) => {
  const newArray = [...props.modelValue]
  newArray.splice(index, 1)
  emit('update:modelValue', newArray)
}

// 保存编辑
const saveEdit = () => {
  if (!currentEditingItem.value) return

  // 创建一个全新的数组，确保触发响应式更新
  const newArray = JSON.parse(JSON.stringify(props.modelValue))

  if (currentEditingIndex.value >= 0) {
    // 编辑现有项目
    newArray[currentEditingIndex.value] = deepClone(currentEditingItem.value)
  } else {
    // 添加新项目
    newArray.push(deepClone(currentEditingItem.value))
  }

  // 使用emit触发更新
  emit('update:modelValue', newArray)
  closeEditModal()
}

// 关闭编辑弹窗
const closeEditModal = () => {
  currentEditingItem.value = null
  currentEditingIndex.value = -1
  showEditModal.value = false
}

// 获取字段的友好名称
const getFieldLabel = (field) => {
  const fieldDesc = getFieldDesc(field)
  return fieldDesc?.label || field
}

// 获取字段的提示信息
const getFieldHint = (field) => {
  const fieldDesc = getFieldDesc(field)
  return fieldDesc?.hint || ''
}

// 获取字段的类型
const getFieldType = (field, value) => {
  const fieldDesc = getFieldDesc(field)
  return fieldDesc?.type || getValueType(value)
}

// 获取枚举选项
const getEnumOptions = (field) => {
  const fieldDesc = getFieldDesc(field)
  const options = fieldDesc?.enumOptions || []

  return options.map((option) => {
    if (typeof option === 'object' && option.value !== undefined && option.label !== undefined) {
      return option
    } else if (typeof option === 'object') {
      return {
        value: option.value || option.name || '',
        label: option.label || option.name || option.value || '',
      }
    } else {
      return {
        value: option,
        label: option,
      }
    }
  })
}

// 判断值的类型
const getValueType = (value) => {
  if (value === null || value === undefined) return 'null'
  if (Array.isArray(value)) return 'array'
  if (value instanceof Color) return 'color'
  if (typeof value === 'object') {
    if (
      value &&
      'r' in value &&
      'g' in value &&
      'b' in value &&
      typeof value.r === 'number' &&
      typeof value.g === 'number' &&
      typeof value.b === 'number'
    ) {
      return 'color'
    }
    return 'object'
  }
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') {
    // 检查是否可能是Minecraft整数颜色格式
    try {
      Color.fromMinecraftInt(value)
      return 'color'
    } catch (e) {
      return Number.isInteger(value) ? 'integer' : 'float'
    }
  }
  if (typeof value === 'string') {
    // 使用Color类的方法尝试解析颜色字符串
    try {
      if (value.startsWith('#')) {
        Color.fromHex(value)
        return 'color'
      } else if (value.startsWith('rgb')) {
        Color.fromRgbString(value)
        return 'color'
      }
    } catch (e) {
      // 解析失败，不是有效的颜色字符串
    }
    return 'string'
  }
  return 'unknown'
}

// 处理颜色更新
const handleColorUpdate = (value, field) => {
  if (!currentEditingItem.value) return

  try {
    let colorObj

    // 将输入值转换为Color对象
    if (typeof value === 'string') {
      if (value.startsWith('#')) {
        colorObj = Color.fromHex(value)
      } else if (value.startsWith('rgb')) {
        colorObj = Color.fromRgbString(value)
      } else {
        colorObj = new Color(0, 0, 0)
      }
    } else if (typeof value === 'number') {
      colorObj = Color.fromMinecraftInt(value)
    } else if (value instanceof Color) {
      colorObj = value
    } else if (value && typeof value === 'object' && 'r' in value && 'g' in value && 'b' in value) {
      colorObj = new Color(value.r, value.g, value.b, value.a !== undefined ? value.a : 255)
    } else {
      colorObj = new Color(0, 0, 0)
    }

    const path = `[].${field}`
    const colorFormat = props.fieldDescriptions[path]?.colorFormat || 'hex'

    // 根据指定的格式设置值
    switch (colorFormat) {
      case 'hex':
        currentEditingItem.value[field] = colorObj.toHex(true)
        break
      case 'rgb':
        currentEditingItem.value[field] = colorObj.toRgbString(false)
        break
      case 'rgba':
        currentEditingItem.value[field] = colorObj.toRgbString(true)
        break
      case 'mcint':
        currentEditingItem.value[field] = colorObj.toMinecraftInt()
        break
      case 'color':
        currentEditingItem.value[field] = colorObj
        break
      default:
        // 默认保持原始格式
        if (typeof currentEditingItem.value[field] === 'string') {
          if (currentEditingItem.value[field].startsWith('#')) {
            currentEditingItem.value[field] = colorObj.toHex(
              currentEditingItem.value[field].length > 7,
            )
          } else if (currentEditingItem.value[field].startsWith('rgb')) {
            currentEditingItem.value[field] = colorObj.toRgbString(
              currentEditingItem.value[field].startsWith('rgba'),
            )
          }
        } else if (typeof currentEditingItem.value[field] === 'number') {
          currentEditingItem.value[field] = colorObj.toMinecraftInt()
        } else {
          currentEditingItem.value[field] = colorObj
        }
    }
  } catch (error) {
    console.error('颜色转换错误:', error)
  }
}

// 获取显示名称
const getDisplayName = (item, index) => {
  // 使用模板解析
  const displayValue = props.displayTemplate.replace(/\{(\w+)}/g, (match, field) => {
    return item[field] !== undefined ? item[field] : ''
  })

  // 如果解析后为空，则使用默认值
  return displayValue.trim() || `${props.title} ${index + 1}`
}
</script>

<template>
  <div class="array-object-generator">
    <!-- 列表显示 -->
    <div class="mb-4">
      <div
        v-if="modelValue.length === 0"
        class="p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded text-center"
      >
        <p class="mb-2 text-gray-500 dark:text-gray-400">
          {{ translatable(lang, 'component.empty') }}{{ title }}
        </p>
      </div>

      <div v-else class="space-y-2">
        <div
          v-for="(item, index) in modelValue"
          :key="index"
          class="flex justify-between items-center p-3 border border-gray-200 rounded hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <div class="flex items-center">
            <span class="mr-2 text-gray-500 dark:text-gray-400">#{{ index + 1 }}</span>
            <span class="font-medium">{{ getDisplayName(item, index) }}</span>
          </div>
          <div class="flex">
            <button
              class="p-1.5 text-blue-500 hover:bg-blue-100 rounded dark:hover:bg-blue-900 mr-2"
              @click="editItem(item, index)"
            >
              <Icon icon="mdi:pencil" />
            </button>
            <button
              class="p-1.5 text-red-500 hover:bg-red-100 rounded dark:hover:bg-red-900"
              @click="removeItem(index)"
            >
              <Icon icon="mdi:delete" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加按钮 -->
    <button
      class="w-full p-2 border border-dashed border-gray-300 dark:border-gray-600 rounded text-center hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center"
      @click="addItem"
    >
      <Icon icon="mdi:plus" class="mr-1" />
      {{ translatable(lang, 'component.add') }}{{ title }}
    </button>

    <!-- 编辑弹窗 -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:text-white"
      >
        <div class="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 class="text-lg font-medium">
            {{
              currentEditingIndex >= 0
                ? translatable(lang, 'component.update')
                : translatable(lang, 'component.add')
            }}{{ title }}
            {{ currentEditingIndex >= 0 ? `#${currentEditingIndex + 1}` : '' }}
          </h3>
          <button
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            @click="closeEditModal"
          >
            <Icon icon="mdi:close" class="text-xl" />
          </button>
        </div>

        <Form class="p-4">
          <template v-if="currentEditingItem">
            <!-- 使用字段描述中的字段列表 -->
            <template v-for="field in getAllFields()" :key="field">
              <FormItem :label="getFieldLabel(field)">
                <!-- 字符串类型 -->
                <template v-if="getFieldType(field) === 'string'">
                  <!-- 如果字段描述中指定了autocomplete类型 -->
                  <AutoComplete
                    v-if="getFieldDesc(field)?.type === 'autocomplete'"
                    v-model="currentEditingItem[field]"
                    :suggestions="getFieldDesc(field)?.suggestions || []"
                    :valueKey="getFieldDesc(field)?.valueKey || 'value'"
                    :labelKey="getFieldDesc(field)?.labelKey || 'label'"
                    :placeholder="getFieldDesc(field)?.placeholder"
                    :clearable="true"
                  />
                  <!-- 普通字符串输入 -->
                  <Input v-else v-model="currentEditingItem[field]" default-model="search" />
                </template>

                <!-- 数字类型 -->
                <InputNumber
                  v-else-if="getFieldType(field) === 'integer'"
                  v-model="currentEditingItem[field]"
                  :precision="0"
                  :step="1"
                  :min="getFieldDesc(field)?.min"
                  :max="getFieldDesc(field)?.max"
                />

                <InputNumber
                  v-else-if="getFieldType(field) === 'float'"
                  v-model="currentEditingItem[field]"
                  :precision="2"
                  :step="0.1"
                  :min="getFieldDesc(field)?.min"
                  :max="getFieldDesc(field)?.max"
                />

                <!-- 布尔类型 -->
                <Switch
                  v-else-if="getFieldType(field) === 'boolean'"
                  v-model:modelValue="currentEditingItem[field]"
                />

                <!-- 枚举类型 -->
                <Select
                  v-else-if="getFieldType(field) === 'enum'"
                  :value="currentEditingItem[field]"
                  :options="getEnumOptions(field)"
                  @update:value="
                    (val) => {
                      currentEditingItem[field] = val.value
                    }
                  "
                  trigger="hover"
                  :mode="getFieldDesc(field)?.mode"
                  :offset="2"
                />

                <!-- 颜色类型 -->
                <ColorPicker
                  v-else-if="getFieldType(field) === 'color'"
                  v-model="currentEditingItem[field]"
                  @update:modelValue="(val) => handleColorUpdate(val, field)"
                />

                <!-- 默认使用字符串类型 -->
                <Input v-else v-model="currentEditingItem[field]" default-model="search" />

                <!-- 提示信息 -->
                <div
                  v-if="getFieldHint(field)"
                  class="text-xs text-gray-500 mt-1 dark:text-gray-400"
                >
                  {{ getFieldHint(field) }}
                </div>
              </FormItem>
            </template>
          </template>
        </Form>

        <div class="flex justify-end p-4 border-t dark:border-gray-700">
          <button
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 mr-2 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            @click="closeEditModal"
          >
            {{ translatable(lang, 'component.dialog.negative') }}
          </button>
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            @click="saveEdit"
          >
            {{ translatable(lang, 'component.dialog.positive') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.array-object-generator {
  width: 100%;
}
</style>
