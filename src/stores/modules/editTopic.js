import { defineStore } from 'pinia'
import { ref } from 'vue'
import { modList } from '@/assets/mod/mod.js'
import { language } from '@/assets/translatable/translatable.js'

export const useEditTopicStore = defineStore(
  'edit-topic',
  () => {

    let content = ref('')
    let mcVersion = ref('')
    let modLoader = ref('')
    let modVersion = ref('')
    let language = ref('')

    //preview | code
    let mode = ref('preview')
    let textCount = ref(0)
    let autosaveCount = ref(0)

    let editorContext = ref(null)

    const setTopicInfo = (topic) => {
      if (topic?.content !== undefined) content.value = topic.content
      if (topic?.mcVersion !== undefined) mcVersion.value = topic.mcVersion
      if (topic?.modLoader !== undefined) modLoader.value = topic.modLoader
      if (topic?.modVersion !== undefined) modVersion.value = topic.modVersion
      if (topic?.language !== undefined) language.value = topic.language
      if (topic?.mode !== undefined) mode.value = topic.mode
      if (topic?.textCount !== undefined) textCount.value = topic.textCount
      if (topic?.autosaveCount !== undefined) autosaveCount.value = topic.autosaveCount
      if (topic?.editorContext !== undefined) editorContext.value = topic.editorContext
    }

    const getTopicInfo = () => {
      return {
        content: content.value,
        mcVersion: mcVersion.value,
        modLoader: modLoader.value,
        modVersion: modVersion.value,
        language: language.value,
        mode: mode.value,
        textCount: textCount.value,
        autosaveCount: autosaveCount.value,
        editorContext: editorContext.value
      }
    }

    const resetTopicInfo = () => {
      content.value = ''
      mcVersion.value = ''
      modVersion.value = ''
      mode.value = 'preview'
      textCount.value = 0
      autosaveCount.value = 0
      editorContext.value = null
    }

    return {
      content,
      mcVersion,
      modLoader,
      modVersion,
      language,
      mode,
      textCount,
      autosaveCount,
      editorContext,
      setTopicInfo,
      getTopicInfo,
      resetTopicInfo
    }
  },
  {
    persist: {
      pick: ['content', 'mcVersion', 'modLoader', 'modVersion', 'language', 'mode', 'textCount', 'autosaveCount', 'editorContext']
    }
  }
)
