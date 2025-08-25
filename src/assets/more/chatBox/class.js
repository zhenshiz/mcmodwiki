/**
 * 颜色类，支持RGB、RGBA和Minecraft整数颜色格式之间的转换
 */
class Color {
  /**
   * 创建一个颜色对象
   * @param {number} r - 红色通道值 (0-255)
   * @param {number} g - 绿色通道值 (0-255)
   * @param {number} b - 蓝色通道值 (0-255)
   * @param {number} a - 透明度通道值 (0-255)，默认为255（完全不透明）
   */
  constructor(r = 0, g = 0, b = 0, a = 255) {
    this.r = this.clamp(r, 0, 255);
    this.g = this.clamp(g, 0, 255);
    this.b = this.clamp(b, 0, 255);
    this.a = this.clamp(a, 0, 255);
  }

  /**
   * 限制值在指定范围内
   * @param {number} value - 要限制的值
   * @param {number} min - 最小值
   * @param {number} max - 最大值
   * @returns {number} 限制后的值
   * @private
   */
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * 从十六进制颜色字符串创建颜色对象
   * @param {string} hex - 十六进制颜色字符串，格式为 #RGB, #RGBA, #RRGGBB 或 #RRGGBBAA
   * @returns {Color} 颜色对象
   */
  static fromHex(hex) {
    // 移除 # 前缀（如果有）
    hex = hex.replace(/^#/, '');

    let r, g, b, a = 255;

    if (hex.length === 3 || hex.length === 4) {
      // 处理 #RGB 或 #RGBA 格式
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);

      if (hex.length === 4) {
        a = parseInt(hex[3] + hex[3], 16);
      }
    } else if (hex.length === 6 || hex.length === 8) {
      // 处理 #RRGGBB 或 #RRGGBBAA 格式
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);

      if (hex.length === 8) {
        a = parseInt(hex.substring(6, 8), 16);
      }
    } else {
      throw new Error(`无效的十六进制颜色格式: ${hex}`);
    }

    return new Color(r, g, b, a);
  }

  /**
   * 从RGB或RGBA字符串创建颜色对象
   * @param {string} rgbStr - RGB或RGBA字符串，格式为 rgb(r,g,b) 或 rgba(r,g,b,a)
   * @returns {Color} 颜色对象
   */
  static fromRgbString(rgbStr) {
    // 匹配 rgb(r,g,b) 或 rgba(r,g,b,a) 格式
    const rgbRegex = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/i;
    const match = rgbStr.match(rgbRegex);

    if (!match) {
      throw new Error(`无效的RGB或RGBA字符串格式: ${rgbStr}`);
    }

    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    // 如果是rgba格式，将alpha值（0-1）转换为0-255范围
    const a = match[4] !== undefined ? Math.round(parseFloat(match[4]) * 255) : 255;

    return new Color(r, g, b, a);
  }

  /**
   * 从Minecraft整数颜色格式创建颜色对象
   * Minecraft颜色格式: (a << 24) | (r << 16) | (g << 8) | b
   * @param {number} mcColor - Minecraft整数颜色值
   * @returns {Color} 颜色对象
   */
  static fromMinecraftInt(mcColor) {
    const r = (mcColor >> 16) & 0xFF;
    const g = (mcColor >> 8) & 0xFF;
    const b = mcColor & 0xFF;
    const a = (mcColor >> 24) & 0xFF;

    // 如果alpha为负数（因为JavaScript中的位移操作是有符号的），需要转换为0-255范围
    const normalizedA = a < 0 ? 256 + a : a;

    return new Color(r, g, b, normalizedA);
  }

  /**
   * 转换为Minecraft整数颜色格式
   * @returns {number} Minecraft整数颜色值
   */
  toMinecraftInt() {
    return ((this.a & 0xFF) << 24) | ((this.r & 0xFF) << 16) | ((this.g & 0xFF) << 8) | (this.b & 0xFF);
  }

  /**
   * 转换为十六进制颜色字符串
   * @param {boolean} includeAlpha - 是否包含透明度通道
   * @returns {string} 十六进制颜色字符串，格式为 #RRGGBB 或 #RRGGBBAA
   */
  toHex(includeAlpha = false) {
    const rHex = this.r.toString(16).padStart(2, '0');
    const gHex = this.g.toString(16).padStart(2, '0');
    const bHex = this.b.toString(16).padStart(2, '0');

    if (includeAlpha && this.a !== 255) {
      const aHex = this.a.toString(16).padStart(2, '0');
      return `#${rHex}${gHex}${bHex}${aHex}`;
    }

    return `#${rHex}${gHex}${bHex}`;
  }

  /**
   * 转换为RGB或RGBA字符串
   * @param {boolean} includeAlpha - 是否包含透明度通道
   * @returns {string} RGB或RGBA字符串，格式为 rgb(r,g,b) 或 rgba(r,g,b,a)
   */
  toRgbString(includeAlpha = false) {
    if (includeAlpha && this.a !== 255) {
      // 将alpha值（0-255）转换为0-1范围
      const alphaValue = (this.a / 255).toFixed(2);
      return `rgba(${this.r}, ${this.g}, ${this.b}, ${alphaValue})`;
    }

    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }

  /**
   * 设置颜色的透明度
   * @param {number} alpha - 透明度值 (0-255)
   * @returns {Color} 新的颜色对象
   */
  withAlpha(alpha) {
    return new Color(this.r, this.g, this.b, alpha);
  }

  /**
   * 混合两种颜色
   * @param {Color} color - 要混合的颜色
   * @param {number} amount - 混合比例 (0-1)，0表示完全使用当前颜色，1表示完全使用参数颜色
   * @returns {Color} 混合后的新颜色
   */
  blend(color, amount) {
    const r = Math.round(this.r * (1 - amount) + color.r * amount);
    const g = Math.round(this.g * (1 - amount) + color.g * amount);
    const b = Math.round(this.b * (1 - amount) + color.b * amount);
    const a = Math.round(this.a * (1 - amount) + color.a * amount);

    return new Color(r, g, b, a);
  }

  /**
   * 创建颜色的副本
   * @returns {Color} 颜色副本
   */
  clone() {
    return new Color(this.r, this.g, this.b, this.a);
  }

  /**
   * 判断两个颜色是否相等
   * @param {Color} color - 要比较的颜色
   * @returns {boolean} 如果颜色相等则返回true，否则返回false
   */
  equals(color) {
    return this.r === color.r &&
      this.g === color.g &&
      this.b === color.b &&
      this.a === color.a;
  }
}

// 导出颜色类
export default Color;
