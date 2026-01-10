import { createAtomBlockMarkdownSpec, mergeAttributes, Node } from '@tiptap/core'

export const BiliBili = Node.create({
  name: 'bilibili',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      src: { default: null },
      bvid: { default: null }
    }
  },
  parseHTML() {
    return [{ tag: 'iframe[src*="bilibili.com"]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', { class: 'video-container' },
      ['iframe', mergeAttributes(HTMLAttributes, {
        width: '640',
        height: '480',
        allowfullscreen: 'true',
        frameborder: '0'
      })]
    ]
  },
  addCommands() {
    return {
      setBiliBili: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options
        })
      }
    }
  },
  ...createAtomBlockMarkdownSpec({
    nodeName: 'bilibili',
    requiredAttributes: ['src'],
    allowedAttributes: ['src', 'bvid'],
  }),
})
