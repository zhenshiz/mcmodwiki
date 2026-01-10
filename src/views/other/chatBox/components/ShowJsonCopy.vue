<script setup>
import { translatable } from '@/assets/translatable/translatable.js'
import Modal from '@/components/Modal.vue'
import { usePageStore } from '@/stores/index.js'
import { useMessage } from '@/components/register/useMessage.js'
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
const message = useMessage()
const lang = computed(() => usePageStore().setting.language)

const json = computed(() => {
  return `<pre language="json" isclosed="false"><code class="language-json">${JSON.stringify(props.value, null, 2)}</code></pre>`
})
</script>

<template>
  <Button is-toggle-color :rounded-size="3" @click="visible = true">
    &nbsp;&nbsp;{{ translatable(lang, 'chat.box.component.global.portrait.translatable.generation.json')
    }}&nbsp;&nbsp;
  </Button>
  <Modal :show="visible" :title="translatable(lang, 'chat.box.theme.download.title')"
    @default-close="() => (visible = false)" :negative-visible="false" :positive-visible="false">
    <template #content>
      <div class="center flex-col size-full">
        <MarkDownReadOnly :content="json" />
      </div>
    </template>
  </Modal>
</template>
