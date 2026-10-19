// 帧按预览版本隔离，避免旧编码任务覆盖新草稿的画面。
export function acceptsPreviewFrame(packet, revision, previousSequence = -1) {
  return packet?.event === 'preview.frame' && packet.revision === revision &&
    Number.isSafeInteger(packet.sequence) && packet.sequence > previousSequence &&
    ['width', 'height', 'guiWidth', 'guiHeight'].every(key => Number.isInteger(packet[key]) && packet[key] > 0 && packet[key] <= 16384) &&
    typeof packet.url === 'string' && packet.url.startsWith('data:image/png;base64,') &&
    Array.isArray(packet.components)
}

// 补偿与游戏通信的延迟，让落点立即跟随指针。
export function previewComponentRect(item, frame) {
  const dx = Number.isFinite(item.positionX) ? (item.target.x || 0) - item.positionX : 0
  const dy = Number.isFinite(item.positionY) ? (item.target.y || 0) - item.positionY : 0
  return { x: item.x + dx / 100 * frame.guiWidth, y: item.y + dy / 100 * frame.guiHeight, width: item.width, height: item.height }
}

export function previewComponentTarget(model, bounds) {
  if (bounds.kind === 'portrait') return model?.portrait?.[bounds.key]
  if (bounds.kind === 'functionalButton') return model?.functionalButton?.[Number(bounds.key)]
  return model?.[bounds.kind]
}
