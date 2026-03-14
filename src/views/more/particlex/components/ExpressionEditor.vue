<script setup>
import { computed, ref } from 'vue'
import { useParticleEditorStore } from '@/stores/modules/particleEditor'

const store = useParticleEditorStore()
const activeTab = ref('functions')

const expression = computed({
  get: () => store.particleConfig.expression,
  set: (value) => store.updateConfig('expression', value)
})

const availableFunctions = [
  { name: 'sin', desc: '正弦函数', syntax: 'sin(x)' },
  { name: 'cos', desc: '余弦函数', syntax: 'cos(x)' },
  { name: 'tan', desc: '正切函数', syntax: 'tan(x)' },
  { name: 'asin', desc: '反正弦函数', syntax: 'asin(x)' },
  { name: 'acos', desc: '反余弦函数', syntax: 'acos(x)' },
  { name: 'atan', desc: '反正切函数', syntax: 'atan(x)' },
  { name: 'sqrt', desc: '平方根', syntax: 'sqrt(x)' },
  { name: 'abs', desc: '绝对值', syntax: 'abs(x)' },
  { name: 'pow', desc: '幂运算', syntax: 'pow(x, y)' },
  { name: 'log', desc: '自然对数', syntax: 'log(x)' },
  { name: 'floor', desc: '向下取整', syntax: 'floor(x)' },
  { name: 'ceil', desc: '向上取整', syntax: 'ceil(x)' },
  { name: 'round', desc: '四舍五入', syntax: 'round(x)' },
  { name: 'max', desc: '最大值', syntax: 'max(x, y)' },
  { name: 'min', desc: '最小值', syntax: 'min(x, y)' },
  { name: 'random', desc: '随机数', syntax: 'random()' },
]

const variables = [
  { name: 't', desc: '参数变量', type: '自变量' },
  { name: 'x', desc: 'X 坐标', type: '因变量' },
  { name: 'y', desc: 'Y 坐标', type: '因变量' },
  { name: 'z', desc: 'Z 坐标', type: '因变量' },
  { name: 's1', desc: '极坐标角度', type: '极坐标' },
  { name: 's2', desc: '极坐标角度2', type: '极坐标' },
  { name: 'dis', desc: '距离', type: '极坐标' },
]

const operators = [
  { name: '+', desc: '加法' },
  { name: '-', desc: '减法' },
  { name: '*', desc: '乘法' },
  { name: '/', desc: '除法' },
  { name: '%', desc: '取模' },
  { name: '^', desc: '幂运算' },
  { name: '==', desc: '等于' },
  { name: '!=', desc: '不等于' },
  { name: '>', desc: '大于' },
  { name: '<', desc: '小于' },
  { name: '>=', desc: '大于等于' },
  { name: '<=', desc: '小于等于' },
  { name: '&', desc: '逻辑与' },
  { name: '|', desc: '逻辑或' },
  { name: '!', desc: '逻辑非' },
  { name: '=', desc: '赋值' },
]

const insertFunction = (funcName) => {
  const func = availableFunctions.find(f => f.name === funcName)
  if (func) {
    expression.value += func.syntax
  }
}

const insertVariable = (varName) => {
  expression.value += varName
}

const insertOperator = (opName) => {
  expression.value += opName
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- 编辑器工具栏 -->
    <div class="flex items-center gap-2 p-2 border-b border-slate-700 bg-slate-800/50">
      <span class="text-xs text-slate-400">表达式编辑器</span>
      <div class="flex-1"></div>
      <button
        @click="expression = expression.replace(/;/g, ';\n').trim()"
        class="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded transition-colors"
      >
        格式化
      </button>
      <button
        class="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded transition-colors"
        :class="store.validationResult.valid ? 'text-green-400' : 'text-red-400'"
      >
        {{ store.validationResult.valid ? '✓ 验证通过' : '✗ 验证失败' }}
      </button>
    </div>

    <!-- 主编辑区 -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 左侧：代码编辑器 -->
      <div class="flex-1 p-3">
        <textarea
          v-model="expression"
          class="w-full h-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm font-mono focus:outline-none focus:border-blue-500 resize-none"
          placeholder="输入数学表达式，例如: x=cos(t);y=0;z=sin(t)"
          spellcheck="false"
        ></textarea>
      </div>

      <!-- 右侧：函数和变量面板 -->
      <div class="w-64 border-l border-slate-700 flex flex-col overflow-hidden">
        <!-- 标签页 -->
        <div class="flex border-b border-slate-700 text-xs">
          <button
            @click="activeTab = 'functions'"
            :class="activeTab === 'functions' ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:text-slate-200'"
            class="flex-1 px-3 py-2"
          >
            函数
          </button>
          <button
            @click="activeTab = 'variables'"
            :class="activeTab === 'variables' ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:text-slate-200'"
            class="flex-1 px-3 py-2"
          >
            变量
          </button>
          <button
            @click="activeTab = 'operators'"
            :class="activeTab === 'operators' ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:text-slate-200'"
            class="flex-1 px-3 py-2"
          >
            运算符
          </button>
        </div>

        <!-- 内容区 -->
        <div class="flex-1 overflow-y-auto p-2 space-y-1">
          <!-- 函数列表 -->
          <template v-if="activeTab === 'functions'">
            <div
              v-for="func in availableFunctions"
              :key="func.name"
              @click="insertFunction(func.name)"
              class="p-2 rounded bg-slate-800/50 hover:bg-slate-700 cursor-pointer transition-colors"
            >
              <div class="text-sm font-mono text-blue-400">{{ func.syntax }}</div>
              <div class="text-xs text-slate-400">{{ func.desc }}</div>
            </div>
          </template>

          <!-- 变量列表 -->
          <template v-if="activeTab === 'variables'">
            <div
              v-for="variable in variables"
              :key="variable.name"
              @click="insertVariable(variable.name)"
              class="p-2 rounded bg-slate-800/50 hover:bg-slate-700 cursor-pointer transition-colors"
            >
              <div class="flex items-center gap-2">
                <span class="text-sm font-mono text-purple-400">{{ variable.name }}</span>
                <span class="text-xs text-slate-500">{{ variable.type }}</span>
              </div>
              <div class="text-xs text-slate-400">{{ variable.desc }}</div>
            </div>
          </template>

          <!-- 运算符列表 -->
          <template v-if="activeTab === 'operators'">
            <div class="grid grid-cols-4 gap-1">
              <button
                v-for="op in operators"
                :key="op.name"
                @click="insertOperator(op.name)"
                class="p-2 rounded bg-slate-800/50 hover:bg-slate-700 text-sm font-mono transition-colors"
                :title="op.desc"
              >
                {{ op.name }}
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 帮助提示 -->
    <div class="px-3 py-2 border-t border-slate-700 bg-slate-800/30 text-xs text-slate-400">
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        <span>使用分号 (;) 分隔多个赋值表达式</span>
      </div>
    </div>
  </div>
</template>