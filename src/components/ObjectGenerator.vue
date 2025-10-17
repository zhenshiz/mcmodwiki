<script setup>
import { computed, onMounted } from 'vue'
import Form from '@/components/Form.vue'
import FormItem from '@/components/FormItem.vue'
import Input from '@/components/Input.vue'
import InputNumber from '@/components/InputNumber.vue'
import AutoComplete from '@/components/AutoComplete.vue'
import Switch from '@/components/Switch.vue'
import Select from '@/components/Select.vue'
import ColorPicker from '@/components/ColorPicker.vue'
import ArrayComponent from '@/components/ArrayComponent.vue'
import ObjectGeneratorDialog from '@/components/ObjectGeneratorDialog.vue'
import ObjectMapComponent from '@/components/ObjectMapComponent.vue'
import ArrayObjectGenerator from '@/components/ArrayObjectGenerator.vue'
import { ObjectField } from '@/assets/const/objectClass.js'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  properties: {
    type: ObjectField,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const fields = computed(() => props.properties.properties || {})

const getRealKey = (key) => {
  const field = fields.value[key]
  return field?.key || key
}

const updateField = (key, value) => {
  const realKey = getRealKey(key)
  const newVal = { ...props.modelValue, [realKey]: value }
  emit('update:modelValue', newVal)
}

onMounted(() => {
  const initial = { ...props.modelValue }
  for (const [key, field] of Object.entries(fields.value)) {
    const realKey = getRealKey(key)
    if (initial[realKey] === undefined && field.defaultValue !== undefined) {
      initial[realKey] = field.defaultValue
    }
  }
  emit('update:modelValue', initial)
})
</script>

<template>
  <Form>
    <template v-for="(field, key) in fields" :key="key">
      <FormItem
        v-if="field.isVisible(field, modelValue)"
        :label="field.label"
        :tips="field.tips"
        :layout="field.layout"
      >
        <!-- 字符串 -->
        <Input
          v-if="field.type === 'string'"
          defaultModel="search"
          :placeholder="field.placeholder"
          :modelValue="modelValue[getRealKey(key)]"
          @update:modelValue="updateField(key, $event)"
        />

        <!-- 自动补全 -->
        <AutoComplete
          v-else-if="field.type === 'autoComplete'"
          :modelValue="modelValue[getRealKey(key)]"
          :suggestions="field.suggestions"
          :label-key="field.labelKey"
          :value-key="field.valueKey"
          :icon-key="field.iconKey"
          :filter-method="field.filterMethod"
          :clearable="field.clearable"
          :trigger-on-focus="field.triggerOnFocus"
          @update:modelValue="updateField(key, $event)"
        />

        <!-- 数字 -->
        <InputNumber
          v-else-if="['number', 'integer', 'float'].includes(field.type)"
          :modelValue="modelValue[getRealKey(key)]"
          :step="field.step"
          :precision="field.precision"
          :min="field.min"
          :max="field.max"
          @update:modelValue="updateField(key, $event)"
        />

        <!-- 布尔 -->
        <Switch
          v-else-if="field.type === 'boolean'"
          :modelValue="modelValue[getRealKey(key)]"
          @update:modelValue="updateField(key, $event)"
        />

        <!-- 枚举 -->
        <Select
          v-else-if="field.type === 'enum'"
          v-model="modelValue[getRealKey(key)]"
          :options="field.options"
          :width="field.width"
          :mode="field.mode"
          :offset="field.offset"
        />

        <!-- 颜色 -->
        <ColorPicker
          v-else-if="field.type === 'color'"
          :modelValue="modelValue[getRealKey(key)]"
          @update:modelValue="updateField(key, $event)"
        />

        <!-- 字符串数组 -->
        <ArrayComponent
          class="w-[500px]"
          v-else-if="field.type === 'strArr'"
          :modelValue="modelValue[getRealKey(key)]"
          :title="field.title"
          :defaultValue="field.itemDefaultValue"
          @update:modelValue="updateField(key, $event)"
        >
          <template #item="{value,update}">
            <AutoComplete :modelValue="value" @update:modelValue="update($event)"
                          :suggestions="field.suggestions" clearable />
          </template>
        </ArrayComponent>

        <!-- 布尔数组 -->
        <ArrayComponent
          class="w-[500px]"
          v-else-if="field.type === 'boolArr'"
          :modelValue="modelValue[getRealKey(key)]"
          :title="field.title"
          :defaultValue="field.itemDefaultValue"
          @update:modelValue="updateField(key, $event)"
        >
          <template #item="{ value, update }">
            <Switch :modelValue="value" @update:modelValue="update($event)" />
          </template>
        </ArrayComponent>

        <!-- 对象数组 -->
        <ArrayObjectGenerator
          class="w-[500px]"
          v-else-if="field.type === 'objectArr'"
          :properties="field"
          :title="field.title"
          :displayTemplate="field.displayTemplate"
          :dialogWidthPercent="field.dialogWidthPercent"
          v-model="modelValue[getRealKey(key)]"
        />

        <!-- 嵌套对象 -->
        <ObjectGenerator
          v-else-if="field.type === 'object'"
          v-model="modelValue[getRealKey(key)]"
          :properties="field"
        />

        <!-- 弹窗对象 -->
        <ObjectGeneratorDialog
          v-else-if="field.type === 'objectDialog'"
          v-model:visible="field.visible"
          :properties="field"
          v-model="modelValue[getRealKey(key)]"
        />

        <!-- Map对象 -->
        <ObjectMapComponent
          v-else-if="field.type === 'objectMap'"
          :properties="field"
          :displayTemplate="field.displayTemplate"
          v-model="modelValue[getRealKey(key)]"
        />
      </FormItem>
    </template>
  </Form>
</template>
