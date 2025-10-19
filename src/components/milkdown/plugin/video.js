//代码来自 https://github.com/KUN1007/kun-touchgal-next/blob/main/components/kun/milkdown/plugins/components/video/videoPlugin.tsx

import { $command, $inputRule, $node, $remark } from '@milkdown/utils'
import { InputRule } from '@milkdown/prose/inputrules'
import { createApp, h } from 'vue'
import directive from 'remark-directive'
import Plyr from '@/components/milkdown/components/Plyr.vue'

export const videoRemarkDirective = $remark('video', () => directive)

export const videoNode = $node('video', () => ({
  content: '',
  group: 'block',
  selectable: true,
  draggable: true,
  atom: true,
  isolating: true,
  defining: true,
  marks: '',
  attrs: {
    src: { default: '' }
  },
  parseDOM: [{
    tag: 'div[data-video-player]',
    getAttrs: (dom) => ({
      src: dom.getAttribute('data-src')
    })
  }],
  toDOM: (node) => {
    const container = document.createElement('div')
    container.setAttribute('data-video-player', '')
    container.setAttribute('data-src', node.attrs.src)
    container.setAttribute('contenteditable', 'false')
    container.className = 'w-full my-4 overflow-hidden shadow-lg rounded-xl'

    const app = createApp({
      render: () => h(Plyr, { src: node.attrs.src })
    })
    app.mount(container)

    return container
  },
  parseMarkdown: {
    match: (node) => node.name === 'video',
    runner: (state, node, type) => {
      state.addNode(type, { src: node.attributes.src })
    }
  },
  toMarkdown: {
    match: (node) => node.type.name === 'video',
    runner: (state, node) => {
      state.addNode('leafDirective', undefined, undefined, {
        name: 'video',
        attributes: node.attrs
      })
    }
  }
}))

export const insertVideoCommand = $command(
  'InsertVideo',
  (ctx) => (payload) => {
    if (!payload) {
      return false
    }

    return (state, dispatch) => {
      if (!dispatch) {
        return false
      }
      const node = videoNode.type(ctx).create({ src: payload })
      if (!node) return true

      dispatch(state.tr.replaceSelectionWith(node).scrollIntoView())
      return true
    }
  }
)

export const videoInputRule = $inputRule((ctx) =>
  new InputRule(
    /{{video="(?<src>[^"]+)?"?}}/,
    (state, match, start, end) => {
      const [matched, src = ''] = match
      const { tr } = state
      if (matched) {
        return tr.replaceWith(
          start - 1,
          end,
          videoNode.type(ctx).create({ src })
        )
      }
      return null
    }
  )
)

export const video = [
  videoRemarkDirective,
  videoNode,
  insertVideoCommand,
  videoInputRule
].flat()
