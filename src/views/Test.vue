<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import Inspector from '@/components/form/Inspector.vue'

// 引入你刚才定义的类 (确保路径正确)
import { 
  ChatBoxDialogues, 
  DialogueFrame, 
  DialoguePortrait, 
  DialogueReplacePortrait 
} from '@/assets/more/chatbox/chatboxDialogues.js'

// ==========================================
// 1. 模拟数据状态
// ==========================================

// 模拟一个空的 Dialogues 根对象
const rootModel = ref(new ChatBoxDialogues())

// 模拟当前的选中状态 (Store 的行为)
// 初始时选中一个新创建的 Frame
const currentFrame = ref(new DialogueFrame())

// 模拟当前选中的 Key (对应 HierarchyPanel 的点击)
// 我们重点测试 'portrait' (立绘配置)，因为它是最复杂的 AnyTypeArray
const currentKey = ref('portrait') 

// ==========================================
// 2. 模拟 InspectorPanel 的逻辑
// ==========================================

// 核心逻辑：根据 Key 计算出要传给 Inspector 的 model 和 clazz
const inspectorProps = computed(() => {
  if (currentKey.value === 'basic') {
    return {
      model: currentFrame.value,
      clazz: DialogueFrame
    }
  } 
  else if (currentKey.value === 'portrait') {
    // 🔥 测试点：这里 model 是 frame.portrait (包装类实例)
    // clazz 是 DialoguePortrait
    return {
      model: currentFrame.value.portrait,
      clazz: DialoguePortrait
    }
  }
  // ... 其他 case 省略
  return {}
})

// ==========================================
// 3. 调试输出 (验证序列化)
// ==========================================
const jsonOutput = computed(() => {
  // 利用 JSON.stringify 触发类的 toJSON 方法
  return JSON.stringify(currentFrame.value, null, 2)
})

const addItem = () => {
  // 手动模拟添加一个复杂对象到立绘列表
  const p = new DialogueReplacePortrait()
  p.id = 'steve_01'
  p.x = 100
  currentFrame.value.portrait.portrait.push(p)
}

const addStringItem = () => {
  // 手动模拟添加一个字符串到立绘列表
  currentFrame.value.portrait.portrait.push('simple_portrait_id')
}

</script>

<template>
  <div class="flex h-screen bg-[#001529] text-slate-300 overflow-hidden">
    
    <div class="w-64 border-r border-slate-700 p-4 flex flex-col gap-2 bg-[#002033]">
      <div class="text-xs font-bold text-slate-500 mb-2 uppercase">Hierarchy Simulator</div>
      
      <div 
        class="p-2 rounded cursor-pointer text-sm flex items-center gap-2"
        :class="currentKey === 'basic' ? 'bg-blue-600 text-white' : 'hover:bg-slate-700'"
        @click="currentKey = 'basic'"
      >
        <Icon icon="lucide:sliders" /> 基础配置 (Basic)
      </div>

      <div 
        class="p-2 rounded cursor-pointer text-sm flex items-center gap-2"
        :class="currentKey === 'portrait' ? 'bg-blue-600 text-white' : 'hover:bg-slate-700'"
        @click="currentKey = 'portrait'"
      >
        <Icon icon="lucide:users" /> 立绘配置 (Portraits)
        <span class="ml-auto text-xs opacity-50">{{ currentFrame.portrait?.portrait?.length || 0 }}</span>
      </div>
      
      <div class="mt-4 border-t border-slate-700 pt-4">
        <div class="text-xs text-slate-500 mb-2">快速操作 (模拟数据变更)</div>
        <button @click="addItem" class="w-full text-xs bg-slate-700 hover:bg-slate-600 py-1 rounded mb-1">
          + 添加对象立绘
        </button>
        <button @click="addStringItem" class="w-full text-xs bg-slate-700 hover:bg-slate-600 py-1 rounded">
          + 添加字符串ID
        </button>
      </div>
    </div>

    <div class="flex-1 flex flex-col p-4 overflow-hidden">
      <div class="flex items-center justify-between mb-4 border-b border-slate-700 pb-2">
        <h2 class="font-bold text-lg">Inspector Preview</h2>
        <span class="text-xs text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">
          Target: {{ inspectorProps.clazz?.name }}
        </span>
      </div>

      <div class="flex-1 overflow-y-auto bg-[#002941] rounded border border-slate-700 p-4">
        <Inspector 
          :model="inspectorProps.model" 
          :clazz="inspectorProps.clazz"
        />
      </div>
    </div>

    <div class="w-96 border-l border-slate-700 bg-black p-4 overflow-auto font-mono text-xs">
      <div class="text-green-500 mb-2 font-bold">// Frame JSON Output (Serialized)</div>
      <div class="text-slate-500 mb-4">// 观察 portrait 字段是否变成了数组</div>
      <pre>{{ jsonOutput }}</pre>
    </div>

  </div>
</template>