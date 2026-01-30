export const webUtil = {
  //检测当前用户操作系统
  getOperatingSystem: () => {
    const userAgent = navigator.userAgent

    if (/Macintosh|Mac OS X/.test(userAgent)) {
      return 'Mac'
    } else if (/Windows NT/.test(userAgent)) {
      return 'Windows'
    } else if (/Linux/.test(userAgent)) {
      return 'Linux'
    }
    return 'Unknown'
  },
}
