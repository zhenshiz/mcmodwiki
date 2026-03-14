<script setup>
import { ref, computed } from 'vue'
import { useParticleEditorStore } from '@/stores/modules/particleEditor'
import { useMessage } from '@/components/register/useMessage.js'

const store = useParticleEditorStore()
const message = useMessage()

const selectedCommand = ref(0)

const commands = computed(() => store.generatedCommands)
const commandCount = computed(() =>
  commands.value.filter(cmd => !cmd.startsWith('#') && cmd).length
)

const copyCommand = (index) => {
  const command = commands.value[index]
  if (command && !command.startsWith('#')) {
    navigator.clipboard.writeText(command)
    message.success('指令已复制到剪贴板')
  }
}

const copyAll = () => {
  const commandsOnly = commands.value.filter(cmd => !cmd.startsWith('#') && cmd)
  if (commandsOnly.length > 0) {
    navigator.clipboard.writeText(commandsOnly.join('\n'))
    message.success(`已复制 ${commandsOnly.length} 条指令`)
  } else {
    message.warning('没有可复制的指令')
  }
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- 工具栏 -->
    <div class="flex items-center justify-between px-3 py-2 border-b border-slate-700 bg-slate-800/50">
      <span class="text-xs text-slate-400">指令预览</span>
      <div class="flex gap-2">
        <button
          @click="copyAll"
          class="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded transition-colors"
        >
          复制全部
        </button>
      </div>
    </div>

    <!-- 指令列表 -->
    <div class="flex-1 overflow-y-auto">
      <div
        v-for="(command, index) in commands"
        :key="index"
        @click="selectedCommand = index"
        :class="[
          'px-3 py-2 border-b border-slate-800 cursor-pointer transition-colors',
          selectedCommand === index ? 'bg-blue-600/10' : 'hover:bg-slate-800/30'
        ]"
      >
        <div class="flex items-start gap-2">
          <!-- 行号 -->
          <span class="text-xs text-slate-500 select-none">{{ index + 1 }}</span>

          <!-- 指令内容 -->
          <div class="flex-1 min-w-0">
            <code
              :class="[
                'text-sm font-mono break-all',
                command.startsWith('#') ? 'text-slate-500' : 'text-green-400'
              ]"
            >{{ command || '(空行)' }}</code>
          </div>

          <!-- 复制按钮 -->
          <button
            v-if="!command.startsWith('#') && command"
            @click.stop="copyCommand(index)"
            class="p-1 hover:bg-slate-700 rounded transition-colors shrink-0"
            title="复制此指令"
          >
            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="px-3 py-2 border-t border-slate-700 bg-slate-800/30 text-xs text-slate-400">
      共 {{ commandCount }} 条指令
    </div>
  </div>
</template>