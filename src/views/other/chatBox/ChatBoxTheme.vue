<script setup>
import { useChatBoxEditorStore, usePageStore } from '@/stores/index.js'
import { translatable, translatableArg } from '@/assets/translatable/translatable.js'
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
import { isNumber } from '@/utils/math.js'

const lang = computed(() => usePageStore().setting.language)
const chatBoxEditorStore = useChatBoxEditorStore()
const message = useMessage()

const themeComponent = ref()
const jsonInput = ref()
const isShowThemeJson = ref(false)
const fileInfo = computed(() => chatBoxEditorStore.themeSetting)
const themeJson = computed(() => {
  return `\`\`\`json
${JSON.stringify(chatBoxEditorStore.themeSetting, replacer, 2)}
  \`\`\``
})

const replacer = (key, value) => {
  if (key === 'filename' || key === 'theme' || key === 'key' || key === 'visible' || value === undefined || value === null) {
    return undefined  // 排除这些属性
  }
  if (isNumber(value)) {
    return Number(value)
  }
  return value  // 其他的都保留
}

const open = (key, title, setting, renderOrder) => {
  themeComponent.value.open(key, title, renderOrder, setting)
}

const setBasicSetting = (setting) => {
  chatBoxEditorStore.setThemeSetting(setting)
}

const handleFileChange = (event) => {
  event.preventDefault()

  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()

    // 文件读取完成后的回调
    reader.onload = function(e) {
      const fileContent = e.target.result
      try {
        const json = JSON.parse(fileContent)
        chatBoxEditorStore.setThemeSetting(
          {
            filename: file.name.replaceAll('.json', ''),
            theme: 'DIY',
            dialogBox: json.dialogBox,
            logButton: json.logButton,
            option: json.option,
            portrait: json.portrait
          },
          true
        )
      } catch (error) {
        console.error('文件内容不是有效的 JSON 格式！')
      }
    }

    reader.readAsText(file)
    event.target.files = []
  }
}
</script>

<template>
  <div class="flex flex-row size-full dark:text-white">
    <div class="flex flex-col m-5 flex-1 border-r-2">
      <GlobalDialog />
      <!--导入json文件-->
      <Button
        class="mt-5 mb-5 w-[300px] flex flex-row items-center justify-center"
        isToggleColor
        :rounded-size="0"
        @click="jsonInput.click()"
      >
        <Icon width="30" icon="material-symbols:upload" />
        {{ translatable(lang, 'more.chatbox.theme.upload') }}
      </Button>
      <input
        ref="jsonInput"
        hidden
        type="file"
        accept="application/JSON, .json"
        @change="handleFileChange($event)"
      />

      <div class="font-bold text-2xl mb-5">{{ translatable(lang, 'chat.box.theme.1') }}</div>

      <!--创建文件-->
      <div class="flex flex-row items-center">
        <div class="whitespace-nowrap">{{ translatable(lang, 'chat.box.theme.2') }}</div>
        <Input class="max-w-[300px] ml-2 mr-2" v-model="fileInfo.filename" defaultModel="search" />
        <div>.json</div>
      </div>

      <!--对话框主题-->
      <div class="mt-5 flex flex-row items-center">
        <div class="whitespace-nowrap">{{ translatable(lang, 'chat.box.theme.3') }}</div>
        <Select
          is-no-case-sensitive
          class="max-w-[150px]"
          v-model:value="fileInfo.theme"
          :options="themeList"
          @update:value="(arg) => {
            fileInfo.theme = arg.value
            if(fileInfo.theme !== 'DIY'){
              chatBoxEditorStore.themeSetting = Object.assign(chatBoxEditorStore.themeSetting,themeList.filter(theme=> theme.value === fileInfo.theme)[0].json)
            }else{
              chatBoxEditorStore.themeSetting = {
                filename: '',
                theme: 'DIY',
                dialogBox: {},
                logButton: {},
                option: {},
                portrait: {}
              }
            }
          }"
        />
      </div>

      <!--对话框配置-->
      <div class="mt-5 flex flex-row items-center">
        <div class="whitespace-nowrap">
          {{ translatable(lang, 'chat.box.theme.dialog.box.basic') }}：
        </div>
        <Button
          class="mt-5 mb-5 w-[200px] flex flex-row items-center justify-center"
          isToggleColor
          :rounded-size="10"
          @click="open('dialogBox', 'chat.box.theme.dialog.box.basic',0, fileInfo.dialogBox)"
        >
          {{ translatable(lang, 'chat.box.theme.button.setting') }}
        </Button>
      </div>

      <div class="mt-5 flex flex-row items-center">
        <div class="whitespace-nowrap">
          {{ translatable(lang, 'chat.box.theme.4') }}
        </div>
        <Input
          class="max-w-[500px] ml-2 mr-2"
          v-model="fileInfo.dialogBox.texture"
          defaultModel="search"
        />
      </div>

      <div class="mt-5 flex flex-row items-center">
        <div class="whitespace-nowrap">
          {{ translatable(lang, 'chat.box.theme.5') }}
        </div>
        <Input
          class="max-w-[500px] ml-2 mr-2"
          v-model="fileInfo.dialogBox.lineWidth"
          defaultModel="search"
        />
      </div>
      <div class="mt-5 flex flex-row items-center">
        <div class="whitespace-nowrap">
          {{ translatable(lang, 'chat.box.theme.6') }}
        </div>
        <Input
          class="max-w-[300px] ml-2 mr-2"
          v-model="fileInfo.dialogBox.nameX"
          :placeholder="translatableArg(lang, 'chat.box.theme.component.size', -100, 100)"
          defaultModel="search"
        />
        <Input
          class="max-w-[300px] ml-2 mr-2"
          v-model="fileInfo.dialogBox.nameY"
          :placeholder="translatableArg(lang, 'chat.box.theme.component.size', -100, 100)"
          defaultModel="search"
        />
      </div>
      <div class="mt-5 flex flex-row items-center">
        <div class="whitespace-nowrap">
          {{ translatable(lang, 'chat.box.theme.7') }}
        </div>
        <Input
          class="max-w-[300px] ml-2 mr-2"
          v-model="fileInfo.dialogBox.textX"
          :placeholder="translatableArg(lang, 'chat.box.theme.component.size', -100, 100)"
          defaultModel="search"
        />
        <Input
          class="max-w-[300px] ml-2 mr-2"
          v-model="fileInfo.dialogBox.textY"
          :placeholder="translatableArg(lang, 'chat.box.theme.component.size', -100, 100)"
          defaultModel="search"
        />
      </div>

      <!--log按钮配置-->
      <div class="mt-5 flex flex-row items-center">
        <div class="whitespace-nowrap">
          {{ translatable(lang, 'chat.box.theme.log.button.basic') }}：
        </div>
        <Button
          class="mt-5 mb-5 w-[200px] flex flex-row items-center justify-center"
          isToggleColor
          :rounded-size="10"
          @click="open('logButton', 'chat.box.theme.log.button.basic',30, fileInfo.logButton)"
        >
          {{ translatable(lang, 'chat.box.theme.button.setting') }}
        </Button>
      </div>

      <div class="mt-5 flex flex-row items-center">
        <div class="whitespace-nowrap">
          {{ translatable(lang, 'chat.box.theme.8') }}
        </div>
        <Input
          class="max-w-[500px] ml-2 mr-2"
          v-model="fileInfo.logButton.texture"
          defaultModel="search"
        />
      </div>

      <div class="mt-5 flex flex-row items-center">
        <div class="whitespace-nowrap">
          {{ translatable(lang, 'chat.box.theme.9') }}
        </div>
        <Input
          class="max-w-[500px] ml-2 mr-2"
          v-model="fileInfo.logButton.hoverTexture"
          defaultModel="search"
        />
      </div>
    </div>
    <div class="flex-1">
      <!--选项配置-->
      <div class="mt-5 flex flex-row items-center">
        <div class="whitespace-nowrap">
          {{ translatable(lang, 'chat.box.theme.option.basic') }}：
        </div>
        <Button
          class="mt-5 mb-5 w-[200px] flex flex-row items-center justify-center"
          isToggleColor
          :rounded-size="10"
          @click="open('option', 'chat.box.theme.option.basic',10, fileInfo.option)"
        >
          {{ translatable(lang, 'chat.box.theme.button.setting') }}
        </Button>
      </div>
      <div class="flex flex-row items-center">
        <div class="whitespace-nowrap">
          {{ translatable(lang, 'chat.box.theme.10') }}
        </div>
        <Input
          class="max-w-[500px] ml-2 mr-2"
          v-model="fileInfo.option.texture"
          defaultModel="search"
        />
      </div>
      <div class="mt-5 flex flex-row items-center">
        <div class="whitespace-nowrap">
          {{ translatable(lang, 'chat.box.theme.11') }}
        </div>
        <Input
          class="max-w-[500px] ml-2 mr-2"
          v-model="fileInfo.option.selectTexture"
          defaultModel="search"
        />
      </div>
      <div class="mt-5 flex flex-row items-center">
        <div class="whitespace-nowrap">
          {{ translatable(lang, 'chat.box.theme.12') }}
        </div>
        <Input
          class="max-w-[500px] ml-2 mr-2"
          v-model="fileInfo.option.lockTexture"
          defaultModel="search"
        />
      </div>
      <div class="mt-5 flex flex-row items-center">
        <div class="whitespace-nowrap">
          {{ translatable(lang, 'chat.box.theme.13') }}
        </div>
        <Input
          class="max-w-[300px] ml-2 mr-2"
          v-model="fileInfo.option.optionChatX"
          :placeholder="translatableArg(lang, 'chat.box.theme.component.size', -100, 100)"
          defaultModel="search"
        />
        <Input
          class="max-w-[300px] ml-2 mr-2"
          v-model="fileInfo.option.optionChatY"
          :placeholder="translatableArg(lang, 'chat.box.theme.component.size', -100, 100)"
          defaultModel="search"
        />
      </div>
      <div class="mt-5 flex flex-row items-center">
        <div class="whitespace-nowrap">
          {{ translatable(lang, 'chat.box.theme.14') }}
        </div>
        <Select
          is-no-case-sensitive
          class="max-w-[150px]"
          v-model:value="fileInfo.option.textAlign"
          :options="textAlign.values(lang)"
          mode="top"
          @update:value="(arg) => (fileInfo.option.textAlign = arg.value)"
        />
      </div>

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
