<script setup>
import ModeToggle from '@/components/milkdown/ModeToggle.vue'
import Popover from '@/components/Popover.vue'
import { Icon } from '@iconify/vue'
import MilkDownEmoji from '@/components/milkdown/Emoji.vue'
import { callCommand } from '@milkdown/utils'
import {
  createCodeBlockCommand,
  insertHrCommand,
  insertImageCommand,
  toggleEmphasisCommand,
  toggleInlineCodeCommand,
  toggleStrongCommand,
  wrapInBlockquoteCommand,
  wrapInBulletListCommand,
  wrapInHeadingCommand,
  wrapInOrderedListCommand
} from '@milkdown/preset-commonmark'
import { toggleStrikethroughCommand } from '@milkdown/preset-gfm'
import { useMessage } from '@/components/register/useMessage.js'
import { insertLinkPlugin } from '@/components/milkdown/plugin/hyperlinkInsert.js'
import Modal from '@/components/Modal.vue'
import Input from '@/components/Input.vue'
import { generateUUID } from '@/utils/format.js'
import { translatable } from '@/assets/translatable/translatable.js'
import { insertVideoCommand } from '@/components/milkdown/plugin/video.js'
import { usePageStore } from '@/stores/index.js'

const message = useMessage()
const lang = computed(() => usePageStore().setting.language)
const props = defineProps({
  editorInfo: {
    required: true
  },
  isPersistence: {
    type: Boolean,
    default: true
  },
  mode: String
})
const { get } = props.editorInfo
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
const videoUrl = ref('')
const emit = defineEmits(['update:mode'])

const call = (command, payload = {}, callback = () => {
}) => {
  const result = get()?.action(callCommand(command, payload))
  callback()
  return result
}

const uploadUrlPic = async () => {
  if (picUrl.value === '') {
    message.warning(translatable(lang, 'message.warn.url.empty'))
    return
  }
  const fileName = generateUUID()
  const imageName = `${Date.now()}-${fileName}`
  call(insertImageCommand.key, {
    src: picUrl.value,
    title: imageName,
    alt: imageName
  })
  isShowUploadPic.value = false
}

const commandList = ref([
  { icon: 'lucide:bold', lang: 'milkdown.menu.bold', click: () => call(toggleStrongCommand.key) },
  {
    icon: 'lucide:italic',
    lang: 'milkdown.menu.italic',
    click: () => call(toggleEmphasisCommand.key)
  },
  {
    icon: 'lucide:strikethrough',
    lang: 'milkdown.menu.strikethrough',
    click: () => call(toggleStrikethroughCommand.key)
  },
  {
    icon: 'lucide:list',
    lang: 'milkdown.menu.list',
    click: () => call(wrapInBulletListCommand.key)
  },
  {
    icon: 'lucide:list-ordered',
    lang: 'milkdown.menu.list.ordered',
    click: () => call(wrapInOrderedListCommand.key)
  },
  {
    icon: 'lucide:quote',
    lang: 'milkdown.menu.quote',
    click: () => call(wrapInBlockquoteCommand.key)
  },
  { icon: 'lucide:minus', lang: 'milkdown.menu.minus', click: () => call(insertHrCommand.key) },
  {
    icon: 'lucide:link', lang: 'milkdown.menu.link', click: () => {
      isShowInsertLink.value = true
      url.value = { href: '', text: '' }
    }
  },
  {
    icon: 'lucide:square-code',
    lang: 'milkdown.menu.square.code',
    click: () => call(createCodeBlockCommand.key, 'javascript')
  },
  {
    icon: 'lucide:code-xml',
    lang: 'milkdown.menu.code.xml',
    click: () => call(toggleInlineCodeCommand.key)
  },
  {
    icon: 'lucide:image-plus',
    lang: 'milkdown.menu.image',
    click: () => isShowUploadPic.value = true
  },
  {
    icon: 'material-symbols:table-outline',
    lang: 'milkdown.menu.table.outline',
    click: () => isShowTable.value = true
  },
  // {
  //   icon: 'icon-park-outline:video',
  //   lang: 'milkdown.menu.video',
  //   click: () => isShowVideo.value = true
  // }
])
</script>

<template>
  <div
    class="dark:border dark:border-dark-blue dark:rounded sticky top-0 w-full flex justify-start h-full sm:h-[43px] z-10 bg-[#edfaff] dark:bg-[#051e2f]">
    <div class="flex flex-row flex-wrap">
      <ModeToggle :mode="mode" @update:mode="arg=>emit('update:mode', arg)" />
      <Popover class="w-[40px] h-[40px] ml-5" trigger="hover">
        <template #trigger>
          <Icon class="icon dark:text-white" icon="icon-park-outline:title-level" />
        </template>
        <div class="center flex-col p-2 dark:bg-dark-blue">
          <div
            v-for="item in [1, 2, 3, 4, 5, 6]"
            class="flex flex-row items-center justify-between button-theme-cursor-blue dark:text-white hover:text-text-blue"
            @click="call(wrapInHeadingCommand.key,item)">
            <Icon :icon="`codex:h${item}`" width="25" height="25" />
            <div class="p-1">{{ translatable(lang, `milkdown.menu.h${item}`) }}</div>
          </div>
        </div>
      </Popover>
      <Popover class="w-[40px] h-[40px]" trigger="hover"
               :is-popover-trigger="false" v-for="item in commandList"
      >
        <template #trigger>
          <Icon @click="item.click" class="icon dark:text-white"
                :icon="item.icon" />
        </template>
        <div class="dark:bg-dark-blue text-text-blue p-1">{{ translatable(lang, item.lang) }}</div>
      </Popover>
      <Popover class="w-[40px] h-[40px]" trigger="hover">
        <template #trigger>
          <Icon class="icon dark:text-white" icon="lucide:smile-plus" />
        </template>
        <div class="size-full p-2 rounded dark:bg-dark-blue w-[200px]">
          <MilkDownEmoji :editor-info="editorInfo" />
        </div>
      </Popover>
    </div>
  </div>

  <Modal :show="isShowInsertLink" :title="translatable(lang,'milkdown.modal.insert.link.title')"
         :positive-text="translatable(lang,'milkdown.modal.insert.link.positive')"
         @default-close="() => isShowInsertLink=false"
         @on-positive-click="call(insertLinkPlugin.key,url,() => {
                  if(url.href===''){
                    message.warning(translatable(lang,'message.warn.url.empty'))
                    return
                  }
                  isShowInsertLink = false
                  url ={href: '',text: ''}
                })">
    <template #content>
      <div class="flex-col size-full flex">
        <Input class="my-5" v-model="url.href" default-model="search"
               :placeholder="translatable(lang,'milkdown.input.url.href')" />
        <Input v-model="url.text" default-model="search"
               :placeholder="translatable(lang,'milkdown.input.url.text')" />
      </div>
    </template>
  </Modal>
  <Modal :show="isShowUploadPic" :title="translatable(lang,'milkdown.modal.insert.pic.title')"
         :positive-text="translatable(lang,'milkdown.modal.insert.pic.positive')"
         @default-close="() => isShowUploadPic=false" @on-positive-click="uploadUrlPic">
    <template #content>
      <Input class="my-5" v-model="picUrl" default-model="search"
             :placeholder="translatable(lang,'milkdown.input.pic.url')" />
    </template>
  </Modal>
  <Modal :show="isShowTable" :title="translatable(lang,'milkdown.modal.insert.table.title')"
         :positive-text="translatable(lang,'milkdown.modal.insert.table.positive')"
         @default-close="() => isShowTable=false" @on-positive-click="call(
           insertTableCommand.key,{
             row: Number(tableModal.row),
             col: Number(tableModal.col)
           },()=>isShowTable=false
         )">
    <template #content>
      <div class="flex flex-row dark:text-white text-xl items-center">
        <Input class="mr-5" v-model="tableModal.row" default-model="search"
               :placeholder="translatable(lang,'milkdown.input.table.row')" />
        {{ translatable(lang, 'milkdown.modal.row') }}
        <Input class="m-5" v-model="tableModal.col" default-model="search"
               :placeholder="translatable(lang,'milkdown.input.table.col')" />
        {{ translatable(lang, 'milkdown.modal.col') }}
      </div>
    </template>
  </Modal>
  <Modal :show="isShowVideo" :title="translatable(lang,'milkdown.modal.insert.video.title')"
         :positive-text="translatable(lang,'milkdown.modal.insert.video.positive')"
         @default-close="() => isShowVideo=false"
         @on-positive-click="() => {
                  if(videoUrl===''){
                    message.warning(translatable(lang,'message.warn.url.empty'))
                    return
                  }
                  call(insertVideoCommand.key,videoUrl)
                  isShowVideo = false
                  videoUrl = ''
                }">
    <template #content>
      <div class="flex-col size-full flex">
        <Input class="my-5" v-model="videoUrl" default-model="search"
               :placeholder="translatable(lang,'milkdown.input.video.url')" />
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
