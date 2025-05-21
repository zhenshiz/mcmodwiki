<script setup>
import MilkDownEditor from '@/components/milkdown/Editor.vue'
import { MilkdownProvider } from '@milkdown/vue'
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/vue'
import { useEditTopicStore, usePageStore } from '@/stores/index.js'
import ModeToggle from '@/components/milkdown/ModeToggle.vue'
import { Icon } from '@iconify/vue'
import Button from '@/components/Button.vue'
import { useMessage } from '@/components/register/useMessage.js'
import { useRouter } from 'vue-router'
import { useDialog } from '@/components/register/useDialog.js'
import { gsap } from 'gsap'
import { fullScreen } from '@/utils/web.js'
import Input from '@/components/Input.vue'

const router = useRouter()
const message = useMessage()
const dialog = useDialog()
const editorHeight = 350
const editTopicStore = useEditTopicStore()
const form = computed(() => editTopicStore.getTopicInfo())
const textarea = ref()
const isDark = computed(() => usePageStore().isDark)

const saveMarkdown = (markdown) => {
  editTopicStore.setTopicInfo({
    content: markdown,
    autosaveCount: editTopicStore.autosaveCount + 1
  })
}

const autoResizeTextarea = () => {
  if (textarea.value) {
    textarea.value.style.height = 'auto'
    textarea.value.style.height = `${textarea.value.scrollHeight}px`
  }
}

const handleInputCodeMarkdown = (event) => {
  const target = event.target

  autoResizeTextarea()
  saveMarkdown(target.value)
}

//发布话题
const downloadMd = async () => {
  dialog.warning({
    title: '发布话题',
    content: '请确定是否要发布话题',
    onPositiveClick: async () => {
      editTopicStore.resetTopicInfo()
      await router.push('/')
    }
  })
}

const updateMode = arg => {
  editTopicStore.setTopicInfo({
    mode: arg
  })
}

onMounted(() => autoResizeTextarea())

const edit = ref()
const isFullScreen = ref(false)
const scaleAnimation = (target) => {
  let tl = gsap.timeline()
  //先变大再恢复
  if (isFullScreen.value) {
    tl.to(target, { scale: 1.1, duration: 0.3 })
    tl.to(target, { scale: 1, duration: 0.3 })
  } else {
    //先变小再恢复
    tl.to(target, { scale: 0.9, duration: 0.3 })
    tl.to(target, { scale: 1, duration: 0.3 })
  }
}

const screenSmall = () => {
  document.exitFullscreen()
}

const screenBig = () => {
  fullScreen(edit.value.$el)
}

document.addEventListener('fullscreenchange', event => {
  isFullScreen.value = !!document.fullscreenElement
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', () => {
    isFullScreen.value = !!document.fullscreenElement
  })
})

watch(
  () => form.value.mode,
  async () => {
    await nextTick()

    if (form.value.mode === 'code') {
      autoResizeTextarea()
    }
  }
)
</script>

<template>
  <div class="flex justify-center">
    <div ref="edit"
         class="rounded dark:bg-dark-blue shadow mt-5 min-h-[720px] min-w-full sm:min-w-[1290px] w-[65%] h-[75%] flex flex-col relative text-base">
      <!--富文本编辑器-->
      <MilkdownProvider v-if="form.mode==='preview'">
        <ProsemirrorAdapterProvider>
          <MilkDownEditor @update:valueMarkdown="saveMarkdown" :editor-height="editorHeight"
                          :value-markdown="form.content" :mode="form.mode" @update:mode="updateMode"
                          class="dark:text-white" />
        </ProsemirrorAdapterProvider>
      </MilkdownProvider>

      <div v-if="form.mode==='code'" class="relative w-full min-h-[530px]">
        <div
          class="sticky top-0 w-full flex flex-wrap justify-start h-[43px] bg-[#edfaff] dark:bg-[#051e2f]">
          <ModeToggle :mode="form.mode" @update:mode="updateMode" />
        </div>
        <textarea class="p-5 w-full bg-transparent focus:outline-none dark:text-white resize-none"
                  ref="textarea"
                  :value="form.content" type="text" maxlength="100000"
                  :style="{minHeight: editorHeight+'px'}"
                  @input="handleInputCodeMarkdown($event)" autofocus />
      </div>

      <div class="flex flex-row items-center justify-between mt-5">
        <div class="flex flex-row ml-3 items-center dark:text-white h-10 w-full sm:w-1/3">
          <Input></Input>
          <Input></Input>
          <Input></Input>
        </div>
        <div class="button-theme-cursor-blue w-[30px] h-[30px] hover:text-text-blue center shadow"
             @mouseenter="scaleAnimation($event.target)">
          <Icon v-if="isFullScreen" @click="screenSmall" class="icon dark:text-white"
                width="20" height="20"
                icon="streamline:interface-arrows-shrink-1-expand-retract-shrink-bigger-big-small-smaller" />
          <Icon v-else @click="screenBig" class="icon dark:text-white"
                width="20" height="20"
                icon="streamline:interface-arrows-expand-1-expand-small-bigger-retract-smaller-big" />
        </div>
        <Button class="w-48 h-10 text-lg mr-2 center"
                @click="downloadMd"
                :color="isDark?'#66cffc':'#0071d5'" :background="isDark?'#000':'#fff'"
                is-toggle-color>
          生成Markdown文件
        </Button>
      </div>
    </div>
  </div>
</template>
