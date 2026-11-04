// Three.js already includes the standalone fflate ZIP reader; this does not load its renderer.
import { unzip } from 'three/addons/libs/fflate.module.js'

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

export function soundDefinitionNamespace(path) {
  const normalized = path.replaceAll('\\', '/')
  if (normalized.split('/').some(part => part === '..' || part === '__MACOSX')) return null
  return normalized.match(/(?:^|\/)assets\/([a-z0-9_.-]+)\/sounds\.json$/)?.[1] || null
}

export function soundIdsFromDefinition(path, text) {
  const namespace = soundDefinitionNamespace(path)
  if (!namespace) return []
  let data
  try { data = JSON.parse(text.replace(/^\uFEFF/, '')) } catch { throw new Error(`声音定义不是有效的 JSON：${path}`) }
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error(`声音定义必须是 JSON 对象：${path}`)
  return Object.entries(data).filter(([id, definition]) => /^[a-z0-9_./-]+$/.test(id)
    && definition && typeof definition === 'object' && !Array.isArray(definition)).map(([id]) => `${namespace}:${id}`)
}

export function mergeSoundOptions(gameOptions, localOptions) {
  return [...new Map([...gameOptions, ...localOptions].map(option => [option.value, option])).values()]
    .sort((a, b) => a.value.localeCompare(b.value))
}

function imageType(path) { return path.endsWith('.png') ? 'image/png' : 'image/jpeg' }

export async function readResourcePackFiles(files) {
  const textures = new Map()
  const sounds = new Set()
  for (const file of files) {
    const path = file.webkitRelativePath || file.name
    if (soundDefinitionNamespace(path)) {
      for (const id of soundIdsFromDefinition(path, await file.text())) sounds.add(id)
      continue
    }
    const resourceId = textureResourceId(path)
    if (!resourceId) continue
    textures.set(resourceId, { resourceId, blob: file.slice(0, file.size, imageType(resourceId)) })
  }
  return { textures: [...textures.values()], sounds: [...sounds].sort() }
}

export async function readResourcePackArchive(file) {
  const bytes = new Uint8Array(await file.arrayBuffer())
  const entries = await new Promise((resolve, reject) => unzip(bytes, {
    filter: entry => !!soundDefinitionNamespace(entry.name) || !!textureResourceId(entry.name),
  }, (error, result) => error ? reject(new Error('无法读取资源包，请选择有效的 ZIP 或 JAR 文件')) : resolve(result)))
  const textures = new Map()
  const sounds = new Set()
  for (const [path, data] of Object.entries(entries)) {
    if (soundDefinitionNamespace(path)) {
      for (const id of soundIdsFromDefinition(path, new TextDecoder().decode(data))) sounds.add(id)
      continue
    }
    const resourceId = textureResourceId(path)
    textures.set(resourceId, { resourceId, blob: new Blob([data], { type: imageType(path) }) })
  }
  return { textures: [...textures.values()], sounds: [...sounds].sort() }
}
