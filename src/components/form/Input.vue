<script setup>
defineOptions({ name: 'McInput' })
import _ from 'lodash'
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  placeholder: String,
  disabled: Boolean,
  type: {
    type: String,
    default: 'text',
  },
  variant: {
    type: String,
    default: 'outline',
    validator(value) {
      return ['outline', 'underline', 'filled', 'ghost'].includes(value)
    },
  },
  inputClass: {
    type: String,
    default: '',
  },
  isDebounce: {
    type: Boolean,
    default: false,
  },
  debounceTime: {
    type: Number,
    default: 500,
  },
})

const emit = defineEmits(['update:modelValue', 'change', 'input'])
const inputRef = ref()

const variantClasses = computed(() => `mc-input mc-input--${props.variant}`)

// --- 防抖逻辑 ---
const handleInput = (event) => {
  const val = event.target.value

  emit('update:modelValue', val)

  if (props.isDebounce) {
    debouncedEmit(val)
  } else {
    emit('change', val)
  }
}

const debouncedEmit = _.debounce((val) => {
  emit('change', val)
}, props.debounceTime)

const getInput = () => inputRef.value

defineExpose({ getInput })
</script>

<template>
  <div class="w-full relative flex items-center group" :class="[variantClasses]">
    <div
      v-if="$slots.header"
      class="mr-2 text-ui-muted group-focus-within:text-ui-link transition-colors"
    >
      <slot name="header"></slot>
    </div>

    <input
      ref="inputRef"
      class="w-full h-full bg-transparent border-none outline-none text-base text-ui-text placeholder:text-ui-muted"
      :class="inputClass"
      :type="type"
      :disabled="disabled"
      :placeholder="placeholder"
      :value="modelValue"
      @input="handleInput"
    />

    <div v-if="$slots.footer" class="ml-2 text-ui-muted">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style scoped>
.mc-input {
  padding: 9px 12px;
  border: 2px solid rgb(var(--ui-line));
  background: rgb(var(--ui-surface));
  transition: border-color 120ms;
}
.mc-input:focus-within {
  border-color: rgb(var(--ui-link));
}
.mc-input--underline {
  border-width: 0 0 2px;
  background: transparent;
}
.mc-input--filled {
  background: rgb(var(--ui-inset));
}
.mc-input--ghost {
  border-color: transparent;
  background: transparent;
  padding: 0;
}
.mc-input:has(input:disabled) {
  opacity: 0.5;
  cursor: not-allowed;
}
input:focus-visible {
  outline: none;
}
</style>
