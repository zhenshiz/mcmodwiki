<script setup>
import GlobalDialog from '@/views/other/chatBox/components/GlobalModal.vue'
import { Icon } from '@iconify/vue'
import { generateUUID, removeFirstAndLastLine } from '@/utils/format.js'
import { translatable } from '@/assets/translatable/translatable.js'
import { useChatBoxEditorStore, usePageStore } from '@/stores/index.js'
import Modal from '@/components/Modal.vue'
import Input from '@/components/Input.vue'
import { useMessage } from '@/components/register/useMessage.js'
import Switch from '@/components/Switch.vue'
import Button from '@/components/Button.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { copyToClipboard } from '@/utils/web'
import { MilkdownProvider } from '@milkdown/vue'
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/vue'
import MilkDownReadOnly from '@/components/milkdown/MilkDownReadOnly.vue'
import { defaultDialogues, optionSetting } from '@/assets/more/chatBox/defaultInfo'
import PortraitEditor from '@/views/other/chatBox/components/PortraitEditor.vue'
import { useDialog } from '@/components/register/useDialog'
import { get, set } from 'idb-keyval'
import FormItem from '@/components/FormItem.vue'
import ArrayObjectGenerator from '@/components/ArrayObjectGenerator.vue'
import AutoComplete from '@/components/AutoComplete.vue'
import draggable from 'vuedraggable'
import { cleanChatBoxDialogues } from '@/assets/more/chatBox/class.js'

const message = useMessage()
const dialog = useDialog()
const chatBoxEditorStore = useChatBoxEditorStore()
const lang = computed(() => usePageStore().setting.language)
const dialoguesSetting = computed(() => chatBoxEditorStore.dialoguesSetting)
const isDark = computed(() => usePageStore().isDark)
const isShowSetting = ref(false)
const isShowAddGroup = ref(false)
//记录当前打开的是谁的属性
const dialogGroup = ref(null)
const dialogIndex = ref(null)
const isShowEdit = ref(false)
const expandedGroups = ref({})

// 将对象转换为数组以便拖拽
const dialoguesArray = ref([])

// 监听dialoguesSetting变化，更新dialoguesArray
watch(
  () => dialoguesSetting.value,
  (newValue) => {
    if (newValue && newValue.dialogues) {
      dialoguesArray.value = Object.entries(newValue.dialogues).map(([groupName, dialogues]) => ({
        groupName,
        dialogues: [...dialogues], // 创建副本以确保响应式
      }))
    }
  },
  { deep: true, immediate: true },
)

// 当拖拽完成时更新原始数据
const updateDialoguesFromArray = () => {
  const newDialogues = {}
  dialoguesArray.value.forEach((group) => {
    newDialogues[group.groupName] = group.dialogues
  })

  // 直接修改store中的数据
  const newSettings = {
    ...dialoguesSetting.value,
    dialogues: newDialogues,
  }

  chatBoxEditorStore.setDialoguesSetting(newSettings)
}

const toggleGroup = (groupName) => {
  expandedGroups.value[groupName] = !expandedGroups.value[groupName]
}

const addDialogue = (groupName) => {
  dialoguesSetting.value.dialogues[groupName].push(
    Object.assign({
      id: generateUUID(),
      dialogBox: {
        name: '',
        text: '',
      },
      portrait: [],
      options: [],
      sound: '',
      volume: '',
      pitch: '',
      command: '',
      video: {
        path: '',
        canControl: true,
        canSkip: true,
        loop: false,
      },
    }),
  )
}

const removeGroup = (groupName) => {
  dialog.warning({
    title: translatable(lang.value, 'dialog.warning'),
    content: translatable(lang.value, 'dialog.warn.chatbox.dialogues.delete.groupName'),
    onPositiveClick: () => {
      if (groupName === dialogGroup.value) isShowEdit.value = false
      const currentDialogues = JSON.parse(JSON.stringify(dialoguesSetting.value.dialogues)) || {}

      const newDialogues = Object.fromEntries(
        Object.entries(currentDialogues).filter(([key]) => key !== groupName),
      )

      chatBoxEditorStore.setDialoguesSetting({
        ...dialoguesSetting.value,
        dialogues: newDialogues,
      })
    },
  })
}

const newGroupName = ref('')

const addGroup = () => {
  if (!newGroupName.value) {
    message.warning(translatable(lang.value, 'message.warn.dialogues.group'))
    return
  }

  if (!dialoguesSetting.value.dialogues[newGroupName.value]) {
    dialoguesSetting.value.dialogues[newGroupName.value] = []
    expandedGroups.value[newGroupName.value] = true
    newGroupName.value = ''
    isShowAddGroup.value = false
  }
}

const closeDialogue = (groupName, index) => {
  dialog.warning({
    title: translatable(lang.value, 'dialog.warning'),
    content: translatable(lang.value, 'dialog.warn.chatbox.dialogues.delete.dialogues'),
    onPositiveClick: () => {
      if (index < dialogIndex.value) {
        dialogIndex.value--
      } else if (index === dialogIndex.value) {
        isShowEdit.value = false
      }
      dialoguesSetting.value.dialogues[groupName].splice(index, 1)
    },
  })
}

const goto = (url) => {
  window.open(url, '_blank')
}

const openDialoguesSetting = (groupName, index) => {
  dialogGroup.value = groupName
  dialogIndex.value = index
  isShowEdit.value = true

  // 初始化编辑界面的数据
  const dialogue = dialoguesSetting.value.dialogues[dialogGroup.value][dialogIndex.value]
  const dialogBox = dialogue.dialogBox
  const video = dialogue.video
  dialogue.portrait = dialogue.portrait || []
  const options = dialogue.options || []

  dialogBox.name = dialogBox.name || ''
  dialogBox.text = dialogBox.text || ''
  options.forEach((option) => {
    option.text = option.text || ''
    option.isLock = option.isLock !== undefined ? option.isLock : false
    option.lock = option.lock || { objective: '', value: '' }
    option.isHidden = option.isHidden !== undefined ? option.isHidden : false
    option.hidden = option.hidden || { objective: '', value: '' }
    option.next = option.next !== undefined ? option.next : null
    option.click = option.click || { type: '', value: '' }
    option.tooltip = option.tooltip || ''
  })
  video.path = video.path || ''
  video.canControl = video.canControl !== undefined ? video.canControl : true
  video.canSkip = video.canSkip !== undefined ? video.canSkip : true
  video.loop = video.loop !== undefined ? video.loop : false

  dialogue.sound = dialogue.sound || ''
  dialogue.volume = dialogue.volume !== undefined ? dialogue.volume : ''
  dialogue.pitch = dialogue.pitch !== undefined ? dialogue.pitch : ''
  dialogue.command = dialogue.command || ''
  dialogue.backgroundImage = dialogue.backgroundImage || ''
  dialogue.theme = dialogue.theme || ''
}

// 上传相关逻辑
let fileHandle

const loadFile = async () => {
  ;[fileHandle] = await window.showOpenFilePicker()
  const file = await fileHandle.getFile()
  if (file && (file.type === 'application/json' || file.name.endsWith('.json'))) {
    await set('dialoguesFile', fileHandle)
    const reader = new FileReader()
    reader.onload = function (e) {
      const fileContent = e.target.result || defaultDialogues
      try {
        chatBoxEditorStore.setDialoguesSetting(JSON.parse(fileContent))
      } catch (error) {
        console.error('文件内容不是有效的 JSON 格式！')
      }
    }
    reader.readAsText(file)
  }
}

const modifyFile = async (text) => {
  if (fileHandle !== undefined && verifyPermission(fileHandle, true)) {
    const writable = await fileHandle.createWritable()
    await writable.write(text)
    await writable.close()
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
    await set('dialoguesFile', handle)
    let file = await fileHandle.getFile()
    let text = await file.text()

    try {
      chatBoxEditorStore.setDialoguesSetting(JSON.parse(text || defaultDialogues))
    } catch (error) {
      console.error('文件内容不是有效的 JSON 格式！')
    }
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
  if ((await fileHandle.requestPermission(options)) === 'granted') {
    return true
  }
  return false
}

const isShowDialoguesJson = ref(false)

// 预处理对话数据，移除不需要的id字段
const preprocessDialogues = (dialogues) => {
  const result = JSON.parse(JSON.stringify(dialogues))

  // 处理每个分组
  Object.keys(result.dialogues || {}).forEach((groupName) => {
    const group = result.dialogues[groupName]

    // 处理每个对话
    group.forEach((dialog) => {
      // 删除对话同级的id字段
      delete dialog.id

      // 保留portrait中的id字段
      // 不需要特殊处理，因为我们只删除了对话同级的id
    })
  })

  return result
}

const themeJson = computed(() => {
  const processedData = preprocessDialogues(dialoguesSetting.value)
  return `\`\`\`json
${JSON.stringify(cleanChatBoxDialogues(processedData), null, 2)}
  \`\`\``
})

onMounted(async () => {
  fileHandle = await get('dialoguesFile')
})

watch(
  () => chatBoxEditorStore.dialoguesSetting,
  (newValue) => {
    modifyFile(JSON.stringify(cleanChatBoxDialogues(newValue), null, 2))
  },
  { deep: true, immediate: true },
)
</script>

<template>
  <div class="flex flex-col size-full dark:text-white p-5">
    <div class="mb-5 flex flex-row w-full">
      <div class="flex-1">
        <GlobalDialog />
      </div>
      <div class="flex-1 flex justify-end items-center gap-3">
        <!-- 拖拽上传区域 -->
        <Button
          class="text-lg cursor-pointer select-none p-2 border border-[#208bff] text-[#208bff] hover:bg-[#208bff] hover:text-white"
          :class="{ 'upload-drag': isDragOver }"
          @click="loadFile"
          @dragover.prevent="onDragOver"
          @dragleave.prevent="onDragLeave"
          @drop.prevent="onDrop"
        >
          <span class="ml-2 text-base">{{
            translatable(lang, 'chat.box.component.global.portrait.translatable.upload.json')
          }}</span>
        </Button>
        <Button is-toggle-color :rounded-size="0" @click="isShowDialoguesJson = true">
          {{
            translatable(lang, 'chat.box.component.global.portrait.translatable.generation.json')
          }}
        </Button>
        <Button is-toggle-color :rounded-size="0" @click="isShowAddGroup = true">
          {{ translatable(lang, 'chat.box.dialogues.add.group') }}
        </Button>
        <Button is-toggle-color :rounded-size="0" @click="() => (isShowSetting = true)">
          {{ translatable(lang, 'chat.box.dialogues.common.setting') }}
        </Button>
      </div>
    </div>
    <div class="flex flex-row w-full h-[calc(100vh-165px)] max-h-[calc(100vh-165px)]">
      <!--左侧对话列表视图-->
      <div class="border flex-[4] overflow-auto relative p-4">
        <!-- 使用draggable组件实现分组拖拽 -->
        <draggable
          v-model="dialoguesArray"
          item-key="groupName"
          handle=".group-handle"
          ghost-class="ghost-group"
          class="space-y-3"
          @end="updateDialoguesFromArray"
        >
          <template #item="{ element: group }">
            <div class="border rounded-lg overflow-hidden">
              <!-- 分组标题 -->
              <div
                class="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 cursor-pointer"
              >
                <div class="flex items-center">
                  <Icon icon="mdi:drag-vertical" class="text-lg mr-2 cursor-move group-handle" />
                  <h3 class="font-medium" @click="toggleGroup(group.groupName)">
                    {{ group.groupName }}
                  </h3>
                </div>
                <div class="flex items-center space-x-2">
                  <Icon
                    :icon="
                      expandedGroups[group.groupName] ? 'mdi:chevron-down' : 'mdi:chevron-right'
                    "
                    class="text-lg"
                    @click="toggleGroup(group.groupName)"
                  />
                  <span class="text-sm text-gray-500">
                    {{ group.dialogues.length }}
                    {{ translatable(lang, 'chat.box.dialogues.count') }}
                  </span>
                  <Button
                    is-toggle-color
                    class="w-[30px] h-[30px] center"
                    @click.stop="addDialogue(group.groupName)"
                  >
                    +
                  </Button>
                  <Button
                    is-toggle-color
                    :background="'#fff'"
                    :color="'#f00'"
                    class="w-[30px] h-[30px] center"
                    @click.stop="removeGroup(group.groupName)"
                  >
                    x
                  </Button>
                </div>
              </div>

              <!-- 分组内容 - 使用draggable实现对话拖拽 -->
              <div v-if="expandedGroups[group.groupName]" class="p-3 space-y-2">
                <draggable
                  v-model="group.dialogues"
                  item-key="id"
                  handle=".dialog-handle"
                  ghost-class="ghost-dialog"
                  class="space-y-2"
                  @end="updateDialoguesFromArray"
                >
                  <template #item="{ element: dialog, index }">
                    <div
                      class="flex justify-between items-center p-2 border rounded mb-2 cursor-pointer hover:bg-gray-50 hover:text-text-blue"
                      @click.stop="openDialoguesSetting(group.groupName, index)"
                    >
                      <div class="flex items-center">
                        <Icon
                          icon="mdi:drag-vertical"
                          class="text-lg mr-2 cursor-move dialog-handle"
                        />
                        <span class="font-medium ellipsis max-w-20 cursor-pointer">
                          {{
                            dialog.dialogBox?.name === ''
                              ? `${translatable(lang, 'chat.box.dialogues')}${index + 1}`
                              : dialoguesSetting.isTranslatable
                                ? chatBoxEditorStore.translatable(lang, dialog.dialogBox?.name)
                                : dialog.dialogBox?.name
                          }}
                        </span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span
                          class="text-sm text-gray-500 truncate ellipsis max-w-[500px] cursor-pointer"
                          :title="dialog.dialogBox?.text"
                          @click.stop="openDialoguesSetting(group.groupName, index)"
                        >
                          {{
                            dialog.dialogBox?.text === ''
                              ? translatable(lang, 'chat.box.dialogues.empty')
                              : dialoguesSetting.isTranslatable
                                ? chatBoxEditorStore.translatable(lang, dialog.dialogBox?.text)
                                : dialog.dialogBox?.text
                          }}
                        </span>
                        <Icon
                          icon="mdi:close"
                          class="text-gray-500 hover:text-red-500"
                          @click.stop="closeDialogue(group.groupName, index)"
                        />
                      </div>
                    </div>
                  </template>
                </draggable>
              </div>
            </div>
          </template>
        </draggable>
      </div>

      <!-- 右侧编辑界面 -->
      <div
        class="border flex-[2] overflow-auto p-4 dark:bg-gray-800 scrollbar scrollbar-track-transparent scrollbar-thumb-text-gray dark:scrollbar-thumb-text-blue"
      >
        <div v-if="isShowEdit && dialogGroup !== null && dialogIndex !== null" class="space-y-4">
          <div class="title">
            {{ translatable(lang, 'chat.box.dialogues.edit.title') }}
          </div>

          <!-- 对话框基础配置 -->
          <Form>
            <FormItem
              :label="translatable(lang, 'chat.box.dialogues.dialogBox.name')"
              layout="vertical"
            >
              <Input
                v-if="!dialoguesSetting.isTranslatable"
                v-model="dialoguesSetting.dialogues[dialogGroup][dialogIndex].dialogBox.name"
                default-model="input"
              />
              <AutoComplete
                v-else
                v-model="dialoguesSetting.dialogues[dialogGroup][dialogIndex].dialogBox.name"
                :suggestions="chatBoxEditorStore.translatableOptions(lang)"
                valueKey="value"
                labelKey="label"
                clearable
              >
              </AutoComplete>
            </FormItem>
            <FormItem
              :label="translatable(lang, 'chat.box.dialogues.dialogBox.text')"
              layout="vertical"
            >
              <Input
                v-if="!dialoguesSetting.isTranslatable"
                v-model="dialoguesSetting.dialogues[dialogGroup][dialogIndex].dialogBox.text"
                default-model="input"
              />
              <AutoComplete
                v-else
                v-model="dialoguesSetting.dialogues[dialogGroup][dialogIndex].dialogBox.text"
                :suggestions="chatBoxEditorStore.translatableOptions(lang)"
                valueKey="value"
                labelKey="label"
                clearable
              >
              </AutoComplete>
            </FormItem>
            <PortraitEditor
              v-model="dialoguesSetting.dialogues[dialogGroup][dialogIndex].portrait"
            />
            <FormItem :label="translatable(lang, 'chat.box.dialogues.option')" layout="vertical">
              <ArrayObjectGenerator
                v-model="dialoguesSetting.dialogues[dialogGroup][dialogIndex].options"
                :field-descriptions="optionSetting(lang)"
              />
            </FormItem>
            <FormItem :label="translatable(lang, 'chat.box.dialogues.sound')" layout="vertical">
              <Input
                v-model="dialoguesSetting.dialogues[dialogGroup][dialogIndex].sound"
                default-model="input"
              />
            </FormItem>
            <FormItem :label="translatable(lang, 'chat.box.dialogues.volume')" layout="vertical">
              <Input
                v-model.number="dialoguesSetting.dialogues[dialogGroup][dialogIndex].volume"
                default-model="input"
              />
            </FormItem>
            <FormItem :label="translatable(lang, 'chat.box.dialogues.pitch')" layout="vertical">
              <Input
                v-model.number="dialoguesSetting.dialogues[dialogGroup][dialogIndex].pitch"
                default-model="input"
              />
            </FormItem>
            <FormItem :label="translatable(lang, 'chat.box.dialogues.command')" layout="vertical">
              <Input
                v-model.number="dialoguesSetting.dialogues[dialogGroup][dialogIndex].command"
                default-model="input"
              />
            </FormItem>
            <FormItem
              :label="translatable(lang, 'chat.box.dialogues.backgroundImage')"
              layout="vertical"
            >
              <Input
                v-model.number="
                  dialoguesSetting.dialogues[dialogGroup][dialogIndex].backgroundImage
                "
                default-model="input"
              />
            </FormItem>
            <FormItem
              :label="translatable(lang, 'chat.box.dialogues.video.path')"
              layout="vertical"
            >
              <Input
                v-model.number="dialoguesSetting.dialogues[dialogGroup][dialogIndex].video.path"
                default-model="input"
              />
            </FormItem>
            <FormItem
              :label="translatable(lang, 'chat.box.dialogues.video.canControl')"
              layout="vertical"
            >
              <Switch
                v-model="dialoguesSetting.dialogues[dialogGroup][dialogIndex].video.canControl"
              />
            </FormItem>
            <FormItem
              :label="translatable(lang, 'chat.box.dialogues.video.canSkip')"
              layout="vertical"
            >
              <Switch
                v-model="dialoguesSetting.dialogues[dialogGroup][dialogIndex].video.canSkip"
              />
            </FormItem>
            <FormItem
              :label="translatable(lang, 'chat.box.dialogues.video.loop')"
              layout="vertical"
            >
              <Switch v-model="dialoguesSetting.dialogues[dialogGroup][dialogIndex].video.loop" />
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  </div>

  <!--新增分组-->
  <Modal
    :title="translatable(lang, 'chat.box.dialogues.add.group')"
    :show="isShowAddGroup"
    :defaultCloseEvent="['onClose', 'onNegativeClick']"
    @defaultClose="(arg) => (isShowAddGroup = false)"
    @onPositiveClick="addGroup"
    :sm-width="30"
  >
    <template #content>
      <div class="center w-full h-[200px] dark:text-white">
        <div class="flex flex-row items-center whitespace-nowrap">
          {{ translatable(lang, 'chat.box.dialogues.group.name') }}
          <Input class="mr-2" v-model="newGroupName" defaultModel="search" />
        </div>
      </div>
    </template>
  </Modal>

  <!--对话框基础配置-->
  <Modal
    :title="translatable(lang, 'chat.box.dialogues.common.setting')"
    :show="isShowSetting"
    :positive-visible="false"
    :negative-visible="false"
    :smWidth="60"
    @onClose="(args) => (isShowSetting = false)"
  >
    <template #content>
      <Form>
        <FormItem :label="translatable(lang, 'chat.box.dialogues.introduce')">
          <Input class="mr-2" v-model="dialoguesSetting.$introduce" defaultModel="search" />
        </FormItem>
        <FormItem :label="translatable(lang, 'chat.box.dialogues.isTranslatable')">
          <Switch v-model="dialoguesSetting.isTranslatable" />
        </FormItem>
        <FormItem :label="translatable(lang, 'chat.box.dialogues.isEsc')">
          <Switch v-model="dialoguesSetting.isEsc" />
        </FormItem>
        <FormItem :label="translatable(lang, 'chat.box.dialogues.isPause')">
          <Switch v-model="dialoguesSetting.isPause" />
        </FormItem>
        <FormItem :label="translatable(lang, 'chat.box.dialogues.isHistoricalSkip')">
          <Switch v-model="dialoguesSetting.isHistoricalSkip" />
        </FormItem>
        <FormItem :label="translatable(lang, 'chat.box.dialogues.maxTriggerCount')">
          <Input class="mr-2" v-model="dialoguesSetting.maxTriggerCount" defaultModel="search" />
        </FormItem>
        <FormItem :label="translatable(lang, 'chat.box.dialogues.theme')">
          <Input class="mr-2" v-model="dialoguesSetting.theme" defaultModel="search" />
        </FormItem>
        <FormItem :label="translatable(lang, 'chat.box.dialogues.criteria')">
          <Button
            is-toggle-color
            :rounded-size="0"
            @click="goto('https://misode.github.io/advancement/')"
          >
            {{ translatable(lang, 'chat.box.dialogues.criteria.button') }}
          </Button>
        </FormItem>
      </Form>
    </template>
  </Modal>

  <!--生成json-->
  <Modal
    :show="isShowDialoguesJson"
    :title="translatable(lang, 'chat.box.theme.download.title')"
    @default-close="() => (isShowDialoguesJson = false)"
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
.ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}
.upload-drag {
  background-color: #208bff;
  color: white !important;
}
.ghost-group {
  opacity: 0.5;
  background: #c8ebfb;
}
.ghost-dialog {
  opacity: 0.5;
  background: #c8ebfb;
}
.group-handle,
.dialog-handle {
  cursor: move;
}
</style>
