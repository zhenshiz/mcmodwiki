<script setup>
import { useRoute, useRouter } from 'vue-router'
import { modList } from '@/assets/mod/mod.js'
import { translatable } from '@/assets/translatable/translatable.js'
import MilkDownReadOnly from '@/components/milkdown/MilkDownReadOnly.vue'
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/vue'
import { MilkdownProvider } from '@milkdown/vue'
import { Icon } from '@iconify/vue'
import { usePageStore } from '@/stores/index.js'
import Select from '@/components/Select.vue'

const pageStore = usePageStore()
const router = useRouter()
const route = useRoute()
const isDark = computed(() => pageStore.isDark)
const language = computed(() => pageStore.setting.language)

const pageInfo = ref({
  //模组名
  name: '',
  //下载途径
  availableHere: [],
  //第三方工具
  moreUtil: [],
  //文档
  markdown: ''
})
const form = ref({
  //mc版本
  mcVersion: '',
  //模组加载器,
  modLoader: '',
  //mod版本
  modVersion: ''
})
const mcVersionOption = ref([])
const modLoaderOption = ref([])
const modVersionOption = ref([])

const toggleWikiMarkdown = async () => {
  pageInfo.value.markdown = await loadMarkdown(pageInfo.value.name.toLowerCase(), form.value.mcVersion, form.value.modLoader, form.value.modVersion, language.value)
}

const loadMarkdown = async (mod, mcVersion, modLoader, modVersion, language) => {
  const res = await fetch(`/src/assets/mod/md/${mod}/${mcVersion}_${modLoader}_${modVersion}_${language}.md`)
  console.log(res.ok)
  return res.text()
}

const openWeb = (url) => {
  window.open(url)
}

onMounted(async () => {
  //根据翻译后的名字获取是哪个模组
  let res = modList.find(item => translatable(item.lang) === route.params.name)
  mcVersionOption.value = res.mcVersion.map(item => {
    return { label: item, value: item }
  })
  modLoaderOption.value = res.modLoader.map(item => {
    return { label: item, value: item }
  })
  modVersionOption.value = res.modVersion.map(item => {
    return { label: item, value: item }
  })
  form.value = {
    mcVersion: res.mcVersion[0],
    modLoader: res.modLoader[0],
    modVersion: res.modVersion[0]
  }
  let text = await loadMarkdown(translatable(res.lang).toLowerCase(), res.mcVersion[0], res.modLoader[0], res.modVersion[0], language.value)
  pageInfo.value = {
    name: translatable(res.lang),
    availableHere: res.availableHere,
    moreUtil: res.moreUtil,
    markdown: text
  }
})

watch(language, (newValue, oldValue) => {
  toggleWikiMarkdown()
})

</script>

<template>
  <div class="flex flex-row size-full">
    <div
      class="w-1/5 scrollbar flex flex-col m-5 sticky top-0 h-[calc(100vh-20px)] overflow-y-auto">
      <div class="title border-line-between p-2">{{ pageInfo.name }}</div>
      <!--获取途径-->
      <div v-if="pageInfo.availableHere.length" class="flex flex-col">
        <div class="dark:text-white m-2">{{ translatable('wiki.sidebar.1') }}</div>
        <div
          @click="openWeb(item.href)"
          class="theme-cursor-blue text-white flex flex-row items-center justify-between m-2 border-l-4 border-l-text-blue p-2"
          v-for="item in pageInfo.availableHere">
          <div class="flex flex-row items-center pl-3 gap-3">
            <Icon width="25" height="25" :icon="item.icon.icon"
                  :color="isDark?item.icon.darkColor:item.icon.lightColor" />
            <div class="text-black dark:text-white">{{ item.icon.name }}</div>
          </div>
          <Icon width="25" height="25" icon="quill:link-out" class="text-text-blue" />
        </div>
        <div class="border-line-between" />
      </div>
      <!--第三方工具-->
      <div v-if="pageInfo.moreUtil.length" class="flex flex-col">
        <div
          @click="router.push(item.router)"
          class="theme-cursor-blue text-white flex flex-row items-center m-2 border-l-4 border-l-text-blue p-2"
          v-for="item in pageInfo.moreUtil">
          <div class="ml-3">{{ translatable(item.lang) }}</div>
        </div>
        <div class="border-line-between" />
      </div>
      <!--mc版本选择-->
      <div
        class="flex flex-row items-center justify-between h-[80px] dark:text-white whitespace-nowrap m-2">
        <div>{{ translatable('wiki.sidebar.3') }}</div>
        <div>
          <Select v-model:value="form.mcVersion" :options="mcVersionOption"
                  @update:value="newValue =>{
                    form.mcVersion = newValue.value
                    toggleWikiMarkdown()
                  }" />
        </div>
      </div>
      <!--mod加载器选择-->
      <div
        class="flex flex-row items-center justify-between h-[80px] dark:text-white whitespace-nowrap m-2">
        <div>{{ translatable('wiki.sidebar.4') }}</div>
        <div>
          <Select v-model:value="form.modLoader" :options="modLoaderOption"
                  @update:value="newValue =>{
                    form.modLoader = newValue.value
                    toggleWikiMarkdown()
                  }" />
        </div>
      </div>
      <!--mod版本选择-->
      <div
        class="flex flex-row items-center justify-between h-[80px] dark:text-white whitespace-nowrap m-2">
        <div>{{ translatable('wiki.sidebar.5') }}</div>
        <div>
          <Select v-model:value="form.modVersion" :options="modVersionOption"
                  @update:value="newValue =>{
                    form.modVersion = newValue.value
                    toggleWikiMarkdown()
                  }" />
        </div>
      </div>
      <div class="border-line-between" />
      <!--文档导航-->
      <div class="m-2 dark:text-white">{{ translatable('wiki.sidebar.2') }}</div>

    </div>
    <div class="w-4/5 m-5">
      <MilkdownProvider>
        <ProsemirrorAdapterProvider>
          <MilkDownReadOnly :content="pageInfo.markdown" />
        </ProsemirrorAdapterProvider>
      </MilkdownProvider>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
