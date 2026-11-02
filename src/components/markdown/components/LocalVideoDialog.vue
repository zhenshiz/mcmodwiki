<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import Modal from '@/components/Modal.vue'
import Button from '@/components/Button.vue'
import { t } from '@/languages'
import { discardMediaAsset, importMediaFile, safeMediaSource } from '@/components/markdown/media/documentMedia.js'
import { useMediaUrl } from '@/components/markdown/media/useMediaUrl.js'

const props = defineProps({ initial: { type: Object, default: () => ({}) } })
const emit = defineEmits(['save', 'close'])
const show = ref(true)
const src = ref(props.initial.src || '')
const poster = ref(props.initial.poster || '')
const caption = ref(props.initial.caption || '')
const width = ref(props.initial.width || '')
const busy = ref(false), error = ref(''), dragging = ref(false)
const previewUrl = useMediaUrl(() => src.value)
const posterUrl = useMediaUrl(() => poster.value)
const editing = computed(() => !!props.initial.src)
const createdSources = []
let active = true, savedSources = new Set()
onBeforeUnmount(() => {
  active = false
  for (const source of createdSources) if (!savedSources.has(source)) discardMediaAsset(source).catch(() => {})
})

async function choose(file, kind) {
  if (!file || busy.value) return
  busy.value = true
  error.value = ''
  try {
    const source = await importMediaFile(file, kind)
    if (!active) { await discardMediaAsset(source); return }
    createdSources.push(source)
    if (kind === 'video') src.value = source
    else poster.value = source
  } catch (cause) { error.value = t(cause.message) }
  finally { busy.value = false }
}

function drop(event) {
  dragging.value = false
  choose(event.dataTransfer.files[0], 'video')
}

function save() {
  error.value = ''
  const source = safeMediaSource(src.value), cover = safeMediaSource(poster.value)
  if (!source || (poster.value.trim() && !cover)) {
    error.value = t('请输入 HTTPS 链接或以 / 开头的站内路径，或选择本地文件')
    return
  }
  const pixels = width.value === '' ? null : Math.round(Number(width.value))
  if (pixels !== null && (!Number.isFinite(pixels) || pixels < 120 || pixels > 3840)) {
    error.value = t('视频宽度应在 120 到 3840 像素之间，留空为自适应')
    return
  }
  savedSources = new Set([source, cover])
  emit('save', { src: source, poster: cover, caption: caption.value.trim(), width: pixels })
  show.value = false
}
</script>

<template>
  <Modal v-model:show="show" width="640px" :title="editing ? t('视频设置') : t('插入本地视频')" @close="emit('close')" @after-leave="emit('close')">
    <div class="local-video-dialog p-4 flex flex-col gap-4 text-sm text-ui-text">
      <label class="border-2 border-dashed border-ui-line bg-ui-inset p-4 text-center cursor-pointer"
        :class="{ 'border-ui-link': dragging }" @dragover.prevent="dragging = true" @dragleave.prevent="dragging = false" @drop.prevent="drop">
        <span class="block font-semibold">{{ busy ? t('正在读取媒体…') : t('选择或拖入 MP4 视频') }}</span>
        <span class="block mt-1 text-xs text-ui-muted">{{ t('单个视频最大 100 MiB，本地媒体随文档打包导出') }}</span>
        <input class="mt-3 max-w-full" type="file" accept=".mp4,video/mp4" :disabled="busy" :aria-label="t('选择 MP4 视频')" @change="choose($event.target.files[0], 'video')" />
      </label>
      <label class="flex flex-col gap-1">
        <span>{{ t('视频地址') }}</span>
        <input v-model="src" class="media-input" :disabled="busy" placeholder="/md/media/demo.mp4" spellcheck="false" />
      </label>
      <video v-if="previewUrl" :key="previewUrl" :src="previewUrl" :poster="posterUrl || undefined" controls playsinline preload="metadata" class="max-h-56 w-full bg-black" :aria-label="t('视频预览')" />
      <label class="flex flex-col gap-1">
        <span>{{ t('封面地址（可选）') }}</span>
        <input v-model="poster" class="media-input" :disabled="busy" placeholder="https://…" spellcheck="false" />
      </label>
      <label class="flex flex-col gap-1">
        <span>{{ t('选择封面图片（可选）') }}</span>
        <input type="file" accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp" :disabled="busy" @change="choose($event.target.files[0], 'poster')" />
      </label>
      <label class="flex flex-col gap-1">
        <span>{{ t('视频说明（可选）') }}</span>
        <textarea v-model="caption" class="media-input" rows="2" :disabled="busy" />
      </label>
      <label class="flex flex-col gap-1">
        <span>{{ t('视频宽度（像素，留空自适应）') }}</span>
        <input v-model="width" class="media-input" type="number" min="120" max="3840" step="1" :disabled="busy" />
      </label>
      <p class="text-xs text-ui-muted">{{ t('本地视频保存在当前浏览器中。发布或换设备前，请导出包含媒体的 ZIP 文档包。') }}</p>
      <p v-if="error" role="alert" class="text-red-500">{{ error }}</p>
    </div>
    <template #footer>
      <Button :disabled="busy" @click="show = false">{{ t('取消') }}</Button>
      <Button variant="primary" :disabled="busy || !src.trim()" @click="save">{{ editing ? t('保存视频设置') : t('插入视频') }}</Button>
    </template>
  </Modal>
</template>

<style scoped>
.media-input { padding: 8px; border: 1px solid rgb(var(--ui-line)); background: rgb(var(--ui-bg)); color: inherit; width: 100%; }
.media-input:focus { outline: 2px solid rgb(var(--ui-link)); outline-offset: 1px; }
</style>
