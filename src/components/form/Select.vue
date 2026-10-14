<script setup>
defineOptions({ name: 'McSelect' })
import { computed, nextTick, ref, useId } from 'vue'
import Popover from '@/components/Popover.vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  modelValue: { type: [String, Number, Boolean, Object], default: '' },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: '请选择' },
  disabled: Boolean,
  width: { type: String, default: '100%' },
  ignoreCase: { type: Boolean, default: true },
})
const emit = defineEmits(['update:modelValue', 'change'])
const isOpen = ref(false)
const triggerRef = ref(null)
const listRef = ref(null)
const activeIndex = ref(0)
const listId = useId()
const isValueMatch = (a, b) =>
  a === b || (props.ignoreCase && String(a ?? '').toLowerCase() === String(b ?? '').toLowerCase())
const selectedOption = computed(() =>
  props.options.find((option) => isValueMatch(option.value, props.modelValue)),
)
const handleSelect = (option) => {
  if (props.disabled) return
  emit('update:modelValue', option.value)
  emit('change', option.value)
  isOpen.value = false
  triggerRef.value?.focus()
}
const focusOption = async (index) => {
  if (props.disabled || !props.options.length) return
  isOpen.value = true
  activeIndex.value = (index + props.options.length) % props.options.length
  await nextTick()
  listRef.value?.querySelectorAll('[role="option"]')[activeIndex.value]?.focus()
}
const handleKeydown = (event) => {
  const selectedIndex = Math.max(
    0,
    props.options.findIndex((option) => isValueMatch(option.value, props.modelValue)),
  )
  const current = isOpen.value ? activeIndex.value : selectedIndex
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    focusOption(current + (event.key === 'ArrowDown' ? 1 : -1))
  } else if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault()
    focusOption(event.key === 'Home' ? 0 : props.options.length - 1)
  } else if (event.key === 'Escape') {
    isOpen.value = false
    triggerRef.value?.focus()
  } else if (event.key === 'Tab') {
    isOpen.value = false
  }
}
</script>

<template>
  <Popover
    v-model:isOpen="isOpen"
    match-trigger-width
    placement="bottom-start"
    trigger="click"
    :offset="6"
    :disabled="disabled"
    class="w-full"
  >
    <template #trigger>
      <button
        ref="triggerRef"
        type="button"
        class="mc-select"
        :class="{ 'mc-select--open': isOpen }"
        :disabled="disabled"
        :style="{ width }"
        aria-haspopup="listbox"
        :aria-expanded="isOpen"
        :aria-controls="listId"
        @keydown="handleKeydown"
      >
        <span class="flex items-center gap-2 min-w-0"
          ><img
            v-if="selectedOption?.icon"
            :src="selectedOption.icon"
            alt=""
            class="size-5 object-contain"
          /><span class="truncate" :class="{ 'text-ui-muted': !selectedOption }">{{
            selectedOption ? selectedOption.label : placeholder
          }}</span></span
        >
        <Icon
          icon="lucide:chevron-down"
          width="17"
          class="shrink-0 transition-transform"
          :class="{ 'rotate-180': isOpen }"
        />
      </button>
    </template>
    <div
      :id="listId"
      ref="listRef"
      role="listbox"
      :aria-label="placeholder"
      class="mc-select-options"
      :style="{ minWidth: width === '100%' ? '160px' : width }"
      @keydown="handleKeydown"
    >
      <button
        v-for="(item, index) in options"
        :key="index"
        type="button"
        role="option"
        :aria-selected="isValueMatch(modelValue, item.value)"
        class="mc-select-option"
        @focus="activeIndex = index"
        @click="handleSelect(item)"
      >
        <img v-if="item.icon" :src="item.icon" alt="" class="size-5 object-contain" /><span
          class="flex-1 text-left"
          >{{ item.label }}</span
        ><Icon v-if="isValueMatch(modelValue, item.value)" icon="lucide:check" width="17" />
      </button>
      <p v-if="!options.length" class="py-3 text-center text-sm text-ui-muted">
        {{ t('暂无数据') }}
      </p>
    </div>
  </Popover>
</template>

<style scoped>
.mc-select {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  min-height: 40px;
  padding: 8px 12px;
  border: 2px solid rgb(var(--ui-line));
  background: rgb(var(--ui-surface));
  color: rgb(var(--ui-text));
  text-align: left;
  font-size: 14px;
}
.mc-select:hover:not(:disabled),
.mc-select--open {
  border-color: rgb(var(--ui-border));
}
.mc-select--open {
  background: rgb(var(--ui-primary));
  color: rgb(var(--ui-on-accent));
}
.mc-select:disabled {
  opacity: 0.45;
}
.mc-select-options {
  max-height: 250px;
  overflow-y: auto;
  margin: -4px -8px;
  padding: 2px;
}
.mc-select-option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid transparent;
  font-size: 13px;
  color: rgb(var(--ui-text));
}
.mc-select-option:hover,
.mc-select-option:focus-visible {
  background: rgb(var(--ui-inset));
}
.mc-select-option[aria-selected='true'] {
  border-color: rgb(var(--ui-border));
  background: rgb(var(--ui-secondary));
  color: rgb(var(--ui-on-accent));
  font-weight: 700;
}
</style>
