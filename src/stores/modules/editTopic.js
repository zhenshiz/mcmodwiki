import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEditTopicStore = defineStore(
  'edit-topic',
  () => {

    let content = ref('')
    let filename = ref('')

    //preview | code
    let mode = ref('preview')

    let editorContext = ref(null)

    const setTopicInfo = (topic) => {
      if (topic?.content !== undefined) content.value = topic.content
      if (topic?.filename !== undefined) filename.value = topic.filename
      if (topic?.mode !== undefined) mode.value = topic.mode
      if (topic?.editorContext !== undefined) editorContext.value = topic.editorContext
    }

    const getTopicInfo = () => {
      return {
        content: content.value,
        filename: filename.value,
        mode: mode.value,
        editorContext: editorContext.value
      }
    }

    const resetTopicInfo = () => {
      content.value = ''
      filename.value = ''
      mode.value = 'preview'
      editorContext.value = null
    }

    return {
      content,
      filename,
      mode,
      editorContext,
      setTopicInfo,
      getTopicInfo,
      resetTopicInfo
    }
  },
  {
    persist: {
      pick: ['content', 'filename', 'mode', 'editorContext']
    }
  }
)
