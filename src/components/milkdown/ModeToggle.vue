<script setup>
import { useEditTopicStore, usePageStore } from '@/stores/index.js'
import { translatable } from '@/assets/translatable/translatable.js'

const lang = computed(() => usePageStore().setting.language)
const props = defineProps({
  mode: String
})

const editTopicStore = useEditTopicStore()

const mode = computed(() => props.mode ?? editTopicStore.mode)

const emit = defineEmits(['update:mode'])
const updateMode = (value) => {
  if (props.mode){
    emit('update:mode',value)
  }
}
</script>

<template>
  <div class="flex flex-row pl-5 h-[43px] text-[16px] pt-[10px] dark:text-white">
    <div class="flex flex-col cursor-pointer" @click="updateMode('preview')">
      <div :class="{'text-text-blue':mode === 'preview'}">{{ translatable(lang,'milkdown.mode.toggle.preview') }}</div>
      <div v-show="mode === 'preview'" class="border-b-2 border-text-blue mt-[1px]" />
    </div>
    <div class="flex flex-col cursor-pointer ml-5" @click="updateMode('code')">
      <div :class="{'text-text-blue':mode === 'code'}">{{ translatable(lang,'milkdown.mode.toggle.code') }}</div>
      <div v-show="mode === 'code'" class="border-b-2 border-text-blue mt-[1px]" />
    </div>
  </div>
</template>
