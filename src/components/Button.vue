<script setup>
defineOptions({ name: 'McButton' })
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'outline' },
  color: String,
  background: String,
  themeTransparent: { type: Boolean, default: true },
  roundedSize: { type: Number, default: 0 },
  type: { type: String, default: 'button' },
})

const buttonStyles = computed(() => {
  const styles = { borderRadius: `${props.roundedSize}px` }
  // Preserve custom colors for existing callers while new buttons use semantic variants.
  if (props.color) {
    styles['--button-text'] = props.color
    styles['--button-hover-bg'] = props.color
    styles['--button-hover-text'] = props.background || 'rgb(var(--ui-surface))'
  }
  if (!props.themeTransparent && props.background) styles['--button-bg'] = props.background
  return styles
})
</script>

<template>
  <button :type="type" class="mc-button" :class="`mc-button--${variant}`" :style="buttonStyles">
    <slot />
  </button>
</template>

<style scoped>
.mc-button {
  --button-bg: rgb(var(--ui-surface));
  --button-text: rgb(var(--ui-text));
  --button-hover-bg: rgb(var(--ui-inset));
  --button-hover-text: rgb(var(--ui-text));
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  padding: 8px 16px;
  border: 2px solid rgb(var(--ui-border));
  background: var(--button-bg);
  color: var(--button-text);
  box-shadow: 3px 3px 0 rgb(var(--ui-shadow));
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
  cursor: pointer;
  transition:
    background-color 120ms,
    color 120ms,
    transform 120ms,
    box-shadow 120ms;
}
.mc-button--primary {
  --button-bg: rgb(var(--ui-primary));
  --button-text: rgb(var(--ui-on-accent));
  --button-hover-bg: rgb(var(--ui-primary) / 0.8);
  --button-hover-text: rgb(var(--ui-on-accent));
}
.mc-button--secondary {
  --button-bg: rgb(var(--ui-secondary));
  --button-text: rgb(var(--ui-on-accent));
  --button-hover-bg: rgb(var(--ui-secondary) / 0.8);
  --button-hover-text: rgb(var(--ui-on-accent));
}
.mc-button--ghost {
  --button-bg: transparent;
  border-color: transparent;
  box-shadow: none;
}
.mc-button--danger {
  --button-bg: rgb(var(--ui-danger-bg));
  --button-text: rgb(var(--ui-danger));
  --button-hover-bg: rgb(var(--ui-danger-bg));
}
.mc-button:hover:not(:disabled) {
  background: var(--button-hover-bg);
  color: var(--button-hover-text);
}
.mc-button:active:not(:disabled) {
  transform: translate(3px, 3px);
  box-shadow: none;
}
.mc-button:disabled {
  opacity: 0.45;
  box-shadow: none;
}
</style>
