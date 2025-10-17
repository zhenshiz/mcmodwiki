<script setup>
import { translatable } from '@/assets/translatable/translatable.js'
import { chatBoxEditorVersion } from '@/assets/const/version.js'
import { useChatBoxEditorStore, usePageStore } from '@/stores/index.js'
import Button from '@/components/Button.vue'
import { useRoute, useRouter } from 'vue-router'
import ObjectMapDialog from '@/components/ObjectMapDialog.vue'
import { themeSetting } from '@/assets/more/chatBox/defaultInfo.js'
import { portraitType } from '@/assets/more/chatBox/option.js'
import TranslatableKey from '@/views/other/chatBox/components/TranslatableKey.vue'

const route = useRoute()
const router = useRouter()
const lang = computed(() => usePageStore().setting.language)
const chatBoxEditorStore = useChatBoxEditorStore()
const theme = themeSetting(lang.value)

const portraitSearch = ref({
  key: '',
  type: ''
})

const portraitFilter = (key, value) => {
  return (
    (!portraitSearch.value.key || key.includes(portraitSearch.value.key)) &&
    (portraitSearch.value.type === 'None' || !portraitSearch.value.type || value.type === portraitSearch.value.type)
  )
}

const portraitDisplayTemplate = (key, value) => {
  return `${translatable(lang.value, 'chat.box.component.global.portrait.get.type')}：${value.type}  ${translatable(lang.value, `chat.box.component.global.portrait.get.${value.type}.value`)}：${value.value}`
}

const customAnimationSearch = ref({
  key: ''
})

const customAnimationFilter = (key, value) => {
  return !customAnimationSearch.value.key || key.includes(customAnimationSearch.value.key)
}

let options = ref()
onMounted(() => {
  options.value = portraitType.values(lang.value)
  options.value.push({ label: translatable(lang.value, 'component.filter.none'), value: 'None' })
})
</script>

<template>
  <div class="flex flex-row items-center justify-between">
    <div class="font-bold">
      {{ translatable(lang, 'more.chatbox.mod.version') }}
      {{ chatBoxEditorVersion }}
    </div>
    <div class="flex flex-row">
      <Button
        @click="
          () => {
            router.push(`/chatbox/${route.path === '/chatbox/theme' ? 'dialogues' : 'theme'}`)
          }
        "
        class="mr-3"
        isToggleColor
      >
        {{
          translatable(
            lang,
            `chat.box.component.global.link.${route.path === '/chatbox/theme' ? 'dialogues' : 'theme'}`
          )
        }}
      </Button>
      <ObjectMapDialog class="mr-3" :properties="theme.portrait" :filter="portraitFilter"
                       :button-text="translatable(lang,'chat.box.component.global.portrait.title')"
                       :title="translatable(lang, 'chat.box.component.global.portrait.title')"
                       :displayTemplate="portraitDisplayTemplate"
                       v-model="chatBoxEditorStore.themeSetting.portrait">
        <template #filter>
          <div class="flex w-full flex-row items-center justify-end gap-5">
            <div class="dark:text-white">{{ translatable(lang, 'component.filter') }}</div>
            <Input
              class="max-w-[200px]"
              default-model="search"
              v-model="portraitSearch.key"
              :placeholder="translatable(lang, 'chat.box.component.global.portrait.1')"
            />
            <Select
              is-no-case-sensitive
              class="max-w-[200px]"
              v-model="portraitSearch.type"
              :options="options"
            />
          </div>
        </template>
      </ObjectMapDialog>
      <ObjectMapDialog class="mr-3" :properties="theme.customAnimationMap"
                       :title="translatable(lang, 'chat.box.component.global.custom.animation')"
                       :button-text="translatable(lang, 'chat.box.component.global.custom.animation')"
                       :filter="customAnimationFilter"
                       v-model="chatBoxEditorStore.themeSetting.customAnimation">
        <template #filter>
          <div class="flex w-full flex-row items-center justify-end gap-5">
            <div class="dark:text-white">{{ translatable(lang, 'component.filter') }}</div>
            <Input
              class="max-w-[200px]"
              default-model="search"
              v-model="customAnimationSearch.key"
            />
          </div>
        </template>
      </ObjectMapDialog>
      <TranslatableKey />
    </div>
  </div>
</template>
