<script setup>
import MilkDownEditor from '@/components/milkdown/Editor.vue'
import { MilkdownProvider } from '@milkdown/vue'
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/vue'
import { useEditTopicStore, usePageStore } from '@/stores/index.js'
import ModeToggle from '@/components/milkdown/ModeToggle.vue'
import Button from '@/components/Button.vue'
import { useMessage } from '@/components/register/useMessage.js'
import { useDialog } from '@/components/register/useDialog.js'
import Input from '@/components/Input.vue'
import { language, translatable } from '@/assets/translatable/translatable.js'
import { modLoader } from '@/assets/mod/mod.js'
import Select from '@/components/Select.vue'

const message = useMessage()
const dialog = useDialog()
const editorHeight = 350
const editTopicStore = useEditTopicStore()
const form = computed(() => editTopicStore.getTopicInfo())
const textarea = ref()
const isDark = computed(() => usePageStore().isDark)
const lang = computed(() => usePageStore().setting.language)

const saveMarkdown = (markdown) => {
  editTopicStore.setTopicInfo({
    content: markdown,
    autosaveCount: editTopicStore.autosaveCount + 1
  })
}

const autoResizeTextarea = () => {
  if (textarea.value) {
    textarea.value.style.height = 'auto'
    textarea.value.style.height = `${textarea.value.scrollHeight}px`
  }
}

const handleInputCodeMarkdown = (event) => {
  const target = event.target

  autoResizeTextarea()
  saveMarkdown(target.value)
}

//发布话题
const downloadMd = async () => {
  dialog.warning({
    title: translatable(lang.value,'edit.download.md.dialog.title'),
    content: translatable(lang.value,'edit.download.md.dialog.content'),
    onPositiveClick: async () => {
      if (!form.value.mcVersion || !form.value.modLoader || !form.value.modVersion || !form.value.language) {
        message.warning(translatable(lang.value,'message.warn.download'))
        return
      }
      const blob = new Blob([form.value.content], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${form.value.mcVersion}_${form.value.modLoader}_${form.value.modVersion}_${form.value.language}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      message.success(translatable(lang,'message.success.download'))
      editTopicStore.resetTopicInfo()
    }
  })
}

const updateMode = arg => {
  editTopicStore.setTopicInfo({
    mode: arg
  })
}

onMounted(() => {
  autoResizeTextarea()
  if (!form.value.modVersion) editTopicStore.setTopicInfo({ modLoader: modLoader[0].value })
  if (!form.value.language) editTopicStore.setTopicInfo({ language: language.enum.ZH_CN.value })
})

watch(
  () => form.value.mode,
  async () => {
    await nextTick()

    if (form.value.mode === 'code') {
      autoResizeTextarea()
    }
  }
)
</script>

<template>
  <div class="flex justify-center">
    <div
      class="rounded bg-white dark:bg-dark-blue shadow mt-5 mb-5 min-h-[720px] min-w-full sm:min-w-[1290px] w-[65%] h-[75%] flex flex-col relative text-base">
      <!--富文本编辑器-->
      <MilkdownProvider v-if="form.mode==='preview'">
        <ProsemirrorAdapterProvider>
          <MilkDownEditor @update:valueMarkdown="saveMarkdown" :editor-height="editorHeight"
                          :value-markdown="form.content" :mode="form.mode"
                          @update:mode="updateMode"
                          class="dark:text-white" />
        </ProsemirrorAdapterProvider>
      </MilkdownProvider>

      <div v-if="form.mode==='code'" class="relative w-full min-h-[530px]">
        <div
          class="sticky top-0 w-full flex flex-wrap justify-start h-[43px] bg-[#edfaff] dark:bg-[#051e2f] dark:border dark:border-dark-blue">
          <ModeToggle :mode="form.mode" @update:mode="updateMode" />
        </div>
        <textarea class="p-5 w-full bg-transparent focus:outline-none dark:text-white resize-none"
                  ref="textarea"
                  :value="form.content" type="text" maxlength="100000"
                  :style="{minHeight: editorHeight+'px'}"
                  @input="handleInputCodeMarkdown($event)" autofocus />
      </div>

      <div class="flex flex-row items-center justify-between mt-5 mb-5">
        <div class="flex flex-row ml-3 items-center dark:text-white h-10 w-full sm:w-1/2">
          <Input :placeholder="translatable(lang,'edit.input.mc.version')"
                 v-model="form.mcVersion"
                 @update:modelValue="newValue => editTopicStore.setTopicInfo({mcVersion:newValue})"
                 default-model="search" />
          <Select v-model:value="form.modLoader" :options="modLoader" mode="bottom"
                  @update:value="newValue => editTopicStore.setTopicInfo({modLoader:newValue.value})" />
          <Input :placeholder="translatable(lang,'edit.input.mod.version')"
                 v-model="form.modVersion"
                 @update:modelValue="newValue => editTopicStore.setTopicInfo({modVersion:newValue})"
                 default-model="search" />
          <Select v-model:value="form.language" :options="language.values()" mode="bottom"
                  @update:value="newValue => editTopicStore.setTopicInfo({language:newValue.value})" />
        </div>
        <div class="flex items-center justify-end">
          <Button class="w-48 h-10 text-lg mr-2 center"
                  @click="downloadMd"
                  :color="isDark?'#66cffc':'#0071d5'" :background="isDark?'#000':'#fff'"
                  is-toggle-color>
            {{ translatable(lang,'edit.button.create.md') }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
