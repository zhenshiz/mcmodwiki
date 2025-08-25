<script setup>
import { computed, ref } from 'vue'
import { translatable } from '@/assets/translatable/translatable.js'
import { useChatBoxEditorStore, usePageStore } from '@/stores/index.js'
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'
import Select from '@/components/Select.vue'
import Modal from '@/components/Modal.vue'
import { Icon } from '@iconify/vue'
import Tag from '@/components/Tag.vue'
import { useMessage } from '@/components/register/useMessage.js'
import { useDialog } from '@/components/register/useDialog.js'
import {
  alignXList,
  alignYList,
  animation,
  easing,
  portraitType,
} from '@/assets/more/chatBox/option'
import Form from '@/components/Form.vue'
import FormItem from '@/components/FormItem.vue'
import AutoComplete from '@/components/AutoComplete.vue'
import Switch from '@/components/Switch.vue'
import ArrayObjectGenerator from '@/components/ArrayObjectGenerator.vue'
import { customAnimationSetting } from '@/assets/more/chatBox/defaultInfo.js'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const message = useMessage()
const dialog = useDialog()
const lang = computed(() => usePageStore().setting.language)
const chatBoxEditorStore = useChatBoxEditorStore()
const isDark = computed(() => usePageStore().isDark)

// 当前编辑的立绘索引
const editingIndex = ref(-1)
// 当前编辑的立绘数据
const editingPortrait = ref(null)
// 是否显示编辑弹窗
const isShowEditPortrait = ref(false)
// 是否是新增模式
const isAddMode = ref(false)

// 获取主题中的立绘列表，用于下拉选择
const themePortraits = computed(() => {
  const portraits = chatBoxEditorStore.themeSetting.portrait || {}
  return Object.keys(portraits).map((key) => ({ value: key, label: key }))
})

// 打开编辑弹窗
const openEditPortrait = (index) => {
  editingIndex.value = index

  if (index === -1) {
    // 新增模式
    isAddMode.value = true
    editingPortrait.value = ''
  } else {
    // 编辑模式
    isAddMode.value = false
    const portrait = props.modelValue[index]

    if (typeof portrait === 'string') {
      // 如果是字符串，直接编辑字符串
      editingPortrait.value = portrait
    } else {
      // 如果是对象，创建一个副本进行编辑
      editingPortrait.value = JSON.parse(JSON.stringify(portrait))
    }
  }

  isShowEditPortrait.value = true
}

// 保存编辑
const savePortrait = () => {
  const updatedPortraits = [...props.modelValue]

  // 确保对象模式下有id字段
  if (typeof editingPortrait.value === 'object' && editingPortrait.value !== null) {
    if (!editingPortrait.value.id) {
      message.warning('立绘ID不能为空')
      return
    }
  }

  if (isAddMode.value) {
    // 新增模式
    updatedPortraits.push(editingPortrait.value)
  } else {
    // 编辑模式
    updatedPortraits[editingIndex.value] = editingPortrait.value
  }

  emit('update:modelValue', updatedPortraits)
  isShowEditPortrait.value = false
}

// 删除立绘
const deletePortrait = (index) => {
  dialog.warning({
    title: translatable(lang.value, 'dialog.warning'),
    content: translatable(lang.value, 'chat.box.dialogues.portrait.delete.confirm'),
    onPositiveClick: () => {
      const portraitsCopy = [...props.modelValue]
      portraitsCopy.splice(index, 1)
      emit('update:modelValue', portraitsCopy)
    },
  })
}

// 切换编辑模式（字符串/对象）
const toggleEditMode = () => {
  if (typeof editingPortrait.value === 'string') {
    // 从字符串转为对象
    editingPortrait.value = {
      id: editingPortrait.value
    }
  } else {
    // 从对象转为字符串
    editingPortrait.value = editingPortrait.value.id || ''
  }
}

// 移动立绘位置
const movePortrait = (index, direction) => {
  if (
    (direction === 'up' && index === 0) ||
    (direction === 'down' && index === props.modelValue.length - 1)
  ) {
    return
  }

  const portraitsList = [...props.modelValue]
  const moveTargetIndex = direction === 'up' ? index - 1 : index + 1

  // 交换位置
  const temp = portraitsList[index]
  portraitsList[index] = portraitsList[moveTargetIndex]
  portraitsList[moveTargetIndex] = temp

  emit('update:modelValue', portraitsList)
}

// 判断立绘类型
const getPortraitType = (portrait) => {
  if (typeof portrait === 'string') {
    return 'string'
  } else if (portrait && typeof portrait === 'object') {
    return 'object'
  }
  return 'unknown'
}

// 获取立绘显示名称
const getPortraitDisplayName = (portrait) => {
  if (typeof portrait === 'string') {
    return portrait
  } else if (portrait && portrait.id) {
    return portrait.id
  }
  return translatable(lang.value, 'chat.box.dialogues.portrait.unknown')
}
</script>

<template>
  <div class="w-full">
    <!-- 立绘列表 -->
    <div class="portrait-list">
      <div class="flex justify-between items-center mb-4">
        <div class="flex-1">{{ translatable(lang, 'chat.box.dialogues.portrait') }}</div>
        <Button
          is-toggle-color
          class="w-10 h-10 flex items-center justify-center rounded-full"
          @click="openEditPortrait(-1)"
        >
          <Icon icon="mdi:plus" />
        </Button>
      </div>

      <div v-if="modelValue.length === 0" class="text-center py-4 text-gray-500">
        {{ translatable(lang, 'chat.box.dialogues.portrait.empty') }}
      </div>

      <div v-else class="space-y-2">
        <div
          v-for="(portrait, index) in modelValue"
          :key="index"
          class="flex items-center justify-between p-3 border rounded-md hover:border-blue-500"
        >
          <div class="flex items-center">
            <Tag
              :color="getPortraitType(portrait) === 'string' ? '#4CAF50' : '#2196F3'"
              class="mr-2"
            >
              {{
                getPortraitType(portrait) === 'string'
                  ? translatable(lang, 'chat.box.dialogues.portrait.reference')
                  : translatable(lang, 'chat.box.dialogues.portrait.custom')
              }}
            </Tag>
            <span class="font-medium">{{ getPortraitDisplayName(portrait) }}</span>
          </div>

          <div class="flex items-center space-x-2">
            <Button
              is-toggle-color
              class="w-8 h-8 flex items-center justify-center rounded-full"
              :disabled="index === 0"
              @click="movePortrait(index, 'up')"
            >
              <Icon icon="mdi:arrow-up" />
            </Button>

            <Button
              is-toggle-color
              class="w-8 h-8 flex items-center justify-center rounded-full"
              :disabled="index === modelValue.length - 1"
              @click="movePortrait(index, 'down')"
            >
              <Icon icon="mdi:arrow-down" />
            </Button>

            <Button
              is-toggle-color
              class="w-8 h-8 flex items-center justify-center rounded-full"
              @click="openEditPortrait(index)"
            >
              <Icon icon="mdi:pencil" />
            </Button>

            <Button
              :color="'#f00'"
              class="w-8 h-8 flex items-center justify-center rounded-full"
              @click="deletePortrait(index)"
            >
              <Icon icon="mdi:delete" />
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <Modal
      :sm-width="30"
      :show="isShowEditPortrait"
      :title="
        isAddMode
          ? translatable(lang, 'chat.box.dialogues.portrait.add')
          : translatable(lang, 'chat.box.dialogues.portrait.edit')
      "
      @onPositiveClick="savePortrait"
      @defaultClose="() => (isShowEditPortrait = false)"
    >
      <template #content>
        <div class="p-4 dark:text-white min-h-[500px] w-full flex flex-col items-center gap-3">
          <!-- 切换编辑模式按钮 -->
          <div class="w-full flex items-end">
            <Button is-toggle-color @click="toggleEditMode" :roundedSize="0" class="p-3">
              {{
                typeof editingPortrait === 'string'
                  ? translatable(lang, 'chat.box.dialogues.portrait.switch.to.object')
                  : translatable(lang, 'chat.box.dialogues.portrait.switch.to.string')
              }}
            </Button>
          </div>

          <!-- 字符串模式 -->
          <Form v-if="typeof editingPortrait === 'string'">
            <FormItem :label="translatable(lang, 'chat.box.dialogues.portrait.id')">
              <AutoComplete
                v-model="editingPortrait"
                :suggestions="themePortraits"
                valueKey="value"
                labelKey="label"
                clearable
              />
            </FormItem>
          </Form>

          <!-- 对象模式 -->
          <Form v-else>
            <FormItem :label="translatable(lang, 'chat.box.dialogues.portrait.id')">
              <AutoComplete
                v-model="editingPortrait.id"
                :suggestions="themePortraits"
                valueKey="value"
                labelKey="label"
                clearable
              />
            </FormItem>

            <FormItem :label="translatable(lang, 'chat.box.component.global.portrait.set.type')">
              <Select
                is-no-case-sensitive
                class="max-w-[150px]"
                v-model:value="editingPortrait.type"
                :options="portraitType.values(lang)"
                @update:value="(arg) => (editingPortrait.type = arg.value)"
              />
            </FormItem>
            <div class="mb-5" v-if="editingPortrait.type?.toUpperCase() === 'TEXTURE'">
              <FormItem
                :label="translatable(lang, 'chat.box.component.global.portrait.set.texture.value')"
              >
                <Input v-model="editingPortrait.value" default-model="search" />
              </FormItem>
              <FormItem
                :label="
                  translatable(lang, 'chat.box.component.global.portrait.set.texture.animation')
                "
              >
                <Select
                  class="max-w-[150px]"
                  is-no-case-sensitive
                  v-model:value="editingPortrait.animation"
                  :options="animation.values(lang)"
                  @update:value="(arg) => (editingPortrait.animation = arg.value)"
                />
              </FormItem>
              <FormItem
                v-show="
                  ![undefined, 'NONE', 'CUSTOM'].includes(editingPortrait.animation?.toUpperCase())
                "
                :label="
                  translatable(lang, 'chat.box.component.global.portrait.set.texture.duration')
                "
              >
                <Input v-model="editingPortrait.duration" default-model="search" />
              </FormItem>
              <FormItem
                v-show="
                  ![undefined, 'NONE', 'CUSTOM'].includes(editingPortrait.animation?.toUpperCase())
                "
                :label="translatable(lang, 'chat.box.component.global.portrait.set.texture.easing')"
              >
                <Select
                  :width="210"
                  class="max-w-[210px]"
                  is-no-case-sensitive
                  v-model:value="editingPortrait.easing"
                  :options="easing"
                  @update:value="(arg) => (editingPortrait.easing = arg.value)"
                />
              </FormItem>
              <FormItem
                :label="
                  translatable(lang, 'chat.box.component.global.portrait.set.component.width')
                "
              >
                <Input v-model="editingPortrait.width" default-model="search" />
              </FormItem>
              <FormItem
                :label="
                  translatable(lang, 'chat.box.component.global.portrait.set.component.height')
                "
              >
                <Input v-model="editingPortrait.height" default-model="search" />
              </FormItem>
            </div>
            <div class="mb-5" v-if="editingPortrait.type?.toUpperCase() === 'PLAYER_HEAD'">
              <FormItem
                :label="
                  translatable(lang, 'chat.box.component.global.portrait.set.player.head.value')
                "
              >
                <Input v-model="editingPortrait.value" default-model="search" />
              </FormItem>
              <FormItem
                :label="
                  translatable(lang, 'chat.box.component.global.portrait.set.component.width')
                "
              >
                <Input v-model="editingPortrait.width" default-model="search" />
              </FormItem>
              <FormItem
                :label="
                  translatable(lang, 'chat.box.component.global.portrait.set.component.height')
                "
              >
                <Input v-model="editingPortrait.height" default-model="search" />
              </FormItem>
            </div>
            <div class="mb-5" v-if="editingPortrait.type?.toUpperCase() === 'ITEM'">
              <FormItem
                :label="translatable(lang, 'chat.box.component.global.portrait.set.item.value')"
              >
                <Input v-model="editingPortrait.value" default-model="search" />
              </FormItem>
              <FormItem
                :label="
                  translatable(lang, 'chat.box.component.global.portrait.set.item.customItemData')
                "
              >
                <Input v-model="editingPortrait.customItemData" default-model="search" />
              </FormItem>
            </div>
            <FormItem
              :label="translatable(lang, 'chat.box.component.global.portrait.set.component.x')"
            >
              <Input v-model="editingPortrait.x" default-model="search" />
            </FormItem>
            <FormItem
              :label="translatable(lang, 'chat.box.component.global.portrait.set.component.y')"
            >
              <Input v-model="editingPortrait.y" default-model="search" />
            </FormItem>
            <FormItem
              :label="
                translatable(lang, 'chat.box.component.global.portrait.set.component.opacity')
              "
            >
              <Input v-model="editingPortrait.opacity" default-model="search" />
            </FormItem>
            <FormItem
              :label="translatable(lang, 'chat.box.component.global.portrait.set.component.scale')"
            >
              <Input v-model="editingPortrait.scale" default-model="search" />
            </FormItem>
            <FormItem
              :label="
                translatable(lang, 'chat.box.component.global.portrait.set.component.renderOrder')
              "
            >
              <Input v-model="editingPortrait.renderOrder" default-model="search" />
            </FormItem>
            <FormItem
              :label="translatable(lang, 'chat.box.component.global.portrait.set.component.alignX')"
            >
              <Select
                class="max-w-[150px]"
                is-no-case-sensitive
                v-model:value="editingPortrait.alignX"
                mode="bottom"
                :options="alignXList.values(lang)"
                @update:value="(arg) => (editingPortrait.alignX = arg.value)"
              />
            </FormItem>
            <FormItem
              :label="translatable(lang, 'chat.box.component.global.portrait.set.component.alignY')"
            >
              <Select
                class="max-w-[150px]"
                is-no-case-sensitive
                v-model:value="editingPortrait.alignY"
                mode="bottom"
                :options="alignYList.values(lang)"
                @update:value="(arg) => (editingPortrait.alignY = arg.value)"
              />
            </FormItem>
            <FormItem
              :label="
                translatable(
                  lang,
                  'chat.box.component.global.portrait.set.component.customAnimation',
                )
              "
              layout="vertical"
            >
              <ArrayObjectGenerator
                v-model="editingPortrait.customAnimation"
                :field-descriptions="customAnimationSetting(lang)"
              />
            </FormItem>
            <FormItem
              :label="translatable(lang, 'chat.box.component.global.portrait.set.component.loop')"
            >
              <Switch v-model="editingPortrait.loop" />
            </FormItem>
          </Form>
        </div>
      </template>
    </Modal>
  </div>
</template>
