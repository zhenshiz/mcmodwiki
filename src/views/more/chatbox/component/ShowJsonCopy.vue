<script setup>
import Modal from '@/components/Modal.vue'
import MarkDownReadOnly from '@/components/markdown/MarkDownReadOnly.vue'
import Button from '@/components/Button.vue'

const props = defineProps({
  value: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    default: ''
  }
})
const visible = ref(false)

const json = computed(() => {
  return `<pre language="json" isclosed="false"><code class="language-json">${JSON.stringify(props.value, null, 2)}</code></pre>`
})
</script>

<template>
  <Button is-toggle-color :rounded-size="3" @click="visible = true">
    生成JSON
  </Button>
  <Modal v-model:show="visible" :title="t('生成JSON')">
      <div class="center flex-col size-full">
        <MarkDownReadOnly :content="json" />
      </div>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </Modal>
</template>
