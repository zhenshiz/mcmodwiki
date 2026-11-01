export function themeSymbols(theme) {
  const keys = value => value && typeof value === 'object' && !Array.isArray(value) ? Object.keys(value) : []
  return { portraits: keys(theme?.portrait), animations: keys(theme?.customAnimation) }
}

export function themeSuggestions(catalog, activeId, activeTheme) {
  const themes = { ...catalog }
  if (activeTheme) themes[activeId || '__current__'] = themeSymbols(activeTheme)
  const portraitThemes = activeId ? (themes[activeId] ? [[activeId, themes[activeId]]] : []) : Object.entries(themes)
  const collect = (entries, field) => {
    const ids = new Map()
    for (const [source, symbols] of entries) for (const id of symbols[field]) {
      if (!ids.has(id)) ids.set(id, [])
      ids.get(id).push(source)
    }
    return [...ids].map(([value, sources]) => ({ value, label: value, source: sources.filter(source => source !== '__current__').join(', ') }))
      .sort((a, b) => a.value.localeCompare(b.value))
  }
  return { portraits: collect(portraitThemes, 'portraits'), animations: collect(Object.entries(themes), 'animations') }
}

export async function readThemeCatalog(files, read, isCurrent) {
  const catalog = {}, failed = []
  const queue = files.filter(file => file.kind === 'theme')
  let index = 0
  await Promise.all(Array.from({ length: Math.min(4, queue.length) }, async () => {
    while (index < queue.length && isCurrent()) {
      const file = queue[index++]
      try {
        const result = await read(file)
        if (isCurrent()) catalog[file.resourceId] = themeSymbols(JSON.parse(result.content))
      } catch { if (isCurrent()) failed.push(file.resourceId) }
    }
  }))
  return { catalog, failed }
}
