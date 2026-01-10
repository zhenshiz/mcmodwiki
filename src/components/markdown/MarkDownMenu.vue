<script setup>
import Popover from '@/components/Popover.vue'
import { Icon } from '@iconify/vue'
import MarkDownEmoji from '@/components/markdown/Emoji.vue'
import { useMessage } from '@/components/register/useMessage.js'
import { translatable } from '@/assets/translatable/translatable.js'
import { usePageStore } from '@/stores/index.js'
import Modal from '@/components/Modal.vue'
import { createEnum } from '@/utils/format.js'
import Select from '@/components/Select.vue'
import InputNumber from '@/components/InputNumber.vue'
import FormItem from '@/components/FormItem.vue'
import ModeToggle from '@/components/markdown/ModeToggle.vue'

const message = useMessage()
const lang = computed(() => usePageStore().setting.language)
const props = defineProps({
  editor: {
    required: true
  },
  isPersistence: {
    type: Boolean,
    default: true
  },
  mode: String
})
const isShowInsertLink = ref(false)
const isShowUploadPic = ref(false)
const isShowTable = ref(false)
const isShowVideo = ref(false)
const url = ref({
  href: '',
  text: ''
})
const picUrl = ref('')
const tableModal = ref({
  row: 0,
  col: 0
})
const video = ref({
  type: 'BiliBili',
  url: '',
  height: 480,
  width: 640
})
const videoLabel = computed(() => {
  switch (video.value.type) {
    case 'BiliBili':
      return 'BV'
    case 'YouTube':
      return 'markdown.input.video.url'
  }
})
const emit = defineEmits(['update:mode', 'toggle-fullscreen'])

// 全屏状态响应式变量
const isFullscreen = ref(false)

// 切换全屏函数
const handleFullscreenToggle = () => {
  emit('toggle-fullscreen')
}

// 监听浏览器原生全屏事件，防止用户按 Esc 导致状态不同步
const checkFullscreen = () => {
  isFullscreen.value = !!document.fullscreenElement
}

const videoType = createEnum([
  { label: 'BiliBili', value: 'BiliBili' },
  { label: 'YouTube', value: 'YouTube' }
])

const insertUrl = () => {
  if (url.value.href === '') {
    message.warning(translatable(lang.value, 'message.warn.url.empty'))
    return
  }
  isShowInsertLink.value = false
  const { href, text } = url.value
  props.editor.chain().focus()
    .insertContent({
      type: 'text',
      marks: [
        {
          type: 'link',
          attrs: {
            href: href,
            target: '_blank'
          }
        }
      ],
      text: text ?? url
    })
    .run()
  url.value = { href: '', text: '' }
}

const uploadUrlPic = () => {
  if (picUrl.value === '') {
    message.warning(translatable(lang.value, 'message.warn.url.empty'))
    return
  }
  isShowUploadPic.value = false
  props.editor.chain().focus().setImage({ src: picUrl.value }).run()
}

const insertTable = () => {
  isShowTable.value = false
  props.editor.chain()
    .focus()
    .insertTable({ rows: tableModal.value.row, cols: tableModal.value.col, withHeaderRow: true })
    .run()
}

const insertVideo = () => {
  let { url, type, width, height } = video.value
  if (url === '') {
    message.warning(translatable(lang.value, 'message.warn.url.empty'))
    return
  }
  isShowVideo.value = false
  switch (type) {
    case 'BiliBili':
      let finalUrl = url
      const bvMatch = finalUrl.match(/(BV[a-zA-Z0-9]+)/)
      if (bvMatch) {
        finalUrl = `//player.bilibili.com/player.html?bvid=${bvMatch[0]}&page=1&high_quality=1&danmaku=0`
      }
      props.editor.chain().focus().setBiliBili({ src: finalUrl, width, height }).run()
      break
    case 'YouTube':
      props.editor.chain().focus().setYoutubeVideo({
        src: url,
        width, height
      }).run()
      break
  }
  video.value = { type: 'BiliBili', url: '', width: 640, height: 480 }
}

const commandList = ref([
  {
    name: 'headings',
    icon: 'icon-park-outline:title-level',
    lang: '',
    children: [1, 2, 3, 4, 5, 6].map(level => ({
      icon: `codex:h${level}`,
      lang: `markdown.menu.h${level}`,
      click: () => props.editor.chain().focus().toggleHeading({ level }).run(),
      isActive: () => props.editor.isActive('heading', { level })
    }))
  },
  {
    name: 'admonition',
    icon: 'lucide:info',
    lang: '',
    children: [
      { type: 'info', icon: 'material-symbols:info-outline' },
      { type: 'warning', icon: 'material-symbols:warning-outline-rounded' },
      { type: 'important', icon: 'material-symbols:priority-high-rounded' }
    ].map(item => ({
      icon: item.icon,
      lang: `markdown.menu.admonition.${item.type}`,
      click: () => props.editor.chain().focus().setAdmonition({ type: item.type }).run()
    }))
  },
  {
    icon: 'lucide:list-collapse',
    lang: 'markdown.menu.steps',
    click: () => props.editor.chain().focus().setSteps().run()
  },
  {
    icon: 'lucide:list',
    lang: 'markdown.menu.list',
    click: () => props.editor.chain().focus().toggleBulletList().run()
  },
  {
    icon: 'lucide:list-ordered',
    lang: 'markdown.menu.list.ordered',
    click: () => props.editor.chain().focus().toggleOrderedList().run()
  },
  {
    icon: 'lucide:quote',
    lang: 'markdown.menu.quote',
    click: () => props.editor.chain().focus().toggleBlockquote().run()
  },
  {
    icon: 'lucide:minus',
    lang: 'markdown.menu.minus',
    click: () => props.editor.chain().focus().setHorizontalRule().run()
  },
  {
    icon: 'lucide:link', lang: 'markdown.menu.link', click: () => {
      isShowInsertLink.value = true
      picUrl.value = ''
    }
  },
  {
    icon: 'lucide:square-code',
    lang: 'markdown.menu.square.code',
    click: () => props.editor.chain().focus().toggleCodeBlock().run()
  },
  {
    icon: 'lucide:code-xml',
    lang: 'markdown.menu.code.xml',
    click: () => props.editor.chain().focus().toggleCode().run()
  },
  {
    name: 'taskList',
    icon: 'lucide:list-todo',
    lang: 'markdown.menu.task_list',
    click: () => props.editor.chain().focus().toggleTaskList().run()
  },
  {
    icon: 'lucide:image-plus',
    lang: 'markdown.menu.image',
    click: () => isShowUploadPic.value = true
  },
  {
    icon: 'material-symbols:table-outline',
    lang: 'markdown.menu.table.outline',
    click: () => isShowTable.value = true
  },
  {
    icon: 'icon-park-outline:video',
    lang: 'markdown.menu.video',
    click: () => isShowVideo.value = true
  },
  {
    icon: 'material-symbols:schema-outline',
    lang: 'markdown.menu.mermaid',
    click: () => props.editor.chain().focus().setMermaid({
      code: 'graph TD\n  A[开始] --> B{判断}\n  B -- 是 --> C[执行]\n  B -- 否 --> D[结束]',
      hideCode: false
    }).run()
  }
])

onMounted(() => {
  document.addEventListener('fullscreenchange', checkFullscreen)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', checkFullscreen)
})
</script>

<template>
  <div
    class="dark:border dark:border-dark-blue dark:rounded sticky top-0 w-full flex justify-between items-center h-full sm:h-[43px] z-10 bg-[#edfaff] dark:bg-[#051e2f] px-2">
    <div class="flex flex-row flex-wrap">
      <ModeToggle :mode="mode" @update:mode="arg=>emit('update:mode', arg)" />
      <template v-for="item in commandList" :key="item.lang">
        <Popover v-if="item.children" mode="bottom" class="w-[40px] h-[40px]" trigger="hover">
          <template #trigger>
            <Icon class="icon dark:text-white" :icon="item.icon" />
          </template>
          <div
            class="center flex-col p-2 dark:bg-dark-blue shadow-lg rounded border dark:border-slate-700 bg-white">
            <div
              v-for="sub in item.children"
              :key="sub.lang"
              class="flex flex-row items-center justify-between w-full px-3 py-2 cursor-pointer transition-colors dark:text-white hover:bg-blue-50 dark:hover:bg-slate-700 rounded-md"
              @click="sub.click"
            >
              <Icon :icon="sub.icon" width="20" height="20" class="mr-3" />
              <div class="text-sm whitespace-nowrap">{{ translatable(lang, sub.lang) }}</div>
            </div>
          </div>
        </Popover>

        <Popover v-else class="w-[40px] h-[40px]" trigger="hover" mode="bottom"
                 :is-popover-trigger="false">
          <template #trigger>
            <Icon @click="item.click" class="icon dark:text-white" :icon="item.icon" />
          </template>
          <div class="dark:bg-dark-blue text-text-blue p-1 rounded">{{ translatable(lang, item.lang)
            }}
          </div>
        </Popover>
      </template>

      <Popover class="w-[40px] h-[40px]" trigger="hover" mode="bottom">
        <template #trigger>
          <Icon class="icon dark:text-white" icon="lucide:smile-plus" />
        </template>
        <div class="size-full p-2 rounded dark:bg-dark-blue w-[200px]">
          <MarkDownEmoji :editor="editor" />
        </div>
      </Popover>
    </div>

    <div class="flex items-center">
      <Popover trigger="hover" mode="bottom" :is-popover-trigger="false">
        <template #trigger>
          <Icon
            @click="handleFullscreenToggle"
            class="icon dark:text-white"
            :icon="isFullscreen ? 'lucide:minimize' : 'lucide:maximize'"
          />
        </template>
        <div class="dark:bg-dark-blue text-text-blue p-1 rounded">
          {{ translatable(lang, isFullscreen ? 'markdown.exit.screen' : 'markdown.full.screen') }}
        </div>
      </Popover>
    </div>
  </div>

  <Modal :show="isShowInsertLink" :title="translatable(lang,'markdown.modal.insert.link.title')"
         :positive-text="translatable(lang,'markdown.modal.insert.link.positive')"
         @default-close="() => isShowInsertLink=false"
         @on-positive-click="insertUrl">
    <template #content>
      <div class="flex-col size-full flex">
        <Input class="my-5" v-model="url.href" default-model="search"
               :placeholder="translatable(lang,'markdown.input.url.href')" />
        <Input v-model="url.text" default-model="search"
               :placeholder="translatable(lang,'markdown.input.url.text')" />
      </div>
    </template>
  </Modal>
  <Modal :show="isShowUploadPic" :title="translatable(lang,'markdown.modal.insert.pic.title')"
         :positive-text="translatable(lang,'markdown.modal.insert.pic.positive')"
         @default-close="() => isShowUploadPic=false" @on-positive-click="uploadUrlPic">
    <template #content>
      <Input class="my-5" v-model="picUrl" default-model="search"
             :placeholder="translatable(lang,'markdown.input.pic.url')" />
    </template>
  </Modal>
  <Modal :show="isShowTable" :title="translatable(lang,'markdown.modal.insert.table.title')"
         :positive-text="translatable(lang,'markdown.modal.insert.table.positive')"
         @default-close="() => isShowTable=false" @on-positive-click="insertTable">
    <template #content>
      <div class="flex flex-row dark:text-white text-xl items-center">
        <Input class="mr-5" v-model="tableModal.row" default-model="search"
               :placeholder="translatable(lang,'markdown.input.table.row')" />
        {{ translatable(lang, 'markdown.modal.row') }}
        <Input class="m-5" v-model="tableModal.col" default-model="search"
               :placeholder="translatable(lang,'markdown.input.table.col')" />
        {{ translatable(lang, 'markdown.modal.col') }}
      </div>
    </template>
  </Modal>
  <Modal :show="isShowVideo" :title="translatable(lang,'markdown.modal.insert.video.title')"
         :positive-text="translatable(lang,'markdown.modal.insert.video.positive')"
         @default-close="() => isShowVideo=false"
         @on-positive-click="insertVideo">
    <template #content>
      <div class="flex-col size-full flex">
        <Select :options="videoType.values(lang)" v-model="video.type" />
        <Input class="my-5" v-model="video.url" default-model="search"
               :placeholder="translatable(lang,videoLabel)" />
        <FormItem class="mb-5" :label="translatable(lang,'markdown.input.video.width')">
          <InputNumber :min="0" v-model="video.width" />
        </FormItem>
        <FormItem :label="translatable(lang,'markdown.input.video.height')">
          <InputNumber :min="0" v-model="video.height" />
        </FormItem>
      </div>
    </template>
  </Modal>
</template>

<style lang="scss" scoped>
.icon {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 5px;
  border-radius: 5px;
  margin: 5px;
  font-size: 22px;
  background-color: transparent;
  border: 1px solid transparent;
  width: 35px;
  height: 35px;

  &:hover {
    border: 1px solid #00c0f5;
    color: #00c0f5;
  }
}

.file {
  display: none;
}
</style>
