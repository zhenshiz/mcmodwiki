import { applyThemePreviewVisibility } from '../bridge/themePreview.js'

export const animationNumberFields = ['x', 'y', 'xOffset', 'yOffset', 'scale', 'angle', 'opacity', 'brightness']

export function animationSegments(keyframes) {
  let end = 0
  return keyframes.map((keyframe, index) => {
    const duration = Number.isInteger(keyframe.time ?? 1) && (keyframe.time ?? 1) > 0 ? keyframe.time ?? 1 : 1
    const start = end
    end += duration
    return { index, start, end, duration }
  })
}

export function validAnimation(keyframes) {
  if (!keyframes.length) return true
  return keyframes.every(frame => Number.isInteger(frame.time ?? 1) && (frame.time ?? 1) > 0 &&
    animationNumberFields.every(key => frame[key] == null || Number.isFinite(frame[key])) &&
    (frame.scale == null || frame.scale >= 0) &&
    (frame.opacity == null || frame.opacity >= 0 && frame.opacity <= 100) &&
    (frame.brightness == null || frame.brightness >= 0)) &&
    animationSegments(keyframes).at(-1)?.end <= 2147483647
}

export function animationPortraitVisible(key, activeKey, visibility = {}) {
  return Object.hasOwn(visibility, key) ? visibility[key] : key === activeKey
}

export function animationPreviewTheme(theme, portrait, keyframes, key, portraitVisibility = {}) {
  const result = JSON.parse(JSON.stringify(theme || {}))
  result.portrait ||= {}
  const target = { ...result.portrait[key], ...JSON.parse(JSON.stringify(portrait || {})),
    customAnimation: JSON.parse(JSON.stringify(keyframes)), loop: false }
  delete target.animation
  result.portrait[key] = target
  applyThemePreviewVisibility(result, {
    ...theme, portrait: { ...theme?.portrait, [key]: portrait || theme?.portrait?.[key] },
  })
  // Animation sessions start with only their target visible, independently of the theme editor.
  for (const [portraitKey, component] of Object.entries(result.portrait)) {
    component.hidden = !animationPortraitVisible(portraitKey, key, portraitVisibility)
  }
  return result
}
