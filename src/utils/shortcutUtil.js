import { webUtil } from '@/utils/webUtil.js'

export const shortcutUtil = {
  /**
   * 主修饰键（用于快捷键说明展示）
   * - macOS: Cmd
   * - 其它: Ctrl
   */
  getPrimaryModifierKeyLabel() {
    return webUtil.getOperatingSystem() === 'Mac' ? 'Cmd' : 'Ctrl'
  },
}

