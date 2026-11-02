import { ref, watch } from 'vue'
import { isLocalMediaSource, readMediaAsset, safeMediaSource } from './documentMedia.js'

// 文档只保存稳定路径，blob URL 仅用于当前播放器并在离开时释放。
export function useMediaUrl(source) {
  const url = ref('')
  watch(source, async (value, _, onCleanup) => {
    let cancelled = false, localUrl = ''
    onCleanup(() => {
      cancelled = true
      if (localUrl) URL.revokeObjectURL(localUrl)
    })
    const source = safeMediaSource(value)
    url.value = isLocalMediaSource(source) ? '' : source
    try {
      const asset = await readMediaAsset(source)
      if (!cancelled) {
        if (asset?.blob) localUrl = URL.createObjectURL(asset.blob)
        url.value = localUrl || source
      }
    } catch { if (!cancelled) url.value = source }
  }, { immediate: true })
  return url
}
