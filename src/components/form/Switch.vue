<script setup>
defineOptions({ name: 'McSwitch' })
import { computed } from 'vue'
const props = defineProps({
  modelValue: { type: Boolean, required: true },
  width: { type: Number, default: 52 },
  disabled: Boolean,
  switchOnColor: { type: String, default: 'rgb(var(--ui-primary))' },
  switchOffColor: { type: String, default: 'rgb(var(--ui-inset))' },
})
const emit = defineEmits(['update:modelValue'])
const knobLeft = computed(() => (props.modelValue ? Math.max(0, props.width - 28) : 2))
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :disabled="disabled"
    class="mc-switch"
    :style="{ width: `${width}px`, background: modelValue ? switchOnColor : switchOffColor }"
    @click="emit('update:modelValue', !modelValue)"
  >
    <span class="mc-switch-knob" :style="{ left: `${knobLeft}px` }" />
  </button>
</template>

<style scoped>
.mc-switch {
  position: relative;
  display: inline-block;
  flex-shrink: 0;
  height: 30px;
  border: 2px solid rgb(var(--ui-border));
  cursor: pointer;
}
.mc-switch-knob {
  position: absolute;
  top: 2px;
  width: 22px;
  height: 22px;
  border: 1px solid rgb(var(--ui-border));
  background: rgb(var(--ui-surface));
  transition: left 120ms;
}
.mc-switch:disabled {
  opacity: 0.45;
}
</style>
