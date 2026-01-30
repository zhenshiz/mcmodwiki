import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import {
  resourceService,
  themeService,
  dialogueService,
  useFileSystem,
} from '@/views/more/chatbox/component/tree/useFileSystem.js'

import {
  getBuiltinTextures,
  resolveTexture,
} from '@/views/more/chatbox/component/tree/builtinResources.js'
import { useMessage } from '@/components/register/useMessage.js'
import { ChatBoxDialogues, DialogueFrame } from '@/assets/more/chatbox/chatboxDialogues'
import { i18nScope } from '@/languages'

const message = useMessage()

export const useChatBoxEditorStore = defineStore(
  'chatBoxEditor',
  () => {
    // === 状态 (State) ===
    const fileTree = ref([])
    const currentFile = ref(null)

    // 视图模式: 'empty' | 'theme' | 'dialogue'
    const viewMode = ref('empty')

    // 当前编辑的数据模型 (ChatBoxTheme 或 ChatBoxDialogues 实例)
    const currentModel = ref(null)

    // 纯文本内容的兜底 (用于非标准文件的查看)
    const currentDialogue = ref('')

    // 选中组件
    const selectedComponent = ref(null)
    const selectedComponentKey = ref(null)
    const selectedComponentClass = ref(null)

    // 资源管理
    const textureMap = ref(new Map())
    const textureSuggestions = ref([])
    const isProcessingResources = ref(false)

    // 动画预览 Trigger
    const previewAnimationKey = ref(null)

    // 文件系统钩子
    const fs = useFileSystem()

    // === 翻译键管理 ===
    const translatableKeyColumns = ref(['en_us', 'zh_cn'])
    const translatableKeyRows = ref([])

    // 添加新行 (Key)
    const addRow = () => {
      translatableKeyRows.value.unshift({
        key: 'new.key.' + Date.now(),
        value: new Array(translatableKeyColumns.value.length).fill(''),
      })
    }

    // 删除行
    const removeRow = (index) => {
      translatableKeyRows.value.splice(index, 1)
    }

    // 添加语言列
    const addColumn = (langCode) => {
      if (translatableKeyColumns.value.includes(langCode)) return
      translatableKeyColumns.value.push(langCode)
      translatableKeyRows.value.forEach((row) => row.value.push(''))
    }

    // 删除语言列
    const removeColumn = (colIndex) => {
      translatableKeyColumns.value.splice(colIndex, 1)
      translatableKeyRows.value.forEach((row) => row.value.splice(colIndex, 1))
    }

    const loadFromJson = (results) => {
      const newLangs = Object.keys(results)
      newLangs.forEach((lang) => {
        if (!translatableKeyColumns.value.includes(lang)) {
          addColumn(lang)
        }
      })

      const allKeys = new Set()
      Object.values(results).forEach((jsonObj) => {
        Object.keys(jsonObj).forEach((k) => allKeys.add(k))
      })

      allKeys.forEach((key) => {
        let row = translatableKeyRows.value.find((r) => r.key === key)
        if (!row) {
          row = {
            key: key,
            value: new Array(translatableKeyColumns.value.length).fill(''),
          }
          translatableKeyRows.value.push(row)
        }
        newLangs.forEach((lang) => {
          const val = results[lang][key]
          if (val !== undefined) {
            const colIndex = translatableKeyColumns.value.indexOf(lang)
            if (colIndex !== -1) {
              row.value[colIndex] = val
            }
          }
        })
      })
    }

    const getTranslatableJSON = (targetLang) => {
      if (!targetLang) return {}
      const colIndex = translatableKeyColumns.value.indexOf(targetLang)
      if (colIndex === -1) return {}

      const result = {}
      translatableKeyRows.value.forEach((row) => {
        if (row.key) {
          result[row.key] = row.value[colIndex] || ''
        }
      })
      return result
    }

    const translatableSuggestions = computed(() => {
      const currentActiveLang = i18nScope.activeLanguage || 'zh_cn'
      const targetLang = currentActiveLang.toLowerCase().replace(/-/g, '_')

      const colIndex = translatableKeyColumns.value.indexOf(targetLang)

      return translatableKeyRows.value.map((row) => {
        let translatedText = ''

        if (colIndex !== -1 && row.value[colIndex]) {
          translatedText = row.value[colIndex]
        }

        if (!translatedText) {
          translatedText = row.value.find((v) => v) || '无内容'
        }

        return {
          label: translatedText,
          value: row.key,
        }
      })
    })

    const getTranslatableLabel = (key) => {
      if (!key) return ''

      const currentLang = (i18nScope.activeLanguage || 'zh-cn').toLowerCase().replace(/-/g, '_')

      const colIndex = translatableKeyColumns.value.indexOf(currentLang)
      
      const value = translatableKeyRows.value.find((i) => i.key === key)
      if (value && value.value[colIndex]) {
        return value.value[colIndex]
      }

      return key
    }

    // === 动作 (Actions) ===

    const openProject = async () => {
      const result = await fs.openDirectory()
      if (result) {
        fileTree.value = result.tree
        currentFile.value = null
        currentModel.value = null
        currentDialogue.value = ''
        viewMode.value = 'empty'
        clearSelection()
      }
    }

    /**
     * 加载文件 (智能判断类型)
     */
    const loadFile = async (fileNode) => {
      if (!fileNode.handle) return

      try {
        const textContent = await fs.readFile(fileNode.handle)
        const path = fileNode.path.toLowerCase()
        const name = fileNode.name.toLowerCase()

        // 1. 主题文件 (theme)
        if (path.includes('theme') || name.includes('theme') || name.endsWith('theme.json')) {
          try {
            currentModel.value = themeService.parseTheme(textContent)
            currentFile.value = fileNode
            viewMode.value = 'theme'
            clearSelection()
          } catch (e) {
            console.warn('解析主题文件失败', e)
            message.error('主题解析失败，已切换至文本模式')
            currentDialogue.value = textContent
            currentFile.value = fileNode
            viewMode.value = 'dialogue' // 或其他 fallback 模式
          }
        } else if (
          path.includes('dialogue') ||
          path.includes('dialogues') ||
          name.endsWith('dialogue.json')
        ) {
          try {
            // 使用 dialogueService 将 JSON 解析为 ChatBoxDialogues 实例
            currentModel.value = dialogueService.parseDialogue(textContent)
            currentFile.value = fileNode
            viewMode.value = 'dialogue'
            clearSelection()
          } catch (e) {
            console.warn('解析对话文件失败', e)
            message.error('对话解析失败，已切换至文本模式')
            // 降级处理：作为纯文本存入 currentDialogue
            currentDialogue.value = textContent
            currentFile.value = fileNode
            viewMode.value = 'dialogue' // 这里可能需要一个专门的 'text' 模式，或者让 DialogueEditor 处理 string 类型的 model
          }
        }
        // 3. 其他 JSON/TXT 文件 -> 默认文本预览
        else if (name.endsWith('.json') || name.endsWith('.txt')) {
          currentDialogue.value = textContent
          currentFile.value = fileNode
          // 暂时指向 dialogue 视图，或者你可以做一个专门的 TextEditor
          viewMode.value = 'dialogue'
          clearSelection()
        } else {
          console.warn('不支持的文件类型')
        }
      } catch (err) {
        console.error(err)
        message.error(`加载失败: ${err.message}`)
      }
    }

    /**
     * 保存当前文件
     */
    const saveProject = async () => {
      if (!currentFile.value) {
        message.warning('没有打开的文件')
        return
      }

      try {
        let contentToSave = ''

        if (viewMode.value === 'theme' && currentModel.value) {
          contentToSave = themeService.stringifyTheme(currentModel.value)
        } else if (viewMode.value === 'dialogue') {
          if (currentModel.value) {
            contentToSave = dialogueService.stringifyDialogue(currentModel.value)
          } else {
            contentToSave = currentDialogue.value
          }
        }

        if (contentToSave) {
          await fs.saveFile(currentFile.value.handle, contentToSave)
          message.success('保存成功')
        }
      } catch (err) {
        console.error('保存失败', err)
        message.error('保存失败')
      }
    }

    const currentFrame = ref(null)
    const isShowGlobal = ref(true)

    const selectDialoguesComponent = (component, clazz, key) => {
      if (component instanceof DialogueFrame) {
        currentFrame.value = component
      }
      if (component instanceof ChatBoxDialogues) {
        isShowGlobal.value = true
      } else {
        isShowGlobal.value = false
      }
      selectComponent(component, clazz, key)
    }

    const selectComponent = (component, clazz, key = null) => {
      selectedComponent.value = component
      selectedComponentClass.value = clazz
      selectedComponentKey.value = key
    }

    const clearSelection = () => {
      selectedComponent.value = null
      selectedComponentClass.value = null
      selectedComponentKey.value = null
    }

    const importAssets = async () => {
      const result = await fs.openDirectory('chatbox-assets-dir')
      if (!result) return

      try {
        isProcessingResources.value = true
        resourceService.disposeResources(textureMap.value)
        const { textureMap: map, suggestions } = await resourceService.loadResourcePack(
          result.handle,
        )
        textureMap.value = map
        textureSuggestions.value = suggestions
        message.success(`资源包加载完成: ${map.size} 个文件`)
      } catch (err) {
        console.error('资源导入失败', err)
        message.error('资源导入失败')
      } finally {
        isProcessingResources.value = false
      }
    }

    const getTextureUrl = (path) => {
      if (!path) return ''
      return resolveTexture(path, textureMap.value)
    }

    const triggerAnimation = (key) => {
      previewAnimationKey.value = null
      setTimeout(() => {
        previewAnimationKey.value = key
      }, 0)
    }

    const allTextureOptions = computed(() => {
      const builtins = getBuiltinTextures() || []
      const userImports = (textureSuggestions.value || []).map((item) => ({
        label: item.label,
        value: item.value,
        icon: textureMap.value ? textureMap.value.get(item.value) : '',
      }))
      return [...userImports, ...builtins]
    })

    return {
      fileTree,
      currentFile,
      currentModel,
      currentDialogue,
      viewMode,
      selectedComponent,
      selectedComponentKey,
      textureMap,
      textureSuggestions,
      isProcessingResources,
      previewAnimationKey,
      translatableKeyColumns,
      translatableKeyRows,
      translatableSuggestions,
      selectedComponentClass,
      currentFrame,
      isShowGlobal,

      allTextureOptions,

      openProject,
      loadFile,
      saveProject,
      selectComponent,
      clearSelection,
      importAssets,
      getTextureUrl,
      triggerAnimation,
      addRow,
      removeRow,
      addColumn,
      removeColumn,
      loadFromJson,
      getTranslatableJSON,
      selectDialoguesComponent,
      getTranslatableLabel,
    }
  },
  {
    persist: {
      pick: ['translatableKeyColumns', 'translatableKeyRows'],
    },
  },
)
