<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '#409EFF'
  },
  showAlpha: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'default',
    validator(value) {
      return ['small', 'default', 'large'].includes(value)
    }
  },
  predefine: {
    type: Array,
    default: () => []
  },
  // 是否使用Minecraft颜色格式 (r<<16) | (g<<8) | b | (a<<24)
  useMinecraftFormat: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

// 状态变量
const showPicker = ref(false)
const colorValue = ref(props.modelValue)
const hue = ref(0)
const saturation = ref(100)
const value = ref(100)
const alpha = ref(100)
const pickerRef = ref(null)
const saturationRef = ref(null)
const hueRef = ref(null)
const alphaRef = ref(null)

// 监听modelValue变化
watch(() => props.modelValue, (newVal) => {
  if (newVal !== colorValue.value) {
    if (props.useMinecraftFormat && typeof newVal === 'number') {
      // 如果是Minecraft格式的整数，先转换为十六进制
      const hexColor = minecraftIntToHex(newVal)
      colorValue.value = hexColor
      updateColorFromHex(hexColor)
    } else {
      colorValue.value = String(newVal)
      updateColorFromHex(String(newVal))
    }
  }
})

// 监听颜色变化
watch([hue, saturation, value, alpha], () => {
  updateColor()
})

// 计算样式
const sizeClass = computed(() => {
  switch (props.size) {
    case 'small': return 'w-6 h-6'
    case 'large': return 'w-10 h-10'
    default: return 'w-8 h-8'
  }
})

// 计算饱和度背景
const saturationStyle = computed(() => {
  return {
    backgroundColor: `hsl(${hue.value}, 100%, 50%)`
  }
})

// 计算当前颜色
const currentColor = computed(() => {
  return props.showAlpha
    ? `hsla(${hue.value}, ${saturation.value}%, ${value.value}%, ${alpha.value / 100})`
    : `hsl(${hue.value}, ${saturation.value}%, ${value.value}%)`
})

// 计算饱和度指针位置
const saturationPointerStyle = computed(() => {
  return {
    left: `${saturation.value}%`,
    top: `${100 - value.value}%`
  }
})

// 计算色相指针位置
const huePointerStyle = computed(() => {
  return {
    left: `${(hue.value / 360) * 100}%`
  }
})

// 计算透明度指针位置
const alphaPointerStyle = computed(() => {
  return {
    left: `${alpha.value}%`
  }
})

// 计算透明度背景
const alphaStyle = computed(() => {
  return {
    background: `linear-gradient(to right, transparent, ${`hsl(${hue.value}, ${saturation.value}%, ${value.value}%)`})`
  }
})

// 更新颜色
const updateColor = () => {
  try {
    const hex = HSVtoHEX(hue.value, saturation.value / 100, value.value / 100, alpha.value / 100)
    colorValue.value = hex

    if (props.useMinecraftFormat) {
      // 如果使用Minecraft格式，转换为整数
      const mcInt = hexToMinecraftInt(hex)
      emit('update:modelValue', mcInt)
      emit('change', mcInt)
    } else {
      emit('update:modelValue', hex)
      emit('change', hex)
    }
  } catch (error) {
    console.error('更新颜色错误:', error)
  }
}

// 十六进制颜色转Minecraft整数格式 (r<<16) | (g<<8) | b | (a<<24)
const hexToMinecraftInt = (hex) => {
  try {
    // 确保hex是字符串
    hex = String(hex)

    // 移除#号
    hex = hex.replace('#', '')

    let r, g, b, a = 255

    // 处理不同长度的十六进制颜色
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16)
      g = parseInt(hex[1] + hex[1], 16)
      b = parseInt(hex[2] + hex[2], 16)
    } else if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16)
      g = parseInt(hex.substring(2, 4), 16)
      b = parseInt(hex.substring(4, 6), 16)
    } else if (hex.length === 8) {
      r = parseInt(hex.substring(0, 2), 16)
      g = parseInt(hex.substring(2, 4), 16)
      b = parseInt(hex.substring(4, 6), 16)
      a = parseInt(hex.substring(6, 8), 16)
    } else {
      // 默认值
      r = 0
      g = 0
      b = 0
    }

    // 确保值有效
    r = isNaN(r) ? 0 : r
    g = isNaN(g) ? 0 : g
    b = isNaN(b) ? 0 : b
    a = isNaN(a) ? 255 : a

    // 按照Minecraft格式计算整数值
    return (r << 16) | (g << 8) | b | (a << 24)
  } catch (error) {
    console.error('颜色转换错误:', error)
    return 0 // 默认返回黑色
  }
}

// Minecraft整数格式转十六进制颜色
const minecraftIntToHex = (mcInt) => {
  // 确保mcInt是数字
  mcInt = Number(mcInt) || 0

  const r = (mcInt >> 16) & 0xFF
  const g = (mcInt >> 8) & 0xFF
  const b = mcInt & 0xFF
  const a = (mcInt >> 24) & 0xFF

  // 如果alpha为255（完全不透明）或0（默认值），则返回6位十六进制
  if (a === 255 || a === 0) {
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }

  // 否则返回8位十六进制（包含透明度）
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}${a.toString(16).padStart(2, '0')}`
}

// 从十六进制更新HSV
const updateColorFromHex = (hex) => {
  // 确保hex是字符串
  hex = String(hex)

  try {
    const { h, s, v, a } = HEXtoHSV(hex)
    hue.value = h
    saturation.value = s * 100
    value.value = v * 100
    alpha.value = a * 100
  } catch (error) {
    console.error('颜色转换错误:', error)
    // 如果转换失败，使用默认颜色
    hue.value = 210
    saturation.value = 100
    value.value = 100
    alpha.value = 100
  }
}

// 处理饱和度面板点击
const handleSaturationMouseDown = (event) => {
  if (props.disabled) return

  window.addEventListener('mousemove', handleSaturationMouseMove)
  window.addEventListener('mouseup', handleSaturationMouseUp)

  handleSaturationMouseMove(event)
}

// 处理饱和度面板移动
const handleSaturationMouseMove = (event) => {
  if (!saturationRef.value) return

  const rect = saturationRef.value.getBoundingClientRect()
  let left = event.clientX - rect.left
  let top = event.clientY - rect.top

  left = Math.max(0, Math.min(left, rect.width))
  top = Math.max(0, Math.min(top, rect.height))

  saturation.value = Math.round((left / rect.width) * 100)
  value.value = Math.round(100 - (top / rect.height) * 100)
}

// 处理饱和度面板释放
const handleSaturationMouseUp = () => {
  window.removeEventListener('mousemove', handleSaturationMouseMove)
  window.removeEventListener('mouseup', handleSaturationMouseUp)
}

// 处理色相滑块点击
const handleHueMouseDown = (event) => {
  if (props.disabled) return

  window.addEventListener('mousemove', handleHueMouseMove)
  window.addEventListener('mouseup', handleHueMouseUp)

  handleHueMouseMove(event)
}

// 处理色相滑块移动
const handleHueMouseMove = (event) => {
  if (!hueRef.value) return

  const rect = hueRef.value.getBoundingClientRect()
  let left = event.clientX - rect.left

  left = Math.max(0, Math.min(left, rect.width))

  hue.value = Math.round((left / rect.width) * 360)
}

// 处理色相滑块释放
const handleHueMouseUp = () => {
  window.removeEventListener('mousemove', handleHueMouseMove)
  window.removeEventListener('mouseup', handleHueMouseUp)
}

// 处理透明度滑块点击
const handleAlphaMouseDown = (event) => {
  if (props.disabled || !props.showAlpha) return

  window.addEventListener('mousemove', handleAlphaMouseMove)
  window.addEventListener('mouseup', handleAlphaMouseUp)

  handleAlphaMouseMove(event)
}

// 处理透明度滑块移动
const handleAlphaMouseMove = (event) => {
  if (!alphaRef.value) return

  const rect = alphaRef.value.getBoundingClientRect()
  let left = event.clientX - rect.left

  left = Math.max(0, Math.min(left, rect.width))

  alpha.value = Math.round((left / rect.width) * 100)
}

// 处理透明度滑块释放
const handleAlphaMouseUp = () => {
  window.removeEventListener('mousemove', handleAlphaMouseMove)
  window.removeEventListener('mouseup', handleAlphaMouseUp)
}

// 切换颜色选择器显示
const toggleColorPicker = () => {
  if (props.disabled) return
  showPicker.value = !showPicker.value
}

// 选择预定义颜色
const selectPredefineColor = (color) => {
  colorValue.value = color
  updateColorFromHex(color)
  emit('update:modelValue', color)
  emit('change', color)
}

// 点击外部关闭选择器
const handleClickOutside = (event) => {
  if (pickerRef.value && !pickerRef.value.contains(event.target)) {
    showPicker.value = false
  }
}

// HSV转HEX
function HSVtoHEX(h, s, v, a = 1) {
  const { r, g, b } = HSVtoRGB(h, s, v)
  const alpha = Math.round(a * 255).toString(16).padStart(2, '0')
  const hex = '#' +
    Math.round(r).toString(16).padStart(2, '0') +
    Math.round(g).toString(16).padStart(2, '0') +
    Math.round(b).toString(16).padStart(2, '0')

  return a < 1 ? hex + alpha : hex
}

// HSV转RGB
function HSVtoRGB(h, s, v) {
  let r, g, b
  const i = Math.floor(h / 60)
  const f = h / 60 - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)

  switch (i % 6) {
    case 0: r = v; g = t; b = p; break
    case 1: r = q; g = v; b = p; break
    case 2: r = p; g = v; b = t; break
    case 3: r = p; g = q; b = v; break
    case 4: r = t; g = p; b = v; break
    case 5: r = v; g = p; b = q; break
  }

  return {
    r: r * 255,
    g: g * 255,
    b: b * 255
  }
}

// HEX转HSV
function HEXtoHSV(hex) {
  // 确保hex是字符串
  hex = String(hex)

  // 移除#号
  hex = hex.replace('#', '')

  let r, g, b, a = 1

  // 处理不同长度的十六进制颜色
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16) / 255
    g = parseInt(hex[1] + hex[1], 16) / 255
    b = parseInt(hex[2] + hex[2], 16) / 255
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16) / 255
    g = parseInt(hex.substring(2, 4), 16) / 255
    b = parseInt(hex.substring(4, 6), 16) / 255
  } else if (hex.length === 8) {
    r = parseInt(hex.substring(0, 2), 16) / 255
    g = parseInt(hex.substring(2, 4), 16) / 255
    b = parseInt(hex.substring(4, 6), 16) / 255
    a = parseInt(hex.substring(6, 8), 16) / 255
  } else {
    // 如果格式不正确，使用默认颜色（蓝色）
    r = 0
    g = 0.5
    b = 1
  }

  // 确保值有效
  r = isNaN(r) ? 0 : r
  g = isNaN(g) ? 0 : g
  b = isNaN(b) ? 0 : b
  a = isNaN(a) ? 1 : a

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s, v = max

  const d = max - min
  s = max === 0 ? 0 : d / max

  if (max === min) {
    h = 0 // 无色相
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h *= 60
  }

  return { h, s, v, a }
}

// 生命周期钩子
onMounted(() => {
  updateColorFromHex(props.modelValue)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="pickerRef" class="relative inline-block">
    <!-- 颜色显示框 -->
    <div
      :class="[
        'rounded border cursor-pointer flex items-center justify-center',
        sizeClass,
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      ]"
      @click="toggleColorPicker"
    >
      <div
        class="w-full h-full rounded"
        :style="{ backgroundColor: currentColor }"
      ></div>
    </div>

    <!-- 颜色选择面板 -->
    <div
      v-show="showPicker"
      class="absolute z-50 mt-2 p-4 bg-white rounded shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
      style="width: 240px"
    >
      <!-- 饱和度和亮度选择区域 -->
      <div
        ref="saturationRef"
        class="w-full h-40 relative rounded cursor-pointer mb-4"
        :style="saturationStyle"
        @mousedown="handleSaturationMouseDown"
      >
        <!-- 白色渐变 -->
        <div class="absolute inset-0 bg-gradient-to-r from-white to-transparent"></div>
        <!-- 黑色渐变 -->
        <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <!-- 指针 -->
        <div
          class="absolute w-4 h-4 -ml-2 -mt-2 border-2 border-white rounded-full shadow-md"
          :style="saturationPointerStyle"
        ></div>
      </div>

      <!-- 色相选择条 -->
      <div
        ref="hueRef"
        class="w-full h-3 relative rounded cursor-pointer mb-4 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500"
        @mousedown="handleHueMouseDown"
      >
        <!-- 指针 -->
        <div
          class="absolute w-4 h-4 -ml-2 -mt-0.5 border-2 border-white rounded-full shadow-md"
          :style="huePointerStyle"
        ></div>
      </div>

      <!-- 透明度选择条 -->
      <div
        v-if="showAlpha"
        ref="alphaRef"
        class="w-full h-3 relative rounded cursor-pointer mb-4 bg-checkerboard"
        @mousedown="handleAlphaMouseDown"
      >
        <div
          class="absolute inset-0 rounded"
          :style="alphaStyle"
        ></div>
        <!-- 指针 -->
        <div
          class="absolute w-4 h-4 -ml-2 -mt-0.5 border-2 border-white rounded-full shadow-md"
          :style="alphaPointerStyle"
        ></div>
      </div>

      <!-- 当前颜色和输入框 -->
      <div class="flex items-center mb-4">
        <div
          class="w-8 h-8 rounded mr-2 bg-checkerboard"
        >
          <div
            class="w-full h-full rounded"
            :style="{ backgroundColor: currentColor }"
          ></div>
        </div>
        <input
          type="text"
          v-model="colorValue"
          class="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          :disabled="disabled"
          @input="updateColorFromHex(colorValue)"
        />
      </div>

      <!-- 预定义颜色 -->
      <div v-if="predefine.length > 0" class="flex flex-wrap gap-2">
        <div
          v-for="(color, index) in predefine"
          :key="index"
          class="w-5 h-5 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
          :style="{ backgroundColor: color }"
          @click="selectPredefineColor(color)"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-checkerboard {
  background-image: linear-gradient(45deg, #ddd 25%, transparent 25%),
                    linear-gradient(-45deg, #ddd 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #ddd 75%),
                    linear-gradient(-45deg, transparent 75%, #ddd 75%);
  background-size: 10px 10px;
  background-position: 0 0, 0 5px, 5px -5px, -5px 0;
}

.dark .bg-checkerboard {
  background-image: linear-gradient(45deg, #444 25%, transparent 25%),
                    linear-gradient(-45deg, #444 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #444 75%),
                    linear-gradient(-45deg, transparent 75%, #444 75%);
}
</style>
