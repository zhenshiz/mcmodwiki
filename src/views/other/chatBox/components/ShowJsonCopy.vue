<script setup>
import { translatable } from '@/assets/translatable/translatable.js'
import { copyToClipboard } from '@/utils/web.js'
import { removeFirstAndLastLine } from '@/utils/format.js'
import Modal from '@/components/Modal.vue'
import { usePageStore } from '@/stores/index.js'
import { Icon } from '@iconify/vue'
import { useMessage } from '@/components/register/useMessage.js'
import { MilkdownProvider } from '@milkdown/vue'
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/vue'
import MilkDownReadOnly from '@/components/milkdown/MilkDownReadOnly.vue'
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
  return `\`\`\`json
${JSON.stringify(props.value, null, 2)}
  \`\`\``
})
</script>

<template>
  <Button is-toggle-color :rounded-size="3" @click="visible = true">
    &nbsp;&nbsp;{{ translatable(lang, 'chat.box.component.global.portrait.translatable.generation.json')
    }}&nbsp;&nbsp;
  </Button>
  <Modal
    :show="visible"
    :title="translatable(lang, 'chat.box.theme.download.title')"
    @default-close="() => (visible = false)"
    :negative-visible="false"
    :positive-visible="false"
  >
    <template #content>
      <div class="center flex-col size-full">
        <div class="flex flex-row items-center justify-between dark:text-white w-full">
          <div class="center flex-row">
            {{ translatable(lang, 'chat.box.theme.download.content') }}
            <Icon
              class="ml-2 cursor-pointer hover:text-text-blue"
              icon="solar:clipboard-outline"
              @click="
                () => {
                  copyToClipboard(removeFirstAndLastLine(json))
                  message.success(translatable(lang, 'message.success.copy'))
                }
              "
            />
          </div>
          <slot name="toolbar" />
        </div>
        <MilkdownProvider>
          <ProsemirrorAdapterProvider>
            <MilkDownReadOnly :content="json" />
          </ProsemirrorAdapterProvider>
        </MilkdownProvider>
      </div>
    </template>
  </Modal>
</template>

<style scoped lang="scss">

</style>
