<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useEditTopicStore } from '@/stores/index.js'
import { useMessage } from '@/components/register/useMessage.js'
import { useDialog } from '@/components/register/useDialog.js'
import MarkdownEditor from '@/components/markdown/Editor.vue'
import ModeToggle from '@/components/markdown/ModeToggle.vue'
import Input from '@/components/form/Input.vue'
import MarkDownReadOnly from '@/components/markdown/MarkDownReadOnly.vue'
import Modal from '@/components/Modal.vue'
import Test from '@/assets/test.md?raw'
import { t } from '@/languages'
import { documentFilename, documentMediaSources, exportDocumentPackage, importDocumentPackage } from '@/components/markdown/media/documentMedia.js'

const visible = ref(false)
const message = useMessage()
const dialog = useDialog()
const editTopicStore = useEditTopicStore()
const form = computed(() => editTopicStore.getTopicInfo())
const textarea = ref(null)

const mdEditor = ref(null)
const lastScrollTop = ref(0)
const fileBusy = ref(false)
const hasLocalMedia = computed(() => documentMediaSources(form.value.content).length > 0)
const exportLabel = computed(() => hasLocalMedia.value ? t('导出文档与媒体（ZIP）') : t('生成Markdown文件'))

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

const openMarkdownFilePicker = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.md,.markdown,.zip,text/markdown,text/plain,application/zip'
  input.onchange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      message.warning(t('文件过大（>10MB），可能会导致页面卡顿'))
    }

    fileBusy.value = true
    try {
      const imported = /\.zip$/i.test(file.name)
        ? await importDocumentPackage(file)
        : { filename: file.name.replace(/\.(?:markdown|md)$/i, ''), content: await file.text() }
      editTopicStore.setTopicInfo({ ...imported, mode: 'preview' })
      lastScrollTop.value = 0
      message.success(t('已导入文档'))
    } catch (cause) { message.error(t(cause.message)) }
    finally { fileBusy.value = false }
  }
  input.click()
}

const importMd = () => {
  if (form.value.content && String(form.value.content).trim().length > 0) {
    dialog.warning({
      title: t('导入文档（MD / ZIP）'),
      content: t('导入会覆盖当前编辑器内容，是否继续？'),
      onPositiveClick: () => openMarkdownFilePicker()
    })
    return
  }

  openMarkdownFilePicker()
}

const downloadMd = async () => {
  dialog.warning({
    title: exportLabel.value,
    content: hasLocalMedia.value ? t('文档将与本地视频和封面一起导出为 ZIP，导出后可继续编辑。') : t('请确定是否要生成Markdown文件'),
    onPositiveClick: async () => {
      const filename = documentFilename(form.value.filename)
      if (!filename) {
        message.warning(t('生成文件需要的信息缺失，请检查你的文件名是否提供'))
        return
      }
      fileBusy.value = true
      try {
        const packaged = hasLocalMedia.value
        const blob = packaged ? await exportDocumentPackage(form.value.content, filename)
          : new Blob([form.value.content], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${filename}.${packaged ? 'zip' : 'md'}`
        document.body.appendChild(a)
        a.click()
        a.remove()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
        message.success(t('已成功生成文件'))
        if (!packaged) editTopicStore.resetTopicInfo()
      } catch (cause) { message.error(t(cause.message)) }
      finally { fileBusy.value = false }
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
  <div class="flex min-w-0 flex-row">
    <aside class="w-[300px] hidden xl:block p-8 shrink-0">
      <div
        class="editor-toc-scroll sticky top-10 max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain pr-3 scrollbar-thin scrollbar-thumb-gray-400/50 scrollbar-track-transparent"
      >
        <div class="text-[10px] font-bold text-ui-muted uppercase tracking-widest mb-6">
          {{ t('目录') }}
        </div>
        <ul class="space-y-1 relative border-l dark:border-ui-line">
          <li v-for="h in mdEditor?.headings" :key="h.id" :style="{ paddingLeft: `${(h.level - 1) * 0.75}rem` }"
            class="transition-all duration-300" :class="{
              'is-active': h.isActive && !h.isScrolledOver,
              'is-scrolled-over': h.isScrolledOver
            }">
            <a href="javascript:" @click="mdEditor.scrollToHeading(h.id)"
              class="block py-1.5 text-xs border-l-2 -ml-[2px] pl-4 transition-colors" :class="(h.isActive && !h.isScrolledOver)
                ? 'text-ui-link border-ui-link font-bold'
                : 'text-ui-muted border-transparent hover:text-ui-text dark:hover:text-ui-text'">
              {{ h.textContent }}
            </a>
          </li>
        </ul>
      </div>
    </aside>
    <div class="flex min-w-0 flex-1 justify-center px-3 sm:px-5">
      <div
        class="mc-panel bg-ui-surface my-3 sm:my-5 w-full max-w-[1290px] min-w-0 flex flex-col relative text-base"
        :class="form.mode === 'code' ? 'h-[720px] overflow-hidden' : 'min-h-[720px]'">
        <MarkdownEditor ref="mdEditor" v-if="form.mode === 'preview'" @update:valueMarkdown="saveMarkdown"
          :value-markdown="form.content" :mode="form.mode" @update:mode="updateMode" class="dark:text-ui-text" />
        <div v-if="form.mode === 'code'" class="flex flex-col flex-1 w-full overflow-hidden">
          <div
            class="sticky top-0 z-20 flex flex-wrap justify-start h-[43px] bg-ui-inset dark:bg-ui-surface border-b dark:border-ui-line">
            <ModeToggle :mode="form.mode" @update:mode="updateMode" />
          </div>

          <textarea ref="textarea" class="p-5 w-full flex-1 bg-transparent focus:outline-none dark:text-ui-text resize-none leading-relaxed font-mono
                 scrollbar-thin scrollbar-thumb-gray-400/50 scrollbar-track-transparent" :value="form.content"
            @input="handleInputCodeMarkdown" @scroll="handleScroll" autofocus />
        </div>

        <div class="flex flex-col gap-3 px-3 my-5 lg:flex-row lg:items-center lg:justify-between">
          <div class="center min-w-0 flex-row gap-3 h-full lg:max-w-sm">
            <Input v-model:modelValue="form.filename" :placeholder="t('请输入文件名')"
                   defaultModel="search"
              @update:modelValue="newValue => editTopicStore.setTopicInfo({ filename: newValue })" />
          </div>
          <div class="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:flex lg:items-center lg:justify-end">
            <Button class="w-full lg:w-48 h-10 text-sm sm:text-base lg:text-lg center" @click="() => visible = true" is-toggle-color>
              {{ t('功能展示') }}
            </Button>
            <Button class="w-full lg:w-48 h-10 text-sm sm:text-base lg:text-lg center" variant="primary" :disabled="fileBusy" @click="downloadMd" is-toggle-color>
              {{ exportLabel }}
            </Button>
            <Button class="w-full lg:w-48 h-10 text-sm sm:text-base lg:text-lg center" :disabled="fileBusy" @click="importMd" is-toggle-color>
              {{ t('导入文档（MD / ZIP）') }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Modal v-model:show="visible" width="60%">
    <div class="center flex-col size-full">
      <MarkDownReadOnly :content="Test" />
    </div>
  </Modal>
</template>
