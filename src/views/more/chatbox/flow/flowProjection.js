export const groupNodeId = key => `group:${key}`
export const frameNodeId = (group, index, frame) => `frame:${frame?._editorId || `${group}:${index}`}`

// Stable IDs preserve layout when text or diagnostics change.
export function projectFlow(model, analysis, scope = null) {
  const groups = model.dialogues || {}
  const nodes = [], bundles = new Map()
  const addNode = node => { if (!nodes.some(item => item.id === node.id)) nodes.push(node) }
  const addEdge = (source, target, link) => {
    const id = JSON.stringify([source, target])
    const edge = bundles.get(id) || { id, source, target, links: [] }
    edge.links.push(link)
    bundles.set(id, edge)
  }
  if (scope === null) {
    for (const [group, frames] of Object.entries(groups)) addNode({ id: groupNodeId(group), group, frames, kind: 'group' })
    for (const link of analysis.transitions) {
      if (link.implicit || link.stay || (link.group === link.groupKey && !link.groupJump && link.kind === 'frame')) continue
      if (!['frame', 'missing', 'external'].includes(link.kind)) continue
      const target = link.kind === 'external' ? `external:${link.file}:${link.group}` : groupNodeId(link.group)
      addNode({ id: target, group: link.group, kind: link.kind === 'frame' ? 'group' : link.kind, frames: groups[link.group] || [] })
      addEdge(groupNodeId(link.groupKey), target, link)
    }
  } else {
    ;(groups[scope] || []).forEach((frame, index) => addNode({ id: frameNodeId(scope, index, frame), group: scope, index, frame, kind: 'frame' }))
    const targetId = link => {
      if (link.kind === 'frame' && link.group === scope) return frameNodeId(scope, link.index, groups[scope][link.index])
      const id = link.kind === 'end' ? `end:${scope}` : `portal:${link.kind}:${link.file || ''}:${link.group}:${link.index}`
      addNode({ id, group: link.group, index: link.index, kind: link.kind === 'frame' ? 'portal' : link.kind })
      return id
    }
    for (const link of analysis.transitions) {
      if (link.groupKey === scope) addEdge(frameNodeId(scope, link.frameIndex, groups[scope]?.[link.frameIndex]), targetId(link), link)
      else if (link.group === scope && link.kind === 'frame') {
        const source = `incoming:${link.groupKey}`
        addNode({ id: source, group: link.groupKey, kind: 'incoming' })
        addEdge(source, targetId(link), link)
      }
    }
  }
  return { nodes, edges: [...bundles.values()] }
}
