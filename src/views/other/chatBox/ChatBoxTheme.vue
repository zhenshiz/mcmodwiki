<script setup>
import { useChatBoxEditorStore, usePageStore } from '@/stores/index.js'
import { translatable } from '@/assets/translatable/translatable.js'
import ThemeComponent from '@/views/other/chatBox/components/ThemeComponent.vue'
import Button from '@/components/Button.vue'
import { Icon } from '@iconify/vue'
import Select from '@/components/Select.vue'
import Modal from '@/components/Modal.vue'
import { copyToClipboard } from '@/utils/web.js'
import { removeFirstAndLastLine } from '@/utils/format.js'
import { useMessage } from '@/components/register/useMessage.js'
import { MilkdownProvider } from '@milkdown/vue'
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/vue'
import MilkDownReadOnly from '@/components/milkdown/MilkDownReadOnly.vue'
import GlobalDialog from '@/views/other/chatBox/components/GlobalModal.vue'
import { textAlign, themeList } from '@/assets/more/chatBox/option'
import { defaultTheme, functionalButtonSetting } from '@/assets/more/chatBox/defaultInfo'
import { get, set } from 'idb-keyval'
import { computed, onMounted, ref, watch } from 'vue'
import FormItem from '@/components/FormItem.vue'
import Form from '@/components/Form.vue'
import ArrayObjectGenerator from '@/components/ArrayObjectGenerator.vue'
import InputNumber from '@/components/InputNumber.vue'
import Switch from '@/components/Switch.vue'
import { cleanChatBoxTheme } from '@/assets/more/chatBox/class.js'

const lang = computed(() => usePageStore().setting.language)
const chatBoxEditorStore = useChatBoxEditorStore()
const message = useMessage()

const themeComponent = ref()
const isShowThemeJson = ref(false)
const fileInfo = computed(() => chatBoxEditorStore.themeSetting)
const themeJson = computed(() => {
  return `\`\`\`json
${JSON.stringify(cleanChatBoxTheme(chatBoxEditorStore.themeSetting), null, 2)}
  \`\`\``
})

const open = (key, title, setting, renderOrder, isSizeShow = true) => {
  themeComponent.value.open(key, title, setting, renderOrder, isSizeShow)
}

const setBasicSetting = (setting) => {
  chatBoxEditorStore.setThemeSetting(setting)
}

let fileHandle

const loadFile = async () => {
  ;[fileHandle] = await window.showOpenFilePicker()
  const file = await fileHandle.getFile()
  if (file && (file.type === 'application/json' || file.name.endsWith('.json'))) {
    await set('themeFile', fileHandle)
    const reader = new FileReader()
    reader.onload = function (e) {
      const fileContent = e.target.result || defaultTheme
      try {
        chatBoxEditorStore.setThemeSetting(JSON.parse(fileContent), true)
      } catch (error) {
        console.error('文件内容不是有效的 JSON 格式！')
      }
    }
    reader.readAsText(file)
  } else {
    fileHandle = undefined
  }
}

const isDragOver = ref(false)

const onDragOver = () => {
  isDragOver.value = true
}
const onDragLeave = () => {
  isDragOver.value = false
}
const onDrop = async (event) => {
  isDragOver.value = false
  event.preventDefault()
  const handle = await [...event.dataTransfer.items]
    .filter((item) => item.kind === 'file')[0]
    .getAsFileSystemHandle()

  if (handle.kind === 'file' && (await verifyPermission(handle, true))) {
    fileHandle = handle
    await set('themeFile', handle)
    let file = await fileHandle.getFile()
    let text = await file.text()

    try {
      chatBoxEditorStore.setThemeSetting(JSON.parse(text || defaultTheme), true)
    } catch (error) {
      console.error('文件内容不是有效的 JSON 格式！')
    }
  } else {
    fileHandle = undefined
  }
}

async function verifyPermission(fileHandle, readWrite) {
  const options = {}
  if (readWrite) {
    options.mode = 'readwrite'
  }
  if ((await fileHandle.queryPermission(options)) === 'granted') {
    return true
  }
  return (await fileHandle.requestPermission(options)) === 'granted'
}

const modifyFile = async (text) => {
  if (fileHandle !== undefined && (await verifyPermission(fileHandle, true))) {
    const writable = await fileHandle.createWritable()
    await writable.write(text)
    await writable.close()
  }
}

// 更新功能按钮数组
const updateFunctionalButton = (newButtons) => {
  // 创建一个新的对象，以确保触发响应式更新
  const newThemeSetting = JSON.parse(JSON.stringify(chatBoxEditorStore.themeSetting))
  newThemeSetting.functionalButton = newButtons
  chatBoxEditorStore.setThemeSetting(newThemeSetting, true)
}

onMounted(async () => {
  fileHandle = await get('themeFile')
})

watch(
  () => chatBoxEditorStore.themeSetting,
  (newValue) => {
    modifyFile(JSON.stringify(cleanChatBoxTheme(newValue), null, 2))
  },
  { deep: true, immediate: true },
)
</script>

<template>
  <div class="flex flex-row size-full dark:text-white">
    <div class="flex flex-col m-5 flex-1 border-r-2">
      <GlobalDialog />
      <!--拖拽上传区域-->
      <div
        class="mt-2 mb-5 w-[300px] h-[80px] flex items-center justify-center border-2 border-dashed border-black dark:border-white rounded cursor-pointer select-none hover:text-text-blue hover:border-text-blue"
        :class="{ 'upload-drag': isDragOver }"
        @click="loadFile"
        @dragover.prevent="onDragOver"
        @dragleave.prevent="onDragLeave"
        @drop.prevent="onDrop"
      >
        <Icon width="30" icon="material-symbols:upload" />
        <span class="ml-2">{{ translatable(lang, 'more.chatbox.theme.upload') }}</span>
      </div>

      <div class="font-bold text-2xl mb-5">{{ translatable(lang, 'chat.box.theme.1') }}</div>

      <!--对话框主题-->
      <Form>
        <FormItem :label="translatable(lang, 'chat.box.theme.2')">
          <Select
            :offset="2"
            is-no-case-sensitive
            class="max-w-[150px]"
            v-model:value="fileInfo.theme"
            :options="themeList"
            @update:value="
              (arg) => {
                fileInfo.theme = arg.value

                if (fileInfo.theme !== 'DIY') {
                  const json = themeList.filter((theme) => theme.value === fileInfo.theme)[0].json
                  chatBoxEditorStore.themeSetting = {
                    theme: fileInfo.theme,
                    ...json,
                  }
                } else {
                  // 创建DIY主题，但保留当前的functionalButton
                  chatBoxEditorStore.themeSetting = {
                    theme: 'DIY',
                    portrait: {},
                    option: {},
                    dialogBox: {},
                    functionalButton: currentButtons,
                    keyPrompt: {},
                  }
                }
              }
            "
          />
        </FormItem>
      </Form>

      <!--对话框配置-->
      <Form class="mt-3">
        <FormItem :label="translatable(lang, 'chat.box.theme.dialog.box.basic')">
          <Button
            class="mt-5 mb-5 w-[200px] flex flex-row items-center justify-center"
            isToggleColor
            :rounded-size="10"
            @click="open('dialogBox', 'chat.box.theme.dialog.box.basic', fileInfo.dialogBox, 0)"
          >
            {{ translatable(lang, 'chat.box.theme.button.setting') }}
          </Button>
        </FormItem>
        <FormItem :label="translatable(lang, 'chat.box.theme.dialog.box.texture')">
          <Input
            class="max-w-[500px] ml-2 mr-2"
            v-model="fileInfo.dialogBox.texture"
            defaultModel="search"
          />
        </FormItem>
        <FormItem :label="translatable(lang, 'chat.box.theme.dialog.box.line_width')">
          <InputNumber v-model="fileInfo.dialogBox.lineWidth" :min="0" class="mr-10" />
        </FormItem>
        <FormItem :label="translatable(lang, 'chat.box.theme.dialog.box.name.pos')">
          <InputNumber v-model="fileInfo.dialogBox.nameX" class="mr-10" />
          <InputNumber v-model="fileInfo.dialogBox.nameY" class="mr-10" />
        </FormItem>
        <FormItem :label="translatable(lang, 'chat.box.theme.dialog.box.text.pos')">
          <InputNumber v-model="fileInfo.dialogBox.textX" class="mr-10" />
          <InputNumber v-model="fileInfo.dialogBox.textY" class="mr-10" />
        </FormItem>
      </Form>

      <!--功能按钮配置-->
      <div class="mr-4">
        <div class="font-bold text-2xl mb-5 mt-5">
          {{ translatable(lang, 'chat.box.theme.functional.button.basic') }}
        </div>
        <ArrayObjectGenerator
          :model-value="chatBoxEditorStore.themeSetting.functionalButton"
          @update:model-value="updateFunctionalButton"
          :field-descriptions="functionalButtonSetting(lang)"
          displayTemplate="{type}"
          :title="translatable(lang, 'chat.box.theme.functional.button')"
        />
      </div>
    </div>
    <div class="flex-1">
      <!--选项配置-->
      <Form>
        <FormItem :label="translatable(lang, 'chat.box.theme.option.basic')">
          <Button
            class="mt-5 mb-5 w-[200px] flex flex-row items-center justify-center"
            isToggleColor
            :rounded-size="10"
            @click="open('option', 'chat.box.theme.option.basic', fileInfo.option, 10)"
          >
            {{ translatable(lang, 'chat.box.theme.button.setting') }}
          </Button>
        </FormItem>
        <FormItem :label="translatable(lang, 'chat.box.theme.option.texture')">
          <Input
            class="max-w-[500px] ml-2 mr-2"
            v-model="fileInfo.option.texture"
            defaultModel="search"
          />
        </FormItem>
        <FormItem :label="translatable(lang, 'chat.box.theme.option.hover_texture')">
          <Input
            class="max-w-[500px] ml-2 mr-2"
            v-model="fileInfo.option.selectTexture"
            defaultModel="search"
          />
        </FormItem>
        <FormItem :label="translatable(lang, 'chat.box.theme.option.lock_texture')">
          <Input
            class="max-w-[500px] ml-2 mr-2"
            v-model="fileInfo.option.lockTexture"
            defaultModel="search"
          />
        </FormItem>
        <FormItem :label="translatable(lang, 'chat.box.theme.option.text.pos')">
          <InputNumber v-model="fileInfo.dialogBox.optionChatX" class="mr-10" />
          <InputNumber v-model="fileInfo.dialogBox.optionChatY" class="mr-10" />
        </FormItem>
        <FormItem :label="translatable(lang, 'chat.box.theme.option.text.align')">
          <Select
            is-no-case-sensitive
            class="max-w-[150px]"
            v-model:value="fileInfo.option.textAlign"
            :options="textAlign.values(lang)"
            mode="top"
            @update:value="(arg) => (fileInfo.option.textAlign = arg.value)"
          />
        </FormItem>
      </Form>

      <!--按键提示配置-->
      <Form>
        <FormItem :label="translatable(lang, 'chat.box.theme.KeyPrompt.basic')">
          <Button
            class="mt-5 mb-5 w-[200px] flex flex-row items-center justify-center"
            isToggleColor
            :rounded-size="10"
            @click="open('keyPrompt', 'chat.box.theme.KeyPrompt.basic', fileInfo.keyPrompt, 40)"
          >
            {{ translatable(lang, 'chat.box.theme.button.setting') }}
          </Button>
        </FormItem>
        <FormItem :label="translatable(lang, 'chat.box.theme.KeyPrompt.visible')">
          <Switch v-model="chatBoxEditorStore.themeSetting.keyPrompt.visible" />
        </FormItem>
        <FormItem :label="translatable(lang, 'chat.box.theme.KeyPrompt.mouseTextureWidth')">
          <InputNumber
            v-model="chatBoxEditorStore.themeSetting.keyPrompt.mouseTextureWidth"
            :min="0"
            :step="0.1"
            class="mr-10"
          />
        </FormItem>
        <FormItem :label="translatable(lang, 'chat.box.theme.KeyPrompt.mouseTextureHeight')">
          <InputNumber
            v-model="chatBoxEditorStore.themeSetting.keyPrompt.mouseTextureHeight"
            :min="0"
            :step="0.1"
            class="mr-10"
          />
        </FormItem>
        <FormItem :label="translatable(lang, 'chat.box.theme.KeyPrompt.rightClickTexture')">
          <Input
            class="max-w-[500px] ml-2 mr-2"
            v-model="chatBoxEditorStore.themeSetting.keyPrompt.rightClickTexture"
            defaultModel="search"
          />
        </FormItem>
        <FormItem :label="translatable(lang, 'chat.box.theme.KeyPrompt.scrollTexture')">
          <Input
            class="max-w-[500px] ml-2 mr-2"
            v-model="chatBoxEditorStore.themeSetting.keyPrompt.scrollTexture"
            defaultModel="search"
          />
        </FormItem>
      </Form>

      <!--展示json-->
      <Button
        class="mt-5 w-[200px] flex flex-row items-center justify-center"
        isToggleColor
        :rounded-size="0"
        @click="() => (isShowThemeJson = true)"
      >
        {{ translatable(lang, 'more.chatbox.theme.download') }}
      </Button>
    </div>
  </div>

  <ThemeComponent @onPositiveClick="setBasicSetting" ref="themeComponent" />

  <!--json展示-->
  <Modal
    :show="isShowThemeJson"
    :title="translatable(lang, 'chat.box.theme.download.title')"
    @default-close="() => (isShowThemeJson = false)"
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
                  copyToClipboard(removeFirstAndLastLine(themeJson))
                  message.success(translatable(lang, 'message.success.copy'))
                }
              "
            />
          </div>
        </div>
        <MilkdownProvider>
          <ProsemirrorAdapterProvider>
            <MilkDownReadOnly :content="themeJson" />
          </ProsemirrorAdapterProvider>
        </MilkdownProvider>
      </div>
    </template>
  </Modal>
</template>

<style lang="scss" scoped>
.upload-drag {
  border-color: #00c0f5 !important;
  color: #00c0f5 !important;
}
</style>
