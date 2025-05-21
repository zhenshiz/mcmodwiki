<script setup>
import { language, translatable, translatableArg } from '@/assets/translatable/translatable.js'
import Popover from '@/components/Popover.vue'
import { usePageStore } from '@/stores/index.js'
import { Icon } from '@iconify/vue'
import { webHref } from '@/assets/const/web.js'
import gsap from 'gsap'
import { useRouter } from 'vue-router'
import { getOperatingSystem } from '../utils/web.js'
import Modal from '@/components/Modal.vue'
import { modList, moreUtilList } from '@/assets/mod/mod.js'

const router = useRouter()
const pageStore = usePageStore()
const isDark = computed(() => pageStore.isDark)
const smSettingVisible = ref(false)
const searchVisible = ref(false)
//移动端
const modVisible = ref(false)
const moreVisible = ref(false)
const languageVisible = ref(false)

const languageList = ref(language.values())

const search = ref('')
const searchList = ref([])
const change = () => {
  searchList.value = modList.filter(item => translatable(item.lang).toLowerCase().includes(search.value.toLowerCase()))
}

const toggleTheme = () => {
  if (isDark.value) {
    //光明状态
    document.body.classList.remove('dark')
    pageStore.setSetting({ dark: false })
  } else {
    //黑暗状态
    document.body.classList.add('dark')
    pageStore.setSetting({ dark: true })
  }
}

const smSetting = ref()
const closeSmSetting = () => {
  gsap.to(smSetting.value, {
    duration: 0.5, x: -window.innerWidth * 0.8, onComplete: () => {
      smSettingVisible.value = false
    }
  })
}

const gotoModWiki = item => {
  router.push(`/wiki/${translatable(item.lang)}`)
}

const openWeb = (url) => {
  window.open(url)
}

//进度条
const scrollProgress = ref(0)
const scrollVisible = ref(false)
const isUp = ref(false)
const scrollTimeout = ref()
const lastScrollTop = ref(0)
const handleScroll = event => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
  scrollProgress.value = scrollTop / scrollHeight * 100
  isUp.value = scrollProgress.value <= lastScrollTop.value
  lastScrollTop.value = scrollProgress.value <= 0 ? 0 : scrollProgress.value

  // 显示进度条
  scrollVisible.value = true

  // 如果用户滚动，重置 3 秒隐藏计时器
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value)
  }
  scrollTimeout.value = setTimeout(() => {
    scrollVisible.value = false
  }, 3000)
}

const scrollTo = () => {
  if (isUp.value) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
  }
}

//监听玩家按键打开搜索页面
const keydownToSearch = event => {
  // 获取当前操作系统
  const os = getOperatingSystem()

  // Linux、Windows 使用 Ctrl+K，macOS 使用 Cmd+K
  if ((os === 'Mac' && event.metaKey && event.key === 'k') ||
    (os !== 'Mac' && event.ctrlKey && event.key === 'k')) {
    event.preventDefault()  // 防止默认行为
    searchVisible.value = true
  }
}

window.addEventListener('keydown', keydownToSearch)
window.addEventListener('scroll', handleScroll)

onMounted(() => {
  if (isDark.value) document.body.classList.add('dark')
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', keydownToSearch)
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="w-full">
    <!--头部导航栏-->
    <div
      class="relative top-0 h-16 w-full flex justify-center shadow z-20 dark:bg-dark-blue">
      <div class="flex flex-row justify-between w-[90%] size-full">
        <!--header左侧-->
        <div class="z-10 flex flex-row items-center">
          <div class="ml-5 text-xl font-bold dark:text-white">MCModWiki</div>
        </div>
        <!--header右侧-->
        <div class="hidden z-10 sm:flex flex-row items-center">
          <Popover
            class="mr-4"
            :background-color="isDark?'#002941':'#ffffff'"
            width="190"
          >
            <template #trigger>
              <Icon class="cursor-pointer dark:text-white" icon="heroicons:magnifying-glass-solid"
                    width="30"
                    height="30"
                    @click="()=>searchVisible=true" />
            </template>
            <div class="text-[#3487d5] text-center text-sm p-1">
              {{ translatableArg('layout.search.1', getOperatingSystem() === 'Mac' ? 'Cmd' : 'Ctrl')
              }}
            </div>
          </Popover>
          <!--页面跳转-->
          <Link class="m-2 text-lg text-text-blue whitespace-nowrap"
                hoverLineType="toFlanks"
                :href="`/main`">
            {{ translatable('layout.link.1') }}
          </Link>
          <Link class="m-2 text-lg text-text-blue whitespace-nowrap" hoverLineType="toFlanks"
                :href="`/author`">
            {{ translatable('layout.link.2') }}
          </Link>
          <Link class="m-2 text-lg text-text-blue whitespace-nowrap" hoverLineType="toFlanks"
                :href="`/editor`">
            {{ translatable('layout.link.3') }}
          </Link>
          <Popover
            v-if="modList.length"
            :background-color="isDark?'#002941':'#ffffff'"
          >
            <template #trigger>
              <div class="cursor-pointer m-2 text-lg text-text-blue whitespace-nowrap">
                {{ translatable('layout.link.4') }}
              </div>
            </template>
            <div class="size-full flex flex-col">
              <Link v-for="item in modList" class="m-2 text-lg text-text-blue"
                    :href="`/wiki/${translatable(item.lang)}`"
                    hoverLineType="toFlanks">
                {{ translatable(item.lang) }}
              </Link>
            </div>
          </Popover>
          <Popover
            v-if="moreUtilList.length"
            :background-color="isDark?'#002941':'#ffffff'"
          >
            <template #trigger>
              <div class="cursor-pointer text-lg text-text-blue m-2 whitespace-nowrap">
                {{ translatable('layout.link.5') }}
              </div>
            </template>
            <div class="size-full flex flex-col">
              <Link v-for="item in moreUtilList" class="m-2 text-lg text-text-blue"
                    :href="item.link"
                    hoverLineType="toFlanks">
                {{ translatable(item.lang) }}
              </Link>
            </div>
          </Popover>
          <!--切换主题 切换语言-->
          <div
            class="center h-[30px]  p-2 border-l border-r border-l-light-line-between border-r-light-line-between dark:border-l-dark-line-between dark:border-r-dark-line-between">
            <Popover :offset="-10">
              <template #trigger>
                <Icon width="35" height="35" icon="flowbite:language-outline"
                      class="cursor-pointer dark:text-white" />
              </template>
              <div class="size-full flex flex-col dark:bg-dark-blue">
                <div
                  @click="pageStore.setSetting({ language: item.value })"
                  class="flex flex-row items-center justify-center px-1 h-[30px] dark:text-text-blue theme-cursor-blue"
                  v-for="item in languageList">
                  {{ item.text }}
                </div>
                <div class="flex flex-row items-center p-2 dark:text-white theme-cursor-blue"
                     @click="openWeb(webHref.translatable)">
                  <div>
                    {{ translatable('layout.translatable.1') }}<br>
                    {{ translatable('layout.translatable.2') }}
                  </div>
                  <Icon class="ml-2 cursor-pointer" width="25"
                        height="25" icon="quill:link-out" />
                </div>
              </div>
            </Popover>
            <Icon width="35" height="35" :color="isDark?'#66cffc':'#ff454f'"
                  :icon="`line-md:${isDark?'moon':'sunny'}-loop`" class="cursor-pointer"
                  @click="toggleTheme" />
          </div>
          <div class="size-full flex items-center ml-2 mr-5">
            <Icon @click="openWeb(webHref.github)" :color="isDark?'#fff':'#000'" width="35"
                  height="35" icon="mdi:github" class="cursor-pointer" />
          </div>
        </div>

        <!--移动端适配按钮-->
        <div class="center sm:hidden z-10 mr-5 dark:text-white">
          <Popover
            class="mr-4"
            :background-color="isDark?'#002941':'#ffffff'"
            width="190"
          >
            <template #trigger>
              <Icon class="cursor-pointer dark:text-white" icon="heroicons:magnifying-glass-solid"
                    width="30"
                    height="30"
                    @click="()=>searchVisible=true" />
            </template>
            <div class="text-[#3487d5] text-center text-sm p-1">
              {{ translatableArg('layout.search.1', getOperatingSystem() === 'Mac' ? 'Cmd' : 'Ctrl')
              }}
            </div>
          </Popover>
          <Icon @click="()=>smSettingVisible=true" width="35" height="35" icon="ph:list-bold" />
        </div>
      </div>
    </div>

    <!--移动端设置面板-->
    <div class="sm:hidden absolute top-0 left-0 size-full min-h-lvh flex flex-row z-50"
         v-if="smSettingVisible">
      <!--设置面板-->
      <div ref="smSetting"
           class="w-[80%] bg-white dark:bg-dark-blue flex flex-col items-center justify-start h-full z-10">
        <div class="w-[80%] flex items-start">
          <Link class="m-2 mt-10 text-lg text-text-blue whitespace-nowrap"
                :href="`/main`">
            {{ translatable('layout.link.1') }}
          </Link>
        </div>
        <div class="w-[80%] flex items-start">
          <Link class="m-2 text-lg text-text-blue whitespace-nowrap"
                :href="`/author`">
            {{ translatable('layout.link.2') }}
          </Link>
        </div>
        <div class="w-[80%] flex items-start">
          <Link class="m-2 text-lg text-text-blue whitespace-nowrap"
                :href="`/editor`">
            {{ translatable('layout.link.3') }}
          </Link>
        </div>
        <div class="w-[80%] flex items-start justify-between text-text-blue"
             @click="()=>modVisible = !modVisible">
          <div class="cursor-pointer m-2 text-lg whitespace-nowrap">
            {{ translatable('layout.link.5') }}
          </div>
          <div class="m-2">
            +
          </div>
        </div>
        <div v-show="modVisible" class="w-[95%] flex flex-col border border-text-blue">
          <Link v-for="item in modList" class="m-2 text-text-blue"
                :href="`/wiki/${translatable(item.lang)}`">
            {{ translatable(item.lang) }}
          </Link>
        </div>

        <div class="w-[80%] flex items-start justify-between text-text-blue"
             @click="()=>moreVisible = !moreVisible">
          <div class="cursor-pointer m-2 text-lg whitespace-nowrap">
            {{ translatable('layout.link.4') }}
          </div>
          <div class="m-2">
            +
          </div>
        </div>
        <div v-show="moreVisible" class="w-[95%] flex flex-col border border-text-blue">
          <Link v-for="item in moreUtilList" class="m-2 text-text-blue"
                :href="`/wiki/${translatable(item.lang)}`">
            {{ translatable(item.lang) }}
          </Link>
        </div>

        <Icon width="35" height="35" icon="flowbite:language-outline"
              class="dark:text-white" @click="()=>languageVisible=!languageVisible" />
        <div v-show="languageVisible"
             class="w-[95%] flex flex-col border border-text-blue dark:bg-dark-blue">
          <div
            @click="pageStore.setSetting({ language: item.value })"
            class="flex flex-row items-center justify-center px-1 h-[30px] dark:text-text-blue theme-cursor-blue border-b border-b-text-blue"
            v-for="item in languageList">
            {{ item.text }}
          </div>
          <div
            class="flex flex-row items-center justify-around p-2 dark:text-white theme-cursor-blue"
            @click="openWeb(webHref.translatable)">
            <div>
              {{ translatable('layout.translatable.1') }}<br>
              {{ translatable('layout.translatable.2') }}
            </div>
            <Icon class="ml-2 cursor-pointer" width="25"
                  height="25" icon="quill:link-out" />
          </div>
        </div>

        <Icon width="35" height="35" :color="isDark?'#66cffc':'#ff454f'"
              :icon="`line-md:${isDark?'moon':'sunny'}-loop`" class="cursor-pointer mt-3 mb-3"
              @click="toggleTheme" />
        <Icon @click="openWeb(webHref.github)" :color="isDark?'#fff':'#000'" width="35"
              height="35" icon="mdi:github" class="cursor-pointer" />
      </div>
      <!--遮蔽-->
      <div @click="closeSmSetting" class="mask" />
    </div>
    <!--路由页面-->
    <div class="dark:bg-black-blue min-h-[calc(100vh-64px)]">
      <router-view></router-view>
    </div>

    <!--进度条-->
    <div v-show="scrollVisible"
         class="fixed bottom-5 right-5 h-12 w-[220px] rounded-full bg-white dark:bg-dark-blue center flex-row shadow">
      <div class="w-[100px] h-2 rounded-full"
           :style="{backgroundColor:isDark?'#3f3f45':'#999'}">
        <div class="h-full rounded-full"
             :style="{width:scrollProgress+'px',backgroundColor:isDark?'#0094f2':'#0079ea'}" />
      </div>
      <div class="ml-2 mr-2 text-text-blue w-[40px] text-right">{{ Math.floor(scrollProgress) }}%</div>
      <Icon :style="{backgroundColor:isDark?'#042235':'#cce4fa'}"
            :color="isDark?'#368cc5':'#3483ce'"
            width="35" height="35"
            :icon="isUp?'lucide:move-up':'lucide:move-down'"
            class="rounded-full p-2 cursor-pointer"
            @click="scrollTo" />
    </div>
  </div>

  <!--搜索框-->
  <Modal :show="searchVisible" @default-close="() => searchVisible=false" :isShowClose="false"
         :negativeVisible="false" :positiveVisible="false">
    <template #content>
      <div class="flex flex-col size-full">
        <Input v-model="search" @update:modelValue="change"
               :placeholder="translatable('layout.search.2')"
               default-model="search" is-debounce>
          <template #header>
            <div class="w-[25px] h-[25px] center dark:text-white">
              <Icon icon="material-symbols:search-rounded" width="30" height="30" />
            </div>
          </template>
        </Input>
        <div
          class="p-2 theme-cursor-blue flex flex-col dark:text-white mt-2 border border-text-blue"
          v-for="item in searchList" @click="gotoModWiki(item)">
          <div class="flex flex-row size-full">
            #&nbsp;
            <div class="flex flex-row justify-between size-full">
              <div>{{ translatable(item.lang) }}</div>
              <div class="ellipsis w-[300px] text-end">
                {{ translatable(item.description) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<style lang="scss" scoped>
.ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
