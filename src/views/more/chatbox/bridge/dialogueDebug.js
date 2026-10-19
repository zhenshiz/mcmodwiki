export function acceptsDebugState(packet, session, previousSequence = -1) {
  return packet?.event === 'debug.state' && packet.session === session &&
    Number.isSafeInteger(packet.sequence) && packet.sequence > previousSequence &&
    Number.isSafeInteger(packet.version) && packet.version > 0 &&
    typeof packet.resourceId === 'string' && typeof packet.group === 'string' &&
    Number.isInteger(packet.index) && packet.index >= 0
}

export function sameDebugPosition(a, b) {
  return a && b && a.resourceId === b.resourceId && a.group === b.group && a.index === b.index
}

// 运行位置与编辑器选中状态分开，查看其他节点不会改变游戏进度。
export function debugNodeState(data, state, fileId, active) {
  if (!active || !state || state.resourceId !== fileId || data.group !== state.group) return false
  return data.kind === 'group' || data.kind === 'frame' && data.index === state.index
}
