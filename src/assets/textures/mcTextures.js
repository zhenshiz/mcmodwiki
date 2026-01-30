import { effect } from './effect'
import { item } from './item'

const textures = import.meta.glob('@/assets/textures/**/*.png', {
  eager: true,
  import: 'default'
})

export const itemSuggestions = item.map(i => {
  return {
    label: i.label,
    value: i.value,
    icon: getTexture(i.icon)
  }
})

export const blockSuggestions = item.filter(i => i.isBlock).map(i => {
  return {
    label: i.label,
    value: i.value,
    icon: getTexture(i.icon)
  }
})

export const effectSuggestions = effect.map(i => {
  return {
    label: i.label,
    value: i.value,
    icon: getTexture(i.icon)
  }
})

export function getTexture(path) {
  const normalized = `/src/assets/textures/${path}`

  // 找精确路径（含子目录）
  return textures[normalized] || null
}
