<script setup>
const props = defineProps({
  modelValue: String,
  placeholder: String,
  maxlength: Number
})

const emit = defineEmits(['update:modelValue'])
const textarea = ref()
const autoResizeTextarea = () => {
  if (textarea.value) {
    textarea.value.style.height = 'auto'
    textarea.value.style.height = `${textarea.value.scrollHeight}px`
  }
}

const handleInputCodeMarkdown = (event) => {
  const target = event.target

  autoResizeTextarea()
  emit('update:modelValue', target.value)
}

onMounted(() => autoResizeTextarea())
</script>

<template>
<textarea @input="handleInputCodeMarkdown($event)" ref="textarea"
          class="bg-transparent rounded resize-none focus:outline-none p-1"
          type="text"
          :value="modelValue"
          :placeholder="placeholder" :maxlength="maxlength" />
</template>
