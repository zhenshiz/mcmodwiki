import { h, render } from 'vue'
import Prompt from '@/components/Prompt.vue'

export const usePrompt = () => {
  const showPrompt = ({
                        title,
                        placeholder,
                        suggestions,
                        defaultValue,
                        positiveText,
                        negativeText,
                        maskClosable = true,
                        onPositiveClick,
                        onNegativeClick
                      }) => {
    // 每次弹窗前清空旧实例
    render(null, document.body)

    const container = document.createElement('div')
    document.body.appendChild(container)

    const vNode = h(Prompt, {
      title,
      placeholder,
      suggestions,
      defaultValue,
      positiveText,
      negativeText,
      maskClosable,

      onPositiveClick: (value) => {
        onPositiveClick?.(value)
        render(null, container)
        container.remove()
      },
      onNegativeClick: () => {
        onNegativeClick?.()
        render(null, container)
        container.remove()
      }
    })

    render(vNode, container)
  }

  return {
    open: ({
             title,
             placeholder,
             suggestions,
             defaultValue,
             positiveText,
             negativeText,
             maskClosable,
             onPositiveClick,
             onNegativeClick
           }) => {
      showPrompt({
        title,
        placeholder,
        suggestions,
        defaultValue,
        positiveText,
        negativeText,
        maskClosable,
        onPositiveClick,
        onNegativeClick
      })
    }
  }
}
