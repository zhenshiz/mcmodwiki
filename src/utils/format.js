//解析url中的地址
export const parseQuery = url => {
  let q = {}
  url.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => (q[k] = v))
  return q
}

//筛选对象属性
export const pick =(obj,...props)=>{
  return Object.fromEntries(Object.entries(obj).filter(([k])=>props.includes(k)))
}

//去掉字符串中的元素标记
export const removeTag = (fragment) => {
  return new DOMParser().parseFromString(fragment,'text/html').body.textContent || ''
}

//生成一个uuid字符串
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * 判断一个字符串的值是否异常
 * @param {String} text
 * @returns {boolean|boolean}
 */
export const isEmpty = (text) => {
  return text === null || text === undefined || text.length === 0
}

export function removeFirstAndLastLine(str) {
  // 正则去掉第一行和最后一行
  return str.replace(/^.*\n|\n.*$/g, '')
}

export const VideoUrl = {
  // 正则表达式检查是否是符合要求的视频链接 目前只支持B站 或 YouTube 的链接
  isFilterVideoUrl: (url) => {
    const regex = /^(https?:\/\/)?(www\.)?(bilibili\.com|youtube\.com|youtu\.be)/i
    return regex.test(url)
  },
  //判断当前链接是否是BiliBili的
  isBiliBiliUrl: (url) => {
    const pattern = /^(https?:\/\/)?(www\.)?bilibili\.com/
    return pattern.test(url)
  },
  //判断当前链接是否是YouTube的
  isYouTubeUrl: (url) => {
    const pattern = /^(https?:\/\/)?(www\.)?youtube\.com/
    return pattern.test(url)
  }
}

export const formatBrowserName = browserName => {
  const browserMap = {
    'MSEdge': 'Microsoft Edge',
    'Edge': 'Microsoft Edge',
    'Chrome': 'Google Chrome',
    'Firefox': 'Mozilla Firefox',
    'Safari': 'Apple Safari',
    'IE': 'Internet Explorer',
    'Opera': 'Opera',
    'Chromium': 'Chromium',
    'SamsungBrowser': 'Samsung Internet',
    'UC': 'UC Browser',
    'QQBrowser': 'QQ Browser',
    'Vivaldi': 'Vivaldi',
    'Brave': 'Brave Browser',
    'Yandex': 'Yandex Browser'
  }

  // 返回映射表中的全名，如果未找到匹配，则返回原始浏览器名
  return browserMap[browserName] || browserName
}

export const formatOSName = (osName) => {
  const osMap = {
    'Win32': 'Windows (32-bit)',
    'Win64': 'Windows (64-bit)',
    'Win10': 'Windows 10',
    'Win7': 'Windows 7',
    'MacIntel': 'macOS',
    'MacOS': 'macOS',
    'Linux': 'Linux',
    'LinuxArm': 'Linux (ARM)',
    'Ubuntu': 'Ubuntu',
    'Debian': 'Debian',
    'Android': 'Android',
    'iOS': 'iOS',
    'ChromeOS': 'Chrome OS',
    'Unix': 'Unix'
  }

  // 尝试从映射中获取操作系统全名，如果没有匹配的则返回原始名称
  return osMap[osName] || osName
}

export const markdownToText = (markdown) => {
  if (markdown === null || markdown === undefined) return ''
  return markdown
    .replace(/(\*\*|__)(.*?)\1/gs, '$2')
    .replace(/([*_])(.*?)\1/gs, '$2')
    .replace(/#+\s*(.*?)\n/g, '$1\n')
    .replace(/!\[(.*?)]\((.*?)\)/gm, '$1')
    .replace(/(```\w+)([\s\S]*?)(```)/g, '$2')
    .replace(/`(.*?)`/g, '$1')
    .replace(/\[(.*?)]\(.*?\)/g, '$1')
    .replace(/!\[.*$/g, '')
}
