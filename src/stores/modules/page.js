import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePageStore = defineStore(
  'page',
  () => {
    //需要持久化的设置信息
    const setting = ref({
      dark: false,
      language: 'zh_cn'
    })

    const setSetting = newSetting => {
      let { dark, language } = newSetting
      if (dark !== undefined) setting.value.dark = dark
      if (language !== undefined) setting.value.language = language
    }

    const isDark = computed(() => setting.value.dark)

    return {
      setting,
      setSetting,
      isDark
    }
  },
  {
    persist: {
      pick: ['setting']
    }
  }
)
