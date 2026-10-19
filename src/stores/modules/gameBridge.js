import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'
import { acceptsPreviewFrame } from '@/views/more/chatbox/bridge/previewFrames.js'
import { EditorConnection, EDITOR_PROTOCOL } from '@/views/more/chatbox/bridge/EditorConnection.js'
import { acceptsDebugState, sameDebugPosition } from '@/views/more/chatbox/bridge/dialogueDebug.js'

export const useGameBridgeStore = defineStore('gameBridge', () => {
  const status = ref('disconnected')
  const error = ref('')
  const snapshot = shallowRef(null)
  const images = ref(new Map())
  const imageErrors = ref(new Map())
  const previewing = ref(false)
  const streamFrame = shallowRef(null)
  const debugActive = ref(false), debugStarting = ref(false), debugSyncing = ref(false)
  const debugState = shallowRef(null), debugHistory = ref([])
  const debugSession = ref(''), debugFileId = ref(''), debugError = ref('')
  let debugVersion = 0
  let previewRevision = ''
  const syncing = ref(false)
  const files = shallowRef([])
  const serverSession = ref('')
  const connected = computed(() => status.value === 'connected')
  const pendingImages = new Map()
  let epoch = 0
  let imageGeneration = 0
  let refreshTimer
  let refreshPromise
  let activeImages = 0
  const imageQueue = []

  const connection = new EditorConnection({
    onEvent: (packet) => {
      if (packet.event?.startsWith('debug.')) {
        if (packet.session !== debugSession.value) return
        if (packet.event === 'debug.state' && debugActive.value && acceptsDebugState(packet, debugSession.value, debugState.value?.sequence)) {
          if (!sameDebugPosition(packet, debugState.value)) debugHistory.value = [...debugHistory.value.slice(-49), packet]
          debugState.value = packet
        }
        if (packet.event === 'debug.closed' || packet.event === 'debug.error') {
          debugActive.value = false
          debugStarting.value = false
          if (packet.event === 'debug.error') debugError.value = packet.error
        }
        return
      }
      if (packet.event === 'preview.frame') {
        if (acceptsPreviewFrame(packet, previewRevision, streamFrame.value?.sequence)) streamFrame.value = packet
        return
      }
      if (packet.event === 'preview.closed') {
        if (packet.revision === previewRevision) { previewing.value = false; streamFrame.value = null }
        return
      }
      if (packet.event === 'preview.error') {
        previewing.value = false
        streamFrame.value = null
        error.value = packet.error
        return
      }
      if (packet.event !== 'invalidate') return
      invalidateImages()
      clearTimeout(refreshTimer)
      refreshTimer = setTimeout(() => { if (connected.value) refresh().catch(() => {}) }, 250)
    },
    onClose: () => { disconnect(); error.value = '游戏连接已断开，编辑内容已保留' },
  })

  async function refresh() {
    if (refreshPromise) return refreshPromise
    const current = epoch
    invalidateImages()
    syncing.value = true
    refreshPromise = Promise.all([connection.request('snapshot', {}, 60000), connection.request('files.list', {}, 60000)]).then(([data, catalog]) => {
      if (current !== epoch) return
      if (data.protocol !== EDITOR_PROTOCOL || !data.registries || !data.translations || !Array.isArray(catalog.files) || !catalog.serverSession) throw new Error('游戏连接协议不兼容')
      snapshot.value = data
      files.value = catalog.files
      serverSession.value = catalog.serverSession
      error.value = ''
    }).catch((cause) => { if (current === epoch) error.value = cause.message; throw cause })
      .finally(() => { if (current === epoch) { syncing.value = false; refreshPromise = null } })
    return refreshPromise
  }

  async function connect(address, token) {
    disconnect()
    const current = epoch
    status.value = 'connecting'
    error.value = ''
    try {
      await connection.connect(address, token)
      await refresh()
      if (current === epoch) status.value = 'connected'
    } catch (cause) {
      if (current === epoch) { disconnect(); error.value = cause.message }
      throw cause
    }
  }

  function disconnect() {
    epoch++
    clearTimeout(refreshTimer)
    connection.disconnect()
    status.value = 'disconnected'
    snapshot.value = null
    serverSession.value = ''
    previewing.value = false
    previewRevision = ''
    streamFrame.value = null
    debugActive.value = false
    debugStarting.value = false
    debugSyncing.value = false
    debugSession.value = ''
    if (debugState.value) debugError.value = '游戏连接已断开，编辑内容已保留'
    syncing.value = false
    refreshPromise = null
    invalidateImages()
  }

  function invalidateImages() {
    imageGeneration++
    images.value.clear()
    imageErrors.value.clear()
    pendingImages.clear()
    imageQueue.splice(0).forEach(job => job.resolve(''))
  }

  const imageKey = (kind, resourceId, customModelData = 0) => `${kind}:${resourceId}:${customModelData || 0}`

  function pumpImages() {
    while (activeImages < 4 && imageQueue.length) {
      const job = imageQueue.shift()
      activeImages++
      connection.request('image', job.payload).then((data) => {
        if (job.generation === imageGeneration && /^data:image\/(png|jpeg);base64,/.test(data.url)) images.value.set(job.key, data.url)
        job.resolve(job.generation === imageGeneration ? images.value.get(job.key) || '' : '')
      }).catch((cause) => {
        if (job.generation === imageGeneration) imageErrors.value.set(job.key, cause.message)
        job.resolve('')
      }).finally(() => {
        activeImages--
        if (job.generation === imageGeneration) pendingImages.delete(job.key)
        pumpImages()
      })
    }
  }

  function ensureImage(kind, resourceId, customModelData = 0) {
    const key = imageKey(kind, resourceId, customModelData)
    if (!connected.value || !resourceId || imageErrors.value.has(key)) return Promise.resolve('')
    if (images.value.has(key)) return Promise.resolve(images.value.get(key))
    if (pendingImages.has(key)) return pendingImages.get(key)
    const promise = new Promise((resolve) => {
      imageQueue.push({ key, generation: imageGeneration, resolve, payload: { kind, resourceId, customModelData: customModelData || 0 } })
    })
    pendingImages.set(key, promise)
    pumpImages()
    return promise
  }

  function imageUrl(kind, id, customModelData = 0) {
    if (!connected.value || !id) return ''
    const key = imageKey(kind, id, customModelData)
    const url = images.value.get(key)
    if (!url && !imageErrors.value.has(key)) ensureImage(kind, id, customModelData)
    return url || ''
  }

  function options(type) {
    return connected.value ? snapshot.value?.registries[type] || [] : []
  }

  async function preview(payload) {
    error.value = ''
    const revision = crypto.randomUUID()
    previewRevision = revision
    try {
      const result = await connection.request('preview', { ...payload, revision }, 30000)
      if (revision === previewRevision) previewing.value = true
      return result
    } catch (cause) { error.value = cause.message; throw cause }
  }

  async function stopPreview() {
    await connection.request('preview.stop')
    previewing.value = false
    streamFrame.value = null
    previewRevision = ''
  }

  async function movePreview(payload) {
    try { return await connection.request('preview.move', { ...payload, revision: previewRevision }) }
    catch (cause) { error.value = cause.message; throw cause }
  }

  async function startDebug(payload) {
    if (!connected.value) throw new Error('请先连接游戏')
    if (!snapshot.value?.dialogueDebug) throw new Error('请更新并重启 ChatBox 模组以启用对话调试')
    const session = crypto.randomUUID()
    debugSession.value = session
    debugFileId.value = payload.resourceId
    debugState.value = null
    debugHistory.value = []
    debugVersion = 1
    debugError.value = ''
    debugStarting.value = true
    debugActive.value = true
    try { return await connection.request('debug.start', { ...payload, session, version: 1 }, 30000) }
    catch (cause) {
      if (debugSession.value === session) { debugActive.value = false; debugError.value = cause.message }
      throw cause
    } finally { if (debugSession.value === session) debugStarting.value = false }
  }

  async function updateDebug(payload) {
    if (!debugActive.value || debugStarting.value) return
    const session = debugSession.value
    debugSyncing.value = true
    try {
      const result = await connection.request('debug.update', { ...payload, resourceId: debugFileId.value, session, version: ++debugVersion }, 30000)
      if (session === debugSession.value) debugError.value = ''
      return result
    } catch (cause) {
      if (session === debugSession.value && debugActive.value) debugError.value = cause.message
      throw cause
    } finally { if (session === debugSession.value) debugSyncing.value = false }
  }

  async function stopDebug() {
    const session = debugSession.value
    debugActive.value = false
    debugStarting.value = false
    if (connected.value && session) await connection.request('debug.stop', { session })
  }

  return { status, error, snapshot, files, serverSession, images, imageErrors, connected, previewing, streamFrame, syncing,
    debugActive, debugStarting, debugSyncing, debugState, debugHistory, debugSession, debugFileId, debugError, startDebug, updateDebug, stopDebug,
    connect, disconnect, refresh, options, ensureImage, imageKey, imageUrl, preview, movePreview, stopPreview,
    request: (type, payload, timeout) => connection.request(type, payload, timeout) }
})
