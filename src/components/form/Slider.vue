<script setup>
const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  step: {
    type: Number,
    default: 1
  },
  disabled: {
    type: Boolean,
    default: false
  },
  // 是否显示 tooltip
  showTooltip: {
    type: Boolean,
    default: true
  },
  // 自定义 tooltip 格式化函数
  formatTooltip: {
    type: Function,
    default: (val) => val
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'input'])

const sliderRef = ref(null)
const isDragging = ref(false)
const isHovering = ref(false)

// 计算当前百分比
const percentage = computed(() => {
  if (props.max === props.min) return 0
  const val = (props.modelValue - props.min) / (props.max - props.min) * 100
  return Math.max(0, Math.min(100, val))
})

// 显示的 tooltip 内容
const displayTooltip = computed(() => {
  return props.formatTooltip(props.modelValue)
})

// --- 核心逻辑：计算并更新值 ---
const updateValue = (clientX) => {
  if (props.disabled || !sliderRef.value) return

  const rect = sliderRef.value.getBoundingClientRect()
  const x = clientX - rect.left
  let percent = x / rect.width
  
  // 限制在 0-1 之间
  percent = Math.max(0, Math.min(1, percent))

  // 计算原始数值
  let rawValue = props.min + percent * (props.max - props.min)
  
  // 处理步长 (step)
  const steps = Math.round((rawValue - props.min) / props.step)
  let newValue = props.min + steps * props.step
  
  // 再次确保不越界 (因为 float 计算可能有误差)
  newValue = Math.max(props.min, Math.min(props.max, newValue))
  
  // 保留合适的小数位 (避免 0.300000004 这种情况)
  const stepPrecision = (props.step.toString().split('.')[1] || '').length
  newValue = parseFloat(newValue.toFixed(stepPrecision))

  if (newValue !== props.modelValue) {
    emit('update:modelValue', newValue)
    emit('input', newValue)
  }
}

// --- 鼠标事件处理 ---

const onButtonDown = (event) => {
  if (props.disabled) return
  event.preventDefault()
  onDragStart(event)
}

const onRunwayClick = (event) => {
  if (props.disabled || isDragging.value) return
  updateValue(event.clientX)
  emit('change', props.modelValue)
}

const onDragStart = (event) => {
  isDragging.value = true
  isHovering.value = true
  window.addEventListener('mousemove', onDragging)
  window.addEventListener('mouseup', onDragEnd)
  window.addEventListener('contextmenu', onDragEnd)
}

const onDragging = (event) => {
  if (isDragging.value) {
    updateValue(event.clientX)
  }
}

const onDragEnd = () => {
  if (isDragging.value) {
    isDragging.value = false
    isHovering.value = false
    emit('change', props.modelValue) // 拖拽结束触发 change
    window.removeEventListener('mousemove', onDragging)
    window.removeEventListener('mouseup', onDragEnd)
    window.removeEventListener('contextmenu', onDragEnd)
  }
}

// 鼠标滚轮微调 (可选体验优化)
const onWheel = (e) => {
  if (props.disabled || !isHovering.value) return
  // 阻止页面滚动
  e.preventDefault()
  
  const delta = e.deltaY < 0 ? props.step : -props.step
  let newValue = props.modelValue + delta
  newValue = Math.max(props.min, Math.min(props.max, newValue))
  
  // 精度处理
  const stepPrecision = (props.step.toString().split('.')[1] || '').length
  newValue = parseFloat(newValue.toFixed(stepPrecision))
  
  emit('update:modelValue', newValue)
}

</script>

<template>
  <div 
    class="relative w-full h-6 flex items-center select-none touch-none"
    :class="{ 'opacity-60 cursor-not-allowed': disabled, 'cursor-pointer': !disabled }"
    @mouseenter="isHovering = true"
    @mouseleave="!isDragging && (isHovering = false)"
    @wheel="onWheel"
  >
    <div 
      ref="sliderRef"
      class="w-full h-1.5 rounded-full bg-gray-200 dark:bg-slate-700 relative"
      @click="onRunwayClick"
    >
      <div 
        class="h-full bg-blue-500 rounded-full absolute top-0 left-0"
        :style="{ width: `${percentage}%` }"
      ></div>

      <div 
        class="
          absolute top-1/2 -translate-x-1/2 -translate-y-1/2 
          w-4 h-4 z-10
          flex items-center justify-center
        "
        :style="{ left: `${percentage}%` }"
        @mousedown="onButtonDown"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-1 scale-90"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-1 scale-90"
        >
          <div 
            v-if="showTooltip && (isHovering || isDragging)"
            class="
              absolute -top-9 px-2 py-1 
              bg-dark-blue text-white text-xs rounded shadow-md 
              whitespace-nowrap pointer-events-none
              border border-slate-700
            "
          >
            {{ displayTooltip }}
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-dark-blue rotate-45 border-r border-b border-slate-700"></div>
          </div>
        </Transition>

        <div 
          class="
            w-4 h-4 rounded-full bg-white shadow-sm border-2 border-blue-500 
            transition-transform duration-200
            hover:scale-125
          "
          :class="{ 'scale-125 cursor-grabbing': isDragging, 'cursor-grab': !isDragging }"
        ></div>
      </div>
    </div>
  </div>
</template>