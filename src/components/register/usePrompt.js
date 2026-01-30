import { h, render } from 'vue'
import Prompt from '@/components/Prompt.vue'

export const usePrompt = () => {

  // 内部通用渲染逻辑
  const _render = (props) => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const destroy = () => {
      render(null, container)
      container.remove()
    }

    const vNode = h(Prompt, {
      ...props,
      // 拦截回调，处理销毁逻辑
      onPositiveClick: (value) => {
        props.onPositiveClick?.(value)
        // 延迟销毁以显示关闭动画
        setTimeout(destroy, 500)
      },
      onNegativeClick: () => {
        props.onNegativeClick?.()
        setTimeout(destroy, 500)
      }
    })

    render(vNode, container)
  }

  /**
   * 模式 1: 普通文本输入框
   * 适用于：重命名、新建 ID 等不需要候选项的场景
   */
  const openInput = ({
                       title,
                       placeholder = '',
                       defaultValue = '',
                       positiveText,
                       negativeText,
                       maskClosable = true,
                       onPositiveClick,
                       onNegativeClick
                     }) => {
    _render({
      title,
      placeholder,
      defaultValue,
      positiveText,
      negativeText,
      maskClosable,
      options: undefined,
      onPositiveClick,
      onNegativeClick
    })
  }

  /**
   * 模式 2: 自动补全/选择输入框
   * 适用于：选择预设 Key、搜索资源路径等场景
   */
  const openSelect = ({
                        title,
                        placeholder = '',
                        options = [],
                        defaultValue = '',
                        positiveText,
                        negativeText,
                        maskClosable = true,
                        onPositiveClick,
                        onNegativeClick
                      }) => {
    _render({
      title,
      placeholder,
      defaultValue,
      positiveText,
      negativeText,
      maskClosable,
      options,
      onPositiveClick,
      onNegativeClick
    })
  }

  return {
    openInput,
    openSelect
  }
}
