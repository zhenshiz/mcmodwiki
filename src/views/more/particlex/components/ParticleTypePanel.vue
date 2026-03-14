<script setup>
import { useParticleEditorStore } from '@/stores/modules/particleEditor'

const store = useParticleEditorStore()

const particleTypes = [
  { id: 'normal', name: '普通粒子', icon: '✨', description: '基础粒子生成' },
  { id: 'conditional', name: '条件粒子', icon: '🎯', description: '根据条件生成' },
  { id: 'parameter', name: '参数方程', icon: '📈', description: '数学曲线' },
  { id: 'polar-parameter', name: '极坐标方程', icon: '🌀', description: '极坐标曲线' },
  { id: 'rgba-parameter', name: '动态颜色', icon: '🎨', description: 'RGBA 参数方程' },
  { id: 'tick-parameter', name: '动画粒子', icon: '🎬', description: 'Tick 动画' },
  { id: 'image', name: '图片转粒子', icon: '🖼️', description: '从图片生成' },
  { id: 'video', name: '视频转粒子', icon: '🎥', description: '从视频生成' },
]

const selectType = (typeId) => {
  store.setParticleType(typeId)
}
</script>

<template>
  <div class="p-3">
    <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">粒子类型</h3>
    <div class="grid grid-cols-2 gap-2">
      <button
        v-for="type in particleTypes"
        :key="type.id"
        @click="selectType(type.id)"
        :class="[
          'p-2 rounded-lg border transition-all text-left',
          store.selectedType === type.id
            ? 'bg-blue-600/20 border-blue-500 text-blue-400'
            : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
        ]"
      >
        <div class="flex items-center gap-2 mb-1">
          <span class="text-lg">{{ type.icon }}</span>
          <span class="text-sm font-medium">{{ type.name }}</span>
        </div>
        <p class="text-xs text-slate-400">{{ type.description }}</p>
      </button>
    </div>
  </div>
</template>