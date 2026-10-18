<script setup>
import Dropdown from '@/components/Dropdown.vue'
import { usePageStore } from '@/stores/index.js'
import { Icon } from '@iconify/vue'
import { RouterLink } from 'vue-router'
import Modal from '@/components/Modal.vue'
import { visibleModList, moreUtilList } from '@/assets/info/mod.js'
import { i18nScope } from '@/languages'
import { useVoerkaI18n } from '@voerkai18n/vue'
import { webUtil } from '@/utils/webUtil.js'
import { useEventListener } from '@vueuse/core'
import { languageList, webHref } from '@/assets/info/web.js'
import { computed, ref } from 'vue'

const { languages } = useVoerkaI18n(i18nScope)

const pageStore = usePageStore()
const isDark = computed(() => pageStore.isDark)
const searchVisible = ref(false)
const mobileMenuVisible = ref(false)
let themeTransitioning = false

const search = ref('')
const searchList = ref(visibleModList())
const change = () => {
  searchList.value = visibleModList().filter((item) =>
    item.lang.toLowerCase().includes(search.value.toLowerCase()),
  )
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
          `circle(${radius}px at ${originX}px ${originY}px)`,
        ],
      },
      {
        duration: 650,
        easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
        pseudoElement: '::view-transition-new(root)',
      },
    )

    await animation.finished
  } catch {
    applyTheme(nextIsDark)
  } finally {
    themeTransitioning = false
  }
}

const closeMobileMenu = () => {
  mobileMenuVisible.value = false
}

const openSearch = () => {
  closeMobileMenu()
  change()
  searchVisible.value = true
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
  scrollProgress.value =
    scrollHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100)) : 0
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

const keydownToSearch = (event) => {
  const os = webUtil.getOperatingSystem()
  if (
    (os === 'Mac' && event.metaKey && event.key === 'k') ||
    (os !== 'Mac' && event.ctrlKey && event.key === 'k')
  ) {
    event.preventDefault()
    openSearch()
  }
}

useEventListener('keydown', keydownToSearch)
useEventListener('scroll', handleScroll)
</script>

<template>
  <div class="site-layout">
    <header class="site-header">
      <div class="site-header-inner">
        <RouterLink to="/" class="site-brand" aria-label="MCModWiki 首页"
          ><span class="brand-mark" aria-hidden="true"><i /><i /><i /></span
          ><span
            >MCModWiki<span class="brand-subtitle">MODS & DOCUMENTATION</span></span
          ></RouterLink
        >
        <nav class="desktop-nav" :aria-label="t('主导航')">
          <RouterLink to="/" class="nav-link" exact-active-class="nav-link--active">{{
            t('首页')
          }}</RouterLink>
          <Dropdown trigger="click" placement="bottom-start" :offset="8"
            ><template #trigger
              ><button type="button" class="nav-link">
                {{ t('模组') }}<Icon icon="lucide:chevron-down" width="13" /></button
            ></template>
            <div class="min-w-[200px] p-1">
              <RouterLink
                v-for="item in visibleModList()"
                :key="item.lang"
                :to="`/wiki/${item.lang}`"
                class="mc-menu-item"
                ><img :src="item.icon" alt="" class="size-5 object-contain" />{{
                  item.lang
                }}</RouterLink
              >
            </div></Dropdown
          >
          <RouterLink to="/editor" class="nav-link" active-class="nav-link--active">{{
            t('文档编辑器')
          }}</RouterLink>
          <RouterLink to="/author" class="nav-link" active-class="nav-link--active">{{
            t('关于我们')
          }}</RouterLink>
          <RouterLink to="/chatbox/visual" class="nav-link"
            >{{ t('ChatBox 编辑器') }}<Icon icon="lucide:arrow-up-right" width="13"
          /></RouterLink>
        </nav>
        <div class="header-actions">
          <button
            type="button"
            class="header-search"
            :aria-label="t('搜索模组')"
            @click="openSearch"
          >
            <Icon icon="lucide:search" width="16" /><span>{{ t('搜索模组...') }}</span
            ><kbd>{{ webUtil.getOperatingSystem() === 'Mac' ? '⌘' : 'Ctrl' }} K</kbd>
          </button>
          <Dropdown trigger="click" placement="bottom-end" :offset="8"
            ><template #trigger
              ><button
                type="button"
                class="mc-icon-button language-button"
                :aria-label="t('切换语言')"
              >
                <Icon icon="lucide:languages" width="19" /></button
            ></template>
            <div class="min-w-[150px] p-1">
              <button
                v-for="lang in languages"
                :key="lang.name"
                type="button"
                class="mc-menu-item"
                @click="i18nScope.change(lang.name)"
              >
                {{ languageList[lang.name] }}</button
              ><a
                v-if="webHref.translatable"
                :href="webHref.translatable"
                class="mc-menu-item"
                target="_blank"
                rel="noopener noreferrer"
                >{{ t('协助翻译') }}</a
              >
            </div></Dropdown
          >
          <button
            type="button"
            class="mc-icon-button theme-toggle"
            :aria-label="isDark ? t('切换到亮色主题') : t('切换到暗色主题')"
            :aria-pressed="isDark"
            @click="toggleTheme"
          >
            <Icon :icon="isDark ? 'lucide:moon' : 'lucide:sun'" width="19" />
          </button>
          <a
            :href="webHref.github"
            target="_blank"
            rel="noopener noreferrer"
            class="mc-icon-button github-button"
            aria-label="GitHub"
            ><Icon icon="lucide:github" width="19"
          /></a>
          <button
            type="button"
            class="mc-icon-button mobile-menu-toggle"
            :aria-expanded="mobileMenuVisible"
            aria-controls="mobile-navigation"
            :aria-label="mobileMenuVisible ? t('关闭菜单') : t('打开菜单')"
            @click="mobileMenuVisible = !mobileMenuVisible"
          >
            <Icon :icon="mobileMenuVisible ? 'lucide:x' : 'lucide:menu'" width="21" />
          </button>
        </div>
      </div>
    </header>
    <div
      v-if="mobileMenuVisible"
      class="fixed inset-x-0 top-16 bottom-0 z-40 bg-black/40 lg:hidden"
      @click.self="closeMobileMenu"
    >
      <nav
        id="mobile-navigation"
        class="mc-panel absolute inset-x-4 top-3 max-h-[calc(100dvh-6rem)] overflow-y-auto p-2"
      >
        <RouterLink to="/" class="mc-menu-item" @click="closeMobileMenu">{{ t('首页') }}</RouterLink
        ><RouterLink to="/editor" class="mc-menu-item" @click="closeMobileMenu">{{
          t('文档编辑器')
        }}</RouterLink
        ><RouterLink to="/author" class="mc-menu-item" @click="closeMobileMenu">{{
          t('关于我们')
        }}</RouterLink>
        <div class="mc-label px-3 pt-5 pb-2">{{ t('模组') }}</div>
        <RouterLink
          v-for="item in visibleModList()"
          :key="item.lang"
          :to="`/wiki/${item.lang}`"
          class="mc-menu-item"
          @click="closeMobileMenu"
          ><img :src="item.icon" alt="" class="size-5 object-contain" />{{ item.lang }}</RouterLink
        >
        <div class="border-t border-ui-line mt-2 pt-2">
          <RouterLink
            v-for="item in moreUtilList()"
            :key="item.router"
            :to="item.router"
            class="mc-menu-item"
            @click="closeMobileMenu"
            >{{ item.lang }}<Icon icon="lucide:arrow-up-right" width="16"
          /></RouterLink>
        </div>
      </nav>
    </div>
    <div class="min-h-[calc(100vh-64px)]"><router-view /></div>
    <button
      v-show="scrollVisible"
      type="button"
      class="reading-progress"
      :aria-label="isUp ? t('回到顶部') : t('前往底部')"
      @click="scrollTo"
    >
      <span class="hidden sm:inline">{{ Math.floor(scrollProgress) }}%</span
      ><Icon :icon="isUp ? 'lucide:arrow-up' : 'lucide:arrow-down'" width="18" />
    </button>
    <Modal v-model:show="searchVisible" :title="t('搜索模组')"
      ><div class="flex flex-col gap-3">
        <Input v-model="search" :placeholder="t('输入模组名称...')" @change="change"
          ><template #header><Icon icon="lucide:search" width="18" /></template></Input
        ><RouterLink
          v-for="item in searchList"
          :key="item.lang"
          :to="`/wiki/${item.lang}`"
          class="mc-menu-item border border-ui-line"
          @click="searchVisible = false"
          ><img :src="item.icon" alt="" class="size-9 object-contain" />
          <div class="min-w-0">
            <div class="font-bold">{{ item.lang }}</div>
            <div class="text-xs text-ui-muted mt-1">{{ item.description }}</div>
          </div>
          <Icon icon="lucide:arrow-up-right" width="18" class="ml-auto shrink-0"
        /></RouterLink>
        <p v-if="!searchList.length" class="py-5 text-center text-sm text-ui-muted">
          {{ t('没有找到匹配的模组') }}
        </p>
        <div class="mc-label text-right">ESC {{ t('关闭') }}</div>
      </div></Modal
    >
  </div>
</template>

<style scoped>
.site-header {
  position: relative;
  height: 64px;
  z-index: 30;
  background: rgb(var(--ui-surface));
  border-bottom: 2px solid rgb(var(--ui-border));
}
.site-header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  max-width: 1400px;
  height: 100%;
  padding: 0 32px;
  margin: auto;
}
.site-brand {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  flex-shrink: 0;
  font-size: 17px;
  line-height: 1.2;
  font-weight: 850;
  letter-spacing: -0.04em;
}
.brand-subtitle {
  display: block;
  font: 7px monospace;
  letter-spacing: 0.08em;
  color: rgb(var(--ui-muted));
  margin-top: 5px;
}
.brand-mark {
  position: relative;
  display: block;
  width: 29px;
  height: 29px;
  border: 2px solid rgb(var(--ui-border));
  background: rgb(var(--ui-primary));
  box-shadow: 2px 2px 0 rgb(var(--ui-shadow));
}
.brand-mark i {
  position: absolute;
  width: 5px;
  height: 5px;
  background: rgb(var(--ui-on-accent));
  top: 6px;
  left: 4px;
}
.brand-mark i:nth-child(2) {
  left: 16px;
}
.brand-mark i:nth-child(3) {
  top: 15px;
  left: 9px;
  width: 7px;
  height: 7px;
}
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 23px;
  margin-left: auto;
}
.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 650;
  white-space: nowrap;
  padding: 20px 0;
  position: relative;
}
.nav-link:hover {
  color: rgb(var(--ui-link));
}
.nav-link--active::after {
  content: '';
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  height: 3px;
  background: rgb(var(--ui-link));
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 2px;
}
.header-search {
  display: flex;
  align-items: center;
  gap: 9px;
  background: rgb(var(--ui-inset));
  padding: 9px 10px;
  color: rgb(var(--ui-muted));
  margin-right: 8px;
  font-size: 11px;
  border: 1px solid rgb(var(--ui-line));
}
.header-search kbd {
  padding: 1px 4px;
  margin-left: 14px;
  border: 1px solid rgb(var(--ui-line));
  background: rgb(var(--ui-surface));
  font: 9px monospace;
}
.header-search:hover {
  border-color: rgb(var(--ui-border));
}
.mobile-menu-toggle {
  display: none;
}
.reading-progress {
  position: fixed;
  bottom: 22px;
  right: 22px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 14px;
  background: rgb(var(--ui-surface));
  border: 2px solid rgb(var(--ui-border));
  box-shadow: 3px 3px 0 rgb(var(--ui-shadow));
  color: rgb(var(--ui-text));
  font: 12px monospace;
  z-index: 30;
}
@media (max-width: 1279px) {
  .desktop-nav {
    gap: 16px;
  }
  .header-search > span,
  .header-search kbd {
    display: none;
  }
  .header-search {
    background: transparent;
    border-color: transparent;
    padding: 10px;
    margin: 0;
  }
}
@media (max-width: 1023px) {
  .desktop-nav {
    display: none;
  }
  .mobile-menu-toggle {
    display: inline-flex;
  }
  .site-header-inner {
    padding: 0 20px;
    gap: 10px;
  }
  .github-button {
    display: none;
  }
}
@media (max-width: 359px) {
  .brand-subtitle {
    display: none;
  }
  .site-brand {
    font-size: 15px;
    gap: 8px;
  }
  .language-button {
    display: none;
  }
  .site-header-inner {
    padding: 0 12px;
  }
}
</style>
