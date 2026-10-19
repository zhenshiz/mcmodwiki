<script setup>
import { computed } from 'vue'
import { BaseEdge, getBezierPath } from '@vue-flow/core'

const props = defineProps({
  id: { type: String, required: true }, sourceX: Number, sourceY: Number,
  targetX: Number, targetY: Number, sourcePosition: String, targetPosition: String,
  markerEnd: String, label: [String, Number], style: Object, data: Object
})
const route = computed(() => {
  const { sourceX: x, sourceY: y, targetX: tx, targetY: ty } = props
  if (tx <= x && Math.abs(y - ty) < 80) {
    // Return paths go above the cards, so opposite directions and self-loops
    // remain distinct instead of sharing the same horizontal line.
    const top = Math.min(y, ty) - 105
    return [`M ${x},${y} C ${x + 65},${y} ${x + 65},${top} ${x},${top} L ${tx},${top} C ${tx - 65},${top} ${tx - 65},${ty} ${tx},${ty}`, (x + tx) / 2, top]
  }
  return getBezierPath(props)
})
</script>

<template>
  <BaseEdge :id="id" :class="{ 'runtime-edge': data?.runtimeNext }" :path="route[0]" :label-x="route[1]" :label-y="route[2]" :label="label" :marker-end="markerEnd" :style="data?.runtimeNext ? { ...style, strokeWidth: 4 } : style" :interaction-width="24" />
</template>
