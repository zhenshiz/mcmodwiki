<script setup>
import { TooltipProvider } from '@milkdown/plugin-tooltip'
import { usePluginViewContext } from '@prosemirror-adapter/vue'
import { useInstance } from '@milkdown/vue'
import { callCommand } from '@milkdown/utils'
import { Icon } from '@iconify/vue'
import {
  toggleEmphasisCommand,
  toggleInlineCodeCommand,
  toggleLinkCommand,
  toggleStrongCommand
} from '@milkdown/preset-commonmark'
import { toggleStrikethroughCommand } from '@milkdown/preset-gfm'

const { view, prevState } = usePluginViewContext()
const [loading, get] = useInstance()

const divRef = ref()
let tooltipProvider

const tooltipList = ref([
  { icon: 'lucide:bold', key: toggleStrongCommand.key },
  { icon: 'lucide:italic', key: toggleEmphasisCommand.key },
  { icon: 'lucide:strikethrough', key: toggleStrikethroughCommand.key },
  { icon: 'lucide:code-xml', key: toggleInlineCodeCommand.key },
  { icon: 'lucide:link', key: toggleLinkCommand.key }
])

onMounted(() => {
  tooltipProvider = new TooltipProvider({
    content: divRef.value
  })

  tooltipProvider.update(view.value, prevState.value)
})

watch([view, prevState], () => {
  tooltipProvider?.update(view.value, prevState.value)
})

onUnmounted(() => {
  tooltipProvider.destroy()
})

const call = (command, payload = '') => {
  return get()?.action(callCommand(command, payload))
}
</script>

<template>
  <div ref="divRef"
       class="absolute flex bg-white border border-text-blue rounded backdrop-blur-[10px] z-[9999] data-[show=false]:hidden dark:bg-dark-blue">
    <button v-for="item in tooltipList" @click="call(item.key)">
      <Icon :icon="item.icon" class="dark:text-white" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
button {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border-radius: 5px;
  margin: 5px;
  font-size: 22px;
  color: #00c0f5;
  background-color: transparent;
  border: 1px solid transparent;

  &:hover {
    border: 1px solid #00c0f5;
  }
}
</style>
