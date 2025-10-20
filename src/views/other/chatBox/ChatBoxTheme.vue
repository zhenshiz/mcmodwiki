<script setup>
import { useChatBoxEditorStore, usePageStore } from '@/stores/index.js'
import { translatable } from '@/assets/translatable/translatable.js'
import Select from '@/components/Select.vue'
import { themeList } from '@/assets/more/chatBox/option'
import { computed } from 'vue'
import FormItem from '@/components/FormItem.vue'
import Form from '@/components/Form.vue'
import ArrayObjectGenerator from '@/components/ArrayObjectGenerator.vue'
import FileJsonHandler from '@/components/FileJsonHandler.vue'
import { defaultChatBoxTheme, themeSetting } from '@/assets/more/chatBox/defaultInfo.js'
import ObjectGeneratorDialog from '@/components/ObjectGeneratorDialog.vue'
import ObjectGenerator from '@/components/ObjectGenerator.vue'
import ShowJsonCopy from '@/views/other/chatBox/components/ShowJsonCopy.vue'
import GlobalModal from '@/views/other/chatBox/components/GlobalModal.vue'
import { removeDefaultsByTemplate } from '@/utils/removeDefaults.js'

const lang = computed(() => usePageStore().setting.language)
const chatBoxEditorStore = useChatBoxEditorStore()

const fileInfo = computed(() => chatBoxEditorStore.themeSetting)
const themeConfig = themeSetting(lang.value)
</script>

<template>
  <div class="flex flex-row size-full dark:text-white">
    <div class="flex flex-col m-5 flex-1 border-r-2 p-2">
      <GlobalModal />
      <!--拖拽上传区域-->
      <FileJsonHandler class="mt-5 mb-5 w-[400px]"
                       v-model="chatBoxEditorStore.themeSetting"
                       :process-text="value=>{
                         return removeDefaultsByTemplate(value,defaultChatBoxTheme())
                       }"
                       storageKey="themeJson" />

      <div class="font-bold text-2xl mb-5">{{ translatable(lang, 'chat.box.theme.1') }}</div>

      <!--对话框主题-->
      <Form>
        <FormItem :label="translatable(lang, 'chat.box.theme.2')">
          <Select
            :offset="2"
            is-no-case-sensitive
            class="max-w-[150px]"
            :modelValue="fileInfo.theme"
            :options="themeList"
            @update:modelValue="
              (arg) => {
                fileInfo.theme = arg

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
                    functionalButton: [],
                    keyPrompt: {},
                    customAnimation: {}
                  }
                }
              }
            "
          />
        </FormItem>
      </Form>

      <!--对话框配置-->
      <ObjectGeneratorDialog class="mt-10 mb-10" :properties="themeConfig.dialogBoxComponent"
                             v-model="fileInfo.dialogBox"
                             :title="translatable(lang, 'chat.box.theme.dialog.box.basic')" />
      <ObjectGenerator :properties="themeConfig.dialogBox" v-model="fileInfo.dialogBox" />

      <!--功能按钮配置-->
      <ArrayObjectGenerator class="mt-10" :properties="themeConfig.functionButtons"
                            v-model="fileInfo.functionalButton" displayTemplate="{type}"
                            :title="translatable(lang, 'chat.box.theme.functional.button')" />
    </div>
    <div class="flex-1 p-2">
      <!--选项配置-->
      <ObjectGeneratorDialog class="mb-10" :properties="themeConfig.optionComponent"
                             v-model="fileInfo.option"
                             :title="translatable(lang, 'chat.box.theme.option.basic')" />
      <ObjectGenerator :properties="themeConfig.option" v-model="fileInfo.option" />

      <!--按键提示配置-->
      <ObjectGeneratorDialog class="mt-10 mb-10" :properties="themeConfig.keyPromptComponent"
                             v-model="fileInfo.keyPrompt"
                             :title="translatable(lang, 'chat.box.theme.KeyPrompt.basic')" />
      <ObjectGenerator class="mb-10" :properties="themeConfig.keyPrompt"
                       v-model="fileInfo.keyPrompt" />

      <!--展示json-->
      <ShowJsonCopy
        :value="removeDefaultsByTemplate(chatBoxEditorStore.themeSetting,defaultChatBoxTheme())" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.upload-drag {
  border-color: #00c0f5 !important;
  color: #00c0f5 !important;
}
</style>
