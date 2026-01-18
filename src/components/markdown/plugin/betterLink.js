import { Mark, markInputRule, mergeAttributes } from '@tiptap/core'
import { inputRegex } from '@tiptap/extension-image'

export const BetterLink = Mark.create({
  name: 'link',
  priority: 1000,
  keepOnSplit: false,

  addAttributes() {
    return {
      href: {
        default: null
      },
      target: {
        default: null
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'a[href]'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { href } = HTMLAttributes


    if (href?.startsWith('#') || href?.startsWith('?')) {
      return ['a', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { target: null }), 0]
    }

    return ['a', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
      target: '_blank',
      rel: 'noopener noreferrer nofollow'
    }), 0]
  },

  addCommands() {
    return {
      // 设置链接
      setLink: (attributes) => ({ chain }) => {
        return chain()
          .setMark(this.name, attributes)
          .setMeta('preventAutolink', true)
          .run()
      },
      // 切换链接 (有则删，无则加)
      toggleLink: (attributes) => ({ chain }) => {
        return chain()
          .toggleMark(this.name, attributes, { extendEmptyMarkRange: true })
          .setMeta('preventAutolink', true)
          .run()
      },
      // 移除链接
      unsetLink: () => ({ chain }) => {
        return chain()
          .unsetMark(this.name)
          .setMeta('preventAutolink', true)
          .run()
      },
    }
  },

  addInputRules() {
    return [
      markInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: (match) => {
          return {
            href: match[2],
          }
        },
      }),
    ]
  },
})
