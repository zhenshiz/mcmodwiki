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
      code: {
        default: 'graph TD\n  A --> B',
        parseHTML: (element) =>
          element.getAttribute('data-code') ??
          element.getAttribute('code') ??
          (element.matches('pre.mermaid')
            ? element.textContent
            : element.querySelector('.mermaid')?.textContent
          )?.trim(),
        renderHTML: (attributes) => ({ 'data-code': attributes.code }),
      },
      hideCode: {
        default: false,
        parseHTML: (element) =>
          ['true', '1'].includes(
            element.getAttribute('data-hide-code') ?? element.getAttribute('hideCode'),
          ),
        renderHTML: (attributes) => ({ 'data-hide-code': String(attributes.hideCode === true) }),
      },
    }
  },

  // 输入规则定义
  addInputRules() {
    return [
      new InputRule({
        find: /^```mermaid\s$/,
        handler: ({ state, range, chain }) => {
          const start = range.from
          const end = range.to

          chain()
            .insertContentAt(
              { from: start, to: end },
              {
                type: this.name,
                attrs: {
                  code: 'graph TD\n  Start --> Stop',
                },
              },
            )
            .run()
        },
      }),
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        class: 'mermaid-render-container',
        'data-type': 'mermaid',
      }),
      ['div', { class: 'mermaid' }, node.attrs.code],
    ]
  },

  parseHTML() {
    return [{ tag: 'div[data-type="mermaid"]' }, { tag: 'pre.mermaid' }]
  },

  addNodeView() {
    return VueNodeViewRenderer(MermaidComponent, {
      stopEvent: ({ event }) =>
        event.target instanceof Element &&
        !!event.target.closest('button, textarea, input, select'),
    })
  },

  addCommands() {
    return {
      setMermaid:
        (options) =>
        ({ commands }) => {
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
      rawCode = token.tokens.map((t) => t.text || t.raw || '').join('\n')
    }

    return {
      type: 'mermaid',
      attrs: {
        hideCode,
        code: rawCode.trim(),
      },
    }
  },
  renderMarkdown: (node) => {
    const { code, hideCode } = node.attrs
    return `:::mermaid {hideCode="${hideCode}"}\n${code}\n:::\n\n`
  },
})
