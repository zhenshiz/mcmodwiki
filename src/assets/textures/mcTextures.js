const textures = import.meta.glob('@/assets/textures/**/*.png', {
  eager: true,
  import: 'default'
})

export function getTexture(path) {
  const normalized = `/src/assets/textures/${path}`

  // 找精确路径（含子目录）
  return textures[normalized] || null
}
