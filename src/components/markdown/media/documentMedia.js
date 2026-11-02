import { del, get, setMany } from 'idb-keyval'
import { unzip, zip } from 'three/addons/libs/fflate.module.js'

const MEDIA_ROOT = '/md/media/'
const STORAGE_PREFIX = 'wiki-document-media-v1:'
const MAX_VIDEO_BYTES = 100 * 1024 * 1024
const MAX_IMAGE_BYTES = 8 * 1024 * 1024
const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024
const MAX_PACKAGE_BYTES = 256 * 1024 * 1024
const encoder = new TextEncoder()
const decoder = new TextDecoder()
const mediaTypes = { mp4: 'video/mp4', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' }
const hasUnsafePathCharacters = value => value.includes('\\') || [...value].some(char => char.codePointAt(0) < 32)

export function safeMediaSource(value) {
  const source = String(value || '').trim()
  if (/^\/(?!\/)/.test(source) && !hasUnsafePathCharacters(source)) return source
  try {
    const url = new URL(source)
    if (url.protocol === 'https:' && !url.username && !url.password) return url.href
  } catch { /* 站内路径和 HTTPS 链接以外的地址不可发布。 */ }
  return ''
}

export function isLocalMediaSource(source) {
  return /^\/md\/media\/[a-zA-Z0-9_-]+\.(mp4|png|jpe?g|webp)$/.test(source || '')
}

export async function importMediaFile(file, kind = 'video') {
  const extension = file.name.split('.').at(-1).toLowerCase()
  if (kind === 'video' ? extension !== 'mp4' : !['png', 'jpg', 'jpeg', 'webp'].includes(extension)) {
    throw new Error(kind === 'video' ? '请选择 MP4 视频文件' : '请选择 PNG、JPEG 或 WebP 封面图片')
  }
  if (!file.size || file.size > (kind === 'video' ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES)) {
    throw new Error(kind === 'video' ? '视频不能为空且不能超过 100 MiB' : '封面不能为空且不能超过 8 MiB')
  }
  const source = `${MEDIA_ROOT}${crypto.randomUUID()}.${extension}`
  const asset = { name: file.name, blob: file.slice(0, file.size, mediaTypes[extension]) }
  try { await setMany([[STORAGE_PREFIX + source, asset]]) }
  catch { throw new Error('无法保存本地媒体，请检查浏览器存储空间和权限') }
  return source
}

export async function readMediaAsset(source) {
  return isLocalMediaSource(source) ? get(STORAGE_PREFIX + source) : undefined
}

export async function discardMediaAsset(source) {
  if (isLocalMediaSource(source)) await del(STORAGE_PREFIX + source)
}

export function documentMediaSources(html) {
  const document = new DOMParser().parseFromString(html || '', 'text/html')
  return [...new Set([...document.querySelectorAll('video')].flatMap(video =>
    [video.getAttribute('src'), video.getAttribute('poster')].filter(isLocalMediaSource)))]
}

export function documentFilename(value) {
  return [...String(value || '').trim()].map(char => char.codePointAt(0) < 32 ? '_' : char).join('')
    .replace(/[<>:"/\\|?*]/g, '_').replace(/^\.+|[. ]+$/g, '')
}

export async function exportDocumentPackage(html, filename) {
  const name = documentFilename(filename)
  if (!name) throw new Error('请输入文件名')
  if (/\b(?:src|poster)\s*=\s*["'](?:blob:|file:)/i.test(html)) {
    throw new Error('文档包含临时媒体地址，请重新选择视频文件后导出')
  }
  const files = { [`${name}.md`]: encoder.encode(html) }
  let size = files[`${name}.md`].length
  const sources = documentMediaSources(html)
  if (size > MAX_DOCUMENT_BYTES || sources.length > 499) throw new Error('文档包包含无效路径或内容过大')
  for (const source of sources) {
    let blob = (await readMediaAsset(source))?.blob
    if (!blob) {
      const response = await fetch(source)
      const extension = source.split('.').at(-1)
      if (response.ok && response.headers.get('content-type')?.split(';')[0] === mediaTypes[extension]) blob = await response.blob()
    }
    if (!blob) throw new Error('本地媒体缺失，请重新导入原文档包后再导出')
    if (!blob.size || blob.size > (source.endsWith('.mp4') ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES)) {
      throw new Error('文档包中的视频或封面大小无效')
    }
    size += blob.size
    if (size > MAX_PACKAGE_BYTES) throw new Error('文档包总大小不能超过 256 MiB')
    files[source.slice(1)] = new Uint8Array(await blob.arrayBuffer())
  }
  files['README.txt'] = encoder.encode(
    `文档：${name}.md\n\n` +
    '继续编辑：在富文本编辑器中导入整个 ZIP，即可恢复文档、视频和封面。\n' +
    '网站发布：将 md/media/ 合并到网站项目的 public/md/media/，再把文档放入相应的文档目录并一起构建发布。\n' +
    '本地媒体位于 md/media/，文档使用 /md/media/ 路径引用。其他站内路径及 HTTPS 链接保留为在线引用。\n',
  )
  const bytes = await new Promise((resolve, reject) => zip(files, { level: 0 }, (error, result) => error ? reject(error) : resolve(result)))
  if (bytes.length > MAX_PACKAGE_BYTES) throw new Error('文档包总大小不能超过 256 MiB')
  return new Blob([bytes], { type: 'application/zip' })
}

export async function importDocumentPackage(file) {
  if (file.size > MAX_PACKAGE_BYTES) throw new Error('文档包总大小不能超过 256 MiB')
  const bytes = new Uint8Array(await file.arrayBuffer())
  let size = 0, count = 0, invalid = false
  const entries = await new Promise((resolve, reject) => unzip(bytes, {
    filter: entry => {
      if (entry.name.split('/').some(part => part === '..') || hasUnsafePathCharacters(entry.name) || entry.name.startsWith('/')) {
        invalid = true
        return false
      }
      const document = /^[^/]+\.md$/i.test(entry.name)
      if (!document && !isLocalMediaSource('/' + entry.name)) return false
      size += entry.originalSize
      if (++count > 500 || size > MAX_PACKAGE_BYTES || (document && entry.originalSize > MAX_DOCUMENT_BYTES)) {
        invalid = true
        return false
      }
      return true
    },
  }, (error, result) => error ? reject(new Error('无法读取文档包，请选择有效的 ZIP 文件')) : resolve(result)))
  if (invalid) throw new Error('文档包包含无效路径或内容过大')
  const documents = Object.keys(entries).filter(path => /^[^/]+\.md$/i.test(path))
  if (documents.length !== 1) throw new Error('文档包中必须包含一个 Markdown 文档')
  const content = decoder.decode(entries[documents[0]])
  const assets = documentMediaSources(content).map(source => {
    const data = entries[source.slice(1)]
    if (!data) throw new Error('文档包缺少视频或封面文件')
    const extension = source.split('.').at(-1)
    if (!data.length || data.length > (extension === 'mp4' ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES)) {
      throw new Error('文档包中的视频或封面大小无效')
    }
    return [STORAGE_PREFIX + source, { name: source.split('/').at(-1), blob: new Blob([data], { type: mediaTypes[extension] }) }]
  })
  try { if (assets.length) await setMany(assets) }
  catch { throw new Error('无法保存本地媒体，请检查浏览器存储空间和权限') }
  return { filename: documents[0].replace(/\.md$/i, ''), content }
}
