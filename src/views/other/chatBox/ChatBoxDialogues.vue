<script setup>
import GlobalDialog from '@/views/other/chatBox/components/GlobalModal.vue'
import { Icon } from '@iconify/vue'
import { translatable } from '@/assets/translatable/translatable.js'
import { useChatBoxEditorStore, usePageStore } from '@/stores/index.js'
import Button from '@/components/Button.vue'
import { computed, ref, watch } from 'vue'
import { useDialog } from '@/components/register/useDialog'
import draggable from 'vuedraggable'
import FileJsonHandler from '@/components/FileJsonHandler.vue'
import ShowJsonCopy from '@/views/other/chatBox/components/ShowJsonCopy.vue'
import { usePrompt } from '@/components/register/usePrompt.js'
import ObjectGeneratorDialog from '@/components/ObjectGeneratorDialog.vue'
import { dialoguesSetting } from '@/assets/more/chatBox/defaultInfo.js'
import ObjectGenerator from '@/components/ObjectGenerator.vue'

const dialog = useDialog()
const prompt = usePrompt()
const chatBoxEditorStore = useChatBoxEditorStore()
const lang = computed(() => usePageStore().setting.language)
const ds = computed(() => chatBoxEditorStore.dialoguesSetting)
const dialogues = dialoguesSetting(lang.value)
//记录当前打开的是谁的属性
const dialogGroup = ref(null)
const dialogIndex = ref(null)
const isShowEdit = ref(false)
const expandedGroups = ref({})

const addGroup = () => {
  prompt.open({
    title: translatable(lang.value, 'chat.box.dialogues.add.group'),
    onPositiveClick: (value) => {
      chatBoxEditorStore.dialoguesSetting.dialogues[value] = []
    }
  })
}

const removeGroup = (groupName) => {
  dialog.warning({
    title: translatable(lang.value, 'dialog.warning'),
    content: translatable(lang.value, 'dialog.warn.chatbox.dialogues.delete.groupName'),
    onPositiveClick: () => {
      if (groupName === dialogGroup.value) isShowEdit.value = false
      const currentDialogues = JSON.parse(JSON.stringify(ds.value.dialogues)) || {}

      const newDialogues = Object.fromEntries(
        Object.entries(currentDialogues).filter(([key]) => key !== groupName)
      )

      chatBoxEditorStore.dialoguesSetting = ({
        ...ds.value,
        dialogues: newDialogues
      })
    }
  })
}

// 将对象转换为数组以便拖拽
const dialoguesArray = ref([])

watch(
  () => ds.value.dialogues,
  (dialogues) => {
    if (!dialogues) return
    dialoguesArray.value = Object.entries(dialogues).map(([groupName, list]) => ({
      groupName,
      dialogues: [...list]
    }))
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
  chatBoxEditorStore.dialoguesSetting = {
    ...ds.value,
    dialogues: newDialogues,
  }
}

const toggleGroup = (groupName) => {
  expandedGroups.value[groupName] = !expandedGroups.value[groupName]
}

const addDialogue = (groupName) => {
  ds.value.dialogues[groupName].push(dialogues.dialogues.getDefault())
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
      ds.value.dialogues[groupName].splice(index, 1)
    },
  })
}


const openDialoguesSetting = (groupName, index) => {
  dialogGroup.value = groupName
  dialogIndex.value = index
  isShowEdit.value = true
}
</script>

<template>
  <div class="flex flex-col size-full dark:text-white p-5">
    <div class="mb-5 flex flex-row w-full items-center">
      <div class="flex-1">
        <GlobalDialog />
      </div>
      <div class="flex-1 flex justify-end items-center gap-3">
        <!-- 拖拽上传区域 -->
        <FileJsonHandler class="h-[50px]" key="dialoguesFile"
                         v-model="chatBoxEditorStore.dialoguesSetting" />
        <ShowJsonCopy :value="chatBoxEditorStore.dialoguesSetting" />
        <Button is-toggle-color :rounded-size="0" @click="addGroup">
          {{ translatable(lang, 'chat.box.dialogues.add.group') }}
        </Button>
        <ObjectGeneratorDialog
          :title="translatable(lang, 'chat.box.dialogues.common.setting')"
          :button-text="translatable(lang, 'chat.box.dialogues.common.setting')"
          :properties="dialogues.dialogBasicConfiguration"
          v-model="chatBoxEditorStore.dialoguesSetting" />
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
                            (dialog.dialogBox?.name === '' || dialog.dialogBox?.name === undefined)
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
                            (dialog.dialogBox?.text === '' || dialog.dialogBox?.text === undefined)
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
            <ObjectGenerator :properties="dialogues.dialogues"
                             v-model="chatBoxEditorStore.dialoguesSetting.dialogues[dialogGroup][dialogIndex]" />
            <div class="flex justify-start w-4/5">
              <ObjectGeneratorDialog :properties="dialogues.videoComponent"
                                     :title="translatable(lang, 'chat.box.dialogues.video.basic')"
                                     v-model="chatBoxEditorStore.dialoguesSetting.dialogues[dialogGroup][dialogIndex].video" />
            </div>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
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
