<script setup>
import { TooltipProvider } from '@milkdown/plugin-tooltip'
import { linkSchema, updateLinkCommand } from '@milkdown/preset-commonmark'
import { TextSelection } from '@milkdown/prose/state'
import { callCommand } from '@milkdown/utils'
import { useInstance } from '@milkdown/vue'
import { usePluginViewContext } from '@prosemirror-adapter/vue'
import { useEditTopicStore } from '@/stores/modules/editTopic.js'
import { translatable } from '@/assets/translatable/translatable.js'
import { usePageStore } from '@/stores/index.js'

const { view, prevState } = usePluginViewContext()

const lang = computed(() => usePageStore().setting.language)
const linkHref = ref('')
const hide = ref(true)
const [loading, get] = useInstance()
const editTopicStore = useEditTopicStore()

const linkUpdPopRef = ref()
let tooltipProvider

onMounted(() => {
  const ctx = editTopicStore.editorContext
  if (!ctx) {
    return
  }

  tooltipProvider = new TooltipProvider({
    content: linkUpdPopRef.value,
    debounce: 50,
    shouldShow: (view, _) => {
      if (!view.hasFocus() || !view.editable) {
        return false
      }
      const { selection, doc } = view.state
      const { from, to } = selection

      const linkMarkType = linkSchema.type(ctx)
      if (
        selection instanceof TextSelection &&
        to < doc.content.size &&
        from < doc.content.size &&
        doc.rangeHasMark(from, from === to ? to + 1 : to, linkMarkType)
      ) {
        const cursor = selection.$cursor
        if (!cursor) {
          return false
        }
        const linkMark = doc
          .nodeAt(selection.$cursor.pos)
          ?.marks.find((mark) => mark.type === linkMarkType)
        if (!linkMark) {
          return false
        }
        linkHref.value = linkMark.attrs.href
        hide.value = false
        return selection.empty
      }
      return false
    }
  })

  tooltipProvider.update(view.value, prevState.value)
})

watch([view, prevState], () => {
  tooltipProvider?.update(view.value, prevState.value)
})

onUnmounted(() => {
  tooltipProvider?.destroy()
})

const handleUpdateLink = () => {
  get()?.action(callCommand(updateLinkCommand.key, { href: linkHref.value }))
}
</script>

<template>
  <div
    class="wrapper w-[350px] inline-flex absolute bg-white border border-text-blue dark:bg-dark-blue dark:text-white z-[9999]"
    ref="linkUpdPopRef">
    <input
      class="w-full border-none p-[10px] bg-transparent focus:outline-none"
      type="url"
      @keydown.enter="handleUpdateLink"
      v-model="linkHref"
    />
    <button
      class="cursor-pointer w-[65px] bg-transparent border-none text-[15px] pt-1 pb-1 flex-shrink-0 text-text-blue hover:text-white hover:bg-text-blue dark:hover:text-[#0c1720] dark:hover:bg-text-blue"
      @click="handleUpdateLink">
      {{ translatable(lang, 'milkdown.link.update') }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  &[data-show='false'] {
    display: none;
  }
}
</style>
