<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { modList } from '@/assets/mod/mod.js'
import { translatable } from '@/assets/translatable/translatable.js'
import { Icon } from '@iconify/vue'
import { usePageStore } from '@/stores/index.js'
import MarkdownReadOnly from '@/components/markdown/MarkDownReadOnly.vue'
import TreeItem from './component/TreeItem.vue'

const pageStore = usePageStore()
const route = useRoute()
const language = computed(() => pageStore.setting.language)
const isDark = computed(() => pageStore.isDark)
const router = useRouter()

const pageInfo = ref({
  name: '',
  version: '',
  moreUtil: [],
  availableHere: [],
  markdown: '',
  treeData: []
})
const currentFileName = ref('')
const mdRenderer = ref(null)

// 扫描 public/md 下所有的 md 文件
const allMdModules = import.meta.glob('/public/md/**/*.md')

const getFilesForMod = (modKey, lang) => {
  const prefix = `/public/md/${modKey}/${lang}/`
  return Object.keys(allMdModules)
    .filter(path => path.startsWith(prefix))
    .map(path => path.replace(prefix, ''))
}

// --- 核心：解析文件名树 ---
// 修改 ModWiki.vue 中的 buildFileTree
const buildFileTree = (files) => {
  const root = []
  // 保持自然排序，确保 01 排在 02 前面
  const sortedFiles = [...files].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

  sortedFiles.forEach(file => {
    // 假设文件名格式为 "00.介绍.md" 或 "01-test.md"
    const parts = file.replace('.md', '').split('.')
    let currentLevel = root

    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1

      // 核心：移除显示上的前缀数字（支持 "01." 或 "01-" 格式）
      const displayLabel = part.replace(/^(\d+[\.\-_])/, '')

      let node = currentLevel.find(p => p.label === displayLabel)
      if (!node) {
        node = {
          label: displayLabel,
          children: [],
          isLeaf: isLast,
          fullPath: isLast ? file : null
        }
        currentLevel.push(node)
      }
      currentLevel = node.children
    })
  })
  return root
}

const loadMarkdown = async (mod, lang, fileName) => {
  try {
    const res = await fetch(`/md/${mod}/${lang}/${fileName}`)
    const text = await res.text()
    if (text.startsWith('<!DOCTYPE html>')) throw new Error('Not Found')
    return text
  } catch (err) {
    console.error('加载 Markdown 失败:', err)
    return ''
  }
}

const selectFile = async (fileName) => {
  currentFileName.value = fileName
  const mod = modList.find(item => translatable(language.value, item.lang) === route.params.name)
  if (!mod) return

  const modKey = (mod.name || route.params.name).toLowerCase()
  pageInfo.value.markdown = await loadMarkdown(modKey, language.value, fileName)

  // 渲染后刷新 TOC
  await nextTick()
  if (mdRenderer.value?.updateHeadings) {
    mdRenderer.value.updateHeadings()
  }
}

const loadModInfo = async () => {
  // 重置状态
  pageInfo.value.markdown = ''
  pageInfo.value.name = ''

  const mod = modList.find(item => translatable(language.value, item.lang) === route.params.name)
  if (!mod) return

  pageInfo.value.name = translatable(language.value, mod.lang)
  pageInfo.value.version = mod.modVersion
  pageInfo.value.availableHere = mod.availableHere || []
  pageInfo.value.moreUtil = mod.moreUtil || []

  const modKey = (mod.name || route.params.name).toLowerCase()
  const files = getFilesForMod(modKey, language.value)
  const finalFiles = files.length > 0 ? files : (mod.files || [])

  pageInfo.value.treeData = buildFileTree(finalFiles)

  if (finalFiles.length > 0) {
    const queryFile = route.query.file
    const hasQueryFile = queryFile && finalFiles.includes(queryFile)

    let targetFile = finalFiles[0]
    if (hasQueryFile) {
      targetFile = queryFile
    } else if (currentFileName.value && finalFiles.includes(currentFileName.value)) {
      targetFile = currentFileName.value
    }

    await selectFile(targetFile)
  }
}

const openWeb = href =>{
  window.open(href)
}

onMounted(() => loadModInfo())
watch(() => route.query.file, (newFile) => {
  if (newFile && newFile !== currentFileName.value) {
    loadModInfo()
  }
})
watch([language, () => route.params.name], () => loadModInfo())
</script>

<template>
  <div class="flex h-screen w-full bg-white dark:bg-dark-blue overflow-hidden">
    <aside
      class="w-72 border-r dark:border-slate-800 flex flex-col shrink-0 bg-gray-50/30 dark:bg-transparent">
      <div class="p-6 h-full flex flex-col">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-xl font-bold dark:text-white truncate" :title="pageInfo.name">
            {{ pageInfo.name }}</h1>
          <span
            class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-sm">
            {{ pageInfo.version }}
          </span>
        </div>

        <div v-if="pageInfo.availableHere.length" class="mb-6">
          <div class="text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-wider px-2">
            {{ translatable(language, 'wiki.sidebar.1') }}
          </div>
          <div class="space-y-2">
            <div
              v-for="(item, index) in pageInfo.availableHere"
              :key="index"
              @click="openWeb(item.href)"
              class="flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all hover:bg-blue-500/5 border border-transparent hover:border-blue-500/20 group"
            >
              <div class="flex items-center gap-3">
                <Icon :icon="item.icon.icon" width="20" height="20"
                      :color="isDark ? item.icon.darkColor : item.icon.lightColor" />
                <span class="text-sm dark:text-gray-300 group-hover:text-blue-500">{{ item.icon.name
                  }}</span>
              </div>
              <Icon icon="quill:link-out" width="16"
                    class="text-gray-400 group-hover:text-blue-500" />
            </div>
          </div>
        </div>

        <div v-if="pageInfo.moreUtil.length" class="mb-6">
          <div class="space-y-2">
            <div
              v-for="(item, index) in pageInfo.moreUtil"
              :key="index"
              @click="router.push(item.router)"
              class="flex items-center p-2 rounded-lg cursor-pointer transition-all hover:bg-blue-500/5 border-l-4 border-l-transparent hover:border-l-blue-500 bg-gray-100/50 dark:bg-slate-800/50"
            >
              <span class="text-sm dark:text-gray-300 ml-2">{{ translatable(language, item.lang)
                }}</span>
            </div>
          </div>
        </div>

        <div class="h-px bg-gray-200 dark:bg-slate-800 mb-6" />

        <nav class="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <div class="text-[10px] font-bold text-gray-400 mb-4 uppercase tracking-widest px-2">
            {{ translatable(language, 'wiki.sidebar.2') }}
          </div>
          <div class="tree-container">
            <TreeItem
              v-for="node in pageInfo.treeData"
              :key="node.label"
              :item="node"
              :active-file="currentFileName"
              @select="selectFile"
            />
          </div>
        </nav>
      </div>
    </aside>

    <main
          class="flex-1 overflow-y-auto scroll-smooth custom-scrollbar bg-slate-50/30 dark:bg-transparent">
      <div class="mx-auto px-12 min-h-full">
        <MarkdownReadOnly :key="`${route.params.name}-${currentFileName}`" ref="mdRenderer" :content="pageInfo.markdown" />
      </div>
    </main>

    <aside class="w-64 hidden xl:block border-l dark:border-slate-800 p-8 shrink-0">
      <div class="sticky top-10">
        <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
          {{ translatable(language, 'wiki.sidebar.3') }}
        </div>
        <ul class="space-y-1 relative border-l dark:border-slate-800">
          <li v-for="h in mdRenderer?.headings" :key="h.id"
              :style="{ paddingLeft: `${(h.level - 1) * 0.75}rem` }"
              class="transition-all duration-300"
              :class="{
              'is-active': h.isActive && !h.isScrolledOver,
              'is-scrolled-over': h.isScrolledOver
            }"
          >
            <a
              href="javascript:;"
              @click="mdRenderer.scrollToHeading(h.id)"
              class="block py-1.5 text-xs border-l-2 -ml-[2px] pl-4 transition-colors"
              :class="(h.isActive && !h.isScrolledOver)
              ? 'text-blue-500 border-blue-500 font-bold'
              : 'text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300'"
            >
              {{ h.textContent }}
            </a>
          </li>
        </ul>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(100, 100, 100, 0.2);
  border-radius: 10px;
}
</style>
