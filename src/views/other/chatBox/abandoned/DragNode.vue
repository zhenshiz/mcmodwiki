<script lang="ts" setup>
import { useDrag } from 'vue3-dnd'

const props = defineProps({
  id: String,
  left: Number,
  top: Number,
  hideSourceOnDrag: Boolean
})

const emit = defineEmits(['onClose'])

const [collect, drag] = useDrag(() => ({
  type: 'box',
  item: { id: props.id, left: props.left, top: props.top },
  collect: monitor => ({
    isDragging: monitor.isDragging()
  })
}))
</script>

<template>
  <div v-if="collect.isDragging && hideSourceOnDrag" :ref="drag" />
  <div
    v-else
    :ref="drag"
    class="absolute rounded bg-white dark:bg-dark-blue border border-dashed border-text-gray cursor-move w-[150px] h-[75px]"
    :style="{ left: `${left}px`, top: `${top}px` }"
    data-testid="box"
  >
    <div class="relative size-full center">
      <div
        class="absolute top-0 transform -translate-y-1/2 translate-x-1/2 border rounded-full w-2 h-2 bg-black dark:bg-white cursor-pointer" />
      <div
        class="absolute bottom-0 transform translate-y-1/2 translate-x-1/2 border rounded-full w-2 h-2 bg-black dark:bg-white cursor-pointer" />
      <div @click="emit('onClose')"
           class="absolute top-0 right-2 cursor-pointer hover:text-red-600">x
      </div>
      <slot></slot>
    </div>
  </div>
</template>
