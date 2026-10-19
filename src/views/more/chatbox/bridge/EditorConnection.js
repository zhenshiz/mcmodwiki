export const EDITOR_PROTOCOL = 1

export function localEditorUrl(address) {
  const url = new URL(address.trim())
  if (!['ws:', 'wss:'].includes(url.protocol) || !['127.0.0.1', 'localhost'].includes(url.hostname)
    || !url.port || url.username || url.password || url.search || url.hash) {
    throw new Error('请输入游戏提供的本机 WebSocket 地址')
  }
  if (url.pathname === '/') url.pathname = '/chatbox-editor'
  if (url.pathname !== '/chatbox-editor') throw new Error('连接地址路径应为 /chatbox-editor')
  return url.href
}

export class EditorConnection {
  constructor({ WebSocketImpl = globalThis.WebSocket, onEvent = () => {}, onClose = () => {} } = {}) {
    this.WebSocketImpl = WebSocketImpl
    this.onEvent = onEvent
    this.onClose = onClose
    this.pending = new Map()
    this.sequence = 0
    this.socket = null
  }

  async connect(address, token) {
    const url = localEditorUrl(address)
    if (!token.trim()) throw new Error('请输入游戏提供的配对码')
    this.disconnect()
    const socket = new this.WebSocketImpl(url)
    this.socket = socket
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => { finish(new Error('连接超时，请检查游戏是否已开启网页编辑连接')); if (this.socket === socket) this.disconnect() }, 8000)
      const finish = (error) => { clearTimeout(timer); if (this.cancelOpen === cancel) this.cancelOpen = null; error ? reject(error) : resolve() }
      const cancel = () => finish(new Error('连接已取消'))
      this.cancelOpen = cancel
      socket.onopen = () => finish()
      socket.onerror = () => finish(new Error('无法连接游戏，请检查地址、浏览器本地网络权限及游戏连接状态'))
      socket.onmessage = (event) => {
        if (this.socket !== socket) return
        try {
          const packet = JSON.parse(event.data)
          if (packet.event) { this.onEvent(packet); return }
          const request = this.pending.get(packet.id)
          if (!request) return
          this.pending.delete(packet.id)
          clearTimeout(request.timer)
          packet.ok ? request.resolve(packet.data) : request.reject(new Error(packet.error || '游戏处理请求失败'))
        } catch { /* 忽略不属于当前协议的消息。 */ }
      }
      socket.onclose = () => {
        finish(new Error('游戏连接已断开'))
        if (this.socket !== socket) return
        this.disconnect()
        this.onClose()
      }
    })
    if (this.socket !== socket) throw new Error('连接已取消')
    try { await this.request('hello', { protocol: EDITOR_PROTOCOL, token: token.trim() }) }
    catch (error) { this.disconnect(); throw error }
  }

  request(type, payload = {}, timeout = 15000) {
    if (!this.socket || this.socket.readyState !== 1) return Promise.reject(new Error('请先连接游戏'))
    const id = String(++this.sequence)
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { this.pending.delete(id); reject(new Error(`游戏请求超时：${type}`)) }, timeout)
      this.pending.set(id, { resolve, reject, timer })
      try { this.socket.send(JSON.stringify({ ...payload, type, id })) }
      catch (error) { clearTimeout(timer); this.pending.delete(id); reject(error) }
    })
  }

  disconnect() {
    this.cancelOpen?.()
    const socket = this.socket
    this.socket = null
    if (socket) socket.close()
    for (const request of this.pending.values()) {
      clearTimeout(request.timer)
      request.reject(new Error('游戏连接已断开'))
    }
    this.pending.clear()
  }
}
