<script setup>
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { Portrait } from '@/assets/more/chatbox/chatboxTheme.js'
import { DialogueReplacePortrait } from '@/assets/more/chatbox/chatboxDialogues.js'
import { useChatBoxEditorStore } from '@/stores'
import { t } from '@/languages/index.js'
import ObjectArray from '@/components/form/array/ObjectArray.vue'
import AnimationEditor from './AnimationEditor.vue'

defineOptions({ inheritAttrs: false })
const props = defineProps({ modelValue: { type: [Array, null], default: () => [] }, owner: { type: Object, default: null } })
const emit = defineEmits(['update:modelValue', 'update:loop'])
const store = useChatBoxEditorStore()
const opened = ref(false)
const canOpen = computed(() => store.currentFile && (!(props.owner instanceof Portrait) || props.owner.constructor === Portrait || props.owner instanceof DialogueReplacePortrait))
</script>

<template>
  <div class="w-full">
    <button v-if="canOpen" type="button" class="flex items-center justify-center gap-2 w-full mb-2 px-2 py-2 text-xs border border-ui-link/40 text-ui-link bg-ui-secondary/10 hover:bg-ui-secondary/20"
      @click="opened = true">
      <Icon icon="lucide:clapperboard" width="14" />{{ t('打开动画时间轴') }}
    </button>
    <ObjectArray v-bind="$attrs" :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" />
    <AnimationEditor v-if="opened" :model-value="modelValue" :portrait="owner instanceof Portrait ? owner : null"
      @close="opened = false" @apply="(frames, loop) => { emit('update:modelValue', frames); if (owner instanceof Portrait) emit('update:loop', loop) }" />
  </div>
</template>
