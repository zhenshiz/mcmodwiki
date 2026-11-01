import { computed, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import { get, set } from 'idb-keyval'
import { readResourcePackArchive, readResourcePackFiles } from '@/views/more/chatbox/resources/localResourcePacks.js'

const STORAGE_KEY = 'chatbox-local-resource-packs-v1'

export const useLocalResourcePacksStore = defineStore('chatboxLocalResourcePacks', () => {
  const packs = shallowRef([])
  const loading = shallowRef(true)
  const importing = shallowRef(false)
  const storageError = shallowRef(false)
  let restorePromise
  let saving = Promise.resolve()
  const urls = new Map()

  const textures = computed(() => {
    const index = new Map()
    for (const pack of packs.value) for (const texture of pack.textures) {
      index.set(texture.resourceId, { ...texture, source: pack.name })
    }
    return index
  })
  const options = computed(() => [...textures.value].map(([resourceId, texture]) => ({
    value: resourceId, label: resourceId, textureId: resourceId, source: texture.source, local: true,
  })))

  function replacePacks(next) {
    const keep = new Set(next.flatMap(pack => pack.textures.map(texture => texture.blob)))
    for (const [blob, url] of urls) if (!keep.has(blob)) { URL.revokeObjectURL(url); urls.delete(blob) }
    packs.value = next
  }

  function restore() {
    if (!restorePromise) restorePromise = get(STORAGE_KEY).then(saved => {
      if (Array.isArray(saved)) replacePacks(saved)
    }).catch(() => { storageError.value = true }).finally(() => { loading.value = false })
    return restorePromise
  }

  async function persist() {
    const next = packs.value
    saving = saving.then(() => set(STORAGE_KEY, next)).then(() => { storageError.value = false })
      .catch(() => { storageError.value = true })
    await saving
  }

  async function importPack(files, directory = false) {
    if (importing.value || !files.length) return []
    importing.value = true
    try {
      await restore()
      const imported = []
      const groups = directory ? [Array.from(files)] : Array.from(files).map(file => [file])
      for (const group of groups) {
        const name = directory ? group[0].webkitRelativePath.split('/')[0] : group[0].name
        const result = directory ? await readResourcePackFiles(group) : await readResourcePackArchive(group[0])
        if (!result.textures.length) throw new Error('资源包中未找到 assets/命名空间/textures 下的 PNG 或 JPEG 图片')
        replacePacks([...packs.value.filter(pack => pack.name !== name), { id: crypto.randomUUID(), name, textures: result.textures }])
        imported.push({ name, count: result.textures.length, skipped: result.skipped })
      }
      return imported
    } finally { await persist(); importing.value = false }
  }

  async function removePack(id) {
    await restore()
    replacePacks(packs.value.filter(pack => pack.id !== id))
    await persist()
  }

  function imageUrl(resourceId) {
    const blob = textures.value.get(resourceId)?.blob
    if (!blob) return ''
    if (!urls.has(blob)) urls.set(blob, URL.createObjectURL(blob))
    return urls.get(blob)
  }

  restore()
  return { packs, loading, importing, storageError, options, restore, importPack, removePack, imageUrl }
})
