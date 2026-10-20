const number = (value, fallback) => Number.isFinite(value) ? value : fallback
const round = value => Number(value.toFixed(3))
const rotate = (x, y, angle) => {
  const radians = angle * Math.PI / 180
  return { x: x * Math.cos(radians) - y * Math.sin(radians), y: x * Math.sin(radians) + y * Math.cos(radians) }
}

// 以游戏回传的实际尺寸、单位和对齐方式计算，本地反馈与渲染帧使用同一坐标系。
export function transformedPreviewRect(item, frame) {
  const target = item.target
  let width = item.realWidth, height = item.realHeight
  if (item.sizeMode === 'box') {
    width += (number(target.width, item.modelWidth) - item.modelWidth) * item.widthUnit
    height += (number(target.height, item.modelHeight) - item.modelHeight) * item.heightUnit
  } else if (item.sizeMode === 'square') {
    const delta = (number(target.width, item.modelWidth) - item.modelWidth) * frame.guiWidth / 100 +
      (number(target.height, item.modelHeight) - item.modelHeight) * frame.guiHeight / 100
    width += delta; height += delta
  }
  const scale = item.renderScale + number(target.scale, item.modelScale) - item.modelScale
  const scaledWidth = Math.max(0, width * scale), scaledHeight = Math.max(0, height * scale)
  return {
    x: item.x + (number(target.x, item.positionX) - item.positionX) * frame.guiWidth / 100 +
      (0.5 - item.alignX) * (width - item.realWidth) - (scaledWidth - item.width) / 2,
    y: item.y + (number(target.y, item.positionY) - item.positionY) * frame.guiHeight / 100 +
      (0.5 - item.alignY) * (height - item.realHeight) - (scaledHeight - item.height) / 2 +
      (number(target.height, item.modelHeight) - item.modelHeight) * (item.heightOffsetUnit || 0),
    width: scaledWidth, height: scaledHeight,
    angle: item.rotatable === false ? 0 : item.angle + number(target.angle, item.modelAngle) - item.modelAngle,
    realWidth: width, realHeight: height, renderScale: scale,
  }
}

export function previewTransformStart(item, frame) {
  return { item, frame, rect: transformedPreviewRect(item, frame), values: Object.fromEntries(
    ['x', 'y', 'width', 'height', 'scale', 'angle'].map(key => [key, number(item.target[key],
      { x: item.positionX, y: item.positionY, width: item.modelWidth, height: item.modelHeight, scale: item.modelScale, angle: item.modelAngle }[key])])) }
}

export function resizePreviewComponent(start, handle, dx, dy, lockAspect = false) {
  const { item, frame, rect, values } = start
  const local = rotate(dx, dy, -rect.angle)
  const [sx, sy] = handle
  const minSize = 1
  let width = Math.max(minSize, rect.width + sx * local.x)
  let height = Math.max(minSize, rect.height + sy * local.y)
  if (item.sizeMode !== 'box' || lockAspect) {
    const dw = sx ? (width - rect.width) / Math.max(rect.width, minSize) : 0
    const dh = sy ? (height - rect.height) / Math.max(rect.height, minSize) : 0
    const factor = Math.max(minSize / Math.max(minSize, rect.width), minSize / Math.max(minSize, rect.height),
      1 + (Math.abs(dw) > Math.abs(dh) ? dw : dh))
    width = rect.width * factor; height = rect.height * factor
  }
  const shift = rotate(sx * (width - rect.width) / 2, sy * (height - rect.height) / 2, rect.angle)
  let realWidth = rect.realWidth, realHeight = rect.realHeight
  const result = {}
  if (item.sizeMode === 'scale') {
    result.scale = round(Math.max(0, values.scale + (width / Math.max(rect.width, minSize) - 1) * rect.renderScale))
  } else if (item.sizeMode === 'square') {
    const factor = width / Math.max(rect.width, minSize)
    result.width = round(values.width * factor)
    result.height = round(values.height * factor)
    realWidth *= factor; realHeight *= factor
  } else {
    realWidth = width / Math.max(rect.renderScale, 0.001)
    realHeight = height / Math.max(rect.renderScale, 0.001)
    result.width = round(Math.max(0, values.width + (realWidth - rect.realWidth) / Math.max(item.widthUnit, 0.001)))
    result.height = round(Math.max(0, values.height + (realHeight - rect.realHeight) / Math.max(item.heightUnit, 0.001)))
  }
  result.x = round(values.x + (shift.x - (0.5 - item.alignX) * (realWidth - rect.realWidth)) / frame.guiWidth * 100)
  result.y = round(values.y + (shift.y - (0.5 - item.alignY) * (realHeight - rect.realHeight) - ((result.height ?? values.height) - values.height) * (item.heightOffsetUnit || 0)) / frame.guiHeight * 100)
  return result
}

export function rotatePreviewComponent(start, initial, point, snap = false) {
  const { rect, values } = start
  const cx = rect.x + rect.width / 2, cy = rect.y + rect.height / 2
  const from = Math.atan2(initial.y - cy, initial.x - cx), to = Math.atan2(point.y - cy, point.x - cx)
  let angle = values.angle + (to - from) * 180 / Math.PI
  if (snap) angle = Math.round(angle / 15) * 15
  return { angle: round(((angle + 180) % 360 + 360) % 360 - 180) }
}
