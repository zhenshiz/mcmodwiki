import Image from '@tiptap/extension-image'

const parsePixelWidth = (value) => {
  if (value === null || value === undefined || value === '') return null

  const text = String(value).trim()
  if (text.endsWith('%')) return null

  const width = Number.parseFloat(text.replace(/px$/i, ''))
  return Number.isFinite(width) && width > 0 ? Math.round(width) : null
}

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) =>
          parsePixelWidth(element.getAttribute('width')) || parsePixelWidth(element.style.width),
        renderHTML: (attributes) => {
          const width = parsePixelWidth(attributes.width)
          if (!width) return {}

          return {
            width: String(width),
            style: `width: ${width}px; height: auto;`,
          }
        },
      },
    }
  },
})
