<script setup>
import { usePageStore } from '@/stores/index.js'
import { translatable, translatableArg } from '@/assets/translatable/translatable.js'
import Modal from '@/components/Modal.vue'
import Input from '@/components/Input.vue'
import Select from '@/components/Select.vue'
import { alignXList, alignYList } from '@/assets/more/chatBox/option'

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
      <div class="flex flex-col justify-center w-full dark:text-white">
        <div class="flex flex-col gap-3">
          <div class="flex flex-row items-center whitespace-nowrap">
            {{ translatable(lang, 'chat.box.theme.component.x') }}
            <Input
              class="mr-2"
              v-model="dialogSetting.setting.x"
              defaultModel="search"
              :placeholder="translatableArg(lang, 'chat.box.theme.component.size', -100, 100)"
            />
          </div>
          <div class="flex flex-row items-center whitespace-nowrap">
            {{ translatable(lang, 'chat.box.theme.component.y') }}
            <Input
              v-model="dialogSetting.setting.y"
              defaultModel="search"
              :placeholder="translatableArg(lang, 'chat.box.theme.component.size', -100, 100)"
            />
          </div>
          <div v-if="isSize" class="flex flex-row items-center whitespace-nowrap">
            {{ translatable(lang, 'chat.box.theme.component.width') }}
            <Input
              v-model="dialogSetting.setting.width"
              defaultModel="search"
              :placeholder="translatableArg(lang, 'chat.box.theme.component.size', 0, 100)"
            />
          </div>
          <div v-if="isSize" class="flex flex-row items-center whitespace-nowrap">
            {{ translatable(lang, 'chat.box.theme.component.height') }}
            <Input
              v-model="dialogSetting.setting.height"
              defaultModel="search"
              :placeholder="translatableArg(lang, 'chat.box.theme.component.size', 0, 100)"
            />
          </div>
          <div class="flex flex-row items-center whitespace-nowrap">
            {{ translatable(lang, 'chat.box.theme.component.opacity') }}
            <Input v-model="dialogSetting.setting.opacity" defaultModel="search" />
          </div>
          <div class="flex flex-row items-center whitespace-nowrap">
            {{ translatableArg(lang, 'chat.box.theme.component.renderOrder', defaultRenderOrder) }}
            <Input v-model="dialogSetting.setting.renderOrder" defaultModel="search" />
          </div>
          <div class="flex flex-row items-center whitespace-nowrap">
            {{ translatable(lang, 'chat.box.theme.component.align.x') }}
            <Select
              is-no-case-sensitive
              class="max-w-[150px]"
              v-model:value="dialogSetting.setting.alignX"
              :options="alignXList.values(lang)"
              mode="bottom"
              @update:value="(arg) => (dialogSetting.setting.alignX = arg.value)"
            />
          </div>
          <div class="flex flex-row items-center whitespace-nowrap">
            {{ translatable(lang, 'chat.box.theme.component.align.y') }}
            <Select
              is-no-case-sensitive
              class="max-w-[150px]"
              v-model:value="dialogSetting.setting.alignY"
              :options="alignYList.values(lang)"
              mode="bottom"
              @update:value="(arg) => (dialogSetting.setting.alignY = arg.value)"
            />
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>
