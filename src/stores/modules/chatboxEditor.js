import { defineStore } from 'pinia'
import { useGameBridgeStore } from './gameBridge.js'
import { gameFileTree, gameFileRequest } from '@/views/more/chatbox/bridge/gameFiles.js'
import { computed, nextTick, ref, watch } from 'vue'
import _ from 'lodash'

import { dialogueService, themeService } from '@/views/more/chatbox/component/tree/chatboxSerialization.js'
import { useMessage } from '@/components/register/useMessage.js'
import { useDialog } from '@/components/register/useDialog.js'
import { ChatBoxDialogues, DialogueFrame, DialogueOption } from '@/assets/more/chatbox/chatboxDialogues'
import { analyzeDialogue, connectionTarget, renameGroupReferences, reindexFrameReferences } from '@/views/more/chatbox/flow/dialogueFlow.js'
import { i18nScope, t } from '@/languages'

const message = useMessage()
const DIALOGUE_FRAME_SECTION_KEYS = new Set(['basic', 'dialogBox', 'option', 'portrait', 'video'])

export const useChatBoxEditorStore = defineStore(
  'chatBoxEditor',
  () => {
    const bridge = useGameBridgeStore()

    // === 状态 (State) ===
    const currentFile = ref(null)
    const gameFiles = computed(() => gameFileTree(bridge.files, bridge.serverSession))
    const selectedTreeNode = ref(null)
    const viewMode = ref('empty')
    const currentModel = ref(null)
    const currentDialogue = ref('')
    let activeDialogueGroupKey = ref(null)
    const dialogueGroupOrder = ref([])
    const dialogueEditorView = ref('graph')
    const dialogueGraphGroupKey = ref(null)
    const dialogueDiagnosticsOpen = ref(false)
    const dialogueGraphFocus = ref(null)
    const dialogueGraphLayouts = ref({})
    const dialogueDebugFollow = ref(true)
    const dialogueDebugPending = ref(false)
    const dialogueDebugIssue = ref('')
    let debugTimer, debugSending = false, debugLastSent = ''
    const debuggingCurrentFile = computed(() => bridge.debugActive && bridge.debugFileId === currentFile.value?.resourceId && viewMode.value === 'dialogue')
    const dialogueTheme = ref(null)
    const dialogueThemeState = ref('')
    let dialogueThemeLoad = Promise.resolve()
    const flowOptions = () => ({ fileId: currentFile.value?.resourceId, theme: dialogueTheme.value, themeState: dialogueThemeState.value })
    const dialogueAnalysis = computed(() => viewMode.value === 'dialogue' && currentModel.value
      ? analyzeDialogue(currentModel.value, flowOptions()) : { transitions: [], diagnostics: [] })

    watch(() => [viewMode.value, currentModel.value?.theme, currentFile.value, bridge.serverSession, bridge.connected], (_, __, onCleanup) => {
      let cancelled = false
      onCleanup(() => { cancelled = true })
      dialogueTheme.value = null
      dialogueThemeState.value = ''
      dialogueThemeLoad = Promise.resolve()
      if (viewMode.value !== 'dialogue' || !currentModel.value?.theme) return
      dialogueThemeState.value = 'loading'
      dialogueThemeLoad = (async () => { try {
        const id = currentModel.value.theme
        const result = await bridge.request('files.read', { kind: 'theme', resourceId: id.includes(':') ? id : `minecraft:${id}`, serverSession: bridge.serverSession })
        if (!cancelled) {
          dialogueTheme.value = JSON.parse(result.content)
          dialogueThemeState.value = 'ready'
        }
      } catch {
        if (!cancelled) dialogueThemeState.value = 'unavailable'
      } })()
    })

    const selectedComponent = ref(null)
    const selectedComponentKey = ref(null)
    const selectedComponentClass = ref(null)

    const previewAnimationKey = ref(null)
    const _savedSnapshot = ref(null)
    const dialogueFrameClipboard = ref(null)

    // 序列化当前内容为字符串，用于脏检测
    const _serializeCurrentContent = () => {
      if (viewMode.value === 'theme' && currentModel.value) {
        return themeService.stringifyTheme(currentModel.value)
      } else if (viewMode.value === 'dialogue') {
        if (currentModel.value) {
          return dialogueService.stringifyDialogue(currentModel.value)
        }
        return currentDialogue.value || null
      }
      return null
    }

    // 检查当前文件是否有未保存的修改
    const checkDirty = () => {
      if (!currentFile.value) return false
      const current = _serializeCurrentContent()
      return current !== null && current !== _savedSnapshot.value
    }

    // === 翻译键管理 ===
    const translatableKeyColumns = ref(['en_us', 'zh_cn'])
    const translatableKeyRows = ref([])

    const globalAnimations = computed(() => Object.keys(currentModel.value?.customAnimation || {}))
    const globalPortraits = computed(() => Object.keys(currentModel.value?.portrait || {}))

    const selectTreeNode = (node) => {
      selectedTreeNode.value = node
    }

    const addRow = () => {
      translatableKeyRows.value.unshift({
        key: 'new.key.' + Date.now(),
        value: new Array(translatableKeyColumns.value.length).fill(''),
      })
    }

    const removeRow = (index) => {
      translatableKeyRows.value.splice(index, 1)
    }

    const addColumn = (langCode) => {
      if (translatableKeyColumns.value.includes(langCode)) return
      translatableKeyColumns.value.push(langCode)
      translatableKeyRows.value.forEach((row) => row.value.push(''))
    }

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

    const activePreviewLanguage = computed(() => bridge.connected
      ? bridge.snapshot?.language : (i18nScope.activeLanguage || 'zh-cn').toLowerCase().replace(/-/g, '_'))

    const translatableSuggestions = computed(() => {
      const labels = new Map(bridge.connected ? Object.entries(bridge.snapshot?.translations || {}) : [])
      const col = translatableKeyColumns.value.indexOf(activePreviewLanguage.value)
      for (const row of translatableKeyRows.value) {
        const label = row.value[col] || (!bridge.connected && row.value.find(Boolean))
        if (label) labels.set(row.key, label)
        else if (!labels.has(row.key)) labels.set(row.key, row.key)
      }
      return [...labels].map(([value, label]) => ({ label, value }))
    })

    const getTranslatableLabel = (key) => {
      if (!key) return ''
      const col = translatableKeyColumns.value.indexOf(activePreviewLanguage.value)
      const row = translatableKeyRows.value.find(row => row.key === key)
      return row?.value[col] || (bridge.connected && bridge.snapshot?.translations[key]) || key
    }

    const readEditorFile = async (node) => {
      if (!bridge.connected) throw new Error('请先连接游戏')
      const result = await bridge.request('files.read', gameFileRequest(node, bridge.serverSession), 60000)
      Object.assign(node, result)
      return result.content
    }

    const previewInGame = async ({ stream = false, isCurrent = () => true } = {}) => {
      const serialized = _serializeCurrentContent()
      if (!serialized) throw new Error('请先打开对话或主题文件')
      const content = JSON.parse(serialized)
      if (viewMode.value === 'theme') {
        // Hierarchy visibility is a preview override; it never changes the saved theme.
        const hideForPreview = (draft, model) => { if (draft && model?._hidden) draft.hidden = true }
        for (const key of ['dialogBox', 'option', 'keyPrompt']) hideForPreview(content[key], currentModel.value[key])
        for (const [key, portrait] of Object.entries(currentModel.value.portrait || {})) hideForPreview(content.portrait?.[key], portrait)
        currentModel.value.functionalButton?.forEach((button, index) => hideForPreview(content.functionalButton?.[index], button))
      }
      const translations = {}
      translatableKeyColumns.value.forEach((language, col) => {
        const rows = translatableKeyRows.value.filter(row => row.key && row.value[col])
        if (rows.length) translations[language] = Object.fromEntries(rows.map(row => [row.key, row.value[col]]))
      })
      await bridge.request('assets.commit', { images: [], translations }, 120000)
      if (!isCurrent()) return
      const group = activeDialogueGroupKey.value || Object.keys(content.dialogues || {})[0] || 'preview'
      const frames = currentModel.value?.dialogues?.[group] || []
      const selectedIndex = currentFrame.value ? frames.indexOf(currentFrame.value) : -1
      return bridge.preview({ kind: viewMode.value, content, group, index: Math.max(0, selectedIndex), stream,
        sample: viewMode.value === 'theme' ? { name: currentModel.value.dialogBox?._name, text: currentModel.value.dialogBox?._text, options: currentModel.value.option?._text || [] } : undefined })
    }

    const startDialogueDebug = async (group, index = 0) => {
      if (!currentModel.value?.dialogues?.[group]?.[index]) throw new Error('请选择有效的对话节点')
      const file = currentFile.value
      await nextTick()
      await dialogueThemeLoad
      if (file !== currentFile.value) return
      if (dialogueAnalysis.value.diagnostics.some(item => item.severity === 'error')) {
        dialogueDiagnosticsOpen.value = true
        throw new Error('对话存在无效跳转，请先修复检查面板中的错误')
      }
      if (!bridge.connected || !bridge.snapshot?.dialogueDebug) throw new Error('请更新并重启 ChatBox 模组以启用对话调试')
      const translations = {}
      translatableKeyColumns.value.forEach((language, col) => {
        translations[language] = Object.fromEntries(translatableKeyRows.value.filter(row => row.key && row.value[col]).map(row => [row.key, row.value[col]]))
      })
      await bridge.request('assets.commit', { images: [], translations }, 120000)
      if (file !== currentFile.value) return
      debugLastSent = _serializeCurrentContent()
      dialogueDebugIssue.value = ''
      return bridge.startDebug({ resourceId: file.resourceId, content: debugLastSent, group, index })
    }

    const syncDialogueDebug = async () => {
      clearTimeout(debugTimer)
      if (!debuggingCurrentFile.value || bridge.debugStarting || debugSending) return
      const content = _serializeCurrentContent()
      if (!content || content === debugLastSent) { dialogueDebugPending.value = false; return }
      if (dialogueAnalysis.value.diagnostics.some(item => item.severity === 'error')) {
        dialogueDebugIssue.value = t('草稿存在无效跳转，调试保持上一个有效版本')
        dialogueDebugPending.value = true
        return
      }
      const session = bridge.debugSession
      debugSending = true
      try {
        await bridge.updateDebug({ content })
        if (bridge.debugSession === session) {
          debugLastSent = content
          dialogueDebugIssue.value = ''
          dialogueDebugPending.value = _serializeCurrentContent() !== content
        }
      } catch (error) {
        if (bridge.debugSession === session && bridge.debugActive) { dialogueDebugIssue.value = t(error.message); dialogueDebugPending.value = true }
      } finally {
        debugSending = false
        // Coalesce edits made while an acknowledgement was in flight; a failed version waits for a new edit or explicit retry.
        if (bridge.debugSession === session && debuggingCurrentFile.value && _serializeCurrentContent() !== content) debugTimer = setTimeout(syncDialogueDebug, 180)
      }
    }

    watch(() => [debuggingCurrentFile.value, bridge.debugStarting, _serializeCurrentContent()], () => {
      clearTimeout(debugTimer)
      if (!debuggingCurrentFile.value) { dialogueDebugPending.value = false; return }
      dialogueDebugPending.value = _serializeCurrentContent() !== debugLastSent
      if (dialogueDebugPending.value) debugTimer = setTimeout(syncDialogueDebug, 180)
    })
    watch(currentFile, (file, previous) => {
      if (previous && file !== previous && bridge.debugActive) bridge.stopDebug().catch(() => {})
    })

    // === 动作 (Actions) ===

    const loadFile = async (fileNode) => {
      if (fileNode.isFolder) return

      try {
        activeDialogueGroupKey.value = null
        dialogueGroupOrder.value = []
        dialogueGraphGroupKey.value = null
        dialogueDiagnosticsOpen.value = false
        const textContent = await readEditorFile(fileNode)
        currentModel.value = null
        const path = fileNode.path.toLowerCase()
        const name = fileNode.name.toLowerCase()

        if (path.includes('theme') || name.includes('theme') || name.endsWith('theme.json')) {
          try {
            currentModel.value = themeService.parseTheme(textContent)
            currentFile.value = fileNode
            viewMode.value = 'theme'
            clearSelection()
          } catch (e) {
            console.warn('解析主题文件失败', e)
            message.error(t('主题解析失败，已切换至文本模式'))
            currentDialogue.value = textContent
            currentFile.value = fileNode
            viewMode.value = 'dialogue'
          }
        } else if (
          path.includes('dialogue') ||
          path.includes('dialogues') ||
          name.endsWith('dialogue.json')
        ) {
          try {
            currentModel.value = dialogueService.parseDialogue(textContent)
            currentFile.value = fileNode
            viewMode.value = 'dialogue'
            clearSelection()
          } catch (e) {
            console.warn('解析对话文件失败', e)
            message.error(t('对话解析失败，已切换至文本模式'))
            currentDialogue.value = textContent
            currentFile.value = fileNode
            viewMode.value = 'dialogue'
          }
        }
        else if (name.endsWith('.json') || name.endsWith('.txt')) {
          currentDialogue.value = textContent
          currentFile.value = fileNode
          viewMode.value = 'dialogue'
          clearSelection()
        } else {
          console.warn('不支持的文件类型')
        }

        _savedSnapshot.value = _serializeCurrentContent()
      } catch (err) {
        console.error(err)
        message.error(t('加载失败: {}', t(err.message)))
      }
    }

    const saveProject = async () => {
      if (!currentFile.value) {
        message.warning(t('没有打开的文件'))
        return
      }

      try {
        const savingFile = currentFile.value
        await nextTick()
        if (viewMode.value === 'dialogue') await dialogueThemeLoad
        if (currentFile.value !== savingFile) return false
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
          if (viewMode.value === 'dialogue') {
            const validation = analyzeDialogue(JSON.parse(contentToSave), flowOptions())
            if (validation.diagnostics.some(item => item.severity === 'error')) {
              dialogueDiagnosticsOpen.value = true
              dialogueEditorView.value = 'graph'
              message.error(t('对话存在无效跳转，请修复检查面板中的错误后保存'))
              return false
            }
          }
          const file = currentFile.value
          if (!bridge.connected) throw new Error('请先连接游戏')
          const result = await bridge.request('files.write', {
            ...gameFileRequest(file, bridge.serverSession), revision: file.revision, content: contentToSave,
          }, 120000)
          Object.assign(file, result)
          _savedSnapshot.value = contentToSave
          message.success(t('已保存到游戏并重载：{}', result.savePath))
          bridge.refresh().catch(() => {})
          return true
        }
      } catch (err) {
        console.error('保存失败', err)
        message.error(t('保存失败：{}', t(err.message)))
        return false
      }
    }

    const currentFrame = ref(null)
    const isShowGlobal = ref(true)
    const hasDialogueFrameClipboard = computed(() => dialogueFrameClipboard.value !== null)
    const lastDialogueFrameSectionKey = ref('basic')

    const selectDialoguesComponent = (component, clazz, key, ownerFrame = null) => {
      if (component instanceof DialogueFrame) {
        currentFrame.value = component
      } else if (ownerFrame instanceof DialogueFrame) {
        currentFrame.value = ownerFrame
      }
      if (DIALOGUE_FRAME_SECTION_KEYS.has(key)) lastDialogueFrameSectionKey.value = key
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
      currentFrame.value = null
      isShowGlobal.value = true
    }

    const copyDialogueFrameToClipboard = (frame) => {
      if (!(frame instanceof DialogueFrame)) return false
      dialogueFrameClipboard.value = _.cloneDeep(frame)
      return true
    }

    const getDialogueFrameFromClipboard = () => {
      if (!dialogueFrameClipboard.value) return null
      return _.cloneDeep(dialogueFrameClipboard.value)
    }

    const syncDialogueGroupOrder = (dialogues) => {
      const targetDialogues = dialogues || currentModel.value?.dialogues || {}
      const nextOrder = dialogueGroupOrder.value.filter((key) => targetDialogues[key])
      Object.keys(targetDialogues).forEach((key) => {
        if (!nextOrder.includes(key)) {
          nextOrder.push(key)
        }
      })
      dialogueGroupOrder.value = nextOrder
    }

    const addDialogueGroupKey = (key) => {
      if (!key || dialogueGroupOrder.value.includes(key)) return
      dialogueGroupOrder.value = [...dialogueGroupOrder.value, key]
    }

    const reorderDialogueGroupKeys = (keys) => {
      const dialogues = currentModel.value?.dialogues || {}
      const orderedKeys = (keys || []).filter((key, index, array) => {
        return !!dialogues[key] && array.indexOf(key) === index
      })
      const missingKeys = Object.keys(dialogues).filter((key) => !orderedKeys.includes(key))
      dialogueGroupOrder.value = [...orderedKeys, ...missingKeys]
    }

    const renameDialogueGroup = (oldKey, newKey) => {
      const dialogues = currentModel.value?.dialogues
      const trimmedKey = (newKey || '').trim()
      if (!dialogues || !oldKey || !dialogues[oldKey]) {
        return { ok: false, reason: 'missing' }
      }
      if (!trimmedKey) {
        return { ok: false, reason: 'empty' }
      }
      if (trimmedKey !== oldKey && dialogues[trimmedKey]) {
        return { ok: false, reason: 'duplicate' }
      }
      if (trimmedKey === oldKey) {
        return { ok: true, changed: false, key: oldKey }
      }
      try { connectionTarget(trimmedKey) } catch {
        message.warning(t('该组名是保留跳转值，请先重命名或手动编写指令'))
        return { ok: false, reason: 'reserved' }
      }

      renameGroupReferences(currentModel.value, oldKey, trimmedKey, flowOptions())
      const newMap = Object.fromEntries(Object.entries(dialogues).map(([key, frames]) => [key === oldKey ? trimmedKey : key, frames]))
      currentModel.value.dialogues = newMap

      const groupIndex = dialogueGroupOrder.value.indexOf(oldKey)
      if (groupIndex !== -1) {
        const nextOrder = [...dialogueGroupOrder.value]
        nextOrder[groupIndex] = trimmedKey
        dialogueGroupOrder.value = nextOrder
      } else {
        syncDialogueGroupOrder(newMap)
      }

      if (activeDialogueGroupKey.value === oldKey) {
        activeDialogueGroupKey.value = trimmedKey
      }
      if (dialogueGraphGroupKey.value === oldKey) dialogueGraphGroupKey.value = trimmedKey

      return { ok: true, changed: true, key: trimmedKey }
    }

    const deleteDialogueGroup = (key) => {
      const dialogues = currentModel.value?.dialogues
      if (!dialogues?.[key]) return false
      delete dialogues[key]
      dialogueGroupOrder.value = dialogueGroupOrder.value.filter((item) => item !== key)
      if (activeDialogueGroupKey.value === key) {
        activeDialogueGroupKey.value = null
      }
      if (dialogueGraphGroupKey.value === key) dialogueGraphGroupKey.value = null
      return true
    }

    const replaceDialogueFrames = (groupKey, frames, confirmed = false) => {
      const before = currentModel.value.dialogues[groupKey]
      const movesExistingFrames = before.some((frame, index) => frames.indexOf(frame) !== index)
      if (!confirmed && movesExistingFrames && dialogueAnalysis.value.diagnostics.some(item => ['mvel-ignored', 'dynamic-command', 'theme-unavailable', 'runtime-theme'].includes(item.code))) {
        useDialog().warning({ title: t('检查动态跳转'), content: t('存在无法分析的脚本或主题。调整对话顺序后，请手动检查其中的序号引用。'), onPositiveClick: () => replaceDialogueFrames(groupKey, frames, true) })
        return false
      }
      const problems = reindexFrameReferences(currentModel.value, groupKey, frames, flowOptions())
      if (problems.length) {
        message.warning(t('调整顺序会改变现有跳转，请先修改引用该对话的连线或指令'))
        return false
      }
      currentModel.value.dialogues[groupKey] = frames
      if (before.includes(currentFrame.value) && !frames.includes(currentFrame.value)) clearSelection()
      return true
    }

    const connectDialogue = (sourceGroup, targetGroup, sourceIndex = null, targetIndex = null) => {
      const frames = currentModel.value?.dialogues?.[sourceGroup]
      const target = currentModel.value?.dialogues?.[targetGroup]
      if (!frames?.length || !target?.length) {
        message.warning(t('请先给两个对话组添加对话，再创建连线'))
        return false
      }
      const index = sourceIndex ?? frames.length - 1
      if (!frames[index]) return false
      try {
        const option = new DialogueOption()
        option.text = t('继续')
        option.next = connectionTarget(targetGroup, sourceGroup === targetGroup ? targetIndex : null)
        frames[index].options.options.push(option)
        activeDialogueGroupKey.value = sourceGroup
        selectDialoguesComponent(option, DialogueOption, 'option', frames[index])
        message.success(t('已添加继续选项，可在右侧编辑'))
        return true
      } catch (error) {
        message.warning(t(error.message))
        return false
      }
    }

    const getTextureUrl = (path) => {
      if (!path || !bridge.connected) return ''
      const id = path.includes(':') ? path : `chatbox:${path}`
      return bridge.imageUrl('texture', id)
    }

    const getItemUrl = (id, customModelData = 0) => {
      if (!id || !bridge.connected) return ''
      const normalized = id.includes(':') ? id : `minecraft:${id}`
      return bridge.imageUrl('item', normalized, customModelData)
    }

    const triggerAnimation = (key) => {
      previewAnimationKey.value = null
      setTimeout(() => {
        previewAnimationKey.value = key
      }, 0)
    }

    const allTextureOptions = computed(() => bridge.options('TEXTURE').map(item => ({ ...item, textureId: item.value })))

    return {
      gameFiles,
      currentFile,
      selectedTreeNode,
      currentModel,
      currentDialogue,
      activeDialogueGroupKey,
      dialogueGroupOrder,
      dialogueEditorView,
      dialogueGraphGroupKey,
      dialogueDiagnosticsOpen,
      dialogueGraphFocus,
      dialogueGraphLayouts,
      dialogueAnalysis,
      dialogueTheme,
      debuggingCurrentFile,
      dialogueDebugFollow,
      dialogueDebugPending,
      dialogueDebugIssue,
      startDialogueDebug,
      syncDialogueDebug,
      replaceDialogueFrames,
      connectDialogue,
      viewMode,
      selectedComponent,
      selectedComponentKey,
      previewAnimationKey,
      translatableKeyColumns,
      translatableKeyRows,
      translatableSuggestions,
      selectedComponentClass,
      currentFrame,
      isShowGlobal,
      hasDialogueFrameClipboard,
      lastDialogueFrameSectionKey,
      globalAnimations,
      globalPortraits,
      checkDirty,

      allTextureOptions,
      getItemUrl,
      previewInGame,

      loadFile,
      saveProject,
      selectTreeNode,
      selectComponent,
      clearSelection,
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
      copyDialogueFrameToClipboard,
      getDialogueFrameFromClipboard,
      syncDialogueGroupOrder,
      addDialogueGroupKey,
      reorderDialogueGroupKeys,
      renameDialogueGroup,
      deleteDialogueGroup
    }
  },
  {
    persist: {
      pick: ['translatableKeyColumns', 'translatableKeyRows']
    },
  },
)
