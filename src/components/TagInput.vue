<script setup>
import Tag from '@/components/Tag.vue'
import Input from '@/components/Input.vue'
import { useMessage } from '@/components/register/useMessage.js'
import { usePageStore } from '@/stores'
import { translatable } from '@/assets/translatable/translatable'

const lang = computed(() => usePageStore().setting.language)
const message = useMessage()
const props = defineProps({
  tags: Array,
  //标签的边框颜色
  borderColor: String,
  //背景颜色
  backgroundColor: String,
  //标签的字体颜色
  color: String,
  placeholder: String,
})

const tag = ref('')
const emit = defineEmits(['update:tags'])
const addTag = () => {
  if (props.tags.includes(tag.value)) {
    message.warning(translatable(lang.value, 'message.warn.topic.tag.repetion'))
    return
  }
  let tags = Object.assign(props.tags)
  tags.push(tag.value)
  emit('update:tags', tags)
  tag.value = ''
}
const removeTag = (tag) => {
  let tags = Object.assign(props.tags)
  tags = tags.filter((t) => t !== tag)
  emit('update:tags', tags)
}
</script>

<template>
  <div class="flex flex-wrap gap-2 size-full items-baseline">
    <Tag
      @on-close="removeTag(tag)"
      :color="color"
      :backgroundColor="backgroundColor"
      :borderColor="borderColor"
      v-for="tag in tags"
      :key="tag"
      closable
      round
    >
      {{ tag }}
    </Tag>
    <Input
      class="mt-3 dark:text-white"
      default-model="input"
      @keydown.enter="addTag"
      v-model="tag"
      :placeholder="placeholder"
    >
      <template #footer>
        <div
          @click="addTag"
          class="absolute right-0 top-0 h-full aspect-square cursor-pointer rounded bg-blue-800 text-white center dark:text-black dark:bg-text-blue"
        >
          +
        </div>
      </template>
    </Input>
  </div>
</template>
