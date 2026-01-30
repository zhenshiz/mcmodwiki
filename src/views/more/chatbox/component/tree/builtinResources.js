const modules = import.meta.glob('@/assets/more/chatbox/assets/chatbox/textures/**/*.png', {
  eager: true,
  as: 'url',
})

const builtinMap = {}

for (const path in modules) {
  const url = modules[path]

  const match = path.match(/\/assets\/chatbox\/(.+)$/)

  if (match && match[1]) {
    const mcId = `chatbox:${match[1]}`

    builtinMap[mcId] = url
  }
}

export const getBuiltinTextures = () => {
  return Object.entries(builtinMap).map(([key, url]) => ({
    label: key,
    value: key,
    icon: url
  }))
}

/**
 * 获取资源 URL
 */
export const resolveTexture = (mcPath, userTextureMap) => {
  if (!mcPath) return ''

  if (userTextureMap && userTextureMap.has(mcPath)) {
    return userTextureMap.get(mcPath)
  }

  const normalizedPath = mcPath.includes(':') ? mcPath : `chatbox:${mcPath}`

  if (builtinMap[normalizedPath]) {
    return builtinMap[normalizedPath]
  }

  return ''
}
