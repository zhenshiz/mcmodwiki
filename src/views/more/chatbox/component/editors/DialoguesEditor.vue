<script setup>
import { computed, ref, watch } from 'vue'
import { useChatBoxEditorStore } from '@/stores'
import { Icon } from '@iconify/vue'
import { usePrompt } from '@/components/register/usePrompt.js'
import { useMessage } from '@/components/register/useMessage.js'
import { ChatBoxDialogues, DialogueDialogBox, DialogueFrame, DialogueOption, DialoguePortrait, DialogueVideo } from '@/assets/more/chatbox/chatboxDialogues.js'
import { useDialog } from '@/components/register/useDialog'

const store = useChatBoxEditorStore()
const prompt = usePrompt()
const message = useMessage()
const dialog = useDialog()

// 当前正在查看的组 Key
const activeGroupKey = ref(null)

// 模型数据的快捷访问
const model = computed(() => store.currentModel)
const dialoguesMap = computed(() => model.value?.dialogues || {})

// 获取当前组的所有帧
const currentFrames = computed(() => {
  if (!activeGroupKey.value || !dialoguesMap.value[activeGroupKey.value]) return []
  return dialoguesMap.value[activeGroupKey.value]
})

// === 左侧：组操作 ===
const handleAddGroup = () => {
  prompt.openInput({
    title: '新建剧情片段 (Group)',
    message: '请输入唯一的组 ID (例如: chapter_1_start)',
    onPositiveClick: (val) => {
      if (!val) return
      if (dialoguesMap.value[val]) {
        message.error('该组名已存在')
        return
      }
      model.value.dialogues[val] = []
      activeGroupKey.value = val
    }
  })
}

const handleDeleteGroup = (key) => {
  dialog.warning({
    title: '删除剧情片段',
    content: `确定要删除剧情片段 "${key}" 吗？此操作无法撤销。`,
    onPositiveClick: () => {
      delete model.value.dialogues[key]
      if (activeGroupKey.value === key) {
        activeGroupKey.value = null
      }
    }
  })
}

const selectGroup = (key) => {
  activeGroupKey.value = key
  store.selectDialoguesComponent(model.value, ChatBoxDialogues, 'Global Settings')
}

// === 右侧：帧操作 ===
const handleAddFrame = () => {
  if (!activeGroupKey.value) return
  const newFrame = new DialogueFrame()
  model.value.dialogues[activeGroupKey.value].push(newFrame)
}

const handleDeleteFrame = (index) => {
  model.value.dialogues[activeGroupKey.value].splice(index, 1)
  store.selectComponent(null)
}

const handleMoveFrame = (index, direction) => {
  const list = model.value.dialogues[activeGroupKey.value]
  const targetIndex = index + direction
  if (targetIndex < 0 || targetIndex >= list.length) return

  const temp = list[index]
  list[index] = list[targetIndex]
  list[targetIndex] = temp
}

const selectFramePart = (frame, clazz, part) => {
  store.selectDialoguesComponent(frame, clazz, part)
}

// 点击整个卡片默认选中基础信息
const selectFrame = (frame) => {
  selectFramePart(frame, DialogueFrame, 'basic')
}

// 点击背景，选中全局
const selectGlobal = () => {
  store.selectDialoguesComponent(model.value, ChatBoxDialogues, 'Global Settings')
}

// 自动选中第一个组
watch(() => model.value, (newVal) => {
  if (newVal && newVal.dialogues && Object.keys(newVal.dialogues).length > 0 && !activeGroupKey.value) {
    activeGroupKey.value = Object.keys(newVal.dialogues)[0]
  }
}, { immediate: true })

const isSelected = (comp) => store.selectedComponent === comp

</script>

<template>
  <div class="flex w-full h-full bg-[#1e1e1e] text-slate-300 overflow-hidden" @click.self="selectGlobal" @mousedown.stop
    @wheel.stop>

    <div class="w-64 flex flex-col border-r border-slate-700 bg-[#001529] shrink-0">
      <div class="h-10 flex items-center justify-between px-3 border-b border-slate-700 bg-[#002033]">
        <span class="text-xs font-bold text-slate-400 uppercase">剧情片段 (Groups)</span>
        <button class="p-1 hover:bg-blue-600 rounded text-slate-400 hover:text-white transition"
          @click.stop="handleAddGroup" title="新建组">
          <Icon icon="lucide:plus" width="14" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-2 space-y-1">
        <template v-if="model && model.dialogues">
          <div v-for="(frames, key) in model.dialogues" :key="key"
            class="group flex items-center justify-between px-3 py-2 rounded cursor-pointer text-xs transition-colors border border-transparent"
            :class="activeGroupKey === key ? 'bg-blue-600/20 border-blue-500 text-blue-100' : 'hover:bg-slate-700/50'"
            @click.stop="selectGroup(key)">
            <div class="flex items-center gap-2 overflow-hidden">
              <Icon icon="lucide:folder" class="shrink-0 opacity-70"
                :class="activeGroupKey === key ? 'text-blue-400' : ''" />
              <span class="truncate font-mono">{{ key }}</span>
              <span class="text-[10px] opacity-50 ml-1">({{ frames.length }})</span>
            </div>

            <button class="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition"
              @click.stop="handleDeleteGroup(key)">
              <Icon icon="lucide:trash-2" width="12" />
            </button>
          </div>
        </template>

        <div v-if="!model || Object.keys(model.dialogues).length === 0" class="text-center py-8 text-slate-600 text-xs">
          暂无剧情片段<br>点击右上角 + 添加
        </div>
      </div>
    </div>

    <div class="flex-1 flex flex-col min-w-0 bg-[#000d1a]" @click.self="selectGlobal">
      <div class="h-10 flex items-center justify-between px-4 border-b border-slate-700 bg-[#001529]/50"
        @click.self="selectGlobal">
        <div class="flex items-center gap-2">
          <Icon icon="lucide:message-square-quote" class="text-slate-500" />
          <span class="text-sm font-bold text-slate-200">
            {{ activeGroupKey || '未选择组' }}
          </span>
        </div>

        <button v-if="activeGroupKey"
          class="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs transition shadow-sm"
          @click.stop="handleAddFrame">
          <Icon icon="lucide:plus" width="12" />
          <span>添加对话</span>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-3" @click.self="selectGlobal">

        <template v-if="activeGroupKey && currentFrames.length > 0">
          <div v-for="(frame, index) in currentFrames" :key="index"
            class="relative flex gap-3 p-3 rounded-lg border transition-all cursor-pointer group"
            :class="isSelected(frame) ? 'bg-[#1e1e1e] border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'bg-[#151515] border-slate-700 hover:border-slate-600'"
            @click.stop="selectFrame(frame)">
            <div class="flex flex-col items-center gap-1 w-6 shrink-0 pt-1">
              <span class="text-[10px] font-mono text-slate-500">#{{ index }}</span>
              <div class="opacity-0 group-hover:opacity-100 flex flex-col gap-1 transition-opacity">
                <button class="p-0.5 hover:text-blue-400 text-slate-500" @click.stop="handleMoveFrame(index, -1)"
                  title="上移">
                  <Icon icon="lucide:chevron-up" width="14" />
                </button>
                <button class="p-0.5 hover:text-blue-400 text-slate-500" @click.stop="handleMoveFrame(index, 1)"
                  title="下移">
                  <Icon icon="lucide:chevron-down" width="14" />
                </button>
              </div>
            </div>

            <div class="flex-1 min-w-0 flex flex-col gap-2">

              <div
                class="p-2 rounded bg-[#252525] border border-slate-700 hover:border-blue-500/50 hover:bg-[#2a2a2a] transition-colors group/box">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-[10px] font-bold text-blue-400">
                    {{ store.getTranslatableLabel(frame.dialogBox?.name) || '未知角色' }}
                  </span>
                </div>
                <div class="text-xs text-slate-300 font-mono line-clamp-2 leading-relaxed">
                  {{ store.getTranslatableLabel(frame.dialogBox?.text) || '( 空对话内容 )' }}
                </div>
              </div>
            </div>

            <button
              class="absolute top-2 right-2 p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded transition opacity-0 group-hover:opacity-100"
              @click.stop="handleDeleteFrame(index)">
              <Icon icon="lucide:x" width="14" />
            </button>
          </div>
        </template>

        <div v-else-if="activeGroupKey" class="flex flex-col items-center justify-center h-64 text-slate-600 gap-3">
          <Icon icon="lucide:message-square-plus" width="32" class="opacity-50" />
          <div class="text-xs">此片段暂无对话</div>
          <button @click="handleAddFrame" class="text-blue-500 hover:underline text-xs">立即添加</button>
        </div>

        <div v-else class="flex flex-col items-center justify-center h-full text-slate-600 gap-2">
          <Icon icon="lucide:arrow-left" width="24" class="animate-pulse" />
          <span class="text-xs">请先在左侧选择或新建一个剧情片段</span>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>
