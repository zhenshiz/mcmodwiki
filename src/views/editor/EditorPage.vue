<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useEditTopicStore, usePageStore } from '@/stores/index.js'
import { useMessage } from '@/components/register/useMessage.js'
import { useDialog } from '@/components/register/useDialog.js'
import { translatable } from '@/assets/translatable/translatable.js'
import MarkdownEditor from '@/components/markdown/Editor.vue'
import ModeToggle from '@/components/markdown/ModeToggle.vue'
import Input from '@/components/Input.vue'
import MarkDownReadOnly from '@/components/markdown/MarkDownReadOnly.vue'
import Modal from '@/components/Modal.vue'
import Test from '@/assets/test.md?raw'

const visible = ref(false)
const message = useMessage()
const dialog = useDialog()
const editTopicStore = useEditTopicStore()
const form = computed(() => editTopicStore.getTopicInfo())
const textarea = ref(null)
const isDark = computed(() => usePageStore().isDark)
const lang = computed(() => usePageStore().setting.language)

const mdEditor = ref(null)
const lastScrollTop = ref(0)
const language = computed(() => usePageStore().setting.language)

const saveMarkdown = (markdown) => {
  editTopicStore.setTopicInfo({
    content: markdown
  })
}

// 处理滚动事件，实时记录位置
const handleScroll = (event) => {
  lastScrollTop.value = event.target.scrollTop
}

const handleInputCodeMarkdown = (event) => {
  const target = event.target
  // 仅保存数据，不再修改高度 DOM，避免重绘导致视角丢失
  saveMarkdown(target.value)
}

// 下载 MD 逻辑保持不变
const downloadMd = async () => {
  dialog.warning({
    title: translatable(lang.value, 'edit.download.md.dialog.title'),
    content: translatable(lang.value, 'edit.download.md.dialog.content'),
    onPositiveClick: async () => {
      if (form.value.filename === '') {
        message.warning(translatable(lang.value, 'message.warn.download'))
        return
      }
      const blob = new Blob([form.value.content], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${form.value.filename}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      message.success(translatable(lang.value, 'message.success.download'))
      editTopicStore.resetTopicInfo()
    }
  })
}

const updateMode = arg => {
  editTopicStore.setTopicInfo({
    mode: arg
  })
}

// 监听模式切换
watch(
  () => form.value.mode,
  async (newMode) => {
    if (newMode === 'code') {
      await nextTick()
      if (textarea.value) {
        textarea.value.scrollTop = lastScrollTop.value
      }
    }
  }
)
</script>

<template>
  <div class="flex flex-row">
    <aside
      class="w-[300px] hidden xl:block p-8 shrink-0">
      <div class="sticky top-10">
        <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
          {{ translatable(language, 'wiki.sidebar.3') }}
        </div>
        <ul class="space-y-1 relative border-l dark:border-slate-800">
          <li v-for="h in mdEditor?.headings" :key="h.id"
              :style="{ paddingLeft: `${(h.level - 1) * 0.75}rem` }"
              class="transition-all duration-300"
              :class="{
              'is-active': h.isActive && !h.isScrolledOver,
              'is-scrolled-over': h.isScrolledOver
            }"
          >
            <a
              href="javascript:"
              @click="mdEditor.scrollToHeading(h.id)"
              class="block py-1.5 text-xs border-l-2 -ml-[2px] pl-4 transition-colors"
              :class="(h.isActive && !h.isScrolledOver)
              ? 'text-blue-500 border-blue-500 font-bold'
              : 'text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300'"
            >
              {{ h.textContent }}
            </a>
          </li>
        </ul>
      </div>
    </aside>
    <div class="flex justify-center">
      <div
        class="rounded bg-white dark:bg-dark-blue shadow mt-5 mb-5 min-w-full sm:min-w-[1290px] w-[65%] flex flex-col relative text-base"
        :class="form.mode === 'code' ? 'h-[720px] overflow-hidden' : 'min-h-[720px]'"
      >
        <MarkdownEditor
          ref="mdEditor"
          v-if="form.mode === 'preview'"
          @update:valueMarkdown="saveMarkdown"
          :value-markdown="form.content"
          :mode="form.mode"
          @update:mode="updateMode"
          class="dark:text-white"
        />
        <div v-if="form.mode === 'code'" class="flex flex-col flex-1 w-full overflow-hidden">
          <div
            class="sticky top-0 z-20 flex flex-wrap justify-start h-[43px] bg-[#edfaff] dark:bg-[#051e2f] border-b dark:border-slate-800">
            <ModeToggle :mode="form.mode" @update:mode="updateMode" />
          </div>

          <textarea
            ref="textarea"
            class="p-5 w-full flex-1 bg-transparent focus:outline-none dark:text-white resize-none leading-relaxed font-mono
                 scrollbar-thin scrollbar-thumb-gray-400/50 scrollbar-track-transparent"
            :value="form.content"
            @input="handleInputCodeMarkdown"
            @scroll="handleScroll"
            autofocus
          />
        </div>

        <div class="flex flex-row items-center justify-between mt-5 mb-5">
          <div class="ml-2 center flex-row gap-3 h-full ">
            <Input v-model:modelValue="form.filename" placeholder="请输入文件名"
                   defaultModel="search"
                   @update:modelValue="newValue=>editTopicStore.setTopicInfo({filename:newValue})" />
          </div>
          <div class="flex items-center justify-end">
            <Button class="w-48 h-10 text-lg mr-2 center"
                    @click="()=>visible= true"
                    :color="isDark?'#66cffc':'#0071d5'"
                    :background="isDark?'#000':'#fff'" is-toggle-color>
              功能展示
            </Button>
            <Button class="w-48 h-10 text-lg mr-2 center"
                    @click="downloadMd"
                    :color="isDark?'#66cffc':'#0071d5'" :background="isDark?'#000':'#fff'"
                    is-toggle-color>
              {{ translatable(lang, 'edit.button.create.md') }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Modal :show="visible"
         @default-close="() => (visible = false)" :negative-visible="false"
         :positive-visible="false">
    <template #content>
      <div class="center flex-col size-full">
        <MarkDownReadOnly :content="Test" />
      </div>
    </template>
  </Modal>
</template>
