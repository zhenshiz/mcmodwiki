import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePageStore = defineStore(
  'page',
  () => {
    const isDark = ref(false)
    return {
      isDark
    }
  },
  {
    persist: {
      pick: ['isDark']
    }
  }
)
