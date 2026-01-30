/**
 * 过滤并构建文件树
 * 规范路径：data/<namespace>/chatbox/theme|dialogues/xxx.json
 */
export function buildFileTree(fileList) {
  const root = []

  // 辅助：查找或创建子节点
  const findOrCreateChild = (nodes, name) => {
    let node = nodes.find(n => n.name === name)
    if (!node) {
      node = {
        name,
        path: '',
        isFolder: true,
        isOpen: true, // 默认展开，方便查看
        children: []
      }
      nodes.push(node)
    }
    return node
  }

  // 遍历所有上传的文件
  for (const file of fileList) {
    // 1. 获取相对路径，例如 "data/test_mod/chatbox/theme/my_theme.json"
    const rawPath = file.webkitRelativePath || file.name

    // 2. 严格的过滤逻辑 (ChatBox 模组规范)
    // 必须包含 /chatbox/ 且是 .json 文件
    if (!rawPath.includes('/chatbox/') || !rawPath.endsWith('.json')) {
      continue
    }

    // 3. 路径分割
    const parts = rawPath.split('/')

    // 4. 递归构建树
    let currentLevel = root
    let currentPath = ''

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1
      currentPath = currentPath ? `${currentPath}/${part}` : part

      if (isFile) {
        // 是文件：添加文件节点
        // 简单判断类型：是在 theme 文件夹下还是 dialogues 文件夹下
        const type = rawPath.includes('/theme/') ? 'theme' :
          rawPath.includes('/dialogues/') ? 'dialogue' : 'unknown'

        currentLevel.push({
          name: part,
          path: currentPath,
          isFolder: false,
          file: file, // 存入原始 File 对象用于读取
          type: type
        })
      } else {
        // 是文件夹：查找或创建
        const folderNode = findOrCreateChild(currentLevel, part)
        folderNode.path = currentPath
        currentLevel = folderNode.children
      }
    })
  }

  // 5. 排序：文件夹优先，然后按名称
  const sortNodes = (nodes) => {
    if (!nodes) return
    nodes.sort((a, b) => {
      if (a.isFolder === b.isFolder) return a.name.localeCompare(b.name)
      return a.isFolder ? -1 : 1
    })
    nodes.forEach(node => {
      if (node.isFolder) sortNodes(node.children)
    })
  }

  sortNodes(root)
  return root
}

/**
 * 解析资源包文件
 * 将 FileList 转换为 Map<MinecraftPath, BlobURL> 和 List<Suggestion>
 */
export function processResourcePack(fileList) {
  const textureMap = new Map() // Key: "chatbox:textures/...", Value: BlobURL
  const suggestions = [] // 用于 AutoComplete 的数组

  for (const file of fileList) {
    const rawPath = file.webkitRelativePath || file.name

    if (!rawPath.startsWith('assets/') || !rawPath.includes('/textures/') || !rawPath.endsWith('.png')) {
      continue
    }

    const match = rawPath.match(/^assets\/([^/]+)\/(.*)$/)

    if (match && match.length === 3) {
      const namespace = match[1]
      const restPath = match[2]

      const mcLocation = `${namespace}:${restPath}`

      const blobUrl = URL.createObjectURL(file)

      textureMap.set(mcLocation, blobUrl)
      suggestions.push(mcLocation)
    }
  }

  // 排序建议列表
  suggestions.sort()

  return { textureMap, suggestions }
}
