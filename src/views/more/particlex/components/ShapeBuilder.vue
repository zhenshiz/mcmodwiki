<script setup>
import { computed } from 'vue'
import { useParticleEditorStore } from '@/stores/modules/particleEditor'
import Switch from '@/components/form/Switch.vue'
import Slider from '@/components/form/Slider.vue'
import NumberInput from '@/components/form/NumberInput.vue'
import Select from '@/components/form/Select.vue'

const store = useParticleEditorStore()

const enabled = computed({
  get: () => store.shapeBuilder.enabled,
  set: (val) => store.setShapeBuilderEnabled(val),
})

const liveSync = computed({
  get: () => store.shapeBuilder.liveSync,
  set: (val) => store.setShapeBuilderLiveSync(val),
})

const shape = computed({
  get: () => store.shapeBuilder.shape,
  set: (val) => store.setShapeBuilderShape(val),
})

const circle = computed(() => store.shapeBuilder.circle)
const line = computed(() => store.shapeBuilder.line)
const helix = computed(() => store.shapeBuilder.helix)
const cloud = computed(() => store.shapeBuilder.cloud)

const shapeOptions = [
  { label: '圆形 (XZ)', value: 'circle' },
  { label: '线段', value: 'line' },
  { label: '螺旋 (Helix)', value: 'helix' },
  { label: '点云 (Sphere/Disk)', value: 'cloud' },
]

const updateCircleCenter = (key, value) => {
  store.updateCircleShape({
    center: {
      [key]: value,
    },
  })
}

const updateCircleRadius = (value) => {
  store.updateCircleShape({ radius: value })
}

const updateLinePoint = (role, key, value) => {
  store.updateLineShape({
    [role]: {
      [key]: value,
    },
  })
}

const resetLine = () => {
  store.updateLineShape({
    start: { x: -1, y: 0, z: 0 },
    end: { x: 1, y: 0, z: 0 },
  })
  if (!store.shapeBuilder.liveSync) store.applyShapeBuilderOnce()
}

const updateHelixCenter = (key, value) => {
  store.updateHelixShape({
    center: {
      [key]: value,
    },
  })
}

const resetHelix = () => {
  store.updateHelixShape({
    center: { x: 0, y: 0, z: 0 },
    radius: 1,
    height: 2,
    turns: 2,
  })
  if (!store.shapeBuilder.liveSync) store.applyShapeBuilderOnce()
}

const resetCloud = () => {
  store.updateCloudShape({
    center: { x: 0, y: 0, z: 0 },
    radius: 1,
    mode: 'sphere',
  })
  if (!store.shapeBuilder.liveSync) store.applyShapeBuilderOnce()
}

const resetCircle = () => {
  store.updateCircleShape({
    center: { x: 0, y: 0, z: 0 },
    radius: 1,
  })
  if (!store.shapeBuilder.liveSync) {
    store.applyShapeBuilderOnce()
  }
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center gap-3 p-3 border-b border-slate-700 bg-slate-800/40">
      <div class="min-w-0">
        <div class="text-sm font-semibold">形状构建器</div>
        <div class="text-xs text-slate-400 truncate">
          通过 3D 控制点调形状，再生成表达式（可与手写表达式共存）
        </div>
      </div>

      <div class="flex-1"></div>

      <div class="w-56">
        <Select v-model="shape" :options="shapeOptions" />
      </div>

      <div class="flex items-center gap-2 text-xs text-slate-400">
        <span>启用</span>
        <Switch v-model="enabled" :width="52" />
      </div>

      <div class="flex items-center gap-2 text-xs text-slate-400">
        <span>实时同步</span>
        <Switch v-model="liveSync" :width="52" />
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-3 space-y-4">
      <div
        v-if="!store.canUseShapeBuilder"
        class="p-3 rounded border border-slate-700 bg-slate-900/40 text-sm text-slate-300"
      >
        当前粒子类型不支持表达式，形状构建器不可用。
      </div>

      <template v-else>
        <div class="p-3 rounded border border-slate-700 bg-slate-900/30 space-y-3">
          <div class="flex items-center justify-between">
            <div class="text-sm font-medium">
              <template v-if="shape === 'circle'">圆形（XZ 平面）</template>
              <template v-else-if="shape === 'line'">线段</template>
              <template v-else-if="shape === 'helix'">螺旋（Helix）</template>
              <template v-else>点云</template>
            </div>
            <div class="text-xs text-slate-400">
              <template v-if="shape === 'circle'">拖拽预览里的控制点可以直接改中心/半径</template>
              <template v-else-if="shape === 'line'">拖拽预览里的控制点可以直接改起点/终点</template>
              <template v-else-if="shape === 'helix'">先用参数调形状，后续可扩展更多 gizmo</template>
              <template v-else>点云基于 random()，更适合快速做“体积感”</template>
            </div>
          </div>

          <template v-if="shape === 'circle'">
            <div class="grid grid-cols-3 gap-3">
              <div class="space-y-1">
                <div class="text-xs text-slate-400">中心 X</div>
                <NumberInput
                  :model-value="circle.center.x"
                  :step="0.1"
                  :precision="3"
                  @update:modelValue="(v) => updateCircleCenter('x', v)"
                />
              </div>
              <div class="space-y-1">
                <div class="text-xs text-slate-400">中心 Y</div>
                <NumberInput
                  :model-value="circle.center.y"
                  :step="0.1"
                  :precision="3"
                  @update:modelValue="(v) => updateCircleCenter('y', v)"
                />
              </div>
              <div class="space-y-1">
                <div class="text-xs text-slate-400">中心 Z</div>
                <NumberInput
                  :model-value="circle.center.z"
                  :step="0.1"
                  :precision="3"
                  @update:modelValue="(v) => updateCircleCenter('z', v)"
                />
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <div class="text-xs text-slate-400">半径</div>
                <div class="text-xs text-blue-400 tabular-nums">{{ circle.radius.toFixed(2) }}</div>
              </div>
              <Slider
                :model-value="circle.radius"
                :min="0.1"
                :max="20"
                :step="0.1"
                :format-tooltip="(v) => `${v.toFixed(2)}`"
                @update:modelValue="updateCircleRadius"
              />
            </div>
          </template>

          <template v-else-if="shape === 'line'">
            <div class="grid grid-cols-3 gap-3">
              <div class="space-y-1">
                <div class="text-xs text-slate-400">起点 X</div>
                <NumberInput
                  :model-value="line.start.x"
                  :step="0.1"
                  :precision="3"
                  @update:modelValue="(v) => updateLinePoint('start', 'x', v)"
                />
              </div>
              <div class="space-y-1">
                <div class="text-xs text-slate-400">起点 Y</div>
                <NumberInput
                  :model-value="line.start.y"
                  :step="0.1"
                  :precision="3"
                  @update:modelValue="(v) => updateLinePoint('start', 'y', v)"
                />
              </div>
              <div class="space-y-1">
                <div class="text-xs text-slate-400">起点 Z</div>
                <NumberInput
                  :model-value="line.start.z"
                  :step="0.1"
                  :precision="3"
                  @update:modelValue="(v) => updateLinePoint('start', 'z', v)"
                />
              </div>
              <div class="space-y-1">
                <div class="text-xs text-slate-400">终点 X</div>
                <NumberInput
                  :model-value="line.end.x"
                  :step="0.1"
                  :precision="3"
                  @update:modelValue="(v) => updateLinePoint('end', 'x', v)"
                />
              </div>
              <div class="space-y-1">
                <div class="text-xs text-slate-400">终点 Y</div>
                <NumberInput
                  :model-value="line.end.y"
                  :step="0.1"
                  :precision="3"
                  @update:modelValue="(v) => updateLinePoint('end', 'y', v)"
                />
              </div>
              <div class="space-y-1">
                <div class="text-xs text-slate-400">终点 Z</div>
                <NumberInput
                  :model-value="line.end.z"
                  :step="0.1"
                  :precision="3"
                  @update:modelValue="(v) => updateLinePoint('end', 'z', v)"
                />
              </div>
            </div>
          </template>

          <template v-else-if="shape === 'helix'">
            <div class="grid grid-cols-3 gap-3">
              <div class="space-y-1">
                <div class="text-xs text-slate-400">中心 X</div>
                <NumberInput
                  :model-value="helix.center.x"
                  :step="0.1"
                  :precision="3"
                  @update:modelValue="(v) => updateHelixCenter('x', v)"
                />
              </div>
              <div class="space-y-1">
                <div class="text-xs text-slate-400">中心 Y</div>
                <NumberInput
                  :model-value="helix.center.y"
                  :step="0.1"
                  :precision="3"
                  @update:modelValue="(v) => updateHelixCenter('y', v)"
                />
              </div>
              <div class="space-y-1">
                <div class="text-xs text-slate-400">中心 Z</div>
                <NumberInput
                  :model-value="helix.center.z"
                  :step="0.1"
                  :precision="3"
                  @update:modelValue="(v) => updateHelixCenter('z', v)"
                />
              </div>
            </div>

            <div class="grid grid-cols-3 gap-3">
              <div class="space-y-1">
                <div class="text-xs text-slate-400">半径</div>
                <NumberInput
                  :model-value="helix.radius"
                  :step="0.1"
                  :precision="3"
                  :min="0.1"
                  @update:modelValue="(v) => store.updateHelixShape({ radius: v })"
                />
              </div>
              <div class="space-y-1">
                <div class="text-xs text-slate-400">高度</div>
                <NumberInput
                  :model-value="helix.height"
                  :step="0.1"
                  :precision="3"
                  @update:modelValue="(v) => store.updateHelixShape({ height: v })"
                />
              </div>
              <div class="space-y-1">
                <div class="text-xs text-slate-400">圈数</div>
                <NumberInput
                  :model-value="helix.turns"
                  :step="0.25"
                  :precision="2"
                  :min="0.25"
                  @update:modelValue="(v) => store.updateHelixShape({ turns: v })"
                />
              </div>
            </div>
          </template>

          <template v-else>
            <div class="grid grid-cols-3 gap-3">
              <div class="space-y-1">
                <div class="text-xs text-slate-400">中心 X</div>
                <NumberInput
                  :model-value="cloud.center.x"
                  :step="0.1"
                  :precision="3"
                  @update:modelValue="(v) => store.updateCloudShape({ center: { x: v } })"
                />
              </div>
              <div class="space-y-1">
                <div class="text-xs text-slate-400">中心 Y</div>
                <NumberInput
                  :model-value="cloud.center.y"
                  :step="0.1"
                  :precision="3"
                  @update:modelValue="(v) => store.updateCloudShape({ center: { y: v } })"
                />
              </div>
              <div class="space-y-1">
                <div class="text-xs text-slate-400">中心 Z</div>
                <NumberInput
                  :model-value="cloud.center.z"
                  :step="0.1"
                  :precision="3"
                  @update:modelValue="(v) => store.updateCloudShape({ center: { z: v } })"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <div class="text-xs text-slate-400">半径</div>
                <NumberInput
                  :model-value="cloud.radius"
                  :step="0.1"
                  :precision="3"
                  :min="0.1"
                  @update:modelValue="(v) => store.updateCloudShape({ radius: v })"
                />
              </div>
              <div class="space-y-1">
                <div class="text-xs text-slate-400">模式</div>
                <Select
                  :model-value="cloud.mode"
                  :options="[
                    { label: '球体', value: 'sphere' },
                    { label: '圆盘 (XZ)', value: 'disk' }
                  ]"
                  @update:modelValue="(v) => store.updateCloudShape({ mode: v })"
                />
              </div>
            </div>
          </template>

          <div class="flex items-center gap-2 pt-1">
            <button
              class="px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm transition-colors"
              @click="shape === 'circle' ? resetCircle() : shape === 'line' ? resetLine() : shape === 'helix' ? resetHelix() : resetCloud()"
              type="button"
            >
              重置形状
            </button>

            <button
              v-if="!store.shapeBuilder.liveSync"
              class="px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-sm transition-colors"
              @click="store.applyShapeBuilderOnce()"
              type="button"
            >
              应用到表达式
            </button>
          </div>
        </div>

        <div class="text-xs text-slate-400 leading-5">
          提示：如果你想把形状整体移动到玩家附近，建议用右侧的 “位置 pos” 调整，而不是把大偏移写进表达式。
        </div>
      </template>
    </div>
  </div>
</template>
