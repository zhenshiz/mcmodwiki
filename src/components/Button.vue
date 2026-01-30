<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 按钮主色调（文字颜色 / Hover时的背景色）
  color: { type: String, default: '#208bff' },
  // 按钮背景色（Hover时的文字颜色 / 非透明模式下的背景色）
  background: { type: String, default: '#fff' },
  // 是否背景透明（默认透明，Hover时才显示背景色）
  themeTransparent: { type: Boolean, default: true },
  // 圆角大小
  roundedSize: { type: Number, default: 5 }
})

const buttonStyles = computed(() => {
  // 1. 计算常态下的背景色
  const normalBg = props.themeTransparent ? 'transparent' : props.background

  return {
    // --- 布局变量 ---
    '--radius': `${props.roundedSize}px`,
    '--btn-border': props.color,

    // --- 常态颜色 (Normal) ---
    '--btn-text': props.color,
    '--btn-bg': normalBg,

    // --- 悬停颜色 (Hover) - 默认反转逻辑 ---
    // Hover 时，背景变成主色(color)，文字变成原本的背景色(background)
    '--btn-hover-text': props.background,
    '--btn-hover-bg': props.color
  }
})
</script>

<template>
  <button
    class="
      /* 布局与排版 */
      flex items-center justify-center
      px-3 py-1.5 text-lg select-none
      border

      /* 动态圆角 */
      rounded-[var(--radius)]

      /* 常态颜色绑定 */
      text-[var(--btn-text)]
      bg-[var(--btn-bg)]
      border-[var(--btn-border)]

      /* 交互与动画 */
      cursor-pointer
      transition-colors duration-300 ease-in-out

      /* Hover 状态：颜色反转 */
      hover:text-[var(--btn-hover-text)]
      hover:bg-[var(--btn-hover-bg)]

      /* Active 状态：点击缩放反馈 */
      active:scale-95
    "
    :style="buttonStyles"
  >
    <slot></slot>
  </button>
</template>
