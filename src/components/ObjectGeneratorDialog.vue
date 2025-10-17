<script setup>
import { computed, ref, watch } from 'vue'
import ObjectGenerator from '@/components/ObjectGenerator.vue'
import { translatable } from '@/assets/translatable/translatable.js'
import { usePageStore } from '@/stores/index.js'
import { ObjectField } from '@/assets/const/objectClass.js'
import FormItem from '@/components/FormItem.vue'
import Modal from '@/components/Modal.vue'

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
const saveDialog = () => {
  emit('update:modelValue', editingItem.value)
  closeDialog()
}

defineOptions({ inheritAttrs: false })
</script>

<template>
  <div :class="$attrs.class">
    <FormItem :label="properties.label">
      <slot name="trigger" :openDialog="openDialog">
        <Button @click="openDialog" is-toggle-color>
          {{ translatable(lang, buttonText) }}
        </Button>
      </slot>
    </FormItem>

    <Modal
      :show="showDialog"
      :sm-width="dialogWidthPercent"
      :title="title"
      @defaultClose="closeDialog"
      @onPositiveClick="saveDialog"
      @onNegativeClick="closeDialog"
    >
      <template #content>
        <div class="p-4">
          <ObjectGenerator v-model="editingItem" :properties="properties" />
        </div>
      </template>
    </Modal>
  </div>
</template>
