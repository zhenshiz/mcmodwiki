<script setup>
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useChatBoxEditorStore } from '@/stores'
// 引入主题相关类
import { Attachment, DialogBox, FunctionButton, KeyPrompt, Option, Portrait } from '@/assets/more/chatbox/chatboxTheme.js'
// 引入对话相关类
import { ChatBoxDialogues, DialogueDialogBox, DialogueFrame, DialogueOption, DialoguePortrait, DialogueVideo } from '@/assets/more/chatbox/chatboxDialogues.js'
import { useDialog } from '@/components/register/useDialog.js'
import { usePrompt } from '@/components/register/usePrompt.js'
import { useMessage } from '@/components/register/useMessage.js'

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
  component.hidden = !component.hidden
}

const togglePortraitExpand = (key) => {
  portraitExpanded.value[key] = !portraitExpanded.value[key]
}

const addPortrait = (e) => {
  e.stopPropagation()
  prompt.openInput({
    title: '新建立绘',
    message: '请输入新立绘的 ID (Key):',
    defaultValue: 'new_portrait',
    onPositiveClick: (key) => {
      if (key && model.value) {
        if (model.value.portrait[key]) {
          message.warning('该 ID 已存在！')
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
    title: '删除立绘',
    content: `确定要删除立绘 "${key}" 吗？`,
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
    title: '删除按钮',
    content: `确定删除该按钮吗？`,
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
    title: '删除渲染附件',
    content: `确定要删除该附件吗？`,
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

const selectDialoguesItem = (component, clazz, key) => {
  store.selectDialoguesComponent(component, clazz, key)
}

const addDialogueGroup = (e) => {
  e?.stopPropagation()
  prompt.openInput({
    title: '新建剧情片段',
    message: '请输入唯一的组 ID (例如: chapter_1):',
    onPositiveClick: (key) => {
      if (!key) return
      if (model.value.dialogues[key]) {
        message.error('该组名已存在')
        return
      }
      model.value.dialogues[key] = []
    }
  })
}

const deleteDialogueGroup = (e, key) => {
  e?.stopPropagation()
  dialog.warning({
    title: '删除剧情片段',
    content: `确定要删除组 "${key}" 及其所有内容吗？`,
    onPositiveClick: () => {
      delete model.value.dialogues[key]
    }
  })
}

// 跳转到组 (切换到全局视图)
const jumpToGroup = (key) => {
  selectDialoguesItem(model.value, ChatBoxDialogues, 'Global')
}
</script>

<template>
  <div class="flex flex-col h-full bg-[#002033]">
    <div
      class="px-3 py-1 text-xs font-bold uppercase bg-[#001529] text-slate-400 border-b border-slate-700 h-[30px] flex items-center shrink-0 justify-between">
      <span>Hierarchy</span>
      <span v-if="store.viewMode !== 'empty'" class="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-500">
        {{ store.viewMode === 'theme' ? 'THEME' : 'DIALOGUE' }}
      </span>
    </div>

    <div v-if="store.viewMode === 'theme' && model" class="flex-1 overflow-y-auto p-1 custom-scrollbar text-slate-300">

      <div class="mb-1">
        <div
          class="text-[10px] font-bold text-blue-400 px-2 py-1 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 rounded"
          @click="isComponentsOpen = !isComponentsOpen">
          <div class="flex items-center gap-1">
            <Icon :icon="isComponentsOpen ? 'lucide:chevron-down' : 'lucide:chevron-right'" width="12" />
            <span>核心组件 (Core)</span>
          </div>
        </div>

        <div v-show="isComponentsOpen" class="flex flex-col gap-0.5 mt-0.5">
          <div
            class="group pl-5 pr-2 py-1 text-xs cursor-pointer rounded border border-transparent flex items-center justify-between transition-colors"
            :class="store.selectedComponent === model.dialogBox ? 'bg-[#007fd4] text-white' : 'hover:bg-[#002941] hover:border-blue-500/30 text-slate-300'"
            @click="selectItem(model.dialogBox, DialogBox, '@dialog')">
            <div class="flex items-center gap-2">
              <Icon icon="lucide:message-square" width="12" class="opacity-70" />
              <span>对话框 (DialogBox)</span>
            </div>
            <Icon :icon="model.dialogBox.hidden ? 'lucide:eye-off' : 'lucide:eye'" width="12"
              class="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity"
              :class="{ 'opacity-100 text-slate-500': model.dialogBox.hidden }"
              @click="toggleVisibility($event, model.dialogBox)" />
          </div>
          <div
            class="group pl-5 pr-2 py-1 text-xs cursor-pointer rounded border border-transparent flex items-center justify-between transition-colors"
            :class="store.selectedComponent === model.option ? 'bg-[#007fd4] text-white' : 'hover:bg-[#002941] hover:border-blue-500/30 text-slate-300'"
            @click="selectItem(model.option, Option, '@option')">
            <div class="flex items-center gap-2">
              <Icon icon="lucide:list" width="12" class="opacity-70" />
              <span>选项样式 (Option)</span>
            </div>
            <Icon :icon="model.option.hidden ? 'lucide:eye-off' : 'lucide:eye'" width="12"
              class="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity"
              :class="{ 'opacity-100 text-slate-500': model.option.hidden }"
              @click="toggleVisibility($event, model.option)" />
          </div>
          <div
            class="group pl-5 pr-2 py-1 text-xs cursor-pointer rounded border border-transparent flex items-center justify-between transition-colors"
            :class="store.selectedComponent === model.keyPrompt ? 'bg-[#007fd4] text-white' : 'hover:bg-[#002941] hover:border-blue-500/30 text-slate-300'"
            @click="selectItem(model.keyPrompt, KeyPrompt, '@keyPrompt')">
            <div class="flex items-center gap-2">
              <Icon icon="lucide:keyboard" width="12" class="opacity-70" />
              <span>按键提示 (KeyPrompt)</span>
            </div>
            <Icon :icon="!model.keyPrompt.visible ? 'lucide:eye-off' : 'lucide:eye'" width="12"
              class="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity"
              :class="{ 'opacity-100 text-slate-500': !model.keyPrompt.visible }"
              @click.stop="model.keyPrompt.visible = !model.keyPrompt.visible" />
          </div>
        </div>
      </div>

      <div class="mb-1 border-t border-slate-800 pt-1">
        <div
          class="text-[10px] font-bold text-yellow-500 px-2 py-1 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 rounded group/header"
          @click="isPortraitsOpen = !isPortraitsOpen">
          <div class="flex items-center gap-1">
            <Icon :icon="isPortraitsOpen ? 'lucide:chevron-down' : 'lucide:chevron-right'" width="12" />
            <span>立绘组 (Portraits)</span>
            <span class="text-slate-600 font-normal ml-1">{{ Object.keys(model.portrait || {}).length }}</span>
          </div>
          <div
            class="p-0.5 rounded hover:bg-slate-600 text-slate-400 hover:text-white opacity-0 group-hover/header:opacity-100 transition-opacity"
            @click="addPortrait">
            <Icon icon="lucide:plus" width="12" />
          </div>
        </div>

        <div v-show="isPortraitsOpen" class="flex flex-col gap-0.5 mt-0.5">
          <div v-for="(portrait, key) in model.portrait" :key="key">
            <div
              class="group pl-5 pr-2 py-1 text-xs cursor-pointer rounded border border-transparent flex items-center justify-between transition-colors"
              :class="store.selectedComponent === portrait ? 'bg-[#007fd4] text-white' : 'hover:bg-[#002941] hover:border-blue-500/30 text-slate-300'"
              @click="selectItem(portrait, Portrait, key)">
              <div class="flex items-center gap-2 overflow-hidden">
                <div class="w-3 h-3 flex items-center justify-center hover:bg-white/20 rounded cursor-pointer"
                  @click.stop="togglePortraitExpand(key)">
                  <Icon v-if="portrait.attachment && portrait.attachment.length > 0"
                    :icon="portraitExpanded[key] ? 'lucide:chevron-down' : 'lucide:chevron-right'" width="10" />
                </div>
                <Icon icon="lucide:user" width="12" class="opacity-70 shrink-0" />
                <span class="truncate">{{ key }}</span>
              </div>

              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon icon="lucide:play" width="12" class="hover:text-green-400 text-slate-500 mr-1" title="播放动画"
                  @click="playAnimation($event, key)" />
                <Icon icon="lucide:paperclip" width="12" class="hover:text-green-400 text-slate-500 mr-1" title="添加附件"
                  @click="addAttachment($event, portrait, key)" />
                <Icon :icon="portrait.hidden ? 'lucide:eye-off' : 'lucide:eye'" width="12" class="hover:text-white"
                  @click="toggleVisibility($event, portrait)" />
                <Icon icon="lucide:trash-2" width="12" class="hover:text-red-400 text-slate-500"
                  @click="deletePortrait($event, key)" />
              </div>
            </div>

            <div v-if="portraitExpanded[key] && portrait.attachment"
              class="flex flex-col gap-0.5 mt-0.5 pl-4 border-l border-slate-700/50 ml-4">
              <div v-for="(att, idx) in portrait.attachment" :key="idx"
                class="group pl-4 pr-2 py-0.5 text-[11px] cursor-pointer rounded border border-transparent flex items-center justify-between transition-colors"
                :class="store.selectedComponent === att ? 'bg-[#007fd4] text-white' : 'hover:bg-[#002941] hover:border-blue-500/30 text-slate-400'"
                @click="selectItem(att, Attachment, `${key}_att_${idx}`)">
                <div class="flex items-center gap-2">
                  <Icon icon="lucide:file-image" width="10" class="opacity-70" />
                  <span>Attach #{{ idx + 1 }}</span>
                </div>
                <Icon icon="lucide:trash-2" width="10"
                  class="hover:text-red-400 text-slate-600 opacity-0 group-hover:opacity-100"
                  @click="deleteAttachment($event, portrait, idx)" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-1 border-t border-slate-800 pt-1">
        <div
          class="text-[10px] font-bold text-green-500 px-2 py-1 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 rounded group/header"
          @click="isButtonsOpen = !isButtonsOpen">
          <div class="flex items-center gap-1">
            <Icon :icon="isButtonsOpen ? 'lucide:chevron-down' : 'lucide:chevron-right'" width="12" />
            <span>功能按钮 (Buttons)</span>
            <span class="text-slate-600 font-normal ml-1">{{ (model.functionalButton || []).length }}</span>
          </div>
          <div
            class="p-0.5 rounded hover:bg-slate-600 text-slate-400 hover:text-white opacity-0 group-hover/header:opacity-100 transition-opacity"
            title="添加按钮" @click="addButton">
            <Icon icon="lucide:plus" width="12" />
          </div>
        </div>

        <div v-show="isButtonsOpen" class="flex flex-col gap-0.5 mt-0.5">
          <div v-for="(btn, index) in model.functionalButton" :key="index"
            class="group pl-5 pr-2 py-1 text-xs cursor-pointer rounded border border-transparent flex items-center justify-between transition-colors"
            :class="store.selectedComponent === btn ? 'bg-[#007fd4] text-white' : 'hover:bg-[#002941] hover:border-blue-500/30 text-slate-300'"
            @click="selectItem(btn, FunctionButton, `btn_${index}`)">
            <div class="flex items-center gap-2">
              <Icon icon="lucide:mouse-pointer-2" width="12" class="opacity-70" />
              <span>Button {{ index + 1 }}</span>
              <span class="text-[10px] opacity-50 ml-1">({{ btn.functionType }})</span>
            </div>
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Icon :icon="btn.hidden ? 'lucide:eye-off' : 'lucide:eye'" width="12" class="hover:text-white"
                :class="{ 'opacity-100 text-slate-400': btn.hidden }" @click="toggleVisibility($event, btn)" />
              <Icon icon="lucide:trash-2" width="12" class="hover:text-red-400 text-slate-500"
                @click="deleteButton($event, index)" />
            </div>
          </div>
        </div>
      </div>

    </div>


    <div v-else-if="store.viewMode === 'dialogue' && model"
      class="flex-1 overflow-y-auto p-1 custom-scrollbar text-slate-300">

      <div v-if="!isShowGlobal" class="flex flex-col gap-1">

        <div class="px-2 py-1.5 bg-blue-600/20 border-l-2 border-blue-500 text-blue-100 text-xs font-bold mb-1">
          当前选中: 对话帧
        </div>

        <div
          class="group px-3 py-2 text-xs cursor-pointer rounded border border-transparent flex items-center gap-2 hover:bg-slate-700 transition-colors"
          :class="store.selectedComponentKey === 'basic' || !store.selectedComponentKey ? 'bg-[#007fd4] text-white' : 'text-slate-300'"
          @click="selectDialoguesItem(currentFrame, DialogueFrame, 'basic')">
          <Icon icon="lucide:sliders" width="14" />
          <span>基础配置 (Basic)</span>
        </div>

        <div
          class="group px-3 py-2 text-xs cursor-pointer rounded border border-transparent flex items-center gap-2 hover:bg-slate-700 transition-colors"
          :class="store.selectedComponentKey === 'dialogBox' ? 'bg-[#007fd4] text-white' : 'text-slate-300'"
          @click="selectDialoguesItem(currentFrame.dialogBox, DialogueDialogBox, 'dialogBox')">
          <Icon icon="lucide:message-square" width="14" />
          <span>对话框 (DialogBox)</span>
        </div>

        <div
          class="group px-3 py-2 text-xs cursor-pointer rounded border border-transparent flex items-center justify-between hover:bg-slate-700 transition-colors"
          :class="store.selectedComponentKey === 'option' ? 'bg-[#007fd4] text-white' : 'text-slate-300'"
          @click="selectDialoguesItem(currentFrame.options, DialogueOption, 'option')">
          <div class="flex items-center gap-2">
            <Icon icon="lucide:list" width="14" />
            <span>选项分支 (Options)</span>
          </div>
          <span class="text-[10px] opacity-60 bg-black/20 px-1 rounded">{{ currentFrame.options?.options?.length || 0 }}</span>
        </div>

        <div
          class="group px-3 py-2 text-xs cursor-pointer rounded border border-transparent flex items-center justify-between hover:bg-slate-700 transition-colors"
          :class="store.selectedComponentKey === 'portrait' ? 'bg-[#007fd4] text-white' : 'text-slate-300'"
          @click="selectDialoguesItem(currentFrame.portrait, DialoguePortrait, 'portrait')">
          <div class="flex items-center gap-2">
            <Icon icon="lucide:users" width="14" />
            <span>立绘配置 (Portraits)</span>
          </div>
          <span class="text-[10px] opacity-60 bg-black/20 px-1 rounded">{{ currentFrame.portrait?.portrait?.length || 0 }}</span>
        </div>

        <div
          class="group px-3 py-2 text-xs cursor-pointer rounded border border-transparent flex items-center justify-between hover:bg-slate-700 transition-colors"
          :class="store.selectedComponentKey === 'video' ? 'bg-[#007fd4] text-white' : 'text-slate-300'"
          @click="selectDialoguesItem(currentFrame.video, DialogueVideo, 'video')">
          <div class="flex items-center gap-2">
            <Icon icon="lucide:video" width="14" />
            <span>视频配置 (Video)</span>
          </div>
          <div v-if="currentFrame.video?.path" class="w-1.5 h-1.5 rounded-full bg-green-500"></div>
        </div>

        <div class="border-t border-slate-700 my-2 mx-2"></div>

        <div class="px-3 py-2 text-xs cursor-pointer text-slate-500 hover:text-slate-300 flex items-center gap-2"
          @click="selectDialoguesItem(model, ChatBoxDialogues, 'Global')">
          <Icon icon="lucide:arrow-left" width="12" />
          <span>返回全局配置</span>
        </div>

      </div>

      <div v-else class="flex flex-col gap-1">

        <div class="px-2 py-1.5 bg-purple-600/20 border-l-2 border-purple-500 text-purple-100 text-xs font-bold mb-1">
          当前选中: 全局配置
        </div>

        <div
          class="group px-3 py-2 text-xs cursor-pointer rounded border border-transparent flex items-center gap-2 hover:bg-slate-700 transition-colors"
          :class="store.selectedComponent === model ? 'bg-[#007fd4] text-white' : 'text-slate-300'"
          @click="selectDialoguesItem(model, ChatBoxDialogues, 'Global')">
          <Icon icon="lucide:settings" width="14" />
          <span>全局参数 (Settings)</span>
        </div>

        <div
          class="mt-4 px-2 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase group/header">
          <span>剧情分组 (Groups)</span>
          <Icon icon="lucide:plus" width="12"
            class="cursor-pointer hover:text-white opacity-0 group-hover/header:opacity-100 transition-opacity"
            title="新建分组" @click="addDialogueGroup" />
        </div>

        <div class="pl-2 flex flex-col gap-0.5 mt-1">
          <div v-for="(frames, key) in model.dialogues" :key="key"
            class="group/item flex items-center justify-between px-2 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            @click="jumpToGroup(key)">
            <div class="flex items-center gap-2 truncate">
              <Icon icon="lucide:folder" width="12" />
              <span class="font-mono truncate">{{ key }}</span>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-[10px] opacity-50 group-hover/item:hidden">{{ frames.length }}</span>
              <Icon icon="lucide:trash-2" width="12"
                class="text-slate-600 hover:text-red-400 hidden group-hover/item:block cursor-pointer" title="删除分组"
                @click.stop="deleteDialogueGroup($event, key)" />
            </div>
          </div>

          <div v-if="!model.dialogues || Object.keys(model.dialogues).length === 0"
            class="text-[10px] text-slate-600 pl-2 italic">
            暂无分组
          </div>
        </div>

      </div>

    </div>

    <div v-else class="flex flex-col items-center justify-center h-full text-slate-600 text-xs">
      <div v-if="store.viewMode === 'empty'">请打开文件</div>
      <div v-else>数据加载中...</div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #1e293b;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
</style>