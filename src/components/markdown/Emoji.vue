<script setup>
import { emojiArray } from '@/components/markdown/emoji/emoji.js'
import { Icon } from '@iconify/vue'

const props = defineProps({
  editor: {
    required: true
  }
})

const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(emojiArray.length / 49))

const paginatedEmojis = computed(() => {
  const start = (currentPage.value - 1) * 49
  return emojiArray.slice(start, start + 49)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const selectEmoji = (emoji) => {
  props.editor.chain().focus()
    .insertContent({
      type: 'text',
      text: emoji
    })
    .run()
}
</script>

<template>
  <div class="grid grid-cols-7">
      <span
        v-for="(emoji, index) in paginatedEmojis"
        :key="index"
        @click="selectEmoji(emoji)"
        class="p-[2px] text-center text-xl button-theme-cursor-blue select-none"
      >
        {{ emoji }}
      </span>
  </div>

  <div class="center w-full text-xl dark:text-white">
      <span
        class="pl-1 pr-1 pt-2 pb-2 shadow mr-2 hover:text-text-blue button-theme-cursor-blue"
        @click="prevPage">
        <Icon icon="lucide:chevron-left" />
      </span>

    <span
      class="pl-1 pr-1 pt-2 pb-2 rounded-xl shadow hover:text-text-blue button-theme-cursor-blue"
      @click="nextPage">
        <Icon icon="lucide:chevron-right" />
      </span>
  </div>
</template>
