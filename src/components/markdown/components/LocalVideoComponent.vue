<script setup>
import { computed, ref, watch } from 'vue'
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { t } from '@/languages'
import LocalVideoDialog from './LocalVideoDialog.vue'
import { useMediaUrl } from '@/components/markdown/media/useMediaUrl.js'

const props = defineProps(nodeViewProps)
const editing = ref(false), failed = ref(false)
const source = useMediaUrl(() => props.node.attrs.src)
const poster = useMediaUrl(() => props.node.attrs.poster)
const width = computed(() => {
  const pixels = Number(props.node.attrs.width)
  return Number.isFinite(pixels) && pixels >= 120 && pixels <= 3840 ? `${pixels}px` : '100%'
})
watch(source, () => { failed.value = false })
function save(attrs) { props.updateAttributes(attrs); editing.value = false }
</script>

<template>
  <NodeViewWrapper as="figure" data-type="local-video" class="local-video-node" :class="{ 'is-selected': selected }" :style="{ width }" contenteditable="false">
    <div v-if="editor.isEditable" class="local-video-toolbar">
      <span data-drag-handle class="cursor-grab text-ui-muted">{{ t('操作演示') }}</span>
      <button type="button" @click="editing = true">{{ t('视频设置') }}</button>
      <button type="button" @click="deleteNode">{{ t('删除视频') }}</button>
    </div>
    <video v-if="source" :key="source" :src="source" :poster="poster || undefined" controls playsinline preload="metadata" :aria-label="node.attrs.caption || t('操作演示视频')" @error="failed = true" @loadedmetadata="failed = false" />
    <p v-if="failed" role="alert" class="p-3 text-sm text-red-500">{{ t('视频无法播放，请检查视频格式或重新导入包含媒体的文档包。') }}</p>
    <figcaption v-if="node.attrs.caption">{{ node.attrs.caption }}</figcaption>
    <LocalVideoDialog v-if="editing" :initial="node.attrs" @save="save" @close="editing = false" />
  </NodeViewWrapper>
</template>

<style scoped>
.local-video-node { max-width: 100%; margin: 20px auto; border: 1px solid rgb(var(--ui-line)); background: rgb(var(--ui-surface)); overflow: hidden; }
.local-video-node.is-selected { outline: 2px solid rgb(var(--ui-link)); outline-offset: 2px; }
.local-video-node video { display: block; width: 100%; height: auto; max-height: 80vh; background: #000; }
.local-video-node figcaption { padding: 10px 12px; font-size: 13px; line-height: 1.6; color: rgb(var(--ui-muted)); overflow-wrap: anywhere; }
.local-video-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 6px 10px; font-size: 12px; background: rgb(var(--ui-inset)); }
.local-video-toolbar span { margin-right: auto; }
.local-video-toolbar button { padding: 3px 6px; border: 1px solid rgb(var(--ui-line)); }
.local-video-toolbar button:hover { border-color: rgb(var(--ui-link)); color: rgb(var(--ui-link)); }
</style>
