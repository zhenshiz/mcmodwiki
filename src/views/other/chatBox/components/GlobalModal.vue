<script setup>
import { translatable } from '@/assets/translatable/translatable.js'
import { chatBoxEditorVersion } from '@/assets/const/version.js'
import { useChatBoxEditorStore, usePageStore } from '@/stores/index.js'
import Button from '@/components/Button.vue'
import Modal from '@/components/Modal.vue'
import Input from '@/components/Input.vue'
import Select from '@/components/Select.vue'
import {
  alignXList,
  alignYList,
  animation,
  easing,
  portraitType
} from '@/assets/more/chatBox/option'
import { getDefaultIfInvalid } from '@/utils/math'
import { Icon } from '@iconify/vue'
import { useDialog } from '@/components/register/useDialog.js'
import { useMessage } from '@/components/register/useMessage.js'
import Switch from '@/components/Switch.vue'
import { template } from 'lodash'
import Tag from '@/components/Tag.vue'
import { copyToClipboard } from '@/utils/web.js'
import { removeFirstAndLastLine } from '@/utils/format.js'
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/vue'
import { MilkdownProvider } from '@milkdown/vue'
import MilkDownReadOnly from '@/components/milkdown/MilkDownReadOnly.vue'
import { useRoute, useRouter } from 'vue-router'

const dialog = useDialog()
const message = useMessage()
const route = useRoute()
const router = useRouter()
const lang = computed(() => usePageStore().setting.language)
const chatBoxEditorStore = useChatBoxEditorStore()
const isDark = computed(() => usePageStore().isDark)
const isShowPortrait = ref(false)
const isShowTranslatable = ref(false)
const isShowGenerationJson = ref(false)
const isShowChangePortrait = ref(false)
const isShowCustomAnimation = ref(false)

const searchInfo = ref({
  name: '',
  type: ''
})

const formData = ref({
  customAnimation: []
})
const customAnimation = ref([])

const searchList = computed(() => {
  let list = []
  for (const [k, item] of Object.entries(chatBoxEditorStore.themeSetting.portrait)) {
    if ((searchInfo.value.name
      ? item.value.includes(searchInfo.value.name)
      : true) && (searchInfo.value.type
      ? item.type.toUpperCase().includes(searchInfo.value.type.toUpperCase())
      : true)) {
      list.push({
        key: k,
        ...item
      })
    }
  }
  return list
})

const changePortrait = ref()
const changePortraitInfo = ref({
  title: ''
})

const portraitKey = ref('')

const openChangePortrait = (key, setting = {}) => {
  isShowChangePortrait.value = true
  if (key === 'add') {
    portraitKey.value = ''
  } else if (key === 'update') {
    portraitKey.value = setting.key
  }
  changePortraitInfo.value.title = translatable(
    lang.value,
    `chat.box.component.global.portrait.${key}`
  )
  formData.value = setting
}

const del = key => {
  let list = {}
  for (const [k, v] of Object.entries(chatBoxEditorStore.themeSetting.portrait)) {
    if (k !== key) {
      list[k] = v
    }
  }
  chatBoxEditorStore.setPortraitSetting(list, true)
}

const deletePortrait = item => {
  dialog.warning({
    title: translatable(lang.value, 'chat.box.component.global.portrait.del.title'),
    content: translatable(lang.value, 'chat.box.component.global.portrait.del.content'),
    onPositiveClick: () => {
      del(item.key)
    }
  })
}

const setPortrait = () => {
  if (formData.value?.type === undefined || formData.value?.type === '') {
    message.warning(translatable(lang.value, 'message.warn.no.portrait.type'))
    return
  }
  if (formData.value?.key === undefined || formData.value?.key === '') {
    message.warning(translatable(lang.value, 'message.warn.no.portrait.key'))
    return
  }
  if (formData.value?.value === undefined || formData.value?.value === '') {
    message.warning(translatable(lang.value, 'message.warn.no.portrait.value'))
    return
  }

  let cachePortrait = chatBoxEditorStore.themeSetting.portrait[portraitKey.value]
  if (portraitKey.value) {
    //update
    del(portraitKey.value)
  }
  if (formData.value.key in chatBoxEditorStore.themeSetting.portrait) {
    //提示不能重名key 回滚
    message.warning(translatable(lang.value, 'message.warn.repetition.portrait.key'))
    chatBoxEditorStore.setPortraitSetting(cachePortrait, false)
    return
  }
  chatBoxEditorStore.setPortraitSetting(formData.value, false)
  isShowChangePortrait.value = false
}

const setCustomAnimation = () => {
  for (let item of customAnimation.value) {
    if (item.time === null) {
      message.warning(translatable(lang.value, 'message.warn.custom.animation.time'))
      return
    }
  }
  isShowCustomAnimation.value = false
  formData.value.customAnimation = customAnimation.value
}

const selectedLang = ref(chatBoxEditorStore.translatableKeyColumns[0])
const translatableKeyOption = computed(() => {
  return chatBoxEditorStore.translatableKeyColumns.map(item => {
    return { value: item, label: item }
  })
})
const translatableKeyJson = computed(() => {
  return `\`\`\`json
${JSON.stringify(chatBoxEditorStore.translatableKey(selectedLang.value), null, 2)}
  \`\`\``
})

const jsonInput = ref()
const handleFileChange = (event) => {
  event.preventDefault()

  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()

    // 文件读取完成后的回调
    reader.onload = function(e) {
      const fileContent = e.target.result
      try {
        const json = JSON.parse(fileContent)
        const lang = file.name.replaceAll('.json', '')
        const columns = chatBoxEditorStore.translatableKeyColumns
        const rows = chatBoxEditorStore.translatableKeyRows
        const index = columns.findIndex(item => item === lang)

        if (index === -1) {
          // 语言列不存在 - 新增一列
          columns.push(lang)

          // 获取JSON中的键数量
          const jsonKeyCount = Object.keys(json).length

          // 为所有行添加新列（空字符串）
          rows.forEach(row => {
            // 确保每行的value数组长度与列数匹配
            while (row.value.length < columns.length - 1) {
              row.value.push('')
            }
            row.value.push('')
          })

          // 检查JSON键数量是否超过当前行数
          if (jsonKeyCount > rows.length) {
            // 需要新增行
            const newRowCount = jsonKeyCount - rows.length
            for (let i = 0; i < newRowCount; i++) {
              // 创建新行，所有列初始化为空字符串
              rows.push({
                key: '',
                value: Array(columns.length).fill('')
              })
            }
          }

          // 现在处理JSON数据
          let rowIndex = 0
          for (const [key, value] of Object.entries(json)) {
            if (rowIndex < rows.length) {
              // 更新现有行
              rows[rowIndex].key = key
              rows[rowIndex].value[columns.length - 1] = value // 最后一列是新添加的语言列
            } else {
              const newRowValues = Array(columns.length).fill('')
              newRowValues[columns.length - 1] = value
              rows.push({
                key: key,
                value: newRowValues
              })
            }
            rowIndex++
          }
        } else {
          // 语言列已存在 - 更新当前列
          let rowIndex = 0
          for (const [key, value] of Object.entries(json)) {
            if (rowIndex < rows.length) {
              // 更新现有行
              rows[rowIndex].key = key
              rows[rowIndex].value[index] = value
            } else {
              // 如果JSON键更多，创建新行
              const newRowValues = Array(columns.length).fill('')
              newRowValues[index] = value
              rows.push({
                key: key,
                value: newRowValues
              })
            }
            rowIndex++
          }

          // 如果JSON键数量少于行数，将多余行的该列设为空字符串
          if (Object.keys(json).length < rows.length) {
            for (let i = Object.keys(json).length; i < rows.length; i++) {
              if (rows[i].value.length > index) {
                rows[i].value[index] = ''
              } else {
                // 确保数组长度足够
                while (rows[i].value.length <= index) {
                  rows[i].value.push('')
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('文件内容不是有效的 JSON 格式！')
      }
    }

    reader.readAsText(file)
    event.target.files = []
  }
}
</script>

<template>
  <div class="flex flex-row items-center justify-between">
    <div class="font-bold">
      {{ translatable(lang, 'more.chatbox.mod.version') }}
      {{ chatBoxEditorVersion }}
    </div>
    <div>
      <Button @click="() => {
        router.push(`/chatbox/${route.path === '/chatbox/theme' ? 'dialogues' : 'theme'}`)

      }" class="mr-3" isToggleColor>
        {{ translatable(lang, `chat.box.component.global.link.${route.path === '/chatbox/theme' ? 'dialogues' : 'theme'}`)
        }}
      </Button>
      <Button @click="() => (isShowPortrait = true)" class="mr-3" isToggleColor>
        {{ translatable(lang, 'chat.box.component.global.portrait') }}
      </Button>
      <Button @click="() => (isShowTranslatable = true)" class="mr-3" isToggleColor>
        {{ translatable(lang, 'chat.box.component.global.translatable.key') }}
      </Button>
    </div>
    <!--预设立绘配置预览-->
    <Modal
      :sm-width="60"
      :show="isShowPortrait"
      :title="translatable(lang, 'chat.box.component.global.portrait.title')"
      :default-close-event="['onClose']"
      :positive-visible="false"
      :negative-visible="false"
      @defaultClose="(arg) => (isShowPortrait = false)"
    >
      <template #content>
        <div class="flex flex-col justify-center w-full dark:text-white">
          <div class="flex flex-row items-center justify-end">
            <Input
              class="max-w-[200px]"
              default-model="search"
              v-model="searchInfo.name"
              :placeholder="translatable(lang, 'chat.box.component.global.portrait.1')"
            />
            <Select is-no-case-sensitive
                    class="max-w-[200px]"
                    v-model:value="searchInfo.type"
                    :options="portraitType.values(lang)"
                    @update:value="
                (arg) => {
                  searchInfo.type = arg.value
                }
              "
            />
            <div class="flex flex-row justify-center mr-3">
              <Button @click="openChangePortrait('add')" is-toggle-color>
                {{ translatable(lang, 'chat.box.component.global.portrait.add') }}
              </Button>
            </div>
          </div>
          <div class="w-full grid grid-cols-1 sm:grid-cols-2 p-2 m-2">
            <div
              v-for="item in searchList"
              class="center flex-col border-2 rounded border-text-gray hover:border-text-blue m-5 pt-5 pb-5 w-[350px]"
            >
              <div class="flex flex-col center" v-if="item.type?.toUpperCase() === 'TEXTURE'">
                <div>{{ translatable(lang, 'chat.box.component.global.portrait.get.texture') }}
                </div>
                <div>{{ translatable(lang, 'chat.box.component.global.portrait.get.texture.value')
                  }}
                </div>
                <div>{{ item.value }}</div>
                <div>
                  {{ translatable(lang, 'chat.box.component.global.portrait.get.texture.animation')
                  }}{{ getDefaultIfInvalid(item.animation, 'none') }}
                </div>
                <div v-show="![undefined,'NONE','CUSTOM'].includes(item.animation?.toUpperCase())">
                  {{ translatable(lang, 'chat.box.component.global.portrait.get.texture.duration')
                  }}{{ getDefaultIfInvalid(item.duration, 20) }}
                </div>
                <div v-show="![undefined,'NONE','CUSTOM'].includes(item.animation?.toUpperCase())">
                  {{ translatable(lang, 'chat.box.component.global.portrait.get.texture.easing')
                  }}{{ getDefaultIfInvalid(item.easing, 'EASE_IN_SINE') }}
                </div>
                <div>{{ translatable(lang, 'chat.box.component.global.portrait.get.component.width')
                  }}{{ getDefaultIfInvalid(item.width, 10) }}
                </div>
                <div>
                  {{ translatable(lang, 'chat.box.component.global.portrait.get.component.height')
                  }}{{ getDefaultIfInvalid(item.height, 10) }}
                </div>
              </div>
              <div class="flex flex-col center" v-if="item.type?.toUpperCase() === 'PLAYER_HEAD'">
                <div>{{ translatable(lang, 'chat.box.component.global.portrait.get.player.head')
                  }}
                </div>
                <div>
                  {{ translatable(lang, 'chat.box.component.global.portrait.get.player.head.value')
                  }}{{ item.value }}
                </div>
                <div>{{ translatable(lang, 'chat.box.component.global.portrait.get.component.width')
                  }}{{ getDefaultIfInvalid(item.width, 10) }}
                </div>
                <div>
                  {{ translatable(lang, 'chat.box.component.global.portrait.get.component.height')
                  }}{{ getDefaultIfInvalid(item.height, 10) }}
                </div>
              </div>
              <div class="flex flex-col center" v-if="item.type?.toUpperCase() === 'ITEM'">
                <div>{{ translatable(lang, 'chat.box.component.global.portrait.get.item') }}</div>
                <div>{{ translatable(lang, 'chat.box.component.global.portrait.get.item.value')
                  }}{{ item.value }}
                </div>
              </div>
              <div>{{ translatable(lang, 'chat.box.component.global.portrait.get.component.x')
                }}{{ getDefaultIfInvalid(item.x, 0) }}
              </div>
              <div>{{ translatable(lang, 'chat.box.component.global.portrait.get.component.y')
                }}{{ getDefaultIfInvalid(item.y, 0) }}
              </div>
              <div>{{ translatable(lang, 'chat.box.component.global.portrait.get.component.alignX')
                }}{{ getDefaultIfInvalid(item.alignX, 'LEFT') }}
              </div>
              <div>{{ translatable(lang, 'chat.box.component.global.portrait.get.component.alignY')
                }}{{ getDefaultIfInvalid(item.alignY, 'TOP') }}
              </div>
              <div>{{ translatable(lang, 'chat.box.component.global.portrait.get.component.opacity')
                }}{{ getDefaultIfInvalid(item.opacity, 100) }}
              </div>
              <div>{{ translatable(lang, 'chat.box.component.global.portrait.get.component.scale')
                }}{{ getDefaultIfInvalid(item.scale, 1) }}
              </div>
              <div>
                {{ translatable(lang, 'chat.box.component.global.portrait.get.component.renderOrder')
                }}{{ getDefaultIfInvalid(item.renderOrder, 20) }}
              </div>
              <Button class="mt-3" @click="openChangePortrait('update',item)" is-toggle-color>{{
                  translatable(lang, 'chat.box.component.global.portrait.update')
                }}
              </Button>
              <Icon class="mt-3 cursor-pointer hover:text-red-600" width="30"
                    @click="deletePortrait(item)" icon="material-symbols:delete-outline" />
            </div>
          </div>
        </div>
      </template>
    </Modal>
    <!--翻译键-->
    <Modal :sm-width="80"
           :title="translatable(lang,'chat.box.component.global.portrait.translatable.title')"
           :negative-visible="false"
           :positive-visible="false"
           :show="isShowTranslatable" :default-close-event="['onClose']"
           @defaultClose="(arg) => (isShowTranslatable = false)">
      <template #content>
        <div class="flex flex-col center w-full dark:text-white">
          <div class="w-full justify-start mb-3">
            <Button :rounded-size="10" is-toggle-color
                    @click="chatBoxEditorStore.addTranslatableKeyRow">
              {{ translatable(lang, 'chat.box.component.global.portrait.translatable.add.row') }}
            </Button>
            <Button class="ml-3 mr-3" :rounded-size="10" is-toggle-color
                    @click="chatBoxEditorStore.addTranslatableKeyCol">
              {{ translatable(lang, 'chat.box.component.global.portrait.translatable.add.col') }}
            </Button>
            <Button class="mr-3" :rounded-size="10" is-toggle-color
                    @click="()=>isShowGenerationJson = true">
              {{ translatable(lang, 'chat.box.component.global.portrait.translatable.generation.json')
              }}
            </Button>
            <Button :rounded-size="10" is-toggle-color
                    @click="()=>jsonInput.click()">
              {{ translatable(lang, 'chat.box.component.global.portrait.translatable.upload.json')
              }}
            </Button>
            <input
              ref="jsonInput"
              hidden
              type="file"
              accept="application/JSON, .json"
              @change="handleFileChange($event)"
            />
          </div>
          <table>
            <thead>
            <tr>
              <th></th>
              <th v-for="(col,index) in chatBoxEditorStore.translatableKeyColumns" class="p-2">
                <div class="text-2xl mb-2" v-if="index<2 && (col === 'zh_cn' || col === 'en_us')">
                  {{ col }}
                </div>
                <div v-else class="center">
                  <Input class="max-w-[70px] mb-1"
                         v-model="chatBoxEditorStore.translatableKeyColumns[index]"
                         default-model="search" />
                </div>
                <div class="center">
                  <div class="text-sm hover:text-text-blue cursor-pointer"
                       @click="chatBoxEditorStore.removeTranslatableKeyCol(index)">
                    {{
                      translatable(lang, 'chat.box.component.global.portrait.translatable.delete.col')
                    }}
                  </div>
                </div>
              </th>
              <th>
                <div class="ml-3 mr-3">
                  {{ translatable(lang, 'chat.box.component.global.portrait.translatable.handle') }}
                </div>
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row,index) in chatBoxEditorStore.translatableKeyRows"
                :key="index" class="m-2">
              <td class="p-2">
                <Input v-model="chatBoxEditorStore.translatableKeyRows[index].key"
                       default-model="search" />
              </td>
              <td v-for="(cell,colIndex) in row.value" :key="colIndex" class="p-2">
                <Input v-model="chatBoxEditorStore.translatableKeyRows[index].value[colIndex]"
                       default-model="search" />
              </td>
              <td>
                <div class="center">
                  <div class="text-sm hover:text-text-blue cursor-pointer"
                       @click="chatBoxEditorStore.translatableKeyRows.splice(index,1)">
                    {{
                      translatable(lang, 'chat.box.component.global.portrait.translatable.delete.row')
                    }}
                  </div>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Modal>
    <!--生成Json-->
    <Modal
      :show="isShowGenerationJson"
      :title="translatable(lang, 'chat.box.component.global.portrait.translatable.generation.json')"
      @default-close="() => (isShowGenerationJson = false)"
      :negative-visible="false"
      :positive-visible="false"
    >
      <template #content>
        <div class="center flex-col size-full">
          <div class="flex flex-row items-center justify-between dark:text-white w-full">
            <div class="center flex-row whitespace-nowrap">
              {{ translatable(lang, 'chat.box.theme.download.content') }}
              <Icon
                :width="40"
                class="ml-2 mr-2 cursor-pointer hover:text-text-blue"
                icon="solar:clipboard-outline"
                @click="
                () => {
                  copyToClipboard(removeFirstAndLastLine(translatableKeyJson))
                  message.success(translatable(lang, 'message.success.copy'))
                }
              "
              />
              <Select :options="translatableKeyOption" :value="selectedLang"
                      @update:value="arg=> selectedLang = arg.value" />
            </div>
          </div>
          <MilkdownProvider>
            <ProsemirrorAdapterProvider>
              <MilkDownReadOnly :content="translatableKeyJson" />
            </ProsemirrorAdapterProvider>
          </MilkdownProvider>
        </div>
      </template>
    </Modal>
    <!--添加/编辑预设立绘-->
    <Modal
      :title="changePortraitInfo.title"
      ref="changePortrait"
      :show="isShowChangePortrait"
      @onPositiveClick="setPortrait"
      @defaultClose="(arg) => (isShowChangePortrait = false)"
    >
      <template #content>
        <div class="flex flex-col gap-2 center w-full dark:text-white">
          <div class="flex flex-row items-center">
            <div class="whitespace-nowrap">
              {{ translatable(lang, 'chat.box.component.global.portrait.set.key') }}
            </div>
            <Input v-model="formData.key" default-model="search" />
          </div>
          <div class="flex flex-row items-center">
            <div class="whitespace-nowrap">
              {{ translatable(lang, 'chat.box.component.global.portrait.set.type') }}
            </div>
            <Select is-no-case-sensitive
                    class="max-w-[200px]"
                    v-model:value="formData.type"
                    :options="portraitType.values(lang)"
                    @update:value="(arg) => formData.type = arg.value"
            />
          </div>
          <div class="flex flex-col gap-2 center" v-if="formData.type?.toUpperCase() === 'TEXTURE'">
            <div class="flex flex-row items-center">
              <div class="whitespace-nowrap">
                {{ translatable(lang, 'chat.box.component.global.portrait.set.texture.value') }}
              </div>
              <Input v-model="formData.value" default-model="search" />
            </div>
            <div class="flex flex-row items-center">
              <div class="whitespace-nowrap">
                {{ translatable(lang, 'chat.box.component.global.portrait.set.texture.animation')
                }}
              </div>
              <Select is-no-case-sensitive v-model:value="formData.animation"
                      :options="animation.values(lang)"
                      @update:value="arg=>formData.animation = arg.value" />
            </div>
            <div class="flex flex-row items-center"
                 v-show="![undefined,'NONE','CUSTOM'].includes(formData.animation?.toUpperCase())">
              <div class="whitespace-nowrap">
                {{ translatable(lang, 'chat.box.component.global.portrait.set.texture.duration') }}
              </div>
              <Input v-model="formData.duration" default-model="search" />
            </div>
            <div class="flex flex-row items-center"
                 v-show="![undefined,'NONE','CUSTOM'].includes(formData.animation?.toUpperCase())">
              <div class="whitespace-nowrap">
                {{ translatable(lang, 'chat.box.component.global.portrait.set.texture.easing')
                }}
              </div>
              <Select :width="210" is-no-case-sensitive v-model:value="formData.easing"
                      :options="easing"
                      @update:value="arg=>formData.easing = arg.value" />
            </div>
            <div class="flex flex-row items-center">
              <div class="whitespace-nowrap">
                {{ translatable(lang, 'chat.box.component.global.portrait.set.component.width') }}
              </div>
              <Input v-model="formData.width" default-model="search" />
            </div>
            <div class="flex flex-row items-center">
              <div class="whitespace-nowrap">
                {{ translatable(lang, 'chat.box.component.global.portrait.set.component.height') }}
              </div>
              <Input v-model="formData.height" default-model="search" />
            </div>
          </div>
          <div class="flex flex-col gap-2 center"
               v-if="formData.type?.toUpperCase() === 'PLAYER_HEAD'">
            <div class="flex flex-row items-center">
              <div class="whitespace-nowrap">
                {{ translatable(lang, 'chat.box.component.global.portrait.set.player.head.value') }}
              </div>
              <Input v-model="formData.value" default-model="search" />
            </div>
            <div class="flex flex-row items-center">
              <div class="whitespace-nowrap">
                {{ translatable(lang, 'chat.box.component.global.portrait.set.component.width') }}
              </div>
              <Input v-model="formData.width" default-model="search" />
            </div>
            <div class="flex flex-row items-center">
              <div class="whitespace-nowrap">
                {{ translatable(lang, 'chat.box.component.global.portrait.set.component.height') }}
              </div>
              <Input v-model="formData.height" default-model="search" />
            </div>
          </div>
          <div class="flex flex-col gap-2 center" v-if="formData.type?.toUpperCase() === 'ITEM'">
            <div class="flex flex-row items-center">
              <div class="whitespace-nowrap">
                {{ translatable(lang, 'chat.box.component.global.portrait.set.item.value') }}
              </div>
              <Input v-model="formData.value" default-model="search" />
            </div>
          </div>
          <div class="flex flex-row items-center">
            <div class="whitespace-nowrap">
              {{ translatable(lang, 'chat.box.component.global.portrait.set.component.x') }}
            </div>
            <Input v-model="formData.x" default-model="search" />
          </div>
          <div class="flex flex-row items-center">
            <div class="whitespace-nowrap">
              {{ translatable(lang, 'chat.box.component.global.portrait.set.component.y') }}
            </div>
            <Input v-model="formData.y" default-model="search" />
          </div>
          <div class="flex flex-row items-center">
            <div class="whitespace-nowrap">
              {{ translatable(lang, 'chat.box.component.global.portrait.set.component.opacity') }}
            </div>
            <Input v-model="formData.opacity" default-model="search" />
          </div>
          <div class="flex flex-row items-center">
            <div class="whitespace-nowrap">
              {{ translatable(lang, 'chat.box.component.global.portrait.set.component.scale') }}
            </div>
            <Input v-model="formData.scale" default-model="search" />
          </div>
          <div class="flex flex-row items-center">
            <div class="whitespace-nowrap">
              {{ translatable(lang, 'chat.box.component.global.portrait.set.component.renderOrder')
              }}
            </div>
            <Input v-model="formData.renderOrder" default-model="search" />
          </div>
          <div class="flex flex-row items-center">
            <div class="whitespace-nowrap">
              {{ translatable(lang, 'chat.box.component.global.portrait.set.component.alignX') }}
            </div>
            <Select is-no-case-sensitive v-model:value="formData.alignX" mode="bottom"
                    :options="alignXList.values(lang)"
                    @update:value="arg=>formData.alignX = arg.value" />
          </div>
          <div class="flex flex-row items-center">
            <div class="whitespace-nowrap">
              {{ translatable(lang, 'chat.box.component.global.portrait.set.component.alignY') }}
            </div>
            <Select is-no-case-sensitive v-model:value="formData.alignY" mode="bottom"
                    :options="alignYList.values(lang)"
                    @update:value="arg=>formData.alignY = arg.value" />
          </div>
          <div class="flex flex-row items-center justify-center">
            <div class="whitespace-nowrap">
              {{ translatable(lang, 'chat.box.component.global.portrait.set.component.customAnimation')
              }}
            </div>
            <Button class="mt-3" is-toggle-color @click="isShowCustomAnimation = true">{{
                translatable(lang, 'chat.box.theme.button.setting')
              }}
            </Button>
          </div>
          <div class="flex flex-row items-center justify-center">
            <div class="whitespace-nowrap">
              {{ translatable(lang, 'chat.box.component.global.portrait.set.component.loop') }}
            </div>
            <Switch v-model="formData.loop" />
          </div>
        </div>
      </template>
    </Modal>
    <!--自定义动画-->
    <Modal :title="translatable(lang,'chat.box.component.global.portrait.custom.animation')"
           :show="isShowCustomAnimation" :default-close-event="['onClose', 'onNegativeClick']"
           @defaultClose="(arg) => {
             isShowCustomAnimation = false
             customAnimation = formData.customAnimation ?? []
           }" @onPositiveClick="setCustomAnimation">
      <template #content>
        <div class="flex flex-col gap-2 center w-full dark:text-white">
          <Button class="mt-3" is-toggle-color @click="customAnimation.push({
          'time': null,
          'x': null,
          'y': null,
          'scale': null,
          'opacity': null,
          'easing': null,
          'visible': true
        })">{{
              translatable(lang, 'chat.box.component.global.portrait.custom.animation.node')
            }}
          </Button>
          <div class="gap-3 border rounded p-3 min-w-[450px]"
               v-for="(item,index) in customAnimation">
            <!--下拉和删除-->
            <div class="flex flex-row gap-3 items-center">
              <Tag round :color="isDark? '#fff':'#000'">{{ index + 1 }}</Tag>
              <Icon v-if="item.visible" @click="item.visible = false" width="20"
                    class="cursor-pointer hover:text-text-blue"
                    icon="bytesize:caret-top" />
              <Icon v-else width="20" @click="item.visible = true"
                    class="cursor-pointer hover:text-text-blue"
                    icon="bytesize:caret-bottom" />
              <Icon width="20" @click="customAnimation.splice(index,1)"
                    class="cursor-pointer hover:text-red-600"
                    icon="material-symbols:delete-outline" />
            </div>
            <div v-show="item.visible" class="flex flex-col gap-3">
              <div class="flex flex-row items-center">
                <div class="whitespace-nowrap">
                  {{ translatable(lang, 'chat.box.component.global.portrait.custom.animation.time')
                  }}
                </div>
                <Input v-model="item.time" default-model="search" />
              </div>
              <div class="flex flex-row items-center">
                <div class="whitespace-nowrap">
                  {{ translatable(lang, 'chat.box.component.global.portrait.custom.animation.x')
                  }}
                </div>
                <Input v-model="item.x" default-model="search" />
              </div>
              <div class="flex flex-row items-center">
                <div class="whitespace-nowrap">
                  {{ translatable(lang, 'chat.box.component.global.portrait.custom.animation.y')
                  }}
                </div>
                <Input v-model="item.y" default-model="search" />
              </div>
              <div class="flex flex-row items-center">
                <div class="whitespace-nowrap">
                  {{ translatable(lang, 'chat.box.component.global.portrait.custom.animation.scale')
                  }}
                </div>
                <Input v-model="item.scale" default-model="search" />
              </div>
              <div class="flex flex-row items-center">
                <div class="whitespace-nowrap">
                  {{ translatable(lang, 'chat.box.component.global.portrait.custom.animation.opacity')
                  }}
                </div>
                <Input v-model="item.opacity" default-model="search" />
              </div>
              <div class="flex flex-row items-center"
              >
                <div class="whitespace-nowrap">
                  {{ translatable(lang, 'chat.box.component.global.portrait.custom.animation.easing')
                  }}
                </div>
                <Select :width="210" is-no-case-sensitive v-model:value="item.easing"
                        mode="bottom"
                        :options="easing"
                        @update:value="arg=>item.easing = arg.value" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<style lang="scss" scoped>
table {
  border: 1px solid var(--font-color-3);

  th {
    border: 1px solid var(--font-color-3);

    th {
      border: 1px solid var(--font-color-3);
    }
  }

  td {
    border: 1px solid var(--font-color-3);
  }
}
</style>
