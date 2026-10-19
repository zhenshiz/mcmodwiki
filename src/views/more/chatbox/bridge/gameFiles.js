// Server IDs, rather than browser filesystem paths, identify editable game resources.
export function gameFileTree(files = [], serverSession = '') {
  const roots = []
  const folders = new Map()
  for (const file of files) {
    if (!['dialogue', 'theme'].includes(file.kind) || !file.resourceId?.includes(':')) continue
    const [namespace, name] = file.resourceId.split(':')
    const path = `${namespace}/chatbox/${file.kind === 'dialogue' ? 'dialogues' : 'theme'}/${name}.json`
    const parts = path.split('/')
    let children = roots
    let parent = ''
    for (const segment of parts.slice(0, -1)) {
      const key = parent ? `${parent}/${segment}` : segment
      let node = folders.get(key)
      if (!node) {
        node = { name: segment, path: key, isFolder: true, isOpen: true, game: true, children: [] }
        folders.set(key, node); children.push(node)
      }
      children = node.children; parent = key
    }
    children.push({ ...file, name: parts.at(-1), path, type: file.kind, isFolder: false, game: true, serverSession })
  }
  return roots
}

export function gameFileRequest(file, serverSession) {
  if (!serverSession || file.serverSession !== serverSession) throw new Error('游戏连接已变化，请重新读取文件')
  return { kind: file.kind, resourceId: file.resourceId, serverSession }
}
