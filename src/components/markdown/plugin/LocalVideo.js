import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import LocalVideoComponent from '@/components/markdown/components/LocalVideoComponent.vue'
import { safeMediaSource } from '@/components/markdown/media/documentMedia.js'

const videoElement = element => element.matches('video') ? element : element.querySelector('video')
export const videoWidth = value => {
  const width = Number(value)
  return Number.isFinite(width) && width >= 120 && width <= 3840 ? Math.round(width) : null
}

export const LocalVideo = Node.create({
  name: 'localVideo',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: '', parseHTML: element => safeMediaSource(videoElement(element)?.getAttribute('src')), renderHTML: () => ({}) },
      poster: { default: '', parseHTML: element => safeMediaSource(videoElement(element)?.getAttribute('poster')), renderHTML: () => ({}) },
      caption: { default: '', parseHTML: element => element.querySelector('figcaption')?.textContent || '', renderHTML: () => ({}) },
      width: { default: null, parseHTML: element => videoWidth(element.getAttribute('data-width') || videoElement(element)?.getAttribute('width')), renderHTML: () => ({}) },
    }
  },
  parseHTML() { return [{ tag: 'figure[data-type="local-video"]' }, { tag: 'video' }] },
  renderHTML({ node, HTMLAttributes }) {
    const { caption } = node.attrs
    const src = safeMediaSource(node.attrs.src), poster = safeMediaSource(node.attrs.poster)
    const width = videoWidth(node.attrs.width)
    return ['figure', mergeAttributes(HTMLAttributes, {
      'data-type': 'local-video',
      ...(width ? { 'data-width': width } : {}),
      style: `width: ${width ? `${width}px` : '100%'}; max-width: 100%;`,
    }),
    ['video', { src, ...(poster ? { poster } : {}), controls: '', playsinline: '', preload: 'metadata', style: 'width: 100%; height: auto;' },
      ['a', { href: src }, caption || 'Video']],
    ...(caption ? [['figcaption', {}, caption]] : []),
    ]
  },
  addNodeView() {
    return VueNodeViewRenderer(LocalVideoComponent, {
      stopEvent: ({ event }) => event.target instanceof Element && !!event.target.closest('video, button, input, textarea, label, a'),
    })
  },
  addCommands() {
    return { setLocalVideo: attrs => ({ commands }) => commands.insertContent({ type: this.name, attrs }) }
  },
})
