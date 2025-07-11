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
import { computed, ref } from 'vue'
import { copyToClipboard } from '@/utils/web'
import { isNumber } from 'lodash'
import { MilkdownProvider } from '@milkdown/vue'
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/vue'
import MilkDownReadOnly from '@/components/milkdown/MilkDownReadOnly.vue'
import { allValuesEmptyString } from '@/utils/math'
import Select from '@/components/Select.vue'
import TagInput from '@/components/TagInput.vue'

const message = useMessage()
const chatBoxEditorStore = useChatBoxEditorStore()
const lang = computed(() => usePageStore().setting.language)
const dialoguesSetting = computed(() => chatBoxEditorStore.dialoguesSetting)
const isDark = computed(() => usePageStore().isDark)
const isShowSetting = ref(false)
const isShowAddGroup = ref(false)
const jsonInput = ref()
//记录当前打开的是谁的属性
const dialogGroup = ref(null)
const dialogIndex = ref(null)
const expandedGroups = ref({})

const toggleGroup = (groupName) => {
  expandedGroups.value[groupName] = !expandedGroups.value[groupName]
}

const addDialogue = (groupName) => {
  dialoguesSetting.value.dialogues[groupName].push(
    Object.assign(
      {
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
      },
    ),
  )
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

// 空替换，完全移除拖拽相关代码

const closeDialogue = (groupName, index) => {
  dialoguesSetting.value.dialogues[groupName].splice(index, 1)
}

const goto = (url) => {
  window.open(url, '_blank')
}

const openDialoguesSetting = (groupName, index) => {
  dialogGroup.value = groupName
  dialogIndex.value = index

  // 初始化编辑界面的数据
  const dialogue = dialoguesSetting.value.dialogues[dialogGroup.value][dialogIndex.value]
  const dialogBox = dialogue.dialogBox
  const options = dialogue.options

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
  dialogue.sound = dialogue.sound || ''
  dialogue.volume = dialogue.volume !== undefined ? dialogue.volume : ''
  dialogue.pitch = dialogue.pitch !== undefined ? dialogue.pitch : ''
  dialogue.command = dialogue.command || ''
  dialogue.backgroundImage = dialogue.backgroundImage || ''
}

const addOption = () => {
  dialoguesSetting.value.dialogues[dialogGroup.value][dialogIndex.value].options.push({
    text: '',
    isLock: false,
    lock: {
      objective: '',
      value: '',
    },
    hidden: {
      objective: '',
      value: '',
    },
    isHidden: false,
    next: '',
    click: {
      type: '',
      value: '',
    },
    tooltip: '',
    visible: true,
  })
}

const removeOption = (index) => {
  dialoguesSetting.value.dialogues[dialogGroup.value][dialogIndex.value].options.splice(index, 1)
}

const handleFileChange = (event) => {
  event.preventDefault()

  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()

    // 文件读取完成后的回调
    reader.onload = function (e) {
      const fileContent = e.target.result
      try {
        chatBoxEditorStore.dialoguesSetting = JSON.parse(fileContent)
      } catch (error) {
        console.error('文件内容不是有效的 JSON 格式！')
      }
    }

    reader.readAsText(file)
  }
}

// 拖拽上传相关逻辑
const isDragOver = ref(false)
const onDragOver = () => {
  isDragOver.value = true
}
const onDragLeave = () => {
  isDragOver.value = false
}
const onDrop = (event) => {
  isDragOver.value = false
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file && (file.type === 'application/json' || file.name.endsWith('.json'))) {
    const reader = new FileReader()
    reader.onload = function(e) {
      const fileContent = e.target.result
      try {
        chatBoxEditorStore.dialoguesSetting = JSON.parse(fileContent)
      } catch (error) {
        console.error('文件内容不是有效的 JSON 格式！')
      }
    }
    reader.readAsText(file)
    event.target.files = []
  }
}

const isShowDialoguesJson = ref(false)
const themeJson = computed(() => {
  return `\`\`\`json
${JSON.stringify(dialoguesSetting.value, replacer, 2)}
  \`\`\``
})

const replacer = (key, value) => {
  if (
    key === 'visible' ||
    key === 'id' ||
    value === undefined ||
    value === null ||
    value === ''
  ) {
    return undefined // 排除这些属性
  }
  //空数组
  if (Array.isArray(value) && value.length === 0) return undefined
  //空对象
  if (allValuesEmptyString(value)) {
    return undefined
  }
  if (isNumber(value)) {
    return Number(value)
  }
  return value // 其他的都保留
}
</script>

<template>
  <div class="flex flex-col size-full dark:text-white p-5">
    <div class="mb-5 flex flex-row w-full">
      <div class="flex-1">
        <GlobalDialog />
      </div>
      <div class="flex-1 flex justify-end items-center gap-3">
        <!-- 拖拽上传区域 -->
        <div
          class="w-[180px] h-[50px] flex items-center justify-center border-2 border-dashed border-black rounded cursor-pointer select-none hover:text-text-blue hover:border-text-blue mb-0"
          :class="{ 'text-text-blue border-text-blue': isDragOver }"
          @click="jsonInput.click()"
          @dragover.prevent="onDragOver"
          @dragleave.prevent="onDragLeave"
          @drop.prevent="onDrop"
        >
          <Icon width="24" icon="material-symbols:upload" />
          <span
            class="ml-2 text-base">{{ translatable(lang, 'chat.box.component.global.portrait.translatable.upload.json')
            }}</span>
        </div>
        <input
          ref="jsonInput"
          hidden
          type="file"
          accept="application/JSON, .json"
          @change="handleFileChange($event)"
        />
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
      <div class="border flex-[4] overflow-auto relative p-4">
        <div class="space-y-3">
          <div
            v-for="(dialogues, groupName) in dialoguesSetting.dialogues"
            :key="groupName"
            class="border rounded-lg overflow-hidden"
          >
            <!-- 分组标题 -->
            <div
              class="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 cursor-pointer"
              @click="toggleGroup(groupName)"
            >
              <h3 class="font-medium">{{ groupName }}</h3>
              <div class="flex items-center space-x-2">
                <Icon
                  :icon="expandedGroups[groupName] ? 'mdi:chevron-down' : 'mdi:chevron-right'"
                  class="text-lg"
                />
                <span class="text-sm text-gray-500">
                  {{ dialogues.length }} {{ translatable(lang, 'chat.box.dialogues.count') }}
                </span>
                <Button
                  is-toggle-color
                  class="w-[30px] h-[30px] center"
                  @click.stop="addDialogue(groupName)"
                >
                  +
                </Button>
              </div>
            </div>

            <!-- 分组内容 -->
            <div v-if="expandedGroups[groupName]" class="p-3 space-y-2">
              <div
                v-for="(node, index) in dialogues"
                :key="index"
                class="flex justify-between items-center p-2 border rounded mb-2 cursor-pointer hover:bg-gray-50 hover:text-text-blue"
                @click="openDialoguesSetting(groupName, index)"
              >
                <span class="font-medium ellipsis max-w-20">{{
                  node.dialogBox?.name === ''
                    ? `${translatable(lang, 'chat.box.dialogues')}${index + 1}`
                    : dialoguesSetting.isTranslatable
                      ? chatBoxEditorStore.translatable(lang, node.dialogBox?.name)
                      : node.dialogBox?.name
                }}</span>
                <div class="flex items-center space-x-2">
                  <span
                    class="text-sm text-gray-500 truncate ellipsis max-w-[500px]"
                    :title="node.dialogBox?.text"
                  >
                    {{
                      node.dialogBox?.text === ''
                        ? translatable(lang, 'chat.box.dialogues.empty')
                        : dialoguesSetting.isTranslatable
                          ? chatBoxEditorStore.translatable(lang, node.dialogBox?.text)
                          : node.dialogBox?.text
                    }}
                  </span>
                  <Icon
                    icon="mdi:close"
                    class="text-gray-500 hover:text-red-500"
                    @click.stop="closeDialogue(groupName, index)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧编辑界面 -->
      <div
        class="border flex-1 overflow-auto p-4 dark:bg-gray-800 scrollbar scrollbar-track-transparent scrollbar-thumb-text-gray dark:scrollbar-thumb-text-blue"
      >
        <div v-if="dialogGroup !== null && dialogIndex !== null" class="space-y-4">
          <div class="title">
            {{ translatable(lang, 'chat.box.dialogues.edit.title') }}
          </div>

          <!-- 对话框基础配置 -->
          <div class="w-full">
            <div class="mb-1">{{ translatable(lang, 'chat.box.dialogues.dialogBox.name') }}</div>
            <Input
              v-if="!dialoguesSetting.isTranslatable"
              v-model="dialoguesSetting.dialogues[dialogGroup][dialogIndex].dialogBox.name"
              default-model="input"
            />
            <Select
              :width="300"
              v-else
              v-model:value="dialoguesSetting.dialogues[dialogGroup][dialogIndex].dialogBox.name"
              :options="chatBoxEditorStore.translatableOptions(lang)"
              @update:value="
                (arg) => {
                  dialoguesSetting.dialogues[dialogGroup][dialogIndex].dialogBox.name = arg.value
                }
              "
            >
            </Select>
          </div>

          <div>
            <div class="mb-1">{{ translatable(lang, 'chat.box.dialogues.dialogBox.text') }}</div>
            <Input
              v-if="!dialoguesSetting.isTranslatable"
              v-model="dialoguesSetting.dialogues[dialogGroup][dialogIndex].dialogBox.text"
              default-model="input"
            />
            <Select
              :width="300"
              v-else
              v-model:value="dialoguesSetting.dialogues[dialogGroup][dialogIndex].dialogBox.text"
              :options="chatBoxEditorStore.translatableOptions(lang)"
              @update:value="
                (arg) => {
                  dialoguesSetting.dialogues[dialogGroup][dialogIndex].dialogBox.text = arg.value
                }
              "
            >
            </Select>
          </div>

          <!-- 立绘 -->
          <div>
            <label class="block mb-1">{{
              translatable(lang, 'chat.box.dialogues.portrait')
            }}</label>
            <TagInput
              v-model:tags="dialoguesSetting.dialogues[dialogGroup][dialogIndex].portrait"
              :color="isDark ? '#fff' : '#000'"
            >
            </TagInput>
          </div>

          <!-- 选项配置 -->
          <div class="space-y-2">
            <div
              v-for="(option, optIndex) in dialoguesSetting.dialogues[dialogGroup][dialogIndex]
                .options"
              :key="optIndex"
              class="p-2 border rounded relative min-h-9"
            >
              <div class="flex flex-col gap-3">
                <div class="ellipsis text-sm max-w-20" v-show="!option.visible">
                  {{ option.text }}
                </div>
                <Icon
                  :icon="option.visible ? 'mdi:chevron-down' : 'mdi:chevron-right'"
                  @click="
                    () => {
                      option.visible = !option.visible
                    }
                  "
                  class="text-lg absolute top-2 right-4 cursor-pointer hover:text-text-blue mr-1"
                />
                <div
                  @click="removeOption(optIndex)"
                  class="absolute top-1 right-2 cursor-pointer hover:text-red-600"
                >
                  x
                </div>
                <div v-show="option.visible">
                  <div class="mb-1">
                    {{ translatable(lang, 'chat.box.dialogues.options.text') }}
                  </div>
                  <Input
                    v-if="!dialoguesSetting.isTranslatable"
                    v-model="option.text"
                    default-model="input"
                  />
                  <Select
                    :width="300"
                    v-else
                    v-model:value="option.text"
                    :options="chatBoxEditorStore.translatableOptions(lang)"
                    @update:value="
                      (arg) => {
                        option.text = arg.value
                      }
                    "
                  >
                  </Select>
                </div>

                <div v-show="option.visible">
                  <label class="block mb-1">{{
                    translatable(lang, 'chat.box.dialogues.options.isLock')
                  }}</label>
                  <Switch v-model="option.isLock" />
                </div>

                <div v-if="option.isLock && option.visible">
                  <div class="mb-3">
                    {{ translatable(lang, 'chat.box.dialogues.options.lock.objective') }}
                    <Input v-model="option.lock.objective" default-model="input" />
                  </div>

                  <div class="mb-3">
                    {{ translatable(lang, 'chat.box.dialogues.options.lock.value') }}
                    <Input v-model="option.lock.value" default-model="input" />
                  </div>
                </div>

                <div v-show="option.visible">
                  <label class="block mb-1">{{
                    translatable(lang, 'chat.box.dialogues.options.isHidden')
                  }}</label>
                  <Switch v-model="option.isHidden" />
                </div>

                <div v-if="option.isHidden && option.visible">
                  <div class="mb-3">
                    {{ translatable(lang, 'chat.box.dialogues.options.hidden.objective') }}
                    <Input v-model="option.hidden.objective" default-model="input" />
                  </div>

                  <div class="mb-3">
                    {{ translatable(lang, 'chat.box.dialogues.options.hidden.value') }}
                    <Input v-model="option.hidden.value" default-model="input" />
                  </div>
                </div>

                <div v-show="option.visible">
                  <label class="block mb-1">{{
                    translatable(lang, 'chat.box.dialogues.options.next')
                  }}</label>
                  <Input v-model="option.next" default-model="input" />
                </div>

                <div v-show="option.visible">
                  {{ translatable(lang, 'chat.box.dialogues.options.click.type') }}
                  <Input v-model="option.click.type" default-model="input" />
                </div>

                <div v-show="option.visible">
                  {{ translatable(lang, 'chat.box.dialogues.options.click.value') }}
                  <Input v-model="option.click.value" default-model="input" />
                </div>

                <div v-show="option.visible">
                  {{ translatable(lang, 'chat.box.dialogues.options.tooltip') }}
                  <Input v-model="option.tooltip" default-model="input" />
                </div>
              </div>
            </div>
          </div>
          <Button is-toggle-color class="mt-2" @click="addOption">
            {{ translatable(lang, 'chat.box.dialogues.option.add') }}
          </Button>

          <!-- 音效和命令 -->
          <div>
            <label class="block mb-1">{{ translatable(lang, 'chat.box.dialogues.sound') }}</label>
            <Input
              v-model="dialoguesSetting.dialogues[dialogGroup][dialogIndex].sound"
              default-model="input"
            />
          </div>

          <div>
            <label class="block mb-1">{{ translatable(lang, 'chat.box.dialogues.volume') }}</label>
            <Input
              v-model.number="dialoguesSetting.dialogues[dialogGroup][dialogIndex].volume"
              default-model="input"
            />
          </div>

          <div>
            <label class="block mb-1">{{ translatable(lang, 'chat.box.dialogues.pitch') }}</label>
            <Input
              v-model.number="dialoguesSetting.dialogues[dialogGroup][dialogIndex].pitch"
              default-model="input"
            />
          </div>

          <div>
            <label class="block mb-1">{{ translatable(lang, 'chat.box.dialogues.command') }}</label>
            <Input
              v-model="dialoguesSetting.dialogues[dialogGroup][dialogIndex].command"
              default-model="input"
            />
          </div>

          <div>
            <label class="block mb-1">{{
              translatable(lang, 'chat.box.dialogues.backgroundImage')
            }}</label>
            <Input
              v-model="dialoguesSetting.dialogues[dialogGroup][dialogIndex].backgroundImage"
              default-model="input"
            />
          </div>
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
    @onClose="(args) => (isShowSetting = false)"
  >
    <template #content>
      <div class="flex flex-col justify-center w-full dark:text-white">
        <div class="flex flex-col gap-3">
          <div class="flex flex-row items-center whitespace-nowrap">
            {{ translatable(lang, 'chat.box.dialogues.introduce') }}
            <Input class="mr-2" v-model="dialoguesSetting.$introduce" defaultModel="search" />
          </div>
          <div class="flex flex-row items-center whitespace-nowrap">
            {{ translatable(lang, 'chat.box.dialogues.isTranslatable') }}
            <Switch v-model="dialoguesSetting.isTranslatable" />
          </div>
          <div class="flex flex-row items-center whitespace-nowrap">
            {{ translatable(lang, 'chat.box.dialogues.isEsc') }}
            <Switch v-model="dialoguesSetting.isEsc" />
          </div>
          <div class="flex flex-row items-center whitespace-nowrap">
            {{ translatable(lang, 'chat.box.dialogues.isPause') }}
            <Switch v-model="dialoguesSetting.isPause" />
          </div>
          <div class="flex flex-row items-center whitespace-nowrap">
            {{ translatable(lang, 'chat.box.dialogues.isHistoricalSkip') }}
            <Switch v-model="dialoguesSetting.isHistoricalSkip" />
          </div>
          <div class="flex flex-row items-center whitespace-nowrap">
            {{ translatable(lang, 'chat.box.dialogues.maxTriggerCount') }}
            <Input class="mr-2" v-model="dialoguesSetting.maxTriggerCount" defaultModel="search" />
          </div>
          <div class="flex flex-row items-center whitespace-nowrap">
            {{ translatable(lang, 'chat.box.dialogues.criteria') }}
            <Button
              is-toggle-color
              :rounded-size="0"
              @click="goto('https://misode.github.io/advancement/')"
            >
              {{ translatable(lang, 'chat.box.dialogues.criteria.button') }}
            </Button>
          </div>
        </div>
      </div>
    </template>
  </Modal>

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
</style>
