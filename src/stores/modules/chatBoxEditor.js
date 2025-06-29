import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatBoxEditorStore = defineStore(
  'chat-box-editor',
  () => {
    const translatableKeyColumns = ref(['zh_cn', 'en_us'])
    const translatableKeyRows = ref([
      {
        key: '',
        value: ['', ''],
      },
    ])

    const themeSetting = ref({
      filename: '',
      theme: '',
      dialogBox: {},
      logButton: {},
      option: {},
      portrait: {},
    })

    const dialoguesSetting = ref({
      $introduce: '',
      dialogues: {},
      isTranslatable: false,
      isEsc: true,
      isPause: true,
      isHistoricalSkip: true,
      maxTriggerCount: -1,
    })

    const translatableKey = (lang) => {
      let index = translatableKeyColumns.value.findIndex((item) => item === lang)
      let json = {}
      translatableKeyRows.value.forEach((item) => {
        json[item.key] = item.value[index]
      })
      return json
    }

    const translatable = (lang, key) => {
      let index = translatableKeyColumns.value.findIndex((item) => item === lang)
      let value
      translatableKeyRows.value.forEach((item) => {
        if (item.key === key) {
          value = item.value[index]
        }
      })
      return value
    }

    const translatableOptions = (lang) => {
      let index = translatableKeyColumns.value.findIndex((item) => item === lang)
      let options = []
      translatableKeyRows.value.forEach((item) => {
        let json = {}
        json.label = item.value[index]
        json.value = item.key
        options.push(json)
      })
      return options
    }

    const setThemeSetting = (setting, isAllReplace = false) => {
      if (isAllReplace) {
        themeSetting.value = setting
      } else {
        switch (setting.key) {
          case 'dialogBox': {
            themeSetting.value.dialogBox = Object.assign(themeSetting.value.dialogBox, setting)
            break
          }
          case 'logButton': {
            themeSetting.value.logButton = Object.assign(themeSetting.value.logButton, setting)
            break
          }
          case 'option': {
            themeSetting.value.option = Object.assign(themeSetting.value.option, setting)
            break
          }
        }
      }
    }

    const setPortraitSetting = (setting, isAllReplace = false) => {
      if (isAllReplace) {
        themeSetting.value.portrait = setting
      } else {
        themeSetting.value.portrait[setting.key] = setting
      }
    }

    const setDialoguesSetting = (setting) => {
      dialoguesSetting.value = setting
    }

    const setTranslatableKey = (index, lang, value) => {
      translatableKeyRows.value[index][lang] = value
    }

    const addTranslatableKeyRow = () => {
      translatableKeyRows.value.push({
        key: '',
        value: Array.from({ length: translatableKeyColumns.value.length }, () => ''),
      })
    }

    const addTranslatableKeyCol = (index) => {
      translatableKeyColumns.value.push('')
      translatableKeyRows.value.forEach((row) => {
        row.value.push('')
      })
    }

    const removeTranslatableKeyCol = (index) => {
      translatableKeyColumns.value.splice(index, 1)
      translatableKeyRows.value.forEach((row) => {
        row.value.splice(index, 1)
      })
    }

    return {
      translatableKeyColumns,
      translatableKeyRows,
      themeSetting,
      dialoguesSetting,
      setThemeSetting,
      setPortraitSetting,
      setDialoguesSetting,
      setTranslatableKey,
      addTranslatableKeyRow,
      addTranslatableKeyCol,
      removeTranslatableKeyCol,
      translatableKey,
      translatableOptions,
      translatable
    }
  },
  {
    persist: {
      pick: ['translatableKeyColumns', 'translatableKeyRows', 'themeSetting', 'dialoguesSetting'],
    },
  },
)
