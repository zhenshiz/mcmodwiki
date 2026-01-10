import { createBlockMarkdownSpec, mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import AdmonitionComponent from '@/components/markdown/components/AdmonitionComponent.vue'

export const Admonition = Node.create({
  name: 'admonition',
  group: 'block',
  content: 'admonitionTitle admonitionContent',
  defining: true,
  draggable: true,
  addAttributes() {
    return {
      type: { default: 'info' },
    }
  },
  parseHTML() {
    return [{ tag: 'div[data-type="admonition"]' }]
  },
  renderHTML({ node, HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, {
      'data-type': 'admonition',
      'data-admo-type': node.attrs.type
    }), 0]
  },
  addNodeView() {
    return VueNodeViewRenderer(AdmonitionComponent)
  },
  addCommands() {
    return {
      setAdmonition: (attributes) => ({ chain }) => {
        return chain()
          .insertContent({
            type: this.name,
            attrs: attributes,
            content: [
              {
                type: 'admonitionTitle',
                content: [{ type: 'text', text: (attributes.type || 'info').toUpperCase() }]
              },
              {
                type: 'admonitionContent',
                content: [{ type: 'paragraph' }]
              }
            ]
          })
          .run()
      }
    }
  },
  addInputRules() {
    return [{
      find: /^!!!\s([a-z]+)\s$/,
      handler: ({ match, chain, range }) => {
        const type = match[1]
        chain()
          .deleteRange(range)
          .insertContent({
            type: this.name,
            attrs: { type },
            content: [
              { type: 'admonitionTitle', content: [{ type: 'text', text: type.toUpperCase() }] },
              { type: 'admonitionContent', content: [{ type: 'paragraph' }] }
            ]
          })
          .focus()
          .run()
      }
    }]
  },
  ...createBlockMarkdownSpec({
    nodeName: 'admonition',
    allowedAttributes: ['type'],
    defaultAttributes: { type: 'info' },
  }),
  parseMarkdown: (token, helpers) => {
    const { type } = token.attrs || {}
    const allContent = helpers.parseChildren(token.tokens || [])

    const validNodes = allContent.filter(n => n.content || (n.type === 'text' && n.text))

    const titleNode = validNodes[0]
    const bodyNodes = validNodes.slice(1)

    return {
      type: 'admonition',
      attrs: { type: type || 'info' },
      content: [
        {
          type: 'admonitionTitle',
          content: titleNode?.content ? titleNode.content : (titleNode?.text ? [helpers.createTextNode(titleNode.text)] : [])
        },
        {
          type: 'admonitionContent',
          content: bodyNodes.length > 0 ? bodyNodes : [helpers.createNode('paragraph')]
        }
      ]
    }
  },
  renderMarkdown: (node, helpers) => {
    const { type } = node.attrs
    const title = helpers.renderChildren([node.content[0]]).trim()
    const content = helpers.renderChildren([node.content[1]]).trim()

    return `:::admonition {type="${type}"}\n${title}\n\n${content}\n:::\n`
  },
})

export const AdmonitionTitle = Node.create({
  name: 'admonitionTitle',
  content: 'text*',
  marks: '',
  selectable: false,
  parseHTML() {
    return [{ tag: 'div[data-type="admonition-title"]' }]
  },
  renderHTML() {
    return ['div', { 'data-type': 'admonition-title' }, 0]
  },
  renderMarkdown: (node, helpers) => helpers.renderChildren(node.content || [])
})

export const AdmonitionContent = Node.create({
  name: 'admonitionContent',
  content: 'block+',
  selectable: false,
  parseHTML() {
    return [{ tag: 'div[data-type="admonition-content"]' }]
  },
  renderHTML() {
    return ['div', { 'data-type': 'admonition-content' }, 0]
  },
  renderMarkdown: (node, helpers) => {
    return helpers.renderChildren(node.content || [], '\n\n')
  }
})
