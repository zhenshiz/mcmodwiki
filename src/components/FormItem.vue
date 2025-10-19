<script setup>
import { computed, defineProps, ref } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  layout: {
    type: String,
    default: 'horizontal', // 支持 'horizontal' 或 'vertical'
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  },
  size: {
    type: String,
    default: 'default', // 支持 'large' | 'default' | 'small'
    validator: (value) => ['large', 'default', 'small'].includes(value)
  },
  tips: {
    type: String,
    default: '' // 提示信息内容
  }
})

const showTip = ref(false)

// 判断是否是纵向布局
const isVertical = computed(() => props.layout === 'vertical')
</script>

<template>
  <div
    class="form-item w-full"
    :class="[
      isVertical ? 'flex flex-col items-start' : 'flex items-center',
      size
    ]"
  >
    <!-- Label + Tips -->
    <div
      class="flex items-center gap-1"
      :class="isVertical ? 'mb-3' : 'mr-2 shrink-0'"
    >
      <label class="dark:text-white">{{ label }}</label>

      <!-- Tips -->
      <template v-if="tips">
        <div
          class="relative flex items-center"
          @mouseenter="showTip = true"
          @mouseleave="showTip = false"
        >
          <Icon
            icon="mdi:information-outline"
            class="text-gray-400 dark:text-gray-300 cursor-pointer"
          />
          <div
            v-if="showTip"
            class="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded bg-gray-700 text-white text-xs whitespace-nowrap shadow-lg z-50"
          >
            {{ tips }}
          </div>
        </div>
      </template>
    </div>

    <!-- 插槽内容 -->
    <div
      class="form-item-content w-full"
      :class="isVertical ? 'max-w-none' : 'flex-1 min-w-0'"
    >
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 尺寸样式 */
.large {
  font-size: 1.125rem;
}

.default {
  font-size: 1rem;
}

.small {
  font-size: 0.875rem;
}

/* 防止某些内容因为 flex 收缩 */
.form-item-content {
  width: 100%;
  max-width: 100%;
}
</style>
