import { formatUtil } from '@/utils/formatUtil.js'

export const imageUtil = {
  /**
   * 下载图片
   * @param {String} url 图片url
   */
  downloadImg: (url) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = blobUrl
        a.download = `${formatUtil.generateUUID()}.webp` // 下载时的文件名
        a.style.display = 'none'

        document.body.appendChild(a)

        a.click()

        URL.revokeObjectURL(blobUrl)
        document.body.removeChild(a)
      })
      .catch(error => {
        console.error('下载图片失败:', error)
      })
  }
}
