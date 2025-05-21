import { render } from 'vue'
import Dialog from '@/components/Dialog.vue'

export const useDialog = () => {
  const showDialog = ({
                        title,
                        content,
                        positiveText,
                        negativeText,
                        type,
                        maskClosable,
                        escClosable,
                        onPositiveClick,
                        onNegativeClick,
                        onMaskClick,
                        onEscClick
                      }) => {
    render(null, document.body)

    const dialogNode = h(Dialog, {
      title,
      content,
      positiveText,
      negativeText,
      type,
      maskClosable,
      escClosable,
      onPositiveClick,
      onNegativeClick,
      onMaskClick,
      onEscClick
    })

    render(dialogNode, document.body)
  }

  return {
    warning: ({
                title,
                content,
                positiveText,
                negativeText,
                maskClosable,
                escClosable,
                onPositiveClick,
                onNegativeClick,
                onMaskClick,
                onEscClick
              }) => {
      showDialog({
        title,
        content,
        positiveText,
        negativeText,
        type: 'warn',
        maskClosable,
        escClosable,
        onPositiveClick,
        onNegativeClick,
        onMaskClick,
        onEscClick
      })
    },
    success: ({
                title,
                content,
                positiveText,
                negativeText,
                maskClosable,
                escClosable,
                onPositiveClick,
                onNegativeClick,
                onMaskClick,
                onEscClick
              }) => {
      showDialog({
        title,
        content,
        positiveText,
        negativeText,
        type: 'success',
        maskClosable,
        escClosable,
        onPositiveClick,
        onNegativeClick,
        onMaskClick,
        onEscClick
      })
    },
    error: ({
              title,
              content,
              positiveText,
              negativeText,
              maskClosable,
              escClosable,
              onPositiveClick,
              onNegativeClick,
              onMaskClick,
              onEscClick
            }) => {
      showDialog({
        title,
        content,
        positiveText,
        negativeText,
        type: 'error',
        maskClosable,
        escClosable,
        onPositiveClick,
        onNegativeClick,
        onMaskClick,
        onEscClick
      })
    },
    info: ({
             title,
             content,
             positiveText,
             negativeText,
             maskClosable,
             escClosable,
             onPositiveClick,
             onNegativeClick,
             onMaskClick,
             onEscClick
           }) => {
      showDialog({
        title,
        content,
        positiveText,
        negativeText,
        type: 'info',
        maskClosable,
        escClosable,
        onPositiveClick,
        onNegativeClick,
        onMaskClick,
        onEscClick
      })
    }
  }
}
