<script setup>
import GlobalDialog from '@/views/other/chatBox/components/GlobalModal.vue'
import { useDrop } from 'vue3-dnd'
import DragNode from '@/views/other/chatBox/abandoned/DragNode.vue'
import Switch from '@/components/Switch.vue'
import Popover from '@/components/Popover.vue'
import { generateUUID } from '@/utils/format.js'
import { translatable, translatableArg } from '@/assets/translatable/translatable.js'
import { useChatBoxEditorStore, usePageStore } from '@/stores/index.js'
import Modal from '@/components/Modal.vue'
import Input from '@/components/Input.vue'
import { useMessage } from '@/components/register/useMessage.js'

const message = useMessage()
const chatBoxEditorStore = useChatBoxEditorStore()
const lang = computed(() => usePageStore().setting.language)
const dialoguesSetting = computed(() => chatBoxEditorStore.dialoguesSetting)
const EMPTY_DIALOGUES = ref({
  dialogBox: {},
  portrait: [],
  options: [],
  sound: '',
  volume: 1,
  pitch: 1,
  command: ''
})
const hideSourceOnDrag = ref(false)
const isShowSetting = ref(false)
const isShowAddDialogNode = ref(false)
//记录当前打开的是谁的属性
const key = ref(null)
const index = ref(null)

const getDialoguesById = (id, func) => {
  for (const [key, value] of Object.entries(dialoguesSetting.value.dialogues)) {
    for (let i = 0; i < value.length; i++) {
      let item = value[i]
      if (item.id === id) {
        func(key, i, item)
        return
      }
    }
  }
}

const openDialoguesSetting = id => {
  getDialoguesById(id, (k, i, item) => {
    key.value = k
    index.value = i
  })
}

const move = (id, left, top) => {
  getDialoguesById(id, (key, i, item) => {
    const newDialogues = JSON.parse(JSON.stringify(dialoguesSetting.value.dialogues))
    Object.assign(newDialogues[key][i], { left, top })
    chatBoxEditorStore.dialoguesSetting.dialogues = newDialogues
  })
}

const [, drop] = useDrop(() => ({
  accept: 'box',
  drop(item, monitor) {
    const delta = monitor.getDifferenceFromInitialOffset()
    const left = Math.round(item.left + delta.x)
    const top = Math.round(item.top + delta.y)
    move(item.id, left, top)
    return undefined
  }
}))

const group = ref('')
const addDialogNode = () => {
  if (group.value === '') {
    message.warning(translatable(lang.value, 'message.warn.dialogues.group'))
    return
  }
  if (dialoguesSetting.value.dialogues[group.value] === undefined) dialoguesSetting.value.dialogues[group.value] = []
  dialoguesSetting.value.dialogues[group.value].push(Object.assign({
    id: generateUUID(),
    top: 30,
    left: 30,
    title: translatableArg(lang.value, 'chat.box.dialogues.custom.title', dialoguesSetting.value.dialogues[group.value].length)
  }, EMPTY_DIALOGUES))
  isShowAddDialogNode.value = false
  console.log(dialoguesSetting.value.dialogues)
}

const closeDialogNode = id => {
  getDialoguesById(id, (key, i, item) => dialoguesSetting.value.dialogues[key].splice(i, 1))
}

const goto = url =>{
  window.open(url, '_blank')
}
</script>

<template>
  <div class="flex flex-col size-full dark:text-white p-5">
    <div class="mb-5 flex flex-row w-full">
      <div class="flex-1">
        <GlobalDialog />
      </div>
      <div class="flex-1 flex justify-end items-center gap-3">
        <Button is-toggle-color :rounded-size="0" @click="isShowAddDialogNode=true">
          {{ translatable(lang, 'chat.box.dialogues.add.dialogNode') }}
        </Button>
        <Popover class="w-[60px]" trigger="hover">
          <template #trigger>
            <Switch v-model="hideSourceOnDrag" />
          </template>
          <div class="dark:bg-dark-blue p-2">
            {{ translatable(lang, 'chat.box.dialogues.drag.visible') }}
          </div>
        </Popover>
        <Button is-toggle-color :rounded-size="0" @click="()=>isShowSetting=true">
          {{ translatable(lang, 'chat.box.dialogues.common.setting') }}
        </Button>
      </div>
    </div>
    <div
      class="flex flex-row w-full h-[calc(100vh-165px)] max-h-[calc(100vh-165px)]">
      <!--拖拽界面-->
      <div :ref="drop" class="border flex-[4] overflow-auto relative">
        <div v-for="(value,key) in dialoguesSetting.dialogues" :key="key">
          <DragNode v-for="node in value"
                    :key="node"
                    :id="node.id"
                    :left="node.left"
                    :top="node.top"
                    :hide-source-on-drag="hideSourceOnDrag"
                    @click="openDialoguesSetting(node.id)"
                    @onClose="closeDialogNode(node.id)">
            {{ node.title }}
          </DragNode>
        </div>
      </div>
      <!--编辑界面-->
      <div class="border flex-1 overflow-auto">
        <div v-if="key !== null && index !== null" class="flex flex-col gap-3">
          <div class="flex flex-row items-center whitespace-nowrap">
            {{ translatable(lang, 'chat.box.dialogues.introduce') }}
            <Input
              class="mr-2"
              v-model="chatBoxEditorStore.dialoguesSetting[key][index].dialogBox.name"
              defaultModel="search"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!--新增对话节点-->
  <Modal :title="translatable(lang,'chat.box.dialogues.add.dialogNode')" :show="isShowAddDialogNode"
         :defaultCloseEvent="['onClose', 'onNegativeClick']"
         @defaultClose="arg=>isShowAddDialogNode=false" @onPositiveClick="addDialogNode"
         :sm-width="30">
    <template #content>
      <div class="center w-full h-[200px] dark:text-white">
        <div class="flex flex-row items-center whitespace-nowrap">
          {{ translatable(lang, 'chat.box.dialogues.group') }}
          <Input
            class="mr-2"
            v-model="group"
            defaultModel="search"
          />
        </div>
      </div>
    </template>
  </Modal>
  <!--对话框基础配置-->
  <Modal :title="translatable(lang,'chat.box.dialogues.common.setting')" :show="isShowSetting"
         :positive-visible="false" :negative-visible="false" @onClose="args => isShowSetting=false">
    <template #content>
      <div class="flex flex-col justify-center w-full dark:text-white">
        <div class="flex flex-col gap-3">
          <div class="flex flex-row items-center whitespace-nowrap">
            {{ translatable(lang, 'chat.box.dialogues.introduce') }}
            <Input
              class="mr-2"
              v-model="dialoguesSetting.$introduce"
              defaultModel="search"
            />
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
            <Input
              class="mr-2"
              v-model="dialoguesSetting.maxTriggerCount"
              defaultModel="search"
            />
          </div>
          <div class="flex flex-row items-center whitespace-nowrap">
            {{ translatable(lang, 'chat.box.dialogues.criteria') }}
            <Button is-toggle-color :rounded-size="0" @click="goto('https://misode.github.io/advancement/')">
              {{ translatable(lang, 'chat.box.dialogues.criteria.button') }}
            </Button>
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>
