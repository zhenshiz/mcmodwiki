<script setup>
import { itemSuggestions } from '@/assets/textures/itemSuggestions.js'
import { computed } from 'vue'
import { usePageStore } from '@/stores/index.js'
import {
  AutoCompleteField,
  BoolArrFiled,
  BooleanField,
  ColorField,
  EnumField,
  NumberField,
  ObjectField,
  StrArrFiled,
  StringField
} from '@/assets/const/objectClass.js'
import MilkDownReadOnly from '@/components/milkdown/MilkDownReadOnly.vue'
import { MilkdownProvider } from '@milkdown/vue'
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/vue'
import { themeSetting } from '@/assets/more/chatBox/defaultInfo.js'
import ObjectMapComponent from '@/components/ObjectMapComponent.vue'
import ArrayComponent from '@/components/ArrayComponent.vue'

const lang = computed(() => usePageStore().setting.language)

const testModal = ref([])
const themeJson = computed(() => {
  return `\`\`\`json
${JSON.stringify(testModal.value, null, 2)}
  \`\`\``
})

const customFilterMethod = (value, item) => {
  return item.label.toLowerCase().includes(value.toLowerCase()) ||
    item.value.toLowerCase().includes(value.toLowerCase())
}

const optionList = [
  { label: '左对齐', value: 'left' },
  { label: '居中', value: 'center' },
  { label: '右对齐', value: 'right' }
]

const formProperties = new ObjectField(
  {
    properties: {
      input: new StringField({
        label: '文本输入框',
        placeholder: '请输入一个文本',
        defaultValue: 'test',
        defaultModel: 'search'
      }),

      autoComplete: new AutoCompleteField({
        label: '自动补全输入框',
        placeholder: '请输入一个文本',
        clearable: true,
        suggestions: itemSuggestions(lang.value),
        filterMethod: customFilterMethod
      }),

      inputNumber: new NumberField({
        label: '数字类型输入框',
        min: 0,
        max: 10,
        step: 0.1,
        defaultValue: 0
      }),

      switch: new BooleanField({
        label: '开关',
        defaultValue: false
      }),

      select: new EnumField({
        label: '枚举',
        options: optionList,
        defaultValue: 'left'
      }),

      color: new ColorField({
        label: '颜色',
        defaultValue: -1
      }),

      strArr: new StrArrFiled({
        label: '字符串数组',
        title: '字符串数组',
        itemDefaultValue: 'test'
      }),

      bolArr: new BoolArrFiled({
        label: '布尔值数组',
        title: '布尔值数组',
        itemDefaultValue: false
      })
    }
  }
)

const visible = ref(false)

const theme = themeSetting(lang.value)
</script>

<template>
  <div class="flex flex-row">
    <div class="flex-1 flex w-full justify-center flex-col mb-10 items-center gap-10">
      <div class="text-center text-2xl dark:text-white">JSON生成器组件展示</div>
      <!--      <ObjectGenerator v-model="testModal" :properties="theme.portrait" />-->
<!--      <ObjectMapComponent :properties="theme.portrait" v-model="testModal" title="测试参数" />-->
      <!--            <ArrayObjectGenerator class="w-[500px]" v-model="testModal" :properties="formProperties"-->
      <!--                                  display-template="{input}" />-->
      <!--      <ObjectGeneratorDialog v-model="testModal"-->
      <!--                             :properties="formProperties" title="点击编辑" />-->
      <!--      <FileJsonHandler v-model="testModal"  key="test"/>-->
      <ArrayComponent v-model="testModal">
      </ArrayComponent>
    </div>
    <div class="flex-1">
      <MilkdownProvider>
        <ProsemirrorAdapterProvider>
          <MilkDownReadOnly :content="themeJson" />
        </ProsemirrorAdapterProvider>
      </MilkdownProvider>
    </div>
  </div>
</template>
