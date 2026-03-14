<script setup>
import { computed } from 'vue'
import { useParticleEditorStore } from '@/stores/modules/particleEditor'
import Select from '@/components/form/Select.vue'
import NumberInput from '@/components/form/NumberInput.vue'
import Input from '@/components/form/Input.vue'
import Slider from '@/components/form/Slider.vue'
import { COMMON_PARTICLES } from '@/assets/more/particlex/particleTypes.js'

const store = useParticleEditorStore()

// 当前粒子类型定义
const currentParticleType = computed(() => store.currentParticleType)

// 当前配置
const config = computed(() => store.particleConfig)

const particleOptions = computed(() => {
  return COMMON_PARTICLES.map((id) => ({ label: id, value: id }))
})

const shouldShowParam = (key) => {
  const type = currentParticleType.value
  if (!type?.params) return true
  return type.params.required.includes(key) || type.params.optional.includes(key)
}

// 更新配置
const updateConfig = (key, value) => {
  store.updateConfig(key, value)
}

// 更新嵌套配置
const updateNestedConfig = (parent, key, value) => {
  store.updateNestedConfig(parent, key, value)
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- 标题 -->
    <div class="p-3 border-b border-slate-700 flex items-center justify-between">
      <div>
        <h3 class="text-sm font-semibold">参数配置</h3>
        <p class="text-xs text-slate-400 mt-0.5">{{ currentParticleType?.name }}</p>
      </div>
      <div
        :class="[
          'px-2 py-1 rounded text-xs',
          store.validationResult.valid
            ? 'bg-green-600/20 text-green-400'
            : 'bg-red-600/20 text-red-400'
        ]"
      >
        {{ store.validationResult.valid ? '✓ 配置有效' : '✗ 配置错误' }}
      </div>
    </div>

    <!-- 参数表单 -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-4">
      <!-- 粒子类型 -->
      <div class="space-y-1">
        <label class="text-xs text-slate-400">粒子类型</label>
        <Select
          :model-value="config.name"
          :options="particleOptions"
          @update:modelValue="(v) => updateConfig('name', v)"
        />
      </div>

      <!-- 位置 -->
      <div class="space-y-2">
        <label class="text-xs text-slate-400">位置</label>
        <div class="grid grid-cols-3 gap-2">
          <div>
            <label class="text-xs text-slate-500">X</label>
            <NumberInput
              :model-value="config.pos.x"
              :step="0.1"
              :precision="3"
              @update:modelValue="(v) => updateNestedConfig('pos', 'x', v)"
            />
          </div>
          <div>
            <label class="text-xs text-slate-500">Y</label>
            <NumberInput
              :model-value="config.pos.y"
              :step="0.1"
              :precision="3"
              @update:modelValue="(v) => updateNestedConfig('pos', 'y', v)"
            />
          </div>
          <div>
            <label class="text-xs text-slate-500">Z</label>
            <NumberInput
              :model-value="config.pos.z"
              :step="0.1"
              :precision="3"
              @update:modelValue="(v) => updateNestedConfig('pos', 'z', v)"
            />
          </div>
        </div>
      </div>

      <!-- 颜色 (RGBA) -->
      <div v-if="shouldShowParam('color')" class="space-y-2">
        <label class="text-xs text-slate-400">颜色 (RGBA)</label>
        <div class="space-y-3">
          <div class="grid grid-cols-4 gap-2">
            <div>
              <label class="text-xs text-slate-500">R</label>
              <NumberInput
                :model-value="config.color.r"
                :min="0"
                :max="1"
                :step="0.01"
                :precision="2"
                @update:modelValue="(v) => updateNestedConfig('color', 'r', v)"
              />
            </div>
            <div>
              <label class="text-xs text-slate-500">G</label>
              <NumberInput
                :model-value="config.color.g"
                :min="0"
                :max="1"
                :step="0.01"
                :precision="2"
                @update:modelValue="(v) => updateNestedConfig('color', 'g', v)"
              />
            </div>
            <div>
              <label class="text-xs text-slate-500">B</label>
              <NumberInput
                :model-value="config.color.b"
                :min="0"
                :max="1"
                :step="0.01"
                :precision="2"
                @update:modelValue="(v) => updateNestedConfig('color', 'b', v)"
              />
            </div>
            <div>
              <label class="text-xs text-slate-500">A</label>
              <NumberInput
                :model-value="config.color.a"
                :min="0"
                :max="1"
                :step="0.01"
                :precision="2"
                @update:modelValue="(v) => updateNestedConfig('color', 'a', v)"
              />
            </div>
          </div>

          <div class="grid grid-cols-4 gap-2">
            <Slider :model-value="config.color.r" :min="0" :max="1" :step="0.01" @update:modelValue="(v) => updateNestedConfig('color', 'r', v)" />
            <Slider :model-value="config.color.g" :min="0" :max="1" :step="0.01" @update:modelValue="(v) => updateNestedConfig('color', 'g', v)" />
            <Slider :model-value="config.color.b" :min="0" :max="1" :step="0.01" @update:modelValue="(v) => updateNestedConfig('color', 'b', v)" />
            <Slider :model-value="config.color.a" :min="0" :max="1" :step="0.01" @update:modelValue="(v) => updateNestedConfig('color', 'a', v)" />
          </div>
        </div>
      </div>

      <!-- 初始速度 -->
      <div v-if="shouldShowParam('speed')" class="space-y-2">
        <label class="text-xs text-slate-400">初始速度</label>
        <div class="grid grid-cols-3 gap-2">
          <div>
            <label class="text-xs text-slate-500">VX</label>
            <NumberInput
              :model-value="config.speed.vx"
              :step="0.1"
              :precision="3"
              @update:modelValue="(v) => updateNestedConfig('speed', 'vx', v)"
            />
          </div>
          <div>
            <label class="text-xs text-slate-500">VY</label>
            <NumberInput
              :model-value="config.speed.vy"
              :step="0.1"
              :precision="3"
              @update:modelValue="(v) => updateNestedConfig('speed', 'vy', v)"
            />
          </div>
          <div>
            <label class="text-xs text-slate-500">VZ</label>
            <NumberInput
              :model-value="config.speed.vz"
              :step="0.1"
              :precision="3"
              @update:modelValue="(v) => updateNestedConfig('speed', 'vz', v)"
            />
          </div>
        </div>
      </div>

      <!-- 范围 -->
      <div v-if="shouldShowParam('range')" class="space-y-2">
        <label class="text-xs text-slate-400">范围</label>
        <div class="grid grid-cols-3 gap-2">
          <div>
            <label class="text-xs text-slate-500">DX</label>
            <NumberInput
              :model-value="config.range.dx"
              :min="0"
              :step="0.1"
              :precision="3"
              @update:modelValue="(v) => updateNestedConfig('range', 'dx', v)"
            />
          </div>
          <div>
            <label class="text-xs text-slate-500">DY</label>
            <NumberInput
              :model-value="config.range.dy"
              :min="0"
              :step="0.1"
              :precision="3"
              @update:modelValue="(v) => updateNestedConfig('range', 'dy', v)"
            />
          </div>
          <div>
            <label class="text-xs text-slate-500">DZ</label>
            <NumberInput
              :model-value="config.range.dz"
              :min="0"
              :step="0.1"
              :precision="3"
              @update:modelValue="(v) => updateNestedConfig('range', 'dz', v)"
            />
          </div>
        </div>
      </div>

      <!-- 粒子数量 -->
      <div v-if="shouldShowParam('count')" class="space-y-1">
        <label class="text-xs text-slate-400">粒子数量</label>
        <NumberInput
          :model-value="config.count"
          :min="1"
          :max="10000"
          :step="10"
          @update:modelValue="(v) => updateConfig('count', v)"
        />
      </div>

      <!-- 寿命 -->
      <div v-if="shouldShowParam('age')" class="space-y-1">
        <label class="text-xs text-slate-400">寿命 (0=原寿命, -1=不消失)</label>
        <NumberInput
          :model-value="config.age"
          :min="-1"
          :step="1"
          @update:modelValue="(v) => updateConfig('age', v)"
        />
      </div>

      <!-- 参数范围 -->
      <div v-if="shouldShowParam('begin') || shouldShowParam('end')" class="grid grid-cols-2 gap-2">
        <div class="space-y-1">
          <label class="text-xs text-slate-400">参数起始值</label>
          <NumberInput
            :model-value="config.begin"
            :step="0.1"
            :precision="3"
            @update:modelValue="(v) => updateConfig('begin', v)"
          />
        </div>
        <div class="space-y-1">
          <label class="text-xs text-slate-400">参数结束值</label>
          <NumberInput
            :model-value="config.end"
            :step="0.1"
            :precision="3"
            @update:modelValue="(v) => updateConfig('end', v)"
          />
        </div>
      </div>

      <!-- 计算间隔 -->
      <div v-if="shouldShowParam('calcInterval')" class="space-y-1">
        <label class="text-xs text-slate-400">计算间隔</label>
        <NumberInput
          :model-value="config.calcInterval"
          :min="0.001"
          :step="0.01"
          :precision="3"
          @update:modelValue="(v) => updateConfig('calcInterval', v)"
        />
      </div>

      <!-- CPT -->
      <div v-if="shouldShowParam('CPT')" class="space-y-1">
        <label class="text-xs text-slate-400">CPT (每 tick 执行次数)</label>
        <NumberInput
          :model-value="config.CPT"
          :min="1"
          :step="1"
          @update:modelValue="(v) => updateConfig('CPT', v)"
        />
      </div>

      <!-- 组 -->
      <div v-if="shouldShowParam('group')" class="space-y-1">
        <label class="text-xs text-slate-400">组 (可选)</label>
        <Input
          :model-value="config.group"
          placeholder="例如: groupA"
          @update:modelValue="(v) => updateConfig('group', v)"
        />
      </div>
    </div>

    <!-- 错误提示 -->
    <div
      v-if="!store.validationResult.valid"
      class="p-3 border-t border-slate-700 bg-red-900/20"
    >
      <div class="text-xs font-medium text-red-400 mb-2">配置错误</div>
      <ul class="space-y-1">
        <li
          v-for="(error, index) in store.validationResult.errors"
          :key="index"
          class="text-xs text-red-300"
        >
          • {{ error }}
        </li>
      </ul>
    </div>
  </div>
</template>
