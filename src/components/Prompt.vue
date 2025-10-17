<script setup>
import { ref } from 'vue'
import { usePageStore } from '@/stores/index.js'
import { translatable } from '@/assets/translatable/translatable.js'
import Modal from '@/components/Modal.vue'
import AutoComplete from '@/components/AutoComplete.vue'

const props = defineProps({
  title: String,
  placeholder: {
    type: String,
    default: ''
  },
  suggestions: {
    type: [Array, Function], // 支持数组或函数
    default: () => []
  },
  defaultValue: {
    type: String,
    default: ''
  },
  positiveText: {
    type: String,
    default: translatable(usePageStore().setting.language, 'component.dialog.positive')
  },
  negativeText: {
    type: String,
    default: translatable(usePageStore().setting.language, 'component.dialog.negative')
  },
  maskClosable: {
    type: Boolean,
    default: true
  },
  onPositiveClick: Function,
  onNegativeClick: Function
})

const inputValue = ref(props.defaultValue)
const show = ref(true)

const emitEvent = (type) => {
  if (type === 'positive') {
    props.onPositiveClick?.(inputValue.value)
  } else if (type === 'negative') {
    props.onNegativeClick?.()
  }
  show.value = false
}
</script>

<template>
  <Modal
    :show="show"
    :title="title"
    :positiveText="positiveText"
    :negativeText="negativeText"
    :isShowMask="maskClosable"
    :defaultCloseEvent="[]"
    @onClose="emitEvent('close')"
    @onPositiveClick="emitEvent('positive')"
    @onNegativeClick="emitEvent('negative')"
    :sm-width="40">
    <template #content>
      <!-- 输入框 -->
      <div class="my-5 w-[90%]">
        <AutoComplete
          v-model="inputValue"
          :suggestions="suggestions"
          :placeholder="placeholder"
          clearable
        />
      </div>
    </template>
  </Modal>
</template>
