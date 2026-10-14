import mermaid from 'mermaid'

// Mermaid shares global configuration. Apply it inside the render queue so previews
// and document nodes cannot render with another request's theme.
let pendingRender = Promise.resolve()
let nextId = 0
export const renderMermaid = (code, isDark) => {
  const render = pendingRender.then(async () => {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      suppressErrorRendering: true,
      theme: isDark ? 'dark' : 'default',
      themeVariables: {
        primaryColor: '#80ccff',
        mainBkg: isDark ? '#222e27' : '#f8faf3',
        lineColor: '#80ccff',
        fontSize: '14px',
      },
    })
    const id = `mmd-${++nextId}`
    try {
      const { svg } = await mermaid.render(id, code)
      return svg
    } finally {
      // Mermaid may leave its temporary container behind after a syntax error.
      document.getElementById(`d${id}`)?.remove()
    }
  })
  pendingRender = render.catch(() => {})
  return render
}
