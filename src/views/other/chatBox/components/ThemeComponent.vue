<script setup>
import { usePageStore } from '@/stores/index.js'
import { translatable, translatableArg } from '@/assets/translatable/translatable.js'
import Modal from '@/components/Modal.vue'
import Select from '@/components/Select.vue'
import { alignXList, alignYList } from '@/assets/more/chatBox/option'
import Form from '@/components/Form.vue'
import FormItem from '@/components/FormItem.vue'
import InputNumber from '@/components/InputNumber.vue'

const lang = computed(() => usePageStore().setting.language)

const dialogSetting = ref({
  title: '',
  setting: {
    key: '',
    x: 0,
    y: 0,
    width: 10,
    height: 10,
    alignX: 'LEFT',
    alignY: 'TOP',
    opacity: 100,
    renderOrder: 0
  }
})
const show = ref(false)
const isSize = ref()
const emit = defineEmits(['onPositiveClick'])
const defaultRenderOrder = ref(0)

const open = (key, title, setting, renderOrder, isSizeShow = true) => {
  show.value = true
  isSize.value = isSizeShow
  defaultRenderOrder.value = renderOrder
  dialogSetting.value = {
    title,
    setting: {
      key: key,
      renderOrder: renderOrder,
      ...setting
    }
  }
}

defineExpose({ open })
</script>

<template>
  <Modal
    :title="translatable(lang, dialogSetting.title)"
    :show="show"
    @onPositiveClick="
      (arg) => {
        emit('onPositiveClick', dialogSetting.setting)
        show = false
      }
    "
    @onClose="(arg) => (show = false)"
    @onNegativeClick="(arg) => (show = false)"
  >
    <template #content>
      <Form class="mt-3">
        <FormItem class="mr-2" :label="translatableArg(lang, 'chat.box.theme.component.x',0)">
          <InputNumber v-model="dialogSetting.setting.x" :step="0.1" />
        </FormItem>
        <FormItem class="mr-2" :label="translatableArg(lang, 'chat.box.theme.component.y',0)">
          <InputNumber v-model="dialogSetting.setting.y" :step="0.1" />
        </FormItem>
        <FormItem v-if="isSize" class="mr-2"
                  :label="translatableArg(lang, 'chat.box.theme.component.width',10)">
          <InputNumber v-model="dialogSetting.setting.width" :step="0.1" :min="0" />
        </FormItem>
        <FormItem v-if="isSize" class="mr-2"
                  :label="translatableArg(lang, 'chat.box.theme.component.height',10)">
          <InputNumber v-model="dialogSetting.setting.height" :step="0.1" :min="0" />
        </FormItem>
        <FormItem class="mr-2"
                  :label="translatableArg(lang, 'chat.box.theme.component.opacity',100)">
          <InputNumber v-model="dialogSetting.setting.opacity" :step="1" :min="0" :max="100" />
        </FormItem>
        <FormItem class="mr-2"
                  :label="translatableArg(lang, 'chat.box.theme.component.renderOrder',defaultRenderOrder)">
          <InputNumber v-model="dialogSetting.setting.renderOrder" :step="1" />
        </FormItem>
        <FormItem
          :label="translatableArg(lang, 'chat.box.theme.component.align.x',translatable(lang,alignXList.of('LEFT')))">
          <Select
            is-no-case-sensitive
            class="max-w-[150px]"
            v-model:value="dialogSetting.setting.alignX"
            :options="alignXList.values(lang)"
            mode="bottom"
            @update:value="(arg) => (dialogSetting.setting.alignX = arg.value)"
          />
        </FormItem>
        <FormItem
          :label="translatableArg(lang, 'chat.box.theme.component.align.y',translatable(lang,alignYList.of('TOP')))">
          <Select
            is-no-case-sensitive
            class="max-w-[150px]"
            v-model:value="dialogSetting.setting.alignY"
            :options="alignYList.values(lang)"
            mode="bottom"
            @update:value="(arg) => (dialogSetting.setting.alignY = arg.value)"
          />
        </FormItem>
      </Form>
    </template>
  </Modal>
</template>
