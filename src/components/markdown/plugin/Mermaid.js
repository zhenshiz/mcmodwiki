import { Node, mergeAttributes, InputRule, createBlockMarkdownSpec } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import MermaidComponent from '@/components/markdown/components/MermaidComponent.vue'

export const Mermaid = Node.create({
  name: 'mermaid',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      code: { default: 'graph TD\n  A --> B' },
      hideCode: { default: false },
    }
  },

  // 输入规则定义
  addInputRules() {
    return [
      new InputRule({
        find: /^```mermaid\s$/,
        handler: ({ state, range, chain }) => {
          const start = range.from;
          const end = range.to;

          chain()
            .insertContentAt({ from: start, to: end }, {
              type: this.name,
              attrs: {
                code: 'graph TD\n  Start --> Stop'
              },
            })
            .run();
        },
      }),
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'div', // 改用 div，彻底避开 pre 的全局样式
      mergeAttributes(HTMLAttributes, {
        class: 'mermaid-render-container',
        'data-type': 'mermaid'
      }),
      ['div', { class: 'mermaid' }, node.attrs.code]
    ]
  },

  parseHTML() {
    return [
      { tag: 'div[data-type="mermaid"]' },
      { tag: 'pre.mermaid' }
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(MermaidComponent)
  },

  addCommands() {
    return {
      setMermaid: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    }
  },
  ...createBlockMarkdownSpec({
    nodeName: 'mermaid',
    allowedAttributes: ['hideCode'],
  }),

  parseMarkdown: (token, helpers) => {
    const hideCode = token.attrs?.hideCode === 'true' || token.attrs?.hideCode === true

    let rawCode = token.text || ''

    if (!rawCode && token.tokens) {
      rawCode = token.tokens.map(t => t.text || t.raw || '').join('\n')
    }

    return {
      type: 'mermaid',
      attrs: {
        hideCode,
        code: rawCode.trim()
      }
    }
  },
  renderMarkdown: (node) => {
    const { code, hideCode } = node.attrs
    return `:::mermaid {hideCode="${hideCode}"}\n${code}\n:::\n\n`
  }
})
