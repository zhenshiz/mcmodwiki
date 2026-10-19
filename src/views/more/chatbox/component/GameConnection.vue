<script setup>
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useGameBridgeStore } from '@/stores/modules/gameBridge.js'
import { useChatBoxEditorStore } from '@/stores'
import Modal from '@/components/Modal.vue'
import Button from '@/components/Button.vue'
import Autocomplete from '@/components/form/Autocomplete.vue'
import { useMessage } from '@/components/register/useMessage.js'
import { t } from '@/languages'

const bridge = useGameBridgeStore()
const editor = useChatBoxEditorStore()
const message = useMessage()
const show = ref(false)
const address = ref('')
const token = ref('')
const busy = ref(false)
const translationKey = ref('')
const label = computed(() => bridge.status === 'connecting' ? t('正在连接游戏…')
  : bridge.connected ? t('游戏已连接') : t('连接游戏'))
const registryCount = computed(() => Object.values(bridge.snapshot?.registries || {}).reduce((count, list) => count + list.length, 0))

async function connect() {
  try {
    await bridge.connect(address.value, token.value)
    token.value = ''
    message.success(t('已连接游戏，补全和资源已更新'))
  } catch (error) { message.error(t(error.message)) }
}

async function preview() {
  busy.value = true
  try {
    const result = await editor.previewInGame()
    message.success(t('已发送游戏预览：{} / 第 {} 句', result.group, result.index + 1))
  } catch (error) { message.error(t(error.message)) }
  finally { busy.value = false }
}

async function stop() {
  try { await bridge.stopPreview() }
  catch (error) { message.error(t(error.message)) }
}

async function refresh() {
  try { await bridge.refresh() }
  catch (error) { message.error(t(error.message)) }
}
</script>

<template>
  <div class="flex items-center gap-1 text-xs">
    <button type="button" class="bridge-action" :class="bridge.connected ? 'text-ui-link' : 'text-ui-muted'" @click="show = true">
      <Icon :icon="bridge.connected ? 'lucide:plug-zap' : 'lucide:plug'" width="14" />{{ label }}
    </button>
    <button type="button" class="bridge-action" :disabled="!bridge.connected || !editor.currentModel || busy || bridge.syncing" @click="preview">
      <Icon icon="lucide:play" width="13" />{{ busy ? t('正在发送…') : t('游戏内预览') }}
    </button>
    <button v-if="bridge.previewing" type="button" class="bridge-action" @click="stop" :title="t('结束游戏预览')" :aria-label="t('结束游戏预览')"><Icon icon="lucide:square" width="12" /></button>
  </div>

  <Modal v-model:show="show" :title="t('连接 Minecraft ChatBox')" width="620px">
    <div class="p-5 flex flex-col gap-4 text-sm text-ui-text">
      <p class="text-ui-muted leading-relaxed">{{ t('进入游戏世界后输入 /chatbox editor start。按 T 打开聊天栏，点击蓝色连接地址并粘贴到「本机连接地址」，再点击配对码并粘贴到「配对码」，然后点击「连接游戏」。请使用游戏本次给出的完整地址，端口会变化。') }}</p>
      <p class="text-xs text-ui-muted">{{ t('需要服务端 4 级权限。连接后直接读取游戏文件，保存会写入服务端数据包并重载。') }}</p>
      <template v-if="!bridge.connected">
        <label class="flex flex-col gap-1.5"><span>{{ t('本机连接地址') }}</span>
          <input v-model="address" class="bridge-input font-mono" spellcheck="false" placeholder="ws://127.0.0.1:端口/chatbox-editor" :disabled="bridge.status === 'connecting'" />
        </label>
        <label class="flex flex-col gap-1.5"><span>{{ t('配对码') }}</span>
          <input v-model="token" class="bridge-input font-mono" type="password" autocomplete="off" :disabled="bridge.status === 'connecting'" @keydown.enter="connect" />
        </label>
        <div class="flex gap-2">
          <Button :disabled="bridge.status === 'connecting' || !address.trim() || !token.trim()" @click="connect">{{ label }}</Button>
          <Button v-if="bridge.status === 'connecting'" @click="bridge.disconnect()">{{ t('取消') }}</Button>
        </div>
      </template>
      <template v-else>
        <div class="border-2 border-ui-line bg-ui-inset p-3 grid grid-cols-2 gap-2 text-xs">
          <span>Minecraft {{ bridge.snapshot?.minecraft }}</span><span>ChatBox {{ bridge.snapshot?.chatbox }}</span>
          <span>{{ t('游戏语言：{}', bridge.snapshot?.language) }}</span><span>{{ t('补全条目：{}', registryCount) }}</span>
          <span>{{ t('翻译键：{}', Object.keys(bridge.snapshot?.translations || {}).length) }}</span><span>{{ bridge.snapshot?.inWorld ? t('已进入世界') : t('请先进入游戏世界') }}</span>
        </div>
        <label class="flex flex-col gap-1.5"><span>{{ t('查询游戏翻译键') }}</span>
          <Autocomplete v-model="translationKey" :options="editor.translatableSuggestions" :placeholder="t('输入翻译键或译文')" />
        </label>
        <div v-if="translationKey" class="bg-ui-inset border border-ui-line p-3 break-words">{{ editor.getTranslatableLabel(translationKey) }}</div>
        <div class="flex flex-wrap gap-2">
          <Button :disabled="bridge.syncing || busy" @click="refresh">{{ bridge.syncing ? t('正在同步…') : t('刷新游戏数据') }}</Button>
          <Button :disabled="!editor.currentModel || busy || bridge.syncing" @click="preview">{{ t('游戏内预览') }}</Button>
          <Button @click="bridge.disconnect()">{{ t('断开连接') }}</Button>
        </div>
        <p class="text-xs text-ui-muted leading-relaxed">{{ t('预览当前选中的对话句；未选中时从当前组第一句开始。主题文件使用示例文本，无需准备对话文件。预览不执行指令和脚本；保存会写入服务端数据包并重载。') }}</p>
      </template>
      <p v-if="bridge.error" role="alert" class="border border-red-500/50 bg-red-500/10 p-3 text-red-500 break-words">{{ t(bridge.error) }}</p>
      <p class="text-xs text-ui-muted leading-relaxed">{{ t('连接只访问本机游戏。浏览器询问本地网络权限时，请允许当前网站连接；断线后网页编辑内容仍会保留。') }}</p>
    </div>
  </Modal>
</template>

<style scoped>
.bridge-action { display: flex; align-items: center; gap: 5px; padding: 5px 7px; white-space: nowrap; }
.bridge-action:hover { background: rgb(var(--ui-inset)); }
.bridge-action:disabled { opacity: .4; cursor: not-allowed; }
.bridge-input { width: 100%; padding: 9px 10px; border: 2px solid rgb(var(--ui-line)); background: rgb(var(--ui-inset)); outline: none; }
.bridge-input:focus { border-color: rgb(var(--ui-link)); }
</style>
