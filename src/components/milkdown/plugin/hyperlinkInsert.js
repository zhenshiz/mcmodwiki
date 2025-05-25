//代码来自 https://github.com/KUN1007/kun-galgame-nuxt3

import { linkSchema } from '@milkdown/preset-commonmark'
import { $command } from '@milkdown/utils'

export const insertLinkPlugin = $command(
  'InsertLink',
  (ctx) => (payload) => {
    if (!payload) {
      return false
    }

    let { href, text } = payload

    return (state, dispatch) => {
      if (!dispatch || !href) {
        return false
      }
      text = text === '' ? href : text

      const transaction = state.tr
      const linkMark = linkSchema.type(ctx).create({ href })

      dispatch(
        transaction
          .addStoredMark(linkMark)
          .insertText(text)
          .removeStoredMark(linkMark)
          .scrollIntoView()
      )
      return true
    }
  }
)
