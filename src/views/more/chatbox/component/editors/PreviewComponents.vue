<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { t } from '@/languages/index.js'
import { animationPortraitVisible } from '../../animation/animationTimeline.js'

const props = defineProps({
  theme: { type: Object, default: null },
  portrait: { type: Object, default: null },
  portraitKey: { type: String, default: '' },
  portraitVisibility: { type: Object, default: () => ({}) },
})
const emit = defineEmits(['update:portraitVisibility'])

const groups = computed(() => {
  const theme = props.theme || {}
  const portraits = { ...theme.portrait }
  if (props.portrait && props.portraitKey) portraits[props.portraitKey] = props.portrait
  return [
    { label: t('核心组件'), items: [
      { key: 'dialogBox', label: t('对话框'), icon: 'lucide:message-square', component: theme.dialogBox },
      { key: 'option', label: t('选项样式'), icon: 'lucide:list', component: theme.option },
      { key: 'keyPrompt', label: t('按键提示'), icon: 'lucide:keyboard', component: theme.keyPrompt, usesVisible: true },
    ].filter(item => item.component) },
    { label: t('立绘组'), items: Object.entries(portraits).map(([key, component]) => ({
      key, label: key, icon: 'lucide:user', component, isPortrait: true, active: key === props.portraitKey,
    })) },
    { label: t('功能按钮'), items: (theme.functionalButton || []).map((component, index) => ({
      key: String(index), label: component.id || `Button ${index + 1}`, icon: 'lucide:mouse-pointer-2', component,
    })) },
  ].filter(group => group.items.length)
})

function isHidden(item) {
  if (item.isPortrait) return !animationPortraitVisible(item.key, props.portraitKey, props.portraitVisibility)
  return item.usesVisible ? !item.component.visible : !!item.component._hidden
}

function toggle(item) {
  if (item.isPortrait) emit('update:portraitVisibility', { ...props.portraitVisibility, [item.key]: isHidden(item) })
  else if (item.usesVisible) item.component.visible = !item.component.visible
  else item.component._hidden = !item.component._hidden
}
</script>

<template>
  <section class="preview-components" :aria-label="t('组件列表')">
    <div class="components-heading">{{ t('组件列表') }}</div>
    <div class="components-scroll">
      <div v-for="group in groups" :key="group.label" class="component-group">
        <div class="group-label">{{ group.label }}</div>
        <button v-for="item in group.items" :key="item.key" type="button" class="component-row"
          :class="{ active: item.active, 'component-hidden': isHidden(item) }" :title="item.label"
          :aria-label="`${isHidden(item) ? t('显示组件') : t('隐藏组件')}：${item.label}`"
          :aria-pressed="!isHidden(item)" @click="toggle(item)">
          <Icon :icon="item.icon" width="13" />
          <span class="component-name">{{ item.label }}</span>
          <Icon v-if="item.active" icon="lucide:clapperboard" width="12" :aria-label="t('正在编辑')" />
          <Icon :icon="isHidden(item) ? 'lucide:eye-off' : 'lucide:eye'" width="14" />
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.preview-components { display: flex; flex-direction: column; min-height: 0; border-right: 1px solid rgb(var(--ui-line)); background: rgb(var(--ui-surface)); }
.components-heading { padding: 12px; font-weight: 600; border-bottom: 1px solid rgb(var(--ui-line)); }
.components-scroll { overflow-y: auto; padding: 5px; }
.group-label { padding: 6px; font-size: 11px; color: rgb(var(--ui-muted)); }
.component-row { display: flex; align-items: center; gap: 7px; width: 100%; padding: 6px 8px; border: 1px solid transparent; background: transparent; text-align: left; color: rgb(var(--ui-text)); }
.component-row:hover { background: rgb(var(--ui-inset)); }
.component-row.active { border-color: rgb(var(--ui-link) / 45%); color: rgb(var(--ui-link)); }
.component-row.component-hidden { opacity: .5; }
.component-row:focus-visible { outline: 2px solid rgb(var(--ui-link)); outline-offset: -2px; }
.component-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
