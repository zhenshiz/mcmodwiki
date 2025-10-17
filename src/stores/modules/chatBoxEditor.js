import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useChatBoxEditorStore = defineStore('chat-box-editor', () => {
  // 翻译列和行
  const translatableKeyColumns = ref(['zh_cn', 'en_us'])
  const translatableKeyRows = ref([
    { key: '', value: ['', ''] }
  ])

  const themeSetting = ref({
    theme: '',
    portrait: {},
    option: {},
    dialogBox: {},
    functionalButton: [],
    keyPrompt: {},
    customAnimation: {}
  })

  const dialoguesSetting = ref({
    $introduce: '',
    dialogues: {},
    isTranslatable: false,
    isEsc: true,
    isPause: true,
    isHistoricalSkip: true,
    maxTriggerCount: -1,
    isScreen: true,
    theme: ''
  })

  const animationSuggestions = computed(() => [
    { label: 'FADE_IN', value: 'FADE_IN' },
    { label: 'SLIDE_IN_FROM_BOTTOM', value: 'SLIDE_IN_FROM_BOTTOM' },
    { label: 'BOUNCE', value: 'BOUNCE' },
    ...Object.keys(themeSetting.value.customAnimation).map(k => ({ label: k, value: k }))
  ])

  // ========== 翻译键操作 ==========
  const getTranslatableJSON = (lang) => {
    const index = translatableKeyColumns.value.indexOf(lang)
    const json = {}
    translatableKeyRows.value.forEach(row => {
      if (row.key) json[row.key] = row.value[index] || ''
    })
    return json
  }

  const loadFromJson = (json) => {
    if (!json || typeof json !== 'object') return

    // 判断是多语言结构还是单语言（单文件只包含键值对）
    const isMultiLang = Object.values(json).every(v => typeof v === 'object' && v !== null)
    const parsed = isMultiLang ? json : { zh_cn: json }

    // 现有列 & 行
    const existingCols = [...translatableKeyColumns.value]
    const existingRows = [...translatableKeyRows.value]

    // 合并所有语言列（保持原有列顺序，新增列追加到末尾）
    for (const langCode of Object.keys(parsed)) {
      if (!existingCols.includes(langCode)) {
        existingCols.push(langCode)
      }
    }

    // 收集所有 key（已有 + 导入）
    const allKeysSet = new Set()
    existingRows.forEach(r => { if (r.key) allKeysSet.add(r.key) })
    for (const langCode in parsed) {
      const obj = parsed[langCode] || {}
      Object.keys(obj).forEach(k => allKeysSet.add(k))
    }
    const allKeys = Array.from(allKeysSet)

    // 为每个 key 构建一行，fill 对应列的值（缺失填 ''）
    const newRows = allKeys.map(key => {
      const values = existingCols.map(col => {
        // 优先取 parsed 中的值（导入覆盖同语言的单个 key）
        if (parsed[col] && Object.prototype.hasOwnProperty.call(parsed[col], key)) {
          return parsed[col][key]
        }
        // 若导入中无该 lang 的值，再取已有行中的旧值（保持之前填写的数据）
        const oldRow = existingRows.find(r => r.key === key)
        if (oldRow) {
          const oldColIndex = translatableKeyColumns.value.indexOf(col)
          if (oldColIndex >= 0 && oldRow.value[oldColIndex] !== undefined) {
            return oldRow.value[oldColIndex]
          }
        }
        return ''
      })
      return { key, value: values }
    })

    translatableKeyColumns.value = existingCols
    translatableKeyRows.value = newRows
  }

  const getTranslatableOptions = (lang) => {
    const index = translatableKeyColumns.value.indexOf(lang)
    return translatableKeyRows.value.map(row => ({
      label: row.value[index],
      value: row.key
    }))
  }


  const addRow = () => {
    translatableKeyRows.value.push({
      key: '',
      value: Array(translatableKeyColumns.value.length).fill('')
    })
  }

  const addColumn = (lang = '') => {
    translatableKeyColumns.value.push(lang)
    translatableKeyRows.value.forEach(row => row.value.push(''))
  }

  const removeColumn = (colIndex) => {
    translatableKeyColumns.value.splice(colIndex, 1)
    translatableKeyRows.value.forEach(row => row.value.splice(colIndex, 1))
  }

  const removeRow = (rowIndex) => {
    translatableKeyRows.value.splice(rowIndex, 1)
  }

  return {
    translatableKeyColumns,
    translatableKeyRows,
    themeSetting,
    dialoguesSetting,
    animationSuggestions,
    getTranslatableJSON,
    loadFromJson,
    getTranslatableOptions,
    addRow,
    addColumn,
    removeColumn,
    removeRow
  }
}, {
  persist: {
    pick: ['translatableKeyColumns', 'translatableKeyRows', 'themeSetting', 'dialoguesSetting']
  }
})
