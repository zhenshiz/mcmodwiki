//复制文字到剪切板
import { useMessage } from '@/components/register/useMessage.js'

export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
}

//滚动条距离顶部高度
export function getScrollTop() {
  let scrollTop = 0
  if (document.documentElement && document.documentElement.scrollTop) {
    scrollTop = document.documentElement.scrollTop
  } else if (document.body) {
    scrollTop = document.body.scrollTop
  }
  return Math.ceil(scrollTop)
}

//滚动条本身高度：就是可视窗口高度
export function getScrollBarHeight(){
  let scrollBarHeight = document.documentElement.clientHeight;
  return Math.ceil(scrollBarHeight);
}

//整个页面高度
export function getPageHeight()  {
  return Math.ceil(Math.max(document.body.clientHeight,document.documentElement.scrollHeight));
}

//滚动条是否到底了
export const isScrollAtBottom = ()=>{
  return getScrollTop() + getScrollBarHeight() >= getPageHeight()
}

const tolerantValue = 10

/**
 * 判断一个Element的滚动条是否到底了
 * @param {Element} element
 * @param {Number} value 容错长度
 */
export const isElementScrollAtBottom = (element,value = tolerantValue) => {
  return element.scrollHeight - element.scrollTop <= element.clientHeight + value
}

/**
 * 当一个element设置了 flex-direction:column-reverse的时候 判断是否到头了
 * @param {Element} element
 * @param {Number} value 容错长度
 */
export const isElementScrollAtTop = (element,value = tolerantValue) => {
  return element.scrollHeight + element.scrollTop <= element.clientHeight + value
}

//下载文件
export const downloadFile=(file)=>{
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;

  // 设置下载时的文件名
  a.download = file.name;

  // 模拟点击这个链接
  document.body.appendChild(a);
  a.click();

  // 清理创建的 URL 对象和 <a> 元素
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}


export const fullScreen = (function() {
  return function(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen()
    } else if (element.mozRequestFullScreen) { // Firefox
      element.mozRequestFullScreen()
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari 和 Opera
      element.webkitRequestFullscreen()
    } else if (element.msRequestFullscreen) { // Internet Explorer/Edge
      element.msRequestFullscreen()
    } else {
      useMessage().warning('浏览器不支持全屏 API')
    }
  }
})()

//检测当前用户操作系统
export const getOperatingSystem = () => {
  const userAgent = navigator.userAgent

  if (/Macintosh|Mac OS X/.test(userAgent)) {
    return 'Mac'
  } else if (/Windows NT/.test(userAgent)) {
    return 'Windows'
  } else if (/Linux/.test(userAgent)) {
    return 'Linux'
  }
  return 'Unknown'
}

