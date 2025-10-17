<script setup>
import { computed, ref, watch } from 'vue'
import { translatable } from '@/assets/translatable/translatable.js'
import { usePageStore } from '@/stores/index.js'
import { ObjectField } from '@/assets/const/objectClass.js'
import FormItem from '@/components/FormItem.vue'
import Modal from '@/components/Modal.vue'
import ObjectMapComponent from '@/components/ObjectMapComponent.vue' // ✅ 用你已有的 Modal 组件

const lang = computed(() => usePageStore().setting.language)

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    default: () => ({})
  },
  title: {
    type: String,
    default: ''
  },
  buttonText: {
    type: String,
    default: 'chat.box.theme.button.setting'
  },
  properties: {
    type: ObjectField,
    required: true
  },
  dialogWidthPercent: {
    type: Number,
    default: 50
  },
  visible: {
    type: Boolean,
    default: false
  },
  filter: {
    type: Function,
    default: null
  },
  displayTemplate: {
    type: [String, Function],
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'update:visible'])

const editingItem = ref(JSON.parse(JSON.stringify(props.modelValue)))
const showDialog = ref(props.visible)

watch(() => props.visible, (val) => {
  showDialog.value = val
})

// 打开弹窗
const openDialog = () => {
  editingItem.value = JSON.parse(JSON.stringify(props.modelValue))
  showDialog.value = true
  emit('update:visible', true)
}

// 关闭弹窗
const closeDialog = () => {
  showDialog.value = false
  emit('update:visible', false)
}

// 保存
const saveDialog = (value) => {
  emit('update:modelValue', value)
}

defineOptions({ inheritAttrs: false })
</script>

<template>
  <div :class="$attrs.class">
    <FormItem :label="properties.label">
      <slot name="trigger" :openDialog="openDialog">
        <Button @click="openDialog" is-toggle-color>
          {{ translatable(lang, buttonText) }}
        </button>
      </slot>
    </FormItem>

    <Modal
      :show="showDialog"
      :sm-width="dialogWidthPercent"
      :title="title"
      @defaultClose="closeDialog"
      :negative-visible="false"
      :positive-visible="false"
    >
      <template #content>
        <Form class="p-4 w-full">
          <slot name="filter"></slot>
          <ObjectMapComponent :modelValue="modelValue" @update:modelValue="args=>saveDialog(args)"
                              :properties="properties" :filter="filter"
                              :displayTemplate="displayTemplate"
                              :dialogWidthPercent="dialogWidthPercent" />
        </Form>
      </template>
    </Modal>
  </div>
</template>
