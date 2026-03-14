import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import CustomTableComponent from '@/components/markdown/components/CustomTableComponent.vue'

const clampInt = (value, min, max, fallback) => {
  const parsed = Number.parseInt(String(value ?? ''), 10)
  if (Number.isNaN(parsed)) return fallback
  return Math.min(max, Math.max(min, parsed))
}

const normalizeMatrix = (matrix) => {
  const safe = Array.isArray(matrix) ? matrix : []
  const rows = safe.map((row) => (Array.isArray(row) ? row.map((c) => String(c ?? '')) : []))
  const maxCols = Math.max(1, ...rows.map((r) => r.length || 0))
  if (rows.length === 0) return [new Array(maxCols).fill('')]
  return rows.map((r) => {
    const next = r.slice(0, maxCols)
    while (next.length < maxCols) next.push('')
    return next
  })
}

const buildEmptyMatrix = (rows, cols) => {
  const safeRows = clampInt(rows, 1, 50, 2)
  const safeCols = clampInt(cols, 1, 20, 2)
  return new Array(safeRows).fill(null).map(() => new Array(safeCols).fill(''))
}

const extractCellText = (cell) => {
  if (!cell) return ''
  // innerText 能更好地保留 <br> / 块元素的换行
  const text = typeof cell.innerText === 'string' ? cell.innerText : cell.textContent
  return String(text ?? '').replace(/\r\n/g, '\n').trimEnd()
}

const tableDomToMatrix = (tableEl) => {
  const rowEls = Array.from(tableEl?.querySelectorAll?.('tr') ?? [])
  const rows = rowEls.map((tr) => {
    const cellEls = Array.from(tr.querySelectorAll('th,td'))
    return cellEls.map((cell) => extractCellText(cell))
  })
  return normalizeMatrix(rows)
}

const detectHeaderRow = (tableEl) => {
  const firstRow = tableEl?.querySelector?.('tr')
  if (!firstRow) return true
  return firstRow.querySelectorAll('th').length > 0
}

export const CustomTable = Node.create({
  name: 'customTable',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      withHeaderRow: { default: true },
      data: { default: buildEmptyMatrix(2, 2) },
      style: { default: null },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'table',
        getAttrs: (dom) => {
          const tableEl = dom instanceof HTMLElement ? dom : null
          if (!tableEl) return false

          const data = tableDomToMatrix(tableEl)
          const withHeaderRowAttr = tableEl.getAttribute('data-with-header-row')
          const withHeaderRow =
            withHeaderRowAttr === 'true' ||
            withHeaderRowAttr === '1' ||
            (withHeaderRowAttr == null && detectHeaderRow(tableEl))

          return {
            withHeaderRow,
            data,
            style: tableEl.getAttribute('style') || null,
          }
        },
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    const data = normalizeMatrix(node.attrs.data)
    const withHeaderRow = !!node.attrs.withHeaderRow

    const tbody = [
      'tbody',
      {},
      ...data.map((row, rowIndex) => {
        const cellTag = withHeaderRow && rowIndex === 0 ? 'th' : 'td'
        return [
          'tr',
          {},
          ...row.map((cell) => [cellTag, {}, String(cell ?? '')]),
        ]
      }),
    ]

    return [
      'table',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'custom-table',
        'data-with-header-row': withHeaderRow ? 'true' : 'false',
        ...(node.attrs.style ? { style: node.attrs.style } : {}),
      }),
      tbody,
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(CustomTableComponent, {
      stopEvent: ({ event }) => {
        const target = event.target
        return (
          target instanceof HTMLTextAreaElement ||
          target instanceof HTMLInputElement ||
          target instanceof HTMLButtonElement ||
          target instanceof HTMLSelectElement
        )
      },
      ignoreMutation: () => true,
    })
  },

  addCommands() {
    return {
      insertTable:
        (options = {}) =>
          ({ commands }) => {
            const rows = clampInt(options.rows, 1, 50, 2)
            const cols = clampInt(options.cols, 1, 20, 2)
            const withHeaderRow = options.withHeaderRow !== false

            return commands.insertContent({
              type: this.name,
              attrs: {
                withHeaderRow,
                data: buildEmptyMatrix(rows, cols),
              },
            })
          },
    }
  },
})
