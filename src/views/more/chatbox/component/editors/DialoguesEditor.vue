<script setup>
import { computed, watch } from 'vue'
import { useChatBoxEditorStore } from '@/stores'
import { Icon } from '@iconify/vue'
import { usePrompt } from '@/components/register/usePrompt.js'
import { useMessage } from '@/components/register/useMessage.js'
import {
  ChatBoxDialogues,
  DialogueDialogBox,
  DialogueFrame,
  DialogueOption,
  DialoguePortrait,
  DialogueVideo
} from '@/assets/more/chatbox/chatboxDialogues.js'
import { useDialog } from '@/components/register/useDialog'
import draggable from 'vuedraggable'
import _ from 'lodash'
import { t } from '@/languages/index.js'

const store = useChatBoxEditorStore()
const prompt = usePrompt()
const message = useMessage()
const dialog = useDialog()

// 当前正在查看的组 Key
const activeGroupKey = computed({
  get: () => store.activeDialogueGroupKey,
  set: (value) => {
    store.activeDialogueGroupKey = value
  }
})

// 模型数据的快捷访问
const model = computed(() => store.currentModel)
const dialoguesMap = computed(() => model.value?.dialogues || {})

const createFrameEditorId = () => {
  return globalThis.crypto?.randomUUID?.()
    || `dialogue-frame-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

const ensureFrameEditorId = (frame) => {
  if (!frame._editorId) {
    frame._editorId = createFrameEditorId()
  }
  return frame
}

const cloneFrameForInsert = (frame) => {
  const cloned = _.cloneDeep(frame)
  cloned._editorId = createFrameEditorId()
  return cloned
}

const FRAME_PART_SELECTOR_MAP = {
  basic: (frame) => ({ component: frame, clazz: DialogueFrame }),
  dialogBox: (frame) => ({ component: frame.dialogBox, clazz: DialogueDialogBox }),
  option: (frame) => ({ component: frame.options, clazz: DialogueOption }),
  portrait: (frame) => ({ component: frame.portrait, clazz: DialoguePortrait }),
  video: (frame) => ({ component: frame.video, clazz: DialogueVideo })
}

// === 核心逻辑：组列表拖拽适配 ===
const groupList = computed({
  get: () => {
    return store.dialogueGroupOrder
      .filter(key => dialoguesMap.value[key])
      .map(key => ({ key, frames: dialoguesMap.value[key] }))
  },
  set: (newArr) => {
    store.reorderDialogueGroupKeys(newArr.map(item => item.key))
  }
})

const frameList = computed({
  get: () => {
    if (!activeGroupKey.value || !dialoguesMap.value[activeGroupKey.value]) return []
    return dialoguesMap.value[activeGroupKey.value].map(ensureFrameEditorId)
  },
  set: (val) => {
    if (activeGroupKey.value && model.value.dialogues) {
      model.value.dialogues[activeGroupKey.value] = val
    }
  }
})

const handleAddGroup = () => {
  prompt.openInput({
    title: t('新建剧情片段 (组)'),
    message: t('请输入唯一的组 ID (例如: chapter_1_start)'),
    onPositiveClick: (val) => {
      if (!val) return
      if (dialoguesMap.value[val]) {
        message.error(t('该组名已存在'))
        return
      }
      model.value.dialogues[val] = []
      store.addDialogueGroupKey(val)
      activeGroupKey.value = val
    }
  })
}

const handleDeleteGroup = (key) => {
  dialog.warning({
    title: t('删除剧情片段'),
    content: t('确定要删除剧情片段 "{}" 吗？此操作无法撤销。', key),
    onPositiveClick: () => {
      store.deleteDialogueGroup(key)
    }
  })
}

const handleRenameGroup = (oldKey) => {
  prompt.openInput({
    title: t('重命名 Key'),
    message: t('请输入唯一的组 ID (例如: chapter_1_start)'),
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

const selectGroup = (key) => {
  activeGroupKey.value = key
  store.selectDialoguesComponent(model.value, ChatBoxDialogues, 'Global Settings')
}

const handleAddFrame = () => {
  if (!activeGroupKey.value) return
  const newFrame = ensureFrameEditorId(new DialogueFrame())
  model.value.dialogues[activeGroupKey.value].push(newFrame)
}

const handleCopyFrame = (index) => {
  const list = model.value.dialogues[activeGroupKey.value]
  const sourceFrame = list[index]
  if (!sourceFrame) return

  store.copyDialogueFrameToClipboard(sourceFrame)
  message.success(t('已复制对话'))
}

const handlePasteFrame = (index = null) => {
  if (!activeGroupKey.value) return

  const clipboardFrame = store.getDialogueFrameFromClipboard()
  if (!clipboardFrame) {
    message.warning(t('剪贴板中没有可粘贴的对话'))
    return
  }

  const list = model.value.dialogues[activeGroupKey.value]
  const insertIndex = typeof index === 'number' ? index + 1 : list.length
  const frameToInsert = cloneFrameForInsert(clipboardFrame)

  list.splice(insertIndex, 0, frameToInsert)
  selectFrame(frameToInsert)
  message.success(t('已粘贴对话'))
}

const handleDeleteFrame = (index) => {
  model.value.dialogues[activeGroupKey.value].splice(index, 1)
  store.clearSelection()
}

const selectFramePart = (frame, part = 'basic') => {
  const targetPart = FRAME_PART_SELECTOR_MAP[part] ? part : 'basic'
  const { component, clazz } = FRAME_PART_SELECTOR_MAP[targetPart](frame)
  store.selectDialoguesComponent(component, clazz, targetPart, frame)
}

const selectFrame = (frame) => {
  selectFramePart(frame, store.lastDialogueFrameSectionKey)
}

// 点击背景，选中全局
const selectGlobal = () => {
  store.selectDialoguesComponent(model.value, ChatBoxDialogues, 'Global Settings')
}

// 自动选中第一个组
watch(() => model.value, (newVal) => {
  if (newVal?.dialogues) {
    Object.values(newVal.dialogues).forEach(frames => frames.forEach(ensureFrameEditorId))
    store.syncDialogueGroupOrder(newVal.dialogues)
  } else {
    store.syncDialogueGroupOrder({})
  }
}, { immediate: true })

watch(
  () => Object.keys(dialoguesMap.value),
  (groupKeys) => {
    store.syncDialogueGroupOrder(dialoguesMap.value)
    if (groupKeys.length === 0) {
      activeGroupKey.value = null
      return
    }
    if (!activeGroupKey.value || !dialoguesMap.value[activeGroupKey.value]) {
      activeGroupKey.value = groupKeys[0]
    }
  },
  { immediate: true }
)

const isSelected = (comp) => store.selectedComponent === comp

</script>

<template>
  <div class="flex w-full h-full bg-[#1e1e1e] text-slate-300 overflow-hidden"
       @click.self="selectGlobal" @mousedown.stop
       @wheel.stop>

    <div class="w-64 flex flex-col border-r border-slate-700 bg-[#001529] shrink-0">
      <div
        class="h-10 flex items-center justify-between px-3 border-b border-slate-700 bg-[#002033]">
        <span class="text-xs font-bold text-slate-400 uppercase">{{ t('剧情片段(组)') }}</span>
        <button class="p-1 hover:bg-blue-600 rounded text-slate-400 hover:text-white transition"
                @click.stop="handleAddGroup">
          <Icon icon="lucide:plus" width="14" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-2">
        <draggable
          v-model="groupList"
          item-key="key"
          handle=".group-drag-handle"
          animation="200"
          ghost-class="ghost"
          class="space-y-1"
        >
          <template #item="{ element: group }">
            <div
              class="group flex items-center justify-between px-3 py-2 rounded cursor-pointer text-xs transition-colors border border-transparent"
              :class="activeGroupKey === group.key ? 'bg-blue-600/20 border-blue-500 text-blue-100' : 'hover:bg-slate-700/50'"
              @click.stop="selectGroup(group.key)"
            >
              <div class="flex items-center gap-2 overflow-hidden flex-1">
                <Icon icon="lucide:grip-vertical"
                      class="group-drag-handle shrink-0 opacity-30 hover:opacity-100 cursor-move"
                      width="12" />

                <Icon icon="lucide:folder" class="shrink-0 opacity-70"
                      :class="activeGroupKey === group.key ? 'text-blue-400' : ''" />
                <span class="truncate font-mono">{{ group.key }}</span>
              </div>

              <div class="flex items-center gap-1">
                <span class="text-[10px] opacity-50 ml-1">({{ group.frames.length }})</span>
                <button class="opacity-0 group-hover:opacity-100 p-1 hover:text-blue-400 transition"
                        :title="t('重命名 Key')"
                        @click.stop="handleRenameGroup(group.key)">
                  <Icon icon="lucide:pencil" width="12" />
                </button>
                <button class="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition"
                        @click.stop="handleDeleteGroup(group.key)">
                  <Icon icon="lucide:trash-2" width="12" />
                </button>
              </div>
            </div>
          </template>
        </draggable>

        <div v-if="!model || Object.keys(model.dialogues).length === 0"
             class="text-center py-8 text-slate-600 text-xs">
          {{ t('暂无剧情片段') }}<br>{{ t('点击右上角 + 添加') }}
        </div>
      </div>
    </div>

    <div class="flex-1 flex flex-col min-w-0 bg-[#000d1a]" @click.self="selectGlobal">
      <div
        class="h-10 flex items-center justify-between px-4 border-b border-slate-700 bg-[#001529]/50"
        @click.self="selectGlobal">
        <div class="flex items-center gap-2">
          <Icon icon="lucide:message-square-quote" class="text-slate-500" />
          <span class="text-sm font-bold text-slate-200">
            {{ activeGroupKey || t('未选择组') }}
          </span>
        </div>

        <button v-if="activeGroupKey"
                class="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs transition shadow-sm"
                @click.stop="handleAddFrame">
          <Icon icon="lucide:plus" width="12" />
          <span>{{ t('添加对话') }}</span>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-4" @click.self="selectGlobal">

        <template v-if="activeGroupKey && frameList.length > 0">
          <draggable
            v-model="frameList"
            item-key="_editorId"
            handle=".frame-drag-handle"
            animation="200"
            ghost-class="ghost"
            class="space-y-3"
          >
            <template #item="{ element: frame, index }">
              <div
                class="relative flex gap-3 p-3 rounded-lg border transition-all cursor-pointer group"
                :class="isSelected(frame) ? 'bg-[#1e1e1e] border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'bg-[#151515] border-slate-700 hover:border-slate-600'"
                @click.stop="selectFrame(frame)"
              >
                <div class="flex flex-col items-center gap-1 w-6 shrink-0 pt-1">
                  <span class="text-[10px] font-mono text-slate-500 select-none">#{{ index + 1
                    }}</span>
                  <div
                    class="frame-drag-handle p-1 text-slate-600 hover:text-slate-300 cursor-move">
                    <Icon icon="lucide:grip-horizontal" width="16" />
                  </div>
                </div>

                <div class="flex-1 min-w-0 flex flex-col gap-2">
                  <div
                    class="p-2 rounded bg-[#252525] border border-slate-700 hover:border-blue-500/50 hover:bg-[#2a2a2a] transition-colors group/box">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-[10px] font-bold text-blue-400">
                        {{ store.getTranslatableLabel(frame.dialogBox?.name) || t('未知角色') }}
                      </span>
                    </div>
                    <div
                      class="text-xs text-slate-300 font-mono line-clamp-2 leading-relaxed select-none">
                      {{ store.getTranslatableLabel(frame.dialogBox?.text) || t('( 空对话内容 )') }}
                    </div>
                  </div>
                </div>

                <div
                  class="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    class="p-1.5 text-slate-500 hover:text-white hover:bg-slate-700 rounded transition"
                    :title="t('复制')"
                    @click.stop="handleCopyFrame(index)">
                    <Icon icon="lucide:copy" width="14" />
                  </button>
                  <button
                    class="p-1.5 rounded transition"
                    :class="store.hasDialogueFrameClipboard
                      ? 'text-slate-500 hover:text-white hover:bg-slate-700'
                      : 'text-slate-700 cursor-not-allowed'"
                    :title="t('粘贴')"
                    :disabled="!store.hasDialogueFrameClipboard"
                    @click.stop="handlePasteFrame(index)">
                    <Icon icon="lucide:clipboard-paste" width="14" />
                  </button>
                  <button
                    class="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded transition"
                    @click.stop="handleDeleteFrame(index)">
                    <Icon icon="lucide:trash-2" width="14" />
                  </button>
                </div>
              </div>
            </template>
          </draggable>
        </template>

        <div v-else-if="activeGroupKey"
             class="flex flex-col items-center justify-center h-64 text-slate-600 gap-3">
          <Icon icon="lucide:message-square-plus" width="32" class="opacity-50" />
          <div class="text-xs">{{ t('此片段暂无对话') }}</div>
          <div class="flex items-center gap-3">
            <button @click="handleAddFrame" class="text-blue-500 hover:underline text-xs">
              {{ t('立即添加') }}
            </button>
            <button
              v-if="store.hasDialogueFrameClipboard"
              @click="handlePasteFrame()"
              class="text-emerald-500 hover:underline text-xs">
              {{ t('粘贴') }}
            </button>
          </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center h-full text-slate-600 gap-2">
          <Icon icon="lucide:arrow-left" width="24" class="animate-pulse" />
          <span class="text-xs">{{ t('请先在左侧选择或新建一个剧情片段') }}</span>
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

/* 拖拽时的幽灵样式 */
.ghost {
  opacity: 0.5;
  border: 1px dashed #3b82f6 !important;
  background: #1e3a8a !important;
}
</style>
