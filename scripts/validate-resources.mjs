import { statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import resources, { curseforgeModUrl } from '../src/assets/info/resources.js'

const root = fileURLToPath(new URL('../', import.meta.url))
const downloads = path.join(root, 'public/downloads')
const ids = new Set()
let releases = 0

for (const item of resources) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id) || ids.has(item.id)) {
    throw new Error(`资源 ID 无效或重复：${item.id}`)
  }
  ids.add(item.id)
  if (!item.title || !item.description || !['mod', 'nbt', 'other'].includes(item.category)) {
    throw new Error(`资源缺少标题、介绍或有效分类：${item.id}`)
  }
  for (const field of ['tags', 'releases']) {
    if (!Array.isArray(item[field])) throw new Error(`资源 ${item.id} 的 ${field} 必须是数组`)
  }
  for (const release of item.releases) {
    if (
      !release.version ||
      !release.filename ||
      !release.url ||
      !release.minecraft?.length ||
      !Array.isArray(release.minecraft) ||
      !Array.isArray(release.loaders)
    ) {
      throw new Error(`资源 ${item.id} 的下载版本缺少版本号、文件名、地址或适配信息`)
    }
    if (release.url.startsWith('https://')) {
      new URL(release.url)
    } else {
      if (!release.url.startsWith('/downloads/')) {
        throw new Error(`资源 ${item.id} 的文件必须位于 /downloads/ 或使用 HTTPS 下载地址`)
      }
      const file = path.resolve(root, `public${release.url}`)
      const stats = statSync(file, { throwIfNoEntry: false })
      if (!file.startsWith(`${downloads}${path.sep}`) || !stats?.isFile() || stats.size === 0) {
        throw new Error(`资源 ${item.id} 的下载文件无效：${release.url}`)
      }
    }
    for (const field of ['dependencies', 'optionalDependencies']) {
      const list = release[field]
      if (!list) continue
      if (!Array.isArray(list)) throw new Error(`资源 ${item.id} 的 ${field} 必须是数组`)
      for (const name of list) {
        if (!curseforgeModUrl(name)) {
          throw new Error(`资源 ${item.id} 的依赖 ${name} 缺少 CurseForge 页面配置`)
        }
      }
    }
    releases++
  }
}

console.log(`资源清单验证通过：${resources.length} 项资源，${releases} 个下载版本`)
