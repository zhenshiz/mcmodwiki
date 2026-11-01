// Three.js already includes the standalone fflate ZIP reader; this does not load its renderer.
import { unzip } from 'three/addons/libs/fflate.module.js'

const MAX_IMAGE_BYTES = 8 * 1024 * 1024
const MAX_PACK_BYTES = 128 * 1024 * 1024

export function textureResourceId(path) {
  const normalized = path.replaceAll('\\', '/')
  if (normalized.split('/').some(part => part === '..' || part === '__MACOSX')) return null
  const match = normalized.match(/(?:^|\/)assets\/([a-z0-9_.-]+)\/(textures\/[a-z0-9_./-]+\.(?:png|jpg|jpeg))$/)
  return match ? `${match[1]}:${match[2]}` : null
}

export function mergeTextureOptions(gameOptions, localOptions) {
  const options = new Map(gameOptions.map(option => [option.value, { ...option, textureId: option.value }]))
  for (const option of localOptions) options.set(option.value, option)
  return [...options.values()].sort((a, b) => a.value.localeCompare(b.value))
}

function imageType(path) { return path.endsWith('.png') ? 'image/png' : 'image/jpeg' }

export async function readResourcePackFiles(files) {
  const textures = new Map()
  let size = 0, skipped = 0
  for (const file of files) {
    const resourceId = textureResourceId(file.webkitRelativePath || file.name)
    if (!resourceId) continue
    if (file.size > MAX_IMAGE_BYTES) { skipped++; continue }
    size += file.size
    if (size > MAX_PACK_BYTES) throw new Error('单个资源包的贴图总大小不能超过 128 MiB')
    textures.set(resourceId, { resourceId, blob: file.slice(0, file.size, imageType(resourceId)) })
  }
  return { textures: [...textures.values()], skipped }
}

export async function readResourcePackArchive(file) {
  if (file.size > 512 * 1024 * 1024) throw new Error('资源包压缩文件不能超过 512 MiB')
  const bytes = new Uint8Array(await file.arrayBuffer())
  let size = 0, skipped = 0, tooLarge = false
  const entries = await new Promise((resolve, reject) => unzip(bytes, {
    filter: entry => {
      if (!textureResourceId(entry.name)) return false
      if (entry.originalSize > MAX_IMAGE_BYTES) { skipped++; return false }
      size += entry.originalSize
      if (size > MAX_PACK_BYTES) { tooLarge = true; return false }
      return true
    },
  }, (error, result) => error ? reject(new Error('无法读取资源包，请选择有效的 ZIP 或 JAR 文件')) : resolve(result)))
  if (tooLarge) throw new Error('单个资源包的贴图总大小不能超过 128 MiB')
  const textures = new Map()
  for (const [path, data] of Object.entries(entries)) {
    const resourceId = textureResourceId(path)
    textures.set(resourceId, { resourceId, blob: new Blob([data], { type: imageType(path) }) })
  }
  return { textures: [...textures.values()], skipped }
}
