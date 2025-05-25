<script setup>
import { useEditTopicStore, usePageStore } from '@/stores/index.js'
import { usePluginViewContext } from '@prosemirror-adapter/vue'
import { translatable } from '@/assets/translatable/translatable.js'

const editTopicStore = useEditTopicStore()
const lang = computed(() => usePageStore().setting.language)
const form = computed(() => editTopicStore.getTopicInfo())
const { view } = usePluginViewContext()

const size = computed(() => {
  return view.value.state.doc.textContent.length
})

watch(
  () => size.value,
  () => {
    editTopicStore.setTopicInfo({
      textCount: size.value
    })
  }
)
</script>

<template>
  <!--底部提示-->
  <div v-if="form.mode==='preview'"
       class="min-h-[60px] flex justify-between items-end w-full bg-transparent text-[#666666]">
    <div class="ml-5">{{ translatable(lang,'milkdown.footer.save') }} x {{ form.autosaveCount }}</div>
    <div class="mr-5">{{ form.textCount }} {{ translatable(lang,'milkdown.footer.word') }}</div>
  </div>
</template>
