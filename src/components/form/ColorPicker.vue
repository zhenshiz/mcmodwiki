<script setup>
import { ref, computed, watch } from 'vue'
import Popover from '@/components/Popover.vue'

const props = defineProps({
  // 这里的数值应该是 Java 风格的 int (可能是负数)
  modelValue: {
    type: Number,
    default: -1 // 默认白色 (0xFFFFFFFF)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  width: {
    type: String,
    default: '100%'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const svRef = ref(null)  // 饱和度/明度面板
const hueRef = ref(null) // 色相滑块
const alphaRef = ref(null) // 透明度滑块

// 内部状态：HSVA
// h: 0-360, s: 0-100, v: 0-100, a: 0-1 (Float)
const hsva = ref({ h: 0, s: 0, v: 100, a: 1 })

// 显示用的输入框值
const hexInput = ref('#FFFFFFFF')
const intInput = ref(-1)

// --- 核心算法 (模拟 Java 位运算) ---

// Java Int -> HSVA
const intToHsva = (intVal) => {
  // 强制转换为 32 位有符号整数，提取 ARGB
  const a = ((intVal >> 24) & 0xFF) / 255
  const r = ((intVal >> 16) & 0xFF) / 255
  const g = ((intVal >> 8) & 0xFF) / 255
  const b = (intVal & 0xFF) / 255

  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, v = max

  const d = max - min
  s = max === 0 ? 0 : d / max

  if (max === min) {
    h = 0
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return { h: h * 360, s: s * 100, v: v * 100, a: a }
}

// HSVA -> Java Int (ARGB)
const hsvaToInt = (h, s, v, a) => {
  let r, g, b
  h = h / 360
  s = s / 100
  v = v / 100
  
  let i = Math.floor(h * 6)
  let f = h * 6 - i
  let p = v * (1 - s)
  let q = v * (1 - f * s)
  let t = v * (1 - (1 - f) * s)
  
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break
    case 1: r = q; g = v; b = p; break
    case 2: r = p; g = v; b = t; break
    case 3: r = p; g = q; b = v; break
    case 4: r = t; g = p; b = v; break
    case 5: r = v; g = p; b = q; break
  }

  const iA = Math.round(a * 255)
  const iR = Math.round(r * 255)
  const iG = Math.round(g * 255)
  const iB = Math.round(b * 255)

  // 核心：使用位移构建 32 位整数
  // (x | 0) 这种写法在 JS 里会强制触发 32 位有符号整数转换
  // 这意味着如果最高位是 1，它会自动变成负数，完美复刻 Java 行为
  return ((iA << 24) | (iR << 16) | (iG << 8) | iB) | 0
}

// Int -> Hex (#AARRGGBB)
const intToHex = (intVal) => {
  // >>> 0 强制转为无符号，这样 toString(16) 不会输出负号，而是输出 ffffffff
  const hex = (intVal >>> 0).toString(16).toUpperCase().padStart(8, '0')
  return '#' + hex
}

// Hex -> Int
const hexToInt = (hex) => {
  let val = hex.replace('#', '')
  // 如果输入的是RGB (6位)，补全FF作为Alpha
  if (val.length === 6) val = 'FF' + val
  // 转换为 32 位有符号整数
  return parseInt(val, 16) | 0
}

// --- 状态同步逻辑 ---

// 1. 监听外部 modelValue (Java Int)
watch(() => props.modelValue, (val) => {
  if (val !== intInput.value) {
    intInput.value = val
    hexInput.value = intToHex(val)
    hsva.value = intToHsva(val)
  }
}, { immediate: true })

// 2. 内部更新 -> 外部
const updateFromHsva = () => {
  const intVal = hsvaToInt(hsva.value.h, hsva.value.s, hsva.value.v, hsva.value.a)
  intInput.value = intVal
  hexInput.value = intToHex(intVal)
  
  emit('update:modelValue', intVal)
  emit('change', intVal)
}

// --- 拖拽交互 (复用逻辑) ---
const handleDrag = (event, container, callback) => {
  if (props.disabled) return
  event.preventDefault()
  const rect = container.getBoundingClientRect()
  const update = (e) => {
    let x = e.clientX - rect.left
    let y = e.clientY - rect.top
    x = Math.max(0, Math.min(x, rect.width))
    y = Math.max(0, Math.min(y, rect.height))
    callback(x, y, rect.width, rect.height)
  }
  update(event)
  const onMouseMove = (e) => update(e)
  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

const onSvMouseDown = (e) => {
  handleDrag(e, svRef.value, (x, y, w, h) => {
    hsva.value.s = (x / w) * 100
    hsva.value.v = 100 - (y / h) * 100
    updateFromHsva()
  })
}

const onHueMouseDown = (e) => {
  handleDrag(e, hueRef.value, (x, y, w, h) => {
    hsva.value.h = (x / w) * 360
    updateFromHsva()
  })
}

const onAlphaMouseDown = (e) => {
  handleDrag(e, alphaRef.value, (x, y, w, h) => {
    hsva.value.a = x / w
    updateFromHsva()
  })
}

// 输入框处理
const handleHexInput = (e) => {
  let val = e.target.value
  if (!val.startsWith('#')) val = '#' + val
  // 支持 6位(RGB) 或 8位(ARGB)
  if (/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(val)) {
    const intVal = hexToInt(val)
    intInput.value = intVal
    hexInput.value = val.toUpperCase() // 保持用户输入
    hsva.value = intToHsva(intVal)
    emit('update:modelValue', intVal)
    emit('change', intVal)
  }
}

const handleIntInput = (e) => {
  const val = parseInt(e.target.value)
  if (!isNaN(val)) {
    intInput.value = val
    hexInput.value = intToHex(val)
    hsva.value = intToHsva(val)
    emit('update:modelValue', val)
    emit('change', val)
  }
}

// --- 样式计算 ---
// HSV 转 CSS RGB 字符串 (用于背景预览)
const hsvToRgbString = (h, s, v) => {
  let r, g, b, i, f, p, q, t
  h /= 360; s /= 100; v /= 100
  i = Math.floor(h * 6); f = h * 6 - i
  p = v * (1 - s); q = v * (1 - f * s); t = v * (1 - (1 - f) * s)
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break
    case 1: r = q; g = v; b = p; break
    case 2: r = p; g = v; b = t; break
    case 3: r = p; g = q; b = v; break
    case 4: r = t; g = p; b = v; break
    case 5: r = v; g = p; b = q; break
  }
  return `rgb(${Math.round(r*255)}, ${Math.round(g*255)}, ${Math.round(b*255)})`
}

// 面板背景色 (纯色相)
const hueColor = computed(() => hsvToRgbString(hsva.value.h, 100, 100))
// 当前不透明颜色 (用于 Alpha 条的右侧渐变)
const currentColorOpaque = computed(() => hsvToRgbString(hsva.value.h, hsva.value.s, hsva.value.v))
// 最终预览颜色 (带透明度)
const finalColorStyle = computed(() => {
  return { 
    backgroundColor: currentColorOpaque.value, 
    opacity: hsva.value.a 
  }
})

const svCursorStyle = computed(() => ({ 
  left: `${hsva.value.s}%`, 
  top: `${100 - hsva.value.v}%` 
}))
const hueCursorStyle = computed(() => ({ 
  left: `${(hsva.value.h / 360) * 100}%` 
}))
const alphaCursorStyle = computed(() => ({ 
  left: `${hsva.value.a * 100}%` 
}))

</script>

<template>
  <Popover 
    placement="bottom-start" 
    trigger="click" 
    :offset="4"
    class="w-full"
    v-model:isOpen="isOpen"
  >
    <template #trigger>
      <div 
        class="
          relative flex items-center justify-between
          px-3 py-2 rounded border transition-colors cursor-pointer
          bg-white border-gray-200 
          dark:bg-[#051e2f] dark:border-dark-blue
          group
        "
        :class="{
          'opacity-60 cursor-not-allowed': disabled,
          'border-blue-500 ring-1 ring-blue-500/20': isOpen,
          'hover:border-blue-400 dark:hover:border-blue-500': !disabled && !isOpen
        }"
        :style="{ width: width }"
      >
        <div class="flex items-center gap-2 overflow-hidden w-full">
          <div class="w-5 h-5 rounded border border-gray-200 dark:border-gray-600 shadow-sm flex-shrink-0 relative overflow-hidden checkerboard">
            <div class="absolute inset-0" :style="finalColorStyle"></div>
          </div>
          
          <div class="flex flex-col min-w-0 flex-1">
            <span class="text-xs font-mono text-gray-700 dark:text-gray-200 truncate leading-none mb-0.5">
              {{ hexInput }}
            </span>
            <span class="text-[10px] text-gray-400 dark:text-gray-500 font-mono truncate leading-none">
              {{ intInput }}
            </span>
          </div>
        </div>
      </div>
    </template>

    <div class="p-3 w-[240px] select-none bg-white dark:bg-[#051e2f] text-gray-800 dark:text-gray-200">
      
      <div 
        ref="svRef"
        class="w-full h-[120px] rounded cursor-crosshair relative overflow-hidden mb-3 border border-gray-200 dark:border-slate-700"
        :style="{ backgroundColor: hueColor }"
        @mousedown="onSvMouseDown"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-white to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div 
          class="absolute w-3 h-3 rounded-full border border-white shadow-sm -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          :style="svCursorStyle"
        ></div>
      </div>

      <div 
        ref="hueRef"
        class="w-full h-3 rounded-full cursor-pointer relative mb-3 rainbow-bg"
        @mousedown="onHueMouseDown"
      >
        <div 
          class="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow border border-gray-200 -translate-x-1/2"
          :style="hueCursorStyle"
        ></div>
      </div>

      <div 
        ref="alphaRef"
        class="w-full h-3 rounded-full cursor-pointer relative mb-4 checkerboard overflow-hidden"
        @mousedown="onAlphaMouseDown"
      >
        <div 
          class="absolute inset-0"
          :style="{ background: `linear-gradient(to right, transparent, ${currentColorOpaque})` }"
        ></div>
        <div 
          class="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow border border-gray-200 -translate-x-1/2"
          :style="alphaCursorStyle"
        ></div>
      </div>

      <div class="flex gap-2">
        <div class="flex-1 min-w-0">
          <div class="text-[10px] text-gray-400 mb-1">HEX (ARGB)</div>
          <input 
            type="text" 
            :value="hexInput"
            @input="handleHexInput"
            class="
              w-full px-1 py-1 text-xs rounded border bg-gray-50 dark:bg-[#0a2e45] 
              border-gray-200 dark:border-dark-blue 
              text-gray-700 dark:text-gray-200
              focus:outline-none focus:border-blue-500
              font-mono text-center
            "
          />
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-[10px] text-gray-400 mb-1">INT (Java)</div>
          <input 
            type="text" 
            :value="intInput"
            @input="handleIntInput"
            class="
              w-full px-1 py-1 text-xs rounded border bg-gray-50 dark:bg-[#0a2e45] 
              border-gray-200 dark:border-dark-blue 
              text-gray-700 dark:text-gray-200
              focus:outline-none focus:border-blue-500
              font-mono text-center
            "
          />
        </div>
      </div>

    </div>
  </Popover>
</template>

<style scoped>
.rainbow-bg {
  background: linear-gradient(to right, 
    #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, 
    #0000ff 67%, #ff00ff 83%, #ff0000 100%
  );
}

/* 棋盘格背景 (表示透明) */
.checkerboard {
  background-image: 
    linear-gradient(45deg, #ccc 25%, transparent 25%), 
    linear-gradient(-45deg, #ccc 25%, transparent 25%), 
    linear-gradient(45deg, transparent 75%, #ccc 75%), 
    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size: 8px 8px;
  background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
  background-color: white; /* 亮色底 */
}
</style>