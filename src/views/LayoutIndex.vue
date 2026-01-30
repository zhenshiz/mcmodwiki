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
import { ref, computed, onMounted } from 'vue'

const { languages } = useVoerkaI18n(i18nScope)

const router = useRouter()
const pageStore = usePageStore()
const isDark = computed(() => pageStore.isDark)
const searchVisible = ref(false)

const search = ref('')
const searchList = ref([])
const change = () => {
  searchList.value = modList.filter(item => item.lang.toLowerCase().includes(search.value.toLowerCase()))
}

const toggleTheme = () => {
  if (isDark.value) {
    document.body.classList.remove('dark')
    pageStore.isDark = false
  } else {
    document.body.classList.add('dark')
    pageStore.isDark = true
  }
}

const gotoModWiki = item => {
  router.push(`/wiki/${item.lang}`)
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
const handleScroll = event => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
  scrollProgress.value = scrollTop / scrollHeight * 100
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
      <div class="flex flex-row justify-between w-[90%] size-full">
        <div class="z-10 flex flex-row items-center">
          <div class="ml-5 text-xl font-bold dark:text-white">MCModWiki</div>
        </div>
        
        <div class="hidden z-10 sm:flex flex-row items-center">
          
          <Dropdown>
            <template #trigger>
              <Icon class="cursor-pointer dark:text-white" icon="heroicons:magnifying-glass-solid" width="30"
                height="30" @click="() => searchVisible = true" />
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

          <Dropdown v-if="modList.length">
            <template #trigger>
              <div class="cursor-pointer m-2 text-lg text-text-blue whitespace-nowrap">
                {{ t('模组') }}
              </div>
            </template>
            <div class="flex flex-col py-2">
              <Link v-for="(item, index) in modList" class="m-2 text-lg text-text-blue"
                    :href="`/wiki/${item.lang}`" hoverLineType="toFlanks" :key="index">
                {{ item.lang }}
              </Link>
            </div>
          </Dropdown>

          <Dropdown v-if="moreUtilList.length">
            <template #trigger>
              <div class="cursor-pointer text-lg text-text-blue m-2 whitespace-nowrap">
                {{ t('更多') }}
              </div>
            </template>
            <div class="flex flex-col py-2">
              <Link v-for="(item, index) in moreUtilList" class="m-2 text-lg text-text-blue" :href="item.router"
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
                  <Translate id="notice" class="text-xs text-center">
                    找不到您的语言？<br>
                    点击这里协助翻译
                  </Translate>
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
      </div>
    </div>

    <div class="dark:bg-black-blue min-h-[calc(100vh-64px)]">
      <router-view></router-view>
    </div>

    <div v-show="scrollVisible"
      class="fixed bottom-5 right-5 h-12 w-[220px] rounded-full bg-white dark:bg-dark-blue center flex-row shadow z-50">
      <div class="w-[100px] h-2 rounded-full" :style="{ backgroundColor: isDark ? '#3f3f45' : '#999' }">
        <div class="h-full rounded-full"
          :style="{ width: scrollProgress + 'px', backgroundColor: isDark ? '#0094f2' : '#0079ea' }" />
      </div>
      <div class="ml-2 mr-2 text-text-blue w-[40px] text-right">{{ Math.floor(scrollProgress) }}%</div>
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
          <div class="flex flex-row size-full">
            #&nbsp;
            <div class="flex flex-row justify-between size-full">
              <div>{{ item.lang }}</div>
              <div class="ellipsis w-[300px] text-end">
                {{ t(item.description) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>