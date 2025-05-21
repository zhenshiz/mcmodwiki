import { render } from 'vue'
import Message from '@/components/Message.vue'

const messageCount = ref(0)

export const useMessage = () => {
  const showMessage = ({ message, type, duration, isRichText }) => {
    render(null, document.body)

    let timeout
    messageCount.value++

    const messageNode = h(Message, { message, type, duration, isRichText })

    const time = duration ?? 3000

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      messageCount.value--
      if (!messageCount.value) {
        render(null, document.body)
      }
    }, time)

    render(messageNode, document.body)
  }

  // 方法返回一个函数，根据传入的类型返回对应的消息
  return {
    warning: (message, duration = 3000, isRichText = false) => {
      showMessage({ message, type: 'warn', duration, isRichText })
    },
    success: (message, duration = 3000, isRichText = false) => {
      showMessage({ message, type: 'success', duration, isRichText })
    },
    error: (message, duration = 3000, isRichText = false) => {
      showMessage({ message, type: 'error', duration, isRichText })
    },
    info: (message, duration = 3000, isRichText = false) => {
      showMessage({ message, type: 'info', duration, isRichText })
    }
  }
}
