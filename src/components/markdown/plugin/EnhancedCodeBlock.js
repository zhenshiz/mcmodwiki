import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import CodeBlockComponent from '@/components/markdown/components/CodeBlockComponent.vue'

export const EnhancedCodeBlock = Node.create({
  name: 'codeBlock',
  group: 'block',
  content: 'text*',
  marks: '',
  code: true,
  defining: true,
  draggable: true,

  addAttributes() {
    return {
      language: { default: 'javascript' },
      isClosed: { default: false },
    }
  },

  // 保持标准 HTML 输出，方便 Markdown 导出
  renderHTML({ node, HTMLAttributes }) {
    return [
      'pre',
      mergeAttributes(HTMLAttributes, {
        class: 'enhanced-code-block',
      }),
      ['code', { class: `language-${node.attrs.language}` }, 0],
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(CodeBlockComponent)
  },
})
