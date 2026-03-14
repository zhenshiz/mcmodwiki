<script setup>
import { ref, computed } from 'vue'
import { useParticleEditorStore } from '@/stores/modules/particleEditor'

const store = useParticleEditorStore()

const selectedTemplate = ref(null)
const searchQuery = ref('')

const templates = [
  {
    id: 'circle',
    name: '圆形',
    category: '基础',
    icon: '⭕',
    description: '生成一个完美的圆形粒子',
    type: 'parameter',
    expression: 'x=cos(t);y=0;z=sin(t)',
    params: { begin: 0, end: 6.28, calcInterval: 0.1 }
  },
  {
    id: 'spiral',
    name: '螺旋线',
    category: '基础',
    icon: '🌀',
    description: '阿基米德螺旋线',
    type: 'parameter',
    expression: 'x=t*cos(t);z=t*sin(t)',
    params: { begin: 0, end: 10, calcInterval: 0.1 }
  },
  {
    id: 'heart',
    name: '爱心',
    category: '形状',
    icon: '❤️',
    description: '心形曲线',
    type: 'parameter',
    expression: 'x=16*sin(t)^3;z=13*cos(t)-5*cos(2*t)-2*cos(3*t)-cos(4*t)',
    params: { begin: 0, end: 6.28, calcInterval: 0.05 }
  },
  {
    id: 'wave',
    name: '波浪',
    category: '动画',
    icon: '🌊',
    description: '动态波浪效果',
    type: 'tick-parameter',
    expression: 'x=t;y=sin(x+t/10);z=0',
    params: { begin: -5, end: 5, calcInterval: 0.2, CPT: 10 }
  },
  {
    id: 'atom',
    name: '原子轨道',
    category: '科学',
    icon: '⚛️',
    description: '电子轨道模型',
    type: 'parameter',
    expression: 'x=cos(t);y=sin(2*t);z=0',
    params: { begin: 0, end: 6.28, calcInterval: 0.1 }
  },
  {
    id: 'dna',
    name: 'DNA螺旋',
    category: '科学',
    icon: '🧬',
    description: '双螺旋结构',
    type: 'parameter',
    expression: 'x=cos(t);y=t/3;z=sin(t)',
    params: { begin: 0, end: 12.56, calcInterval: 0.1 }
  },
  {
    id: 'star',
    name: '五角星',
    category: '形状',
    icon: '⭐',
    description: '五角星形',
    type: 'parameter',
    expression: 'x=cos(t)*cos(2*t);z=cos(t)*sin(2*t)',
    params: { begin: 0, end: 6.28, calcInterval: 0.05 }
  },
  {
    id: 'butterfly',
    name: '蝴蝶曲线',
    category: '形状',
    icon: '🦋',
    description: '蝴蝶形状曲线',
    type: 'parameter',
    expression: 'x=sin(t)*(exp(cos(t))-2*cos(4*t)-pow(sin(t/12),5));z=cos(t)*(exp(cos(t))-2*cos(4*t)-pow(sin(t/12),5))',
    params: { begin: 0, end: 30, calcInterval: 0.1 }
  }
]

const filteredTemplates = computed(() => {
  if (!searchQuery.value) return templates

  const query = searchQuery.value.toLowerCase()
  return templates.filter(t =>
    t.name.toLowerCase().includes(query) ||
    t.category.toLowerCase().includes(query) ||
    t.description.toLowerCase().includes(query)
  )
})

const selectTemplate = (template) => {
  selectedTemplate.value = template
  store.loadTemplate({
    type: template.type,
    expression: template.expression,
    params: template.params
  })
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- 搜索框 -->
    <div class="p-3 border-b border-slate-700">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索模板..."
        class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
      >
    </div>

    <!-- 模板列表 -->
    <div class="flex-1 overflow-y-auto p-3 space-y-2">
      <div
        v-for="template in filteredTemplates"
        :key="template.id"
        @click="selectTemplate(template)"
        :class="[
          'p-3 rounded-lg border cursor-pointer transition-all',
          selectedTemplate?.id === template.id
            ? 'bg-purple-600/20 border-purple-500'
            : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
        ]"
      >
        <div class="flex items-center gap-2 mb-1">
          <span class="text-xl">{{ template.icon }}</span>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium truncate">{{ template.name }}</div>
            <div class="text-xs text-slate-400">{{ template.category }}</div>
          </div>
        </div>
        <p class="text-xs text-slate-400 line-clamp-2">{{ template.description }}</p>
      </div>
    </div>
  </div>
</template>
