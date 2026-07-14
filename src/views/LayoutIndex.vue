<script setup>
import Dropdown from '@/components/Dropdown.vue'
import { usePageStore } from '@/stores/index.js'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import Modal from '@/components/Modal.vue'
import { modList, moreUtilList } from '@/assets/info/mod.js'
import { i18nScope } from '@/languages'
import { useVoerkaI18n } from '@voerkai18n/vue'
import { webUtil } from '@/utils/webUtil.js'
import { useEventListener } from '@vueuse/core'
import { languageList, webHref } from '@/assets/info/web.js'
import { computed, onMounted, ref } from 'vue'

const { languages } = useVoerkaI18n(i18nScope)

const router = useRouter()
const pageStore = usePageStore()
const isDark = computed(() => pageStore.isDark)
const searchVisible = ref(false)
const mobileMenuVisible = ref(false)
let themeTransitioning = false

const search = ref('')
const searchList = ref([])
const change = () => {
  searchList.value = modList().filter(item => item.lang.toLowerCase().includes(search.value.toLowerCase()))
}

const applyTheme = (dark) => {
  document.body.classList.toggle('dark', dark)
  pageStore.isDark = dark
}

const toggleTheme = async () => {
  const nextIsDark = !isDark.value
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!document.startViewTransition || reduceMotion) {
    applyTheme(nextIsDark)
    return
  }

  if (themeTransitioning) return
  themeTransitioning = true

  try {
    const transition = document.startViewTransition(() => applyTheme(nextIsDark))
    await transition.ready

    const originX = nextIsDark ? window.innerWidth : 0
    const originY = nextIsDark ? 0 : window.innerHeight
    const radius = Math.hypot(window.innerWidth, window.innerHeight)

    const animation = document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${originX}px ${originY}px)`,
          `circle(${radius}px at ${originX}px ${originY}px)`
        ]
      },
      {
        duration: 650,
        easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
        pseudoElement: '::view-transition-new(root)'
      }
    )

    await animation.finished
  } catch {
    applyTheme(nextIsDark)
  } finally {
    themeTransitioning = false
  }
}

const gotoModWiki = item => {
  searchVisible.value = false
  router.push(`/wiki/${item.lang}`)
}

const closeMobileMenu = () => {
  mobileMenuVisible.value = false
}

const openSearch = () => {
  closeMobileMenu()
  searchVisible.value = true
}

const openWeb = (url) => {
  window.open(url)
}

// 进度条逻辑保持不变
const scrollProgress = ref(0)
const scrollVisible = ref(false)
const isUp = ref(false)
const scrollTimeout = ref()
const lastScrollTop = ref(0)
const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
  scrollProgress.value = scrollHeight > 0
    ? Math.min(100, Math.max(0, scrollTop / scrollHeight * 100))
    : 0
  isUp.value = scrollProgress.value <= lastScrollTop.value
  lastScrollTop.value = scrollProgress.value <= 0 ? 0 : scrollProgress.value

  scrollVisible.value = true

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

const keydownToSearch = event => {
  const os = webUtil.getOperatingSystem()
  if ((os === 'Mac' && event.metaKey && event.key === 'k') ||
    (os !== 'Mac' && event.ctrlKey && event.key === 'k')) {
    event.preventDefault()
    searchVisible.value = true
  }
}

useEventListener('keydown', keydownToSearch)
useEventListener('scroll', handleScroll)

onMounted(() => {
  if (isDark.value) document.body.classList.add('dark')
})
</script>

<template>
  <div class="w-full">
    <div class="relative top-0 h-16 w-full flex justify-center shadow z-20 dark:bg-dark-blue">
      <div class="flex flex-row justify-between w-full max-w-screen-2xl size-full px-4 sm:px-6">
        <div class="z-10 flex flex-row items-center">
          <div class="text-xl font-bold dark:text-white">MCModWiki</div>
        </div>

        <div class="hidden z-10 lg:flex flex-row items-center">

          <Dropdown>
            <template #trigger>
              <Icon class="cursor-pointer dark:text-white" icon="heroicons:magnifying-glass-solid" width="30"
                height="30" @click="openSearch" />
            </template>
            <div class="text-[#3487d5] text-center text-sm p-3">
              {{ t('按下 {} + k 以搜索', webUtil.getOperatingSystem() === 'Mac' ? 'Cmd' : 'Ctrl') }}
            </div>
          </Dropdown>

          <Link class="ml-5 m-2 text-lg text-text-blue whitespace-nowrap" hoverLineType="toFlanks" :href="`/`">
            {{ t('首页') }}
          </Link>
          <Link class="m-2 text-lg text-text-blue whitespace-nowrap" hoverLineType="toFlanks" :href="`/author`">
            {{ t('关于我们') }}
          </Link>
          <Link class="m-2 text-lg text-text-blue whitespace-nowrap" hoverLineType="toFlanks" :href="`/editor`">
            {{ t('编辑') }}
          </Link>

          <Dropdown v-if="modList().length">
            <template #trigger>
              <div class="cursor-pointer m-2 text-lg text-text-blue whitespace-nowrap">
                {{ t('模组') }}
              </div>
            </template>
            <div class="flex flex-col py-2">
              <Link v-for="(item, index) in modList()" class="m-2 text-lg text-text-blue"
                    :href="`/wiki/${item.lang}`" hoverLineType="toFlanks" :key="index">
                {{ t(item.lang) }}
              </Link>
            </div>
          </Dropdown>

          <Dropdown v-if="moreUtilList().length">
            <template #trigger>
              <div class="cursor-pointer text-lg text-text-blue m-2 whitespace-nowrap">
                {{ t('更多') }}
              </div>
            </template>
            <div class="flex flex-col py-2">
              <Link v-for="(item, index) in moreUtilList()" class="m-2 text-lg text-text-blue"
                    :href="item.router"
                hoverLineType="toFlanks" :key="index">
                {{ t(item.lang) }}
              </Link>
            </div>
          </Dropdown>

          <div class="center h-[30px] p-2 border-l border-r border-l-light-line-between border-r-light-line-between dark:border-l-dark-line-between dark:border-r-dark-line-between">

            <Dropdown>
              <template #trigger>
                <Icon width="35" height="35" icon="flowbite:language-outline" class="cursor-pointer dark:text-white" />
              </template>
              <div class="flex flex-col dark:bg-dark-blue">
                <div @click="() => i18nScope.change(lang.name)"
                  class="flex flex-row items-center justify-center px-4 py-2 cursor-pointer dark:text-text-blue hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  v-for="(lang, index) in languages" :key="index">
                  {{ languageList[lang.name] }}
                </div>
                <div class="flex flex-row items-center justify-center px-4 py-2 border-t dark:border-gray-600 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  @click="openWeb(webHref.translatable)">
                  <div class="text-xs text-center">
                    {{ t('找不到您的语言？') }}<br>
                    {{ t('点击这里协助翻译') }}
                  </div>
                  <Icon class="ml-2" width="20" height="20" icon="quill:link-out" />
                </div>
              </div>
            </Dropdown>

            <Icon width="35" height="35" :color="isDark ? '#66cffc' : '#ff454f'"
              :icon="`line-md:${isDark ? 'moon' : 'sunny'}-loop`" class="cursor-pointer ml-3" @click="toggleTheme" />
          </div>

          <div class="size-full flex items-center ml-2 mr-5">
            <Icon @click="openWeb(webHref.github)" :color="isDark ? '#fff' : '#000'" width="35" height="35"
              icon="mdi:github" class="cursor-pointer" />
          </div>
        </div>

        <button
          type="button"
          class="z-10 flex lg:hidden items-center justify-center size-11 self-center rounded-lg text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700"
          :aria-expanded="mobileMenuVisible"
          aria-controls="mobile-navigation"
          :aria-label="mobileMenuVisible ? t('关闭菜单') : t('打开菜单')"
          @click="mobileMenuVisible = !mobileMenuVisible"
        >
          <span aria-hidden="true" class="text-3xl leading-none">
            {{ mobileMenuVisible ? '×' : '☰' }}
          </span>
        </button>
      </div>

      <div
        v-if="mobileMenuVisible"
        class="fixed inset-x-0 top-16 bottom-0 z-40 bg-black/40 lg:hidden"
        @click.self="closeMobileMenu"
      >
        <nav
          id="mobile-navigation"
          class="absolute inset-x-3 top-3 max-h-[calc(100dvh-5.5rem)] overflow-y-auto rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-dark-blue"
        >
          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-text-blue hover:bg-gray-100 dark:hover:bg-slate-700"
            @click="openSearch"
          >
            <Icon icon="heroicons:magnifying-glass-solid" width="22" height="22" />
            {{ t('搜索') }}
          </button>

          <div class="my-2 h-px bg-gray-200 dark:bg-slate-700" />

          <div class="grid grid-cols-2 gap-1">
            <Link class="justify-start rounded-lg px-3 py-3 text-text-blue hover:bg-gray-100 dark:hover:bg-slate-700"
              href="/" @callback="closeMobileMenu">
              {{ t('首页') }}
            </Link>
            <Link class="justify-start rounded-lg px-3 py-3 text-text-blue hover:bg-gray-100 dark:hover:bg-slate-700"
              href="/author" @callback="closeMobileMenu">
              {{ t('关于我们') }}
            </Link>
            <Link class="justify-start rounded-lg px-3 py-3 text-text-blue hover:bg-gray-100 dark:hover:bg-slate-700"
              href="/editor" @callback="closeMobileMenu">
              {{ t('编辑') }}
            </Link>
          </div>

          <template v-if="modList().length">
            <div class="px-3 pb-1 pt-4 text-xs font-bold uppercase tracking-wider text-gray-400">
              {{ t('模组') }}
            </div>
            <Link v-for="item in modList()" :key="item.lang"
              class="justify-start rounded-lg px-3 py-2.5 text-text-blue hover:bg-gray-100 dark:hover:bg-slate-700"
              :href="`/wiki/${item.lang}`" @callback="closeMobileMenu">
              {{ t(item.lang) }}
            </Link>
          </template>

          <template v-if="moreUtilList().length">
            <div class="px-3 pb-1 pt-4 text-xs font-bold uppercase tracking-wider text-gray-400">
              {{ t('更多') }}
            </div>
            <Link v-for="item in moreUtilList()" :key="item.router"
              class="justify-start rounded-lg px-3 py-2.5 text-text-blue hover:bg-gray-100 dark:hover:bg-slate-700"
              :href="item.router" @callback="closeMobileMenu">
              {{ t(item.lang) }}
            </Link>
          </template>

          <div class="my-2 h-px bg-gray-200 dark:bg-slate-700" />

          <div class="flex flex-wrap items-center gap-2 px-1">
            <button v-for="lang in languages" :key="lang.name" type="button"
              class="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-700"
              @click="i18nScope.change(lang.name); closeMobileMenu()">
              {{ languageList[lang.name] }}
            </button>
            <button type="button" class="ml-auto rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-slate-700"
              :aria-label="t('切换主题')" @click="toggleTheme">
              <Icon width="24" height="24" :color="isDark ? '#66cffc' : '#ff454f'"
                :icon="`line-md:${isDark ? 'moon' : 'sunny'}-loop`" />
            </button>
            <button type="button" class="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-slate-700"
              aria-label="GitHub" @click="openWeb(webHref.github)">
              <Icon :color="isDark ? '#fff' : '#000'" width="24" height="24" icon="mdi:github" />
            </button>
          </div>
        </nav>
      </div>
    </div>

    <div class="dark:bg-black-blue min-h-[calc(100vh-64px)]">
      <router-view></router-view>
    </div>

    <div v-show="scrollVisible"
      class="fixed bottom-4 right-4 h-12 w-12 sm:bottom-5 sm:right-5 sm:w-[220px] rounded-full bg-white dark:bg-dark-blue center flex-row shadow z-50">
      <div class="hidden sm:block w-[100px] h-2 rounded-full" :style="{ backgroundColor: isDark ? '#3f3f45' : '#999' }">
        <div class="h-full rounded-full"
          :style="{ width: scrollProgress + 'px', backgroundColor: isDark ? '#0094f2' : '#0079ea' }" />
      </div>
      <div class="hidden sm:block ml-2 mr-2 text-text-blue w-[40px] text-right">{{ Math.floor(scrollProgress) }}%</div>
      <Icon :style="{ backgroundColor: isDark ? '#042235' : '#cce4fa' }" :color="isDark ? '#368cc5' : '#3483ce'" width="35"
        height="35" :icon="isUp ? 'lucide:move-up' : 'lucide:move-down'" class="rounded-full p-2 cursor-pointer"
        @click="scrollTo" />
    </div>
  </div>

  <Modal v-model:show="searchVisible">
    <template #default>
      <div class="flex flex-col size-full">
        <Input v-model="search" @change="change" :placeholder="t('输入内容以自动搜索')"
          default-model="search" is-debounce>
        <template #header>
          <div class="w-[25px] h-[25px] center dark:text-white">
            <Icon icon="material-symbols:search-rounded" width="30" height="30" />
          </div>
        </template>
        </Input>
        <div class="p-2 theme-cursor-blue flex flex-col dark:text-white mt-2 border border-text-blue"
          v-for="(item, index) in searchList" @click="gotoModWiki(item)" :key="index">
          <div class="flex flex-row size-full min-w-0">
            #&nbsp;
            <div class="flex flex-row justify-between size-full min-w-0 gap-3">
              <div class="shrink-0">{{ item.lang }}</div>
              <div class="ellipsis min-w-0 sm:w-[300px] text-end">
                {{ t(item.description) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>
