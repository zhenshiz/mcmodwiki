<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Popover from '@/components/Popover.vue'
import { Icon } from '@iconify/vue'
import MarkDownEmoji from '@/components/markdown/Emoji.vue'
import { useMessage } from '@/components/register/useMessage.js'
import Dialog from '@/components/Dialog.vue'
import ModeToggle from '@/components/markdown/ModeToggle.vue'
import { t } from '@/languages'
import { formatUtil } from '@/utils/formatUtil'

const message = useMessage()
const props = defineProps({
  editor: { required: true },
  isPersistence: { type: Boolean, default: true },
  mode: String
})

const emit = defineEmits(['update:mode', 'toggle-fullscreen'])

// --- 状态变量 ---
const isShowInsertLink = ref(false)
const isShowUploadPic = ref(false)
const isShowTable = ref(false)
const isShowVideo = ref(false)
const isFullscreen = ref(false)

const url = ref({ href: '', text: '' })
const picUrl = ref('')
const tableModal = ref({ row: 0, col: 0 })
const video = ref({
  type: 'BiliBili',
  url: '',
  height: 480,
  width: 640
})

// --- 辅助逻辑 ---
const handleFullscreenToggle = () => emit('toggle-fullscreen')
const checkFullscreen = () => isFullscreen.value = !!document.fullscreenElement

const videoType = formatUtil.createEnum([
  { label: 'BiliBili', value: 'BiliBili' },
  { label: 'YouTube', value: 'YouTube' }
])

const videoLabel = computed(() => {
  switch (video.value.type) {
    case 'BiliBili': return 'BV'
    case 'YouTube': return t('视频链接URL') // 直接使用中文
    default: return ''
  }
})

// --- 业务方法 ---

const insertUrl = () => {
  if (url.value.href === '') {
    message.warning(t('链接的URL不能为空'))
    return
  }
  isShowInsertLink.value = false
  const { href, text } = url.value
  props.editor.chain().focus()
    .insertContent({
      type: 'text',
      marks: [{ type: 'link', attrs: { href: href, target: '_blank' } }],
      text: text || href
    })
    .run()
  url.value = { href: '', text: '' }
}

const uploadUrlPic = () => {
  if (picUrl.value === '') {
    message.warning(t('链接的URL不能为空'))
    return
  }
  isShowUploadPic.value = false
  props.editor.chain().focus().setImage({ src: picUrl.value }).run()
}

const insertTable = () => {
  isShowTable.value = false
  props.editor.chain().focus()
    .insertTable({ rows: tableModal.value.row, cols: tableModal.value.col, withHeaderRow: true })
    .run()
}

const insertVideo = () => {
  let { url, type, width, height } = video.value
  if (url === '') {
    message.warning(t('链接的URL不能为空'))
    return
  }
  isShowVideo.value = false

  if (type === 'BiliBili') {
    let finalUrl = url
    const bvMatch = finalUrl.match(/(BV[a-zA-Z0-9]+)/)
    if (bvMatch) {
      finalUrl = `//player.bilibili.com/player.html?bvid=${bvMatch[0]}&page=1&high_quality=1&danmaku=0`
    }
    props.editor.chain().focus().setBiliBili({ src: finalUrl, width, height }).run()
  } else if (type === 'YouTube') {
    props.editor.chain().focus().setYoutubeVideo({ src: url, width, height }).run()
  }
  video.value = { type: 'BiliBili', url: '', width: 640, height: 480 }
}

// --- 菜单配置 (使用 computed 以支持动态切换语言) ---
// 直接填入你提供的中文文案，voerka-i18n 会自动提取
const commandList = computed(() => [
  {
    name: 'headings',
    icon: 'icon-park-outline:title-level',
    children: [1, 2, 3, 4, 5, 6].map(level => ({
      icon: `codex:h${level}`,
      lang: t('{}级标题', level),
      click: () => props.editor.chain().focus().toggleHeading({ level }).run(),
      isActive: () => props.editor.isActive('heading', { level })
    }))
  },
  {
    name: 'admonition',
    icon: 'lucide:info',
    children: [
      { type: 'info', icon: 'material-symbols:info-outline', label: '信息提示' },
      { type: 'warning', icon: 'material-symbols:warning-outline-rounded', label: '警告提示' },
      { type: 'important', icon: 'material-symbols:priority-high-rounded', label: '重要提示' }
    ].map(item => ({
      icon: item.icon,
      lang: t(item.label),
      click: () => props.editor.chain().focus().setAdmonition({ type: item.type }).run()
    }))
  },
  {
    icon: 'lucide:list-collapse',
    lang: t('步骤'),
    click: () => props.editor.chain().focus().setSteps().run()
  },
  {
    icon: 'lucide:list',
    lang: t('无序列表'),
    click: () => props.editor.chain().focus().toggleBulletList().run()
  },
  {
    icon: 'lucide:list-ordered',
    lang: t('有序列表'),
    click: () => props.editor.chain().focus().toggleOrderedList().run()
  },
  {
    icon: 'lucide:quote',
    lang: t('引用块'),
    click: () => props.editor.chain().focus().toggleBlockquote().run()
  },
  {
    icon: 'lucide:minus',
    lang: t('水平线'),
    click: () => props.editor.chain().focus().setHorizontalRule().run()
  },
  {
    icon: 'lucide:link',
    lang: t('插入超链接'),
    click: () => {
      isShowInsertLink.value = true
      picUrl.value = ''
    }
  },
  {
    icon: 'lucide:square-code',
    lang: t('代码块'),
    click: () => props.editor.chain().focus().toggleCodeBlock().run()
  },
  {
    icon: 'lucide:code-xml',
    lang: t('行内代码'),
    click: () => props.editor.chain().focus().toggleCode().run()
  },
  {
    icon: 'lucide:list-todo',
    lang: t('任务列表'),
    click: () => props.editor.chain().focus().toggleTaskList().run()
  },
  {
    icon: 'lucide:image-plus',
    lang: t('在线链接图片'),
    click: () => isShowUploadPic.value = true
  },
  {
    icon: 'material-symbols:table-outline',
    lang: t('表格'),
    click: () => isShowTable.value = true
  },
  {
    icon: 'icon-park-outline:video',
    lang: t('在线视频'),
    click: () => isShowVideo.value = true
  },
  {
    icon: 'material-symbols:schema-outline',
    lang: t('图表'),
    click: () => props.editor.chain().focus().setMermaid({
      code: 'graph TD\n  A[开始] --> B{判断}\n  B -- 是 --> C[执行]\n  B -- 否 --> D[结束]',
      hideCode: false
    }).run()
  },
  {
    icon: 'tabler:eye-off',
    lang: t('遮蔽文本'),
    click: () => props.editor.chain().focus().setHiddenText({ show: false }).run()
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
      <ModeToggle :mode="mode" @update:mode="arg => emit('update:mode', arg)" />

      <template v-for="item in commandList" :key="item.lang">
        <Popover v-if="item.children">
          <template #trigger>
            <Icon class="icon dark:text-white" :icon="item.icon" />
          </template>
          <div class="center flex-col dark:bg-dark-blue shadow-lg rounded bg-white">
            <div v-for="sub in item.children" :key="sub.lang"
              class="flex flex-row items-center justify-between w-full px-3 py-2 cursor-pointer transition-colors dark:text-white hover:bg-blue-50 dark:hover:bg-slate-700 rounded-md"
              @click="sub.click">
              <Icon :icon="sub.icon" width="20" height="20" class="mr-3" />
              <div class="text-sm whitespace-nowrap">{{ sub.lang }}</div>
            </div>
          </div>
        </Popover>

        <Popover v-else class="w-[40px] h-[40px]">
          <template #trigger>
            <Icon @click="item.click" class="icon dark:text-white" :icon="item.icon" />
          </template>
          <div class="dark:bg-dark-blue text-text-blue p-1 rounded">
            {{ item.lang }}
          </div>
        </Popover>
      </template>

      <Popover class="w-[40px] h-[40px]">
        <template #trigger>
          <Icon class="icon dark:text-white" icon="lucide:smile-plus" />
        </template>
        <div class="size-full p-2 rounded dark:bg-dark-blue w-[200px]">
          <MarkDownEmoji :editor="editor" />
        </div>
      </Popover>
    </div>

    <div class="flex items-center">
      <Popover>
        <template #trigger>
          <Icon @click="handleFullscreenToggle" class="icon dark:text-white"
            :icon="isFullscreen ? 'lucide:minimize' : 'lucide:maximize'" />
        </template>
        <div class="dark:bg-dark-blue text-text-blue p-1 rounded">
          {{ t(isFullscreen ? '退出全屏' : '全屏模式') }}
        </div>
      </Popover>
    </div>
  </div>

  <Dialog v-if="isShowInsertLink" :title="t('插入超链接')" :positive-text="t('插入')" :negative-text="t('取消')"
    :on-positive-click="insertUrl" :on-negative-click="() => isShowInsertLink = false"
    :on-mask-click="() => isShowInsertLink = false">
    <div class="flex-col size-full flex">
      <Input class="my-5" v-model="url.href" default-model="search" :placeholder="t('链接URL')" />
      <Input v-model="url.text" default-model="search" :placeholder="t('链接文字（可选）')" />
    </div>
  </Dialog>

  <Dialog v-if="isShowUploadPic" :title="t('插入外部链接图片')" :positive-text="t('插入')" :negative-text="t('取消')"
    :on-positive-click="uploadUrlPic" :on-negative-click="() => isShowUploadPic = false"
    :on-mask-click="() => isShowUploadPic = false">
    <Input class="my-5" v-model="picUrl" default-model="search" :placeholder="t('外部图片链接')" />
  </Dialog>

  <Dialog v-if="isShowTable" :title="t('插入表格')" :positive-text="t('插入')" :negative-text="t('取消')"
    :on-positive-click="insertTable" :on-negative-click="() => isShowTable = false"
    :on-mask-click="() => isShowTable = false">
    <div class="flex flex-row dark:text-white text-xl items-center py-2">
      <Input class="mr-5" v-model="tableModal.row" default-model="search" :placeholder="t('请输入行')" />
      {{ t('行') }}
      <Input class="m-5" v-model="tableModal.col" default-model="search" :placeholder="t('请输入列')" />
      {{ t('列') }}
    </div>
  </Dialog>

  <Dialog v-if="isShowVideo" :title="t('插入外部链接视频')" :positive-text="t('插入')" :negative-text="t('取消')"
    :on-positive-click="insertVideo" :on-negative-click="() => isShowVideo = false"
    :on-mask-click="() => isShowVideo = false">
    <div class="flex-col size-full flex">
      <Select :options="videoType.values()" v-model="video.type" />
      <Input class="my-5" v-model="video.url" default-model="search" :placeholder="videoLabel" />
      <Translate class="mb-5" message="视频宽(像素)：" />
      <NumberInput :min="0" v-model="video.width" />
      <Translate message="视频高(像素):" />
      <NumberInput :min="0" v-model="video.height" />
    </div>
  </Dialog>
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
</style>