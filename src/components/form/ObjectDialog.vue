<script setup>
import { ref, watch } from 'vue'
import Modal from '@/components/Modal.vue'
import Inspector from './Inspector.vue'
import { t } from '@/languages/index.js'

const props = defineProps({
  show: Boolean,
  // 当前要编辑的对象（原始数据）
  model: {
    type: Object,
    default: null
  },
  title: {
    type: String,
    default: t('编辑对象')
  },
  clazz: { type: Function, default: null }
})

const emit = defineEmits(['update:show', 'confirm'])

// 临时编辑副本（防止修改未保存）
const editCopy = ref(null)

// 监听弹窗打开，创建副本
watch(() => props.show, (val) => {
  if (val && props.model) {
    if (props.model.constructor) {
      editCopy.value = new props.model.constructor()
      Object.assign(editCopy.value, props.model)
    } else {
      // 普通对象兜底
      editCopy.value = JSON.parse(JSON.stringify(props.model))
    }
  }
})

const handleConfirm = () => {
  // 将修改后的副本传出去
  emit('confirm', editCopy.value)
  emit('update:show', false)
}

const handleClose = () => {
  emit('update:show', false)
}
</script>

<template>
  <Modal
    :show="show"
    :title="title"
    width="600px"
    @update:show="emit('update:show', $event)"
    @close="handleClose"
  >
    <div class="py-2">
      <Inspector
        v-if="editCopy"
        :model="editCopy"
        :clazz="clazz"
      />
    </div>

    <template #footer>
      <button
        class="px-4 py-1.5 rounded text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
        @click="handleClose"
      >
        <Translate message="取消" />
      </button>
      <button
        class="px-4 py-1.5 rounded text-sm font-medium text-white bg-[#00c0f5] hover:bg-[#00ace6]"
        @click="handleConfirm"
      >
        <Translate message="保存修改" />
      </button>
    </template>
  </Modal>
</template>
