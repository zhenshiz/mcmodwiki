import { Node, mergeAttributes, createBlockMarkdownSpec } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import StepsComponent from '@/components/markdown/components/StepsComponent.vue'

// 1. 步骤条项 (单个步骤)
export const StepItem = Node.create({
  name: 'stepItem',
  group: 'block',
  content: 'admonitionTitle admonitionContent', // 复用你之前的标题和内容节点名，或者新建
  isolating: true,
  defining: true,
  parseHTML() { return [{ tag: 'div[data-type="step-item"]' }] },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'step-item' }), 0]
  },
  ...createBlockMarkdownSpec({
    nodeName: 'stepItem',
    name: 'step',
  }),
  parseMarkdown: (token, helpers) => {
    const allContent = helpers.parseChildren(token.tokens || [])
    const titleNode = allContent[0]
    const bodyNodes = allContent.slice(1)

    return {
      type: 'stepItem',
      content: [
        {
          type: 'admonitionTitle',
          content: titleNode?.type === 'paragraph' ? titleNode.content : (titleNode ? [titleNode] : [])
        },
        {
          type: 'admonitionContent',
          content: bodyNodes.length > 0 ? bodyNodes : [helpers.createNode('paragraph')]
        }
      ]
    }
  },
  renderMarkdown: (node, helpers) => {
    const title = helpers.renderChildren([node.content[0]]).trim()
    const body = helpers.renderChildren([node.content[1]]).trim()
    return `:::step\n${title}\n\n${body}\n:::\n`
  }
})

// 2. 步骤条父容器
export const Steps = Node.create({
  name: 'steps',
  group: 'block',
  content: 'stepItem+', // 至少包含一个步骤项
  draggable: true,

  addAttributes() {
    return {
      currentStep: { default: 0 } // 记录当前显示第几步
    }
  },

  parseHTML() { return [{ tag: 'div[data-type="steps"]' }] },

  renderHTML({ node, HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'steps' }), 0]
  },

  addNodeView() {
    return VueNodeViewRenderer(StepsComponent)
  },

  addCommands() {
    return {
      setSteps: () => ({ chain }) => {
        return chain()
          .insertContent({
            type: this.name,
            content: [
              { type: 'stepItem', content: [
                  { type: 'admonitionTitle', content: [{ type: 'text', text: '第一步' }] },
                  { type: 'admonitionContent', content: [{ type: 'paragraph', content: [{ type: 'text', text: '在这里输入内容' }] }] }
                ]},
              { type: 'stepItem', content: [
                  { type: 'admonitionTitle', content: [{ type: 'text', text: '第二步' }] },
                  { type: 'admonitionContent', content: [{ type: 'paragraph' }] }
                ]}
            ]
          })
          .run()
      }
    }
  },

  ...createBlockMarkdownSpec({
    nodeName: 'steps',
  }),
  parseMarkdown: (token, helpers) => {
    return {
      type: 'steps',
      content: helpers.parseChildren(token.tokens || [])
    }
  },
  renderMarkdown: (node, helpers) => {
    const content = helpers.renderChildren(node.content || [], '\n\n')
    return `:::steps\n${content}\n:::\n`
  }
})
