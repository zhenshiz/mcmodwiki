<script setup>
import { computed, ref } from 'vue'
import { useChatBoxEditorStore, usePageStore } from '@/stores/index.js'
import Modal from '@/components/Modal.vue'
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'
import { mcLanguageOptions, translatable } from '@/assets/translatable/translatable.js'
import { Icon } from '@iconify/vue'
import { usePrompt } from '@/components/register/usePrompt.js'
import ShowJsonCopy from '@/views/other/chatBox/components/ShowJsonCopy.vue'
import AutoComplete from '@/components/AutoComplete.vue'
import { useMessage } from '@/components/register/useMessage.js'

const chatBoxEditorStore = useChatBoxEditorStore()
const prompt = usePrompt()
const message = useMessage()
const lang = computed(() => usePageStore().setting.language)
const visible = ref(false)
const translatableSearch = ref('')
const languageJson = ref()

const addLang = () => {
  prompt.open({
    title: translatable(lang.value, 'chat.box.component.global.translatable.add.lang'),
    suggestions: mcLanguageOptions,
    onPositiveClick: (value) => {
      chatBoxEditorStore.addColumn(value)
    }
  })
}

// 导入 JSON 文件
const isDragOver = ref(false)
const onDragOver = (e) => {
  e.preventDefault()
  isDragOver.value = true
}
const onDragLeave = () => (isDragOver.value = false)
const onDrop = async (e) => {
  e.preventDefault()
  isDragOver.value = false
  const files = [...e.dataTransfer.files].filter((f) => f.name.endsWith('.json'))
  if (!files.length) return message.error(translatable(lang.value, 'message.error.invalid.file'))
  const results = {}
  for (const file of files) {
    await readJsonFile(file, results)
  }
  chatBoxEditorStore.loadFromJson(results)
  message.success(translatable(lang.value, 'message.success.import'))
}
const loadFiles = async () => {
  try {
    const handles = await window.showOpenFilePicker({
      multiple: true,
      types: [{ description: 'JSON Files', accept: { 'application/json': ['.json'] } }]
    })
    const results = {}
    for (const handle of handles) {
      const file = await handle.getFile()
      await readJsonFile(file, results)
    }
    chatBoxEditorStore.loadFromJson(results)
    message.success(translatable(lang.value, 'message.success.import'))
  } catch (err) {
    if (err.name !== 'AbortError') console.error(err)
  }
}

async function readJsonFile(file, resultObj) {
  try {
    const text = await file.text()
    const data = JSON.parse(text)
    const langCode = file.name.replace(/\.json$/i, '')
    resultObj[langCode] = data
  } catch (e) {
    message.error(`${file.name} ${translatable(lang.value, 'message.error.invalid.json')}`)
  }
}
</script>

<template>
  <Button @click="visible = true" isToggleColor>
    {{ translatable(lang, 'chat.box.component.global.translatable.key') }}
  </Button>

  <Modal :show="visible"
         @defaultClose="()=>visible= false"
         :positive-visible="false"
         :negative-visible="false"
         :title="translatable(lang, 'chat.box.component.global.translatable.key')" :sm-width="80">
    <template #content>
      <div class="flex flex-col gap-3 p-3 w-full">
        <!-- 顶部工具栏 -->
        <div class="flex flex-row gap-2 items-center">
          <Input v-model="translatableSearch"
                 default-model="search"
                 :placeholder="translatable(lang,'chat.box.component.global.translatable.search.key')"
                 class="flex-1" />
          <Button @click="chatBoxEditorStore.addRow()" is-toggle-color>
            {{ translatable(lang, 'chat.box.component.global.translatable.add.key') }}
          </Button>
          <Button @click="addLang" is-toggle-color>
            {{ translatable(lang, 'chat.box.component.global.translatable.add.lang') }}
          </Button>
          <ShowJsonCopy :value="chatBoxEditorStore.getTranslatableJSON(languageJson)">
            <template #toolbar>
              <AutoComplete class="max-w-[100px]" v-model="languageJson"
                            :suggestions="mcLanguageOptions" clearable />
            </template>
          </ShowJsonCopy>
          <div
            class="flex items-center justify-center border-2 border-dashed border-black dark:border-white rounded cursor-pointer px-4 py-2 gap-2 dark:text-white hover:text-text-blue hover:border-text-blue transition-all"
            :class="{ 'upload-drag': isDragOver }"
            @click="loadFiles"
            @dragover="onDragOver"
            @dragleave="onDragLeave"
            @drop="onDrop"
          >
            <div class="flex flex-row items-center gap-2">
              <Icon width="20" icon="material-symbols:upload" />
              <span class="whitespace-nowrap">
              {{ translatable(lang, 'chat.box.component.global.translatable.import.hint') }}
            </span>
            </div>
          </div>
        </div>

        <!-- 列表展示每个 key -->
        <div
          class="flex flex-col gap-4 border-t pt-2"
          style="max-height: calc(80vh - 200px); overflow-y: auto;"
          @wheel.stop
        >
          <div
            v-for="(row, rowIndex) in chatBoxEditorStore.translatableKeyRows.filter(r =>
            !translatableSearch || r.key.includes(translatableSearch)
          )"
            :key="rowIndex"
            class="border rounded p-3 bg-gray-50 bg-transparent dark:text-white"
          >
            <!-- Key 名称行 -->
            <div class="flex flex-row justify-between items-center mb-2">
              <div class="font-bold text-sm flex flex-row w-2/3">
                <div class="flex items-center">Key：</div>
                <Input v-model="row.key" default-model="search" class="" />
              </div>
              <button class="text-red-500 hover:bg-red-100 dark:hover:bg-red-900 p-1 rounded"
                      @click="chatBoxEditorStore.removeRow(rowIndex)">
                <Icon icon="mdi:delete" />
              </button>
            </div>

            <!-- 各语言的值（竖着展示） -->
            <div class="flex flex-col gap-2">
              <div
                v-for="(langCode, colIndex) in chatBoxEditorStore.translatableKeyColumns"
                :key="colIndex"
                class="flex flex-row items-center gap-2"
              >
                <div class="min-w-[80px] text-right font-mono text-xs">{{ langCode }}：</div>
                <Input
                  v-model="row.value[colIndex]"
                  class="flex-1"
                  :placeholder="translatable(lang,'chat.box.component.global.translatable.add.translatable')"
                />
                <button
                  class="text-red-500 hover:bg-red-100 dark:hover:bg-red-900 p-1 rounded"
                  @click="chatBoxEditorStore.removeColumn(colIndex)"
                >
                  <Icon icon="mdi:delete" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<style scoped lang="scss">
.upload-drag {
  border-color: #00c0f5 !important;
  color: #00c0f5 !important;
  background-color: rgba(0, 192, 245, 0.05);
}
</style>
