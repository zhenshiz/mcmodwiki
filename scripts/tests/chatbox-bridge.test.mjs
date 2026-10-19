import test from 'node:test'
import assert from 'node:assert/strict'
import { EditorConnection, localEditorUrl } from '../../src/views/more/chatbox/bridge/EditorConnection.js'

class FakeSocket {
  static sockets = []
  constructor(url) { this.url = url; this.readyState = 0; this.sent = []; FakeSocket.sockets.push(this) }
  open() { this.readyState = 1; this.onopen() }
  send(text) { this.sent.push(JSON.parse(text)) }
  respond(packet) { this.onmessage({ data: JSON.stringify(packet) }) }
  close() { this.readyState = 3; this.onclose?.() }
}

async function paired() {
  const connection = new EditorConnection({ WebSocketImpl: FakeSocket })
  const opening = connection.connect('ws://127.0.0.1:12345', 'pairing-token')
  const socket = FakeSocket.sockets.at(-1)
  socket.open()
  await Promise.resolve()
  assert.equal(socket.sent[0].type, 'hello')
  socket.respond({ id: socket.sent[0].id, ok: true, data: {} })
  await opening
  return { connection, socket }
}

test('accepts only explicit loopback bridge endpoints', () => {
  assert.equal(localEditorUrl('ws://localhost:1234'), 'ws://localhost:1234/chatbox-editor')
  for (const address of ['ws://example.com:1234', 'ws://127.0.0.1:1234/other', 'http://localhost:1234', 'ws://localhost:1234?token=x', 'ws://user:secret@localhost:1234']) {
    assert.throws(() => localEditorUrl(address))
  }
})

test('correlates out-of-order replies and reports game errors', async () => {
  const { connection, socket } = await paired()
  const first = connection.request('snapshot')
  const second = connection.request('image')
  socket.respond({ id: socket.sent[2].id, ok: false, error: 'Texture missing' })
  socket.respond({ id: socket.sent[1].id, ok: true, data: { language: 'zh_cn' } })
  assert.deepEqual(await first, { language: 'zh_cn' })
  await assert.rejects(second, /Texture missing/)
  connection.disconnect()
})

test('disconnect rejects in-flight requests and clears their timers', async () => {
  const { connection } = await paired()
  const pending = connection.request('preview')
  connection.disconnect()
  await assert.rejects(pending, /断开/)
  assert.equal(connection.pending.size, 0)
})

test('canceling an unopened connection cannot cancel the next connection', async () => {
  const connection = new EditorConnection({ WebSocketImpl: FakeSocket })
  const first = connection.connect('ws://localhost:1234', 'one')
  connection.disconnect()
  await assert.rejects(first, /取消/)
  const second = connection.connect('ws://localhost:1234', 'two')
  const socket = FakeSocket.sockets.at(-1)
  socket.open()
  await Promise.resolve()
  socket.respond({ id: socket.sent[0].id, ok: true, data: {} })
  await second
  assert.equal(connection.socket, socket)
  connection.disconnect()
})

test('timeouts reject a request without consuming another response', async () => {
  const { connection } = await paired()
  await assert.rejects(connection.request('snapshot', {}, 5), /超时/)
  assert.equal(connection.pending.size, 0)
  connection.disconnect()
})
