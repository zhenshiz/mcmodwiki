<script setup>
import { useEditTopicStore } from '@/stores/index.js'

const props = defineProps({
  mode: String,
})

const editTopicStore = useEditTopicStore()

const mode = computed(() => props.mode ?? editTopicStore.mode)

const emit = defineEmits(['update:mode'])
const updateMode = (value) => {
  if (props.mode) {
    emit('update:mode', value)
  }
}
</script>

<template>
  <div
    class="flex items-stretch gap-1 px-2 h-[43px] text-sm text-ui-muted"
    role="group"
    :aria-label="t('编辑')"
  >
    <button
      v-for="item in [
        { value: 'preview', label: t('预览') },
        { value: 'code', label: t('代码') },
      ]"
      :key="item.value"
      type="button"
      class="px-4 border-b-2 border-transparent hover:bg-ui-inset font-semibold"
      :class="{ '!border-ui-link text-ui-link bg-ui-secondary/10': mode === item.value }"
      :aria-pressed="mode === item.value"
      @click="updateMode(item.value)"
    >
      {{ item.label }}
    </button>
  </div>
</template>
