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
import { insertTableCommand, toggleStrikethroughCommand } from '@milkdown/preset-gfm'
import { useMessage } from '@/components/register/useMessage.js'
import { insertLinkPlugin } from '@/components/milkdown/plugin/hyperlinkInsert.js'
import Modal from '@/components/Modal.vue'
import Input from '@/components/Input.vue'
import { generateUUID } from '@/utils/format.js'
import { translatable } from '@/assets/translatable/translatable.js'

const message = useMessage()
const props = defineProps({
  editorInfo: {
    required: true
  },
  isShowUploadImage: Boolean,
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
const url = ref({
  href: '',
  text: ''
})
const picUrl = ref('')
const tableModal = ref({
  row: 0,
  col: 0
})
const emit = defineEmits(['update:mode'])

const call = (command, payload = {}, callback = () => {
}) => {
  const result = get()?.action(callCommand(command, payload))
  callback()
  return result
}

const uploadUrlPic = async () => {
  if (picUrl.value === '') {
    message.warning(translatable('message.warn.url.empty'))
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
            class="flex flex-row items-center justify-between button-theme-cursor-blue dark:text-white hover:text-text-blue"
            @click="call(wrapInHeadingCommand.key,'1')">
            <Icon icon="codex:h1" width="25" height="25" />
            <div class="p-1">大标题</div>
          </div>
          <div
            class="flex flex-row items-center justify-between button-theme-cursor-blue dark:text-white hover:text-text-blue"
            @click="call(wrapInHeadingCommand.key,'2')">
            <Icon icon="codex:h2" width="25" height="25" />
            <div class="p-1">小标题</div>
          </div>
        </div>
      </Popover>
      <Popover class="w-[40px] h-[40px]" trigger="hover"
               :is-popover-trigger="false"
      >
        <template #trigger>
          <Icon @click="call(toggleStrongCommand.key)" class="icon dark:text-white"
                icon="lucide:bold" />
        </template>
        <div class="dark:bg-dark-blue text-text-blue p-1">加粗</div>
      </Popover>
      <Popover class="w-[40px] h-[40px]" trigger="hover"
               :is-popover-trigger="false"
      >
        <template #trigger>
          <Icon @click="call(toggleEmphasisCommand.key)" class="icon dark:text-white"
                icon="lucide:italic" />
        </template>
        <div class="dark:bg-dark-blue text-text-blue p-1">斜体</div>
      </Popover>
      <Popover class="w-[40px] h-[40px]" trigger="hover"
               :is-popover-trigger="false"
      >
        <template #trigger>
          <Icon @click="call(toggleStrikethroughCommand.key)" class="icon dark:text-white"
                icon="lucide:strikethrough" />
        </template>
        <div class="dark:bg-dark-blue text-text-blue p-1">删除线</div>
      </Popover>
      <Popover class="w-[40px] h-[40px]" trigger="hover"
               :is-popover-trigger="false"
      >
        <template #trigger>
          <Icon @click="call(wrapInBulletListCommand.key)" class="icon dark:text-white"
                icon="lucide:list" />
        </template>
        <div class="dark:bg-dark-blue text-text-blue p-1">无序列表</div>
      </Popover>
      <Popover class="w-[40px] h-[40px]" trigger="hover"
               :is-popover-trigger="false"
      >
        <template #trigger>
          <Icon @click="call(wrapInOrderedListCommand.key)" class="icon dark:text-white"
                icon="lucide:list-ordered" />
        </template>
        <div class="dark:bg-dark-blue text-text-blue p-1">有序列表</div>
      </Popover>
      <Popover class="w-[40px] h-[40px]" trigger="hover"
               :is-popover-trigger="false"
      >
        <template #trigger>
          <Icon @click="call(wrapInBlockquoteCommand.key)" class="icon dark:text-white"
                icon="lucide:quote" />
        </template>
        <div class="dark:bg-dark-blue text-text-blue p-1">引用块</div>
      </Popover>
      <Popover class="w-[40px] h-[40px]" trigger="hover"
               :is-popover-trigger="false"
      >
        <template #trigger>
          <Icon @click="call(insertHrCommand.key)" class="icon dark:text-white"
                icon="lucide:minus" />
        </template>
        <div class="dark:bg-dark-blue text-text-blue p-1">水平线</div>
      </Popover>
      <Popover class="w-[40px] h-[40px]" trigger="hover"
               :is-popover-trigger="false"
      >
        <template #trigger>
          <Icon @click="()=>{
            isShowInsertLink = true
            url={href: '',text:''}
          }" class="icon dark:text-white" icon="lucide:link" />
        </template>
        <div class="dark:bg-dark-blue text-text-blue p-1">插入链接</div>
      </Popover>
      <Popover class="w-[40px] h-[40px]" trigger="hover"
               :is-popover-trigger="false"
      >
        <template #trigger>
          <Icon @click="call(createCodeBlockCommand.key, 'javascript')" class="icon dark:text-white"
                icon="lucide:square-code" />
        </template>
        <div class="dark:bg-dark-blue text-text-blue p-1">代码块</div>
      </Popover>
      <Popover class="w-[40px] h-[40px]" trigger="hover"
               :is-popover-trigger="false"
      >
        <template #trigger>
          <Icon @click="call(toggleInlineCodeCommand.key)" class="icon dark:text-white"
                icon="lucide:code-xml" />
        </template>
        <div class="dark:bg-dark-blue text-text-blue p-1">行内代码</div>
      </Popover>
      <Popover class="w-[40px] h-[40px]" trigger="hover">
        <template #trigger>
          <Icon class="icon dark:text-white" icon="lucide:image-plus" />
        </template>
        <div class="p-2 dark:bg-dark-blue">
          <div class="p-1 button-theme-cursor-blue dark:text-white hover:text-text-blue"
               @click="()=>isShowUploadPic=true">在线链接图片
          </div>
        </div>
      </Popover>
      <Popover class="w-[40px] h-[40px]" trigger="hover">
        <template #trigger>
          <Icon class="icon dark:text-white" icon="lucide:smile-plus" />
        </template>
        <div class="size-full p-2 rounded dark:bg-dark-blue w-[200px]">
          <MilkDownEmoji :editor-info="editorInfo" />
        </div>
      </Popover>
      <Popover class="w-[40px] h-[40px]" trigger="hover"
               :is-popover-trigger="false"
      >
        <template #trigger>
          <Icon @click="()=>isShowTable=true" class="icon dark:text-white"
                icon="material-symbols:table-outline" />
        </template>
        <div class="dark:bg-dark-blue text-text-blue p-1">表格</div>
      </Popover>
      <!--      <Popover class="w-[40px] h-[40px]" trigger="hover"-->
      <!--               :is-popover-trigger="false"-->
      <!--      >-->
      <!--        <template #trigger>-->
      <!--          <Icon @click="call(insertDiagramCommand.key)" class="icon dark:text-white" icon="bi:diagram-3" />-->
      <!--        </template>-->
      <!--        <div class="dark:bg-dark-blue text-text-blue p-1">图</div>-->
      <!--      </Popover>-->
    </div>
  </div>

  <Modal :show="isShowInsertLink" title="插入超链接" positive-text="插入"
         @default-close="() => isShowInsertLink=false"
         @on-positive-click="call(insertLinkPlugin.key,url,() => {
                  if(url.href===''){
                    message.warning(translatable('message.warn.url.empty'))
                    return
                  }
                  isShowInsertLink = false
                  url ={href: '',text: ''}
                })">
    <template #content>
      <div class="flex-col size-full flex">
        <Input class="my-5" v-model="url.href" default-model="search" placeholder="链接URL" />
        <Input v-model="url.text" default-model="search" placeholder="链接文字（可选）" />
      </div>
    </template>
  </Modal>
  <Modal :show="isShowUploadPic" title="插入外部链接图片" positive-text="插入"
         @default-close="() => isShowUploadPic=false" @on-positive-click="uploadUrlPic">
    <template #content>
      <Input class="my-5" v-model="picUrl" default-model="search" placeholder="外部图片链接" />
    </template>
  </Modal>
  <Modal :show="isShowTable" title="插入表格" positive-text="插入"
         @default-close="() => isShowTable=false" @on-positive-click="call(
           insertTableCommand.key,{
             row: Number(tableModal.row),
             col: Number(tableModal.col)
           },()=>isShowTable=false
         )">
    <template #content>
      <div class="flex flex-row dark:text-white text-xl items-center">
        <Input class="mr-5" v-model="tableModal.row" default-model="search"
               placeholder="链接文字（可选）" />
        行
        <Input class="m-5" v-model="tableModal.col" default-model="search"
               placeholder="链接文字（可选）" />
        列
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
