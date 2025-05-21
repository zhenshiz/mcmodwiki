import { useMessage } from '@/components/register/useMessage.js'
import { generateUUID } from '@/utils/format.js'

const message =useMessage()
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
export const defaultImageTypes = 'image/jpeg image/png image/webp'

//裁剪后的图片默认的尺寸
const defaultCvsSize = 200
const defaultImageType = 'image/webp'
const defaultImageSize = 1024 * 1024
/**
 * 裁剪图片
 * @param {CanvasImageSource} image imgElement
 * @param {Number} cutWidth 裁剪图片的宽度
 * @param {Number} cutHeight 裁剪图片的高度
 * @param {Number} cutX 裁剪图片距离左侧的距离
 * @param {Number} cutY 裁剪图片距离上侧的距离
 * @param {Number} cvsWidth canvas的宽度
 * @param {Number} cvsHeight canvas的高度
 * @returns {Promise<File>}
 */
export const cutImage = async (image, cutWidth, cutHeight, cutX, cutY,cvsWidth = defaultCvsSize, cvsHeight = defaultCvsSize) => {
  return new Promise((resolve, reject) => {
    const cvs = document.createElement('canvas')
    const ctx = cvs.getContext('2d')
    cvs.width = cvsWidth
    cvs.height = cvsHeight
    ctx.drawImage(image, cutX, cutY, cutWidth, cutHeight, 0, 0, cvs.width, cvs.height)

    cvs.toBlob(blob => {
      if (!blob) {
        reject(new Error('不会生成blob'))
      }

      const imageType = defaultImageType
      const type = imageType.substring(imageType.indexOf('/') + 1)
      const fileName = `${generateUUID()}.${type}`
      const file = new File([blob], fileName, { type: imageType })

      if (file.size > defaultImageSize) {
        reject(new Error())
      }
      resolve(file)
    },defaultImageType)
  })
}

export const imgToFile = async (imgElement)=>{
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 设置 canvas 的尺寸和绘制图片
    canvas.width = imgElement.width;
    canvas.height = imgElement.height;
    ctx.drawImage(imgElement, 0, 0, imgElement.width, imgElement.height);

    // 将 canvas 转换为 Blob
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('无法生成 Blob 对象'));
        return;
      }

      // 创建 File 对象
      const imageType = defaultImageType
      const type = imageType.substring(imageType.indexOf('/') + 1)
      const fileName = `${generateUUID()}.${type}`
      const file = new File([blob], fileName, { type: imageType })

      resolve(file);
    })
  })
}

/**
 * 修改图片大小
 * @param {File} file
 * @param {Number} width
 * @param {Number} height
 * @param {String} imageType
 * @returns {Promise<Blob>}
 */
export const resizeImage = async (file, width, height, imageType = defaultImageType) => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = URL.createObjectURL(file)
    image.onload = (() => {
      let newWidth = image.width
      let newHeight = image.height

      if (image.width > width || image.height > height) {
        const aspectRatio = image.width / image.height
        if (aspectRatio > 1) {
          newWidth = width
          newHeight = newWidth / aspectRatio
        } else {
          newHeight = height
          newWidth = newHeight * aspectRatio
        }
      }

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = newWidth
      canvas.height = newHeight

      ctx?.drawImage(image, 0, 0, newWidth, newHeight)
      const resizedFile = dataURItoBlob(canvas.toDataURL(imageType, 0.77))

      if (resizedFile.size > defaultImageSize) {
      } else {
        resolve(resizedFile)
      }
    })
  })
}

export const dataURItoBlob = (dataURI, imageType = defaultImageType) => {
  const byteString = atob(dataURI.split(',')[1])
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], { type: imageType })
}

/**
 * 下载图片
 * @param {String} url 图片url
 */
export const downloadImg = (url) => {
  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const blobUrl = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = blobUrl
      a.download = `${generateUUID()}.webp` // 下载时的文件名
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


//将file文件图片转换成base64
export const fileToBase64 = (file, callback) => {
  // 创建FileReader对象（不兼容IE）
  let reader = new FileReader()
  // 将file转为base64 （异步操作）
  reader.readAsDataURL(file)
  // 转换成功
  reader.onload = () => {
    const response = {
      status: true,
      data: reader.result
    }
    callback(response)
  }
  // 转换失败
  reader.onerror = function() {
    const response = {
      status: false,
      data: reader.error
    }
    callback(response)
  }
}

/**
 * 检测图片链接是否有效
 * @param {string} url - 图片外部链接
 * @param {number} timeout - 超时时间（毫秒）
 * @returns {Promise<boolean>}
 */
export const checkImageExists = (url, timeout = 5000) => {
  return new Promise((resolve) => {
    const img = new Image()
    let timer

    // 成功加载
    img.onload = () => {
      clearTimeout(timer)
      resolve(true)
    }

    // 加载失败
    img.onerror = () => {
      clearTimeout(timer)
      resolve(false)
    }

    // 设置超时
    timer = setTimeout(() => {
      img.src = '' // 中断加载
      resolve(false)
    }, timeout)

    img.src = url
  })
}
