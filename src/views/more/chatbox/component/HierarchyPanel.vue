<script setup>
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useChatBoxEditorStore } from '@/stores'
// 引入主题相关类
import {
  Attachment,
  DialogBox,
  FunctionButton,
  KeyPrompt,
  Option,
  Portrait
} from '@/assets/more/chatbox/chatboxTheme.js'
// 引入对话相关类
import {
  ChatBoxDialogues,
  DialogueDialogBox,
  DialogueFrame,
  DialogueOption,
  DialoguePortrait,
  DialogueVideo
} from '@/assets/more/chatbox/chatboxDialogues.js'
import { useDialog } from '@/components/register/useDialog.js'
import { usePrompt } from '@/components/register/usePrompt.js'
import { useMessage } from '@/components/register/useMessage.js'
import { t } from '@/languages/index.js'

const store = useChatBoxEditorStore()
const model = computed(() => store.currentModel)
const dialog = useDialog()
const prompt = usePrompt()
const message = useMessage()

// ==========================================
// 1. 主题编辑器逻辑 (Theme Mode)
// ==========================================
const isPortraitsOpen = ref(true)
const isComponentsOpen = ref(true)
const isButtonsOpen = ref(true)
const portraitExpanded = ref({})

const selectItem = (component, clazz, key) => {
  store.selectComponent(component, clazz, key)
}

const toggleVisibility = (e, component) => {
  e.stopPropagation()
  component._hidden = !component._hidden
}

const togglePortraitExpand = (key) => {
  portraitExpanded.value[key] = !portraitExpanded.value[key]
}

const addPortrait = (e) => {
  e.stopPropagation()
  prompt.openInput({
    title: t('新建立绘'),
    message: t('请输入新立绘的 ID (Key):'),
    defaultValue: 'new_portrait',
    onPositiveClick: (key) => {
      if (key && model.value) {
        if (model.value.portrait[key]) {
          message.warning(t('该 ID 已存在！'))
          return
        }
        model.value.portrait[key] = new Portrait()
      }
    }
  })
}

const deletePortrait = (e, key) => {
  e.stopPropagation()
  dialog.warning({
    title: t('删除立绘'),
    content: t('确定要删除立绘 "{}" 吗？', key),
    onPositiveClick: () => {
      delete model.value.portrait[key]
      if (store.selectedComponentKey === key) store.clearSelection()
    }
  })
}

const addButton = (e) => {
  e.stopPropagation()
  if (model.value) {
    if (!model.value.functionalButton) model.value.functionalButton = []
    model.value.functionalButton.push(new FunctionButton())
  }
}

const deleteButton = (e, index) => {
  e.stopPropagation()
  dialog.warning({
    title: t('删除按钮'),
    content: t('确定删除该按钮吗？'),
    onPositiveClick: () => {
      model.value.functionalButton.splice(index, 1)
      store.clearSelection()
    }
  })
}

const addAttachment = (e, portrait, key) => {
  e.stopPropagation()
  if (!portrait.attachment) portrait.attachment = []
  portrait.attachment.push(new Attachment())
  portraitExpanded.value[key] = true
}

const deleteAttachment = (e, portrait, index) => {
  e.stopPropagation()
  dialog.warning({
    title: t('删除渲染附件'),
    content: t('确定要删除该附件吗？'),
    onPositiveClick: () => {
      const target = portrait.attachment[index]
      if (store.selectedComponent === target) store.clearSelection()
      portrait.attachment.splice(index, 1)
    }
  })
}

const playAnimation = (e, key) => {
  e.stopPropagation()
  store.triggerAnimation(key)
}

// ==========================================
// 2. 对话编辑器逻辑 (Dialogue Mode)
// ==========================================

const currentFrame = computed(() => store.currentFrame)
const isShowGlobal = computed(() => store.isShowGlobal)
const dialogueGroupList = computed(() => {
  const dialogues = model.value?.dialogues || {}
  return store.dialogueGroupOrder
    .filter(key => dialogues[key])
    .map(key => ({ key, frames: dialogues[key] }))
})

const selectDialoguesItem = (component, clazz, key, ownerFrame = null) => {
  store.selectDialoguesComponent(component, clazz, key, ownerFrame)
}

const addDialogueGroup = (e) => {
  e?.stopPropagation()
  prompt.openInput({
    title: t('新建剧情片段'),
    message: t('请输入唯一的组 ID (例如: chapter_1):'),
    onPositiveClick: (key) => {
      if (!key) return
      if (model.value.dialogues[key]) {
        message.error(t('该组名已存在'))
        return
      }
      model.value.dialogues[key] = []
      store.addDialogueGroupKey(key)
    }
  })
}

const deleteDialogueGroup = (e, key) => {
  e?.stopPropagation()
  dialog.warning({
    title: t('删除剧情片段'),
    content: t('确定要删除组 "{}" 及其所有内容吗？', key),
    onPositiveClick: () => {
      store.deleteDialogueGroup(key)
    }
  })
}

const renameDialogueGroup = (e, oldKey) => {
  e?.stopPropagation()
  prompt.openInput({
    title: t('重命名 Key'),
    message: t('请输入唯一的组 ID (例如: chapter_1):'),
    defaultValue: oldKey,
    onPositiveClick: (newKey) => {
      const result = store.renameDialogueGroup(oldKey, newKey)
      if (!result.ok) {
        if (result.reason === 'duplicate') {
          message.error(t('该组名已存在'))
        }
      }
    }
  })
}

// 跳转到组 (切换到全局视图)
const jumpToGroup = (key) => {
  store.activeDialogueGroupKey = key
  store.dialogueGraphGroupKey = key
  selectDialoguesItem(model.value, ChatBoxDialogues, 'Global')
}
</script>

<template>
  <div class="flex flex-col h-full bg-ui-surface">
    <div
      class="px-3 py-1 text-xs font-bold uppercase bg-ui-bg text-ui-muted border-b border-ui-line h-[30px] flex items-center shrink-0 justify-between">
      <span>Hierarchy</span>
      <span v-if="store.viewMode !== 'empty'" class="text-[10px] px-1.5 py-0.5 rounded-none bg-ui-inset/50 text-ui-muted">
        {{ store.viewMode === 'theme' ? 'THEME' : 'DIALOGUE' }}
      </span>
    </div>

    <div v-if="store.viewMode === 'theme' && model" class="flex-1 overflow-y-auto p-1 custom-scrollbar text-ui-text">

      <div class="mb-1">
        <div
          class="text-[10px] font-bold text-ui-link px-2 py-1 flex items-center justify-between cursor-pointer hover:bg-ui-inset/50 rounded-none"
          @click="isComponentsOpen = !isComponentsOpen">
          <div class="flex items-center gap-1">
            <Icon :icon="isComponentsOpen ? 'lucide:chevron-down' : 'lucide:chevron-right'" width="12" />
            <span>{{ t('核心组件') }}</span>
          </div>
        </div>

        <div v-show="isComponentsOpen" class="flex flex-col gap-0.5 mt-0.5">
          <div
            class="group pl-5 pr-2 py-1 text-xs cursor-pointer rounded-none border border-transparent flex items-center justify-between transition-colors"
            :class="store.selectedComponent === model.dialogBox ? 'bg-ui-secondary text-ui-on-accent' : 'hover:bg-ui-inset hover:border-ui-link/30 text-ui-text'"
            @click="selectItem(model.dialogBox, DialogBox, '@dialog')">
            <div class="flex items-center gap-2">
              <Icon icon="lucide:message-square" width="12" class="opacity-70" />
              <span>{{ t('对话框') }}</span>
            </div>
            <Icon :icon="model.dialogBox._hidden ? 'lucide:eye-off' : 'lucide:eye'" width="12"
              class="opacity-0 group-hover:opacity-100 hover:text-ui-text transition-opacity"
              :class="{ 'opacity-100 text-ui-muted': model.dialogBox._hidden }"
              @click="toggleVisibility($event, model.dialogBox)" />
          </div>
          <div
            class="group pl-5 pr-2 py-1 text-xs cursor-pointer rounded-none border border-transparent flex items-center justify-between transition-colors"
            :class="store.selectedComponent === model.option ? 'bg-ui-secondary text-ui-on-accent' : 'hover:bg-ui-inset hover:border-ui-link/30 text-ui-text'"
            @click="selectItem(model.option, Option, '@option')">
            <div class="flex items-center gap-2">
              <Icon icon="lucide:list" width="12" class="opacity-70" />
              <span>{{ t('选项样式') }}</span>
            </div>
            <Icon :icon="model.option._hidden ? 'lucide:eye-off' : 'lucide:eye'" width="12"
              class="opacity-0 group-hover:opacity-100 hover:text-ui-text transition-opacity"
              :class="{ 'opacity-100 text-ui-muted': model.option._hidden }"
              @click="toggleVisibility($event, model.option)" />
          </div>
          <div
            class="group pl-5 pr-2 py-1 text-xs cursor-pointer rounded-none border border-transparent flex items-center justify-between transition-colors"
            :class="store.selectedComponent === model.keyPrompt ? 'bg-ui-secondary text-ui-on-accent' : 'hover:bg-ui-inset hover:border-ui-link/30 text-ui-text'"
            @click="selectItem(model.keyPrompt, KeyPrompt, '@keyPrompt')">
            <div class="flex items-center gap-2">
              <Icon icon="lucide:keyboard" width="12" class="opacity-70" />
              <span>{{ t('按键提示') }}</span>
            </div>
            <Icon :icon="!model.keyPrompt.visible ? 'lucide:eye-off' : 'lucide:eye'" width="12"
              class="opacity-0 group-hover:opacity-100 hover:text-ui-text transition-opacity"
              :class="{ 'opacity-100 text-ui-muted': !model.keyPrompt.visible }"
              @click.stop="model.keyPrompt.visible = !model.keyPrompt.visible" />
          </div>
        </div>
      </div>

      <div class="mb-1 border-t border-ui-line pt-1">
        <div
          class="text-[10px] font-bold text-yellow-500 px-2 py-1 flex items-center justify-between cursor-pointer hover:bg-ui-inset/50 rounded-none group/header"
          @click="isPortraitsOpen = !isPortraitsOpen">
          <div class="flex items-center gap-1">
            <Icon :icon="isPortraitsOpen ? 'lucide:chevron-down' : 'lucide:chevron-right'" width="12" />
            <span>{{ t('立绘组') }}</span>
            <span class="text-ui-muted font-normal ml-1">{{ Object.keys(model.portrait || {}).length }}</span>
          </div>
          <div class="flex items-center gap-1">
          <button v-if="store.canPastePortrait" type="button" :title="t('粘贴立绘')" :aria-label="t('粘贴立绘')" class="p-0.5 hover:bg-ui-inset" @click.stop="store.pastePortrait"><Icon icon="lucide:clipboard-paste" width="13" /></button>
          <div
            class="p-0.5 rounded-none hover:bg-ui-inset text-ui-muted hover:text-ui-text"
            @click="addPortrait">
            <Icon icon="lucide:plus" width="12" />
          </div>
          </div>
        </div>

        <div v-show="isPortraitsOpen" class="flex flex-col gap-0.5 mt-0.5">
          <div v-for="(portrait, key) in model.portrait" :key="key">
            <div
              class="group pl-5 pr-2 py-1 text-xs cursor-pointer rounded-none border border-transparent flex items-center justify-between transition-colors"
              :class="store.selectedComponent === portrait ? 'bg-ui-secondary text-ui-on-accent' : 'hover:bg-ui-inset hover:border-ui-link/30 text-ui-text'"
              tabindex="0" role="button" :aria-label="t('选择立绘：{}', key)"
              @keydown.enter="selectItem(portrait, Portrait, key)"
              @click="selectItem(portrait, Portrait, key); $event.currentTarget.focus({ preventScroll: true })">
              <div class="flex items-center gap-2 overflow-hidden">
                <div class="w-3 h-3 flex items-center justify-center hover:bg-white/20 rounded-none cursor-pointer"
                  @click.stop="togglePortraitExpand(key)">
                  <Icon v-if="portrait.attachment && portrait.attachment.length > 0"
                    :icon="portraitExpanded[key] ? 'lucide:chevron-down' : 'lucide:chevron-right'" width="10" />
                </div>
                <Icon icon="lucide:user" width="12" class="opacity-70 shrink-0" />
                <span class="truncate">{{ key }}</span>
              </div>

              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                <Icon icon="lucide:play" width="12" class="hover:text-green-400 text-ui-muted mr-1"
                  @click="playAnimation($event, key)" />
                <Icon icon="lucide:paperclip" width="12"
                      class="hover:text-green-400 text-ui-muted mr-1"
                  @click="addAttachment($event, portrait, key)" />
                <Icon :icon="portrait._hidden ? 'lucide:eye-off' : 'lucide:eye'" width="12" class="hover:text-ui-text"
                  @click="toggleVisibility($event, portrait)" />
                <button type="button" :title="t('复制立绘')" :aria-label="t('复制立绘')" class="hover:text-ui-link" @click.stop="store.copyPortrait(key)"><Icon icon="lucide:copy" width="12" /></button>
              <Icon icon="lucide:trash-2" width="12" class="hover:text-red-400 text-ui-muted"
                  @click="deletePortrait($event, key)" />
              </div>
            </div>

            <div v-if="portraitExpanded[key] && portrait.attachment"
              class="flex flex-col gap-0.5 mt-0.5 pl-4 border-l border-ui-line/50 ml-4">
              <div v-for="(att, idx) in portrait.attachment" :key="idx"
                class="group pl-4 pr-2 py-0.5 text-[11px] cursor-pointer rounded-none border border-transparent flex items-center justify-between transition-colors"
                :class="store.selectedComponent === att ? 'bg-ui-secondary text-ui-on-accent' : 'hover:bg-ui-inset hover:border-ui-link/30 text-ui-muted'"
                @click="selectItem(att, Attachment, `${key}_att_${idx}`)">
                <div class="flex items-center gap-2">
                  <Icon icon="lucide:file-image" width="10" class="opacity-70" />
                  <span>Attach #{{ idx + 1 }}</span>
                </div>
                <Icon icon="lucide:trash-2" width="10"
                  class="hover:text-red-400 text-ui-muted opacity-0 group-hover:opacity-100"
                  @click="deleteAttachment($event, portrait, idx)" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-1 border-t border-ui-line pt-1">
        <div
          class="text-[10px] font-bold text-green-500 px-2 py-1 flex items-center justify-between cursor-pointer hover:bg-ui-inset/50 rounded-none group/header"
          @click="isButtonsOpen = !isButtonsOpen">
          <div class="flex items-center gap-1">
            <Icon :icon="isButtonsOpen ? 'lucide:chevron-down' : 'lucide:chevron-right'" width="12" />
            <span>{{ t('功能按钮') }}</span>
            <span class="text-ui-muted font-normal ml-1">{{ (model.functionalButton || []).length }}</span>
          </div>
          <div
            class="p-0.5 rounded-none hover:bg-ui-inset text-ui-muted hover:text-ui-text opacity-0 group-hover/header:opacity-100 transition-opacity"
            @click="addButton">
            <Icon icon="lucide:plus" width="12" />
          </div>
        </div>

        <div v-show="isButtonsOpen" class="flex flex-col gap-0.5 mt-0.5">
          <div v-for="(btn, index) in model.functionalButton" :key="index"
            class="group pl-5 pr-2 py-1 text-xs cursor-pointer rounded-none border border-transparent flex items-center justify-between transition-colors"
            :class="store.selectedComponent === btn ? 'bg-ui-secondary text-ui-on-accent' : 'hover:bg-ui-inset hover:border-ui-link/30 text-ui-text'"
            @click="selectItem(btn, FunctionButton, `btn_${index}`)">
            <div class="flex items-center gap-2">
              <Icon icon="lucide:mouse-pointer-2" width="12" class="opacity-70" />
              <span>Button {{ index + 1 }}</span>
              <span class="text-[10px] opacity-50 ml-1">({{ btn.functionType }})</span>
            </div>
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Icon :icon="btn._hidden ? 'lucide:eye-off' : 'lucide:eye'" width="12" class="hover:text-ui-text"
                :class="{ 'opacity-100 text-ui-muted': btn._hidden }" @click="toggleVisibility($event, btn)" />
              <Icon icon="lucide:trash-2" width="12" class="hover:text-red-400 text-ui-muted"
                @click="deleteButton($event, index)" />
            </div>
          </div>
        </div>
      </div>

    </div>


    <div v-else-if="store.viewMode === 'dialogue' && model"
      class="flex-1 overflow-y-auto p-1 custom-scrollbar text-ui-text">

      <div v-if="!isShowGlobal" class="flex flex-col gap-1">

        <div class="px-2 py-1.5 bg-ui-secondary/20 border-l-2 border-ui-link text-ui-link text-xs font-bold mb-1">
          {{ t('当前选中: 对话帧') }}
        </div>

        <div
          class="group px-3 py-2 text-xs cursor-pointer rounded-none border border-transparent flex items-center gap-2 hover:bg-ui-inset transition-colors"
          :class="store.selectedComponentKey === 'basic' || !store.selectedComponentKey ? 'bg-ui-secondary text-ui-on-accent' : 'text-ui-text'"
          @click="selectDialoguesItem(currentFrame, DialogueFrame, 'basic', currentFrame)">
          <Icon icon="lucide:sliders" width="14" />
          <span>{{ t('基础配置') }}</span>
        </div>

        <div
          class="group px-3 py-2 text-xs cursor-pointer rounded-none border border-transparent flex items-center gap-2 hover:bg-ui-inset transition-colors"
          :class="store.selectedComponentKey === 'dialogBox' ? 'bg-ui-secondary text-ui-on-accent' : 'text-ui-text'"
          @click="selectDialoguesItem(currentFrame.dialogBox, DialogueDialogBox, 'dialogBox', currentFrame)">
          <Icon icon="lucide:message-square" width="14" />
          <span>{{ t('对话框') }}</span>
        </div>

        <div
          class="group px-3 py-2 text-xs cursor-pointer rounded-none border border-transparent flex items-center justify-between hover:bg-ui-inset transition-colors"
          :class="store.selectedComponentKey === 'option' ? 'bg-ui-secondary text-ui-on-accent' : 'text-ui-text'"
          @click="selectDialoguesItem(currentFrame.options, DialogueOption, 'option', currentFrame)">
          <div class="flex items-center gap-2">
            <Icon icon="lucide:list" width="14" />
            <span>{{ t('选项分支') }}</span>
          </div>
          <span class="text-[10px] opacity-60 bg-black/20 px-1 rounded-none">{{ currentFrame.options?.options?.length || 0 }}</span>
        </div>

        <div
          class="group px-3 py-2 text-xs cursor-pointer rounded-none border border-transparent flex items-center justify-between hover:bg-ui-inset transition-colors"
          :class="store.selectedComponentKey === 'portrait' ? 'bg-ui-secondary text-ui-on-accent' : 'text-ui-text'"
          @click="selectDialoguesItem(currentFrame.portrait, DialoguePortrait, 'portrait', currentFrame)">
          <div class="flex items-center gap-2">
            <Icon icon="lucide:users" width="14" />
            <span>{{ t('立绘配置') }}</span>
          </div>
          <span class="text-[10px] opacity-60 bg-black/20 px-1 rounded-none">{{ currentFrame.portrait?.portrait?.length || 0 }}</span>
        </div>

        <div
          class="group px-3 py-2 text-xs cursor-pointer rounded-none border border-transparent flex items-center justify-between hover:bg-ui-inset transition-colors"
          :class="store.selectedComponentKey === 'video' ? 'bg-ui-secondary text-ui-on-accent' : 'text-ui-text'"
          @click="selectDialoguesItem(currentFrame.video, DialogueVideo, 'video', currentFrame)">
          <div class="flex items-center gap-2">
            <Icon icon="lucide:video" width="14" />
            <span>{{ t('视频配置') }}</span>
          </div>
          <div v-if="currentFrame.video?.path" class="w-1.5 h-1.5 rounded-none bg-green-500"></div>
        </div>

        <div class="border-t border-ui-line my-2 mx-2"></div>

        <div class="px-3 py-2 text-xs cursor-pointer text-ui-muted hover:text-ui-text flex items-center gap-2"
          @click="selectDialoguesItem(model, ChatBoxDialogues, 'Global')">
          <Icon icon="lucide:arrow-left" width="12" />
          <span>{{ t('返回全局配置') }}</span>
        </div>

      </div>

      <div v-else class="flex flex-col gap-1">

        <div class="px-2 py-1.5 bg-purple-600/20 border-l-2 border-purple-500 text-purple-100 text-xs font-bold mb-1">
          {{ t('当前选中: 全局配置') }}
        </div>

        <div
          class="group px-3 py-2 text-xs cursor-pointer rounded-none border border-transparent flex items-center gap-2 hover:bg-ui-inset transition-colors"
          :class="store.selectedComponent === model ? 'bg-ui-secondary text-ui-on-accent' : 'text-ui-text'"
          @click="selectDialoguesItem(model, ChatBoxDialogues, 'Global')">
          <Icon icon="lucide:settings" width="14" />
          <span>{{ t('全局参数') }}</span>
        </div>

        <div
          class="mt-4 px-2 flex items-center justify-between text-[10px] font-bold text-ui-muted uppercase group/header">
          <span>{{ t('剧情分组') }}</span>
          <Icon icon="lucide:plus" width="12"
                class="cursor-pointer hover:text-ui-text opacity-0 group-hover/header:opacity-100 transition-opacity"
                @click="addDialogueGroup" />
        </div>

        <div class="pl-2 flex flex-col gap-0.5 mt-1">
          <div v-for="group in dialogueGroupList" :key="group.key"
            class="group/item flex items-center justify-between px-2 py-1.5 text-xs text-ui-muted hover:text-ui-text hover:bg-ui-inset rounded-none transition-colors"
            @click="jumpToGroup(group.key)">
            <div class="flex items-center gap-2 truncate">
              <Icon icon="lucide:folder" width="12" />
              <span class="font-mono truncate">{{ group.key }}</span>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-[10px] opacity-50 group-hover/item:hidden">{{ group.frames.length }}</span>
              <Icon icon="lucide:pencil" width="12"
                    class="text-ui-muted hover:text-ui-link hidden group-hover/item:block cursor-pointer"
                @click.stop="renameDialogueGroup($event, group.key)" />
              <Icon icon="lucide:trash-2" width="12"
                    class="text-ui-muted hover:text-red-400 hidden group-hover/item:block cursor-pointer"
                @click.stop="deleteDialogueGroup($event, group.key)" />
            </div>
          </div>

          <div v-if="dialogueGroupList.length === 0"
            class="text-[10px] text-ui-muted pl-2 italic">
            {{ t('暂无分组') }}
          </div>
        </div>

      </div>

    </div>

    <div v-else class="flex flex-col items-center justify-center h-full text-ui-muted text-xs">
      <div v-if="store.viewMode === 'empty'">{{ t('请打开文件') }}</div>
      <div v-else>{{ t('数据加载中...') }}</div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgb(var(--ui-line));
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
</style>
