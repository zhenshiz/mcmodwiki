<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import Image from '@/components/Image.vue'
import { useGameBridgeStore } from '@/stores/modules/gameBridge.js'

const props = defineProps({ option: { type: Object, required: true }, size: { type: String, default: '20px' }, preview: Boolean })
const bridge = useGameBridgeStore()
const element = ref(null)
const visible = ref(false)
let observer
const kind = computed(() => props.option.itemId ? 'item' : 'texture')
const id = computed(() => props.option.itemId || props.option.textureId)
const src = computed(() => visible.value && id.value ? bridge.imageUrl(kind.value, id.value) : props.option.icon)
watch(() => props.option, () => { visible.value = false; if (element.value) observer?.observe(element.value) })
onMounted(() => {
  observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { visible.value = true; observer.unobserve(entry.target) } })
  observer.observe(element.value)
})
onUnmounted(() => observer?.disconnect())
</script>

<template>
  <span ref="element" class="inline-flex shrink-0 items-center justify-center" :style="{ width: size, height: size }" :title="bridge.imageErrors.get(bridge.imageKey(kind, id))">
    <Image v-if="src && preview" :src="src" object-fit="contain" img-class="w-full h-full object-contain [image-rendering:pixelated] cursor-zoom-in" />
    <img v-else-if="src" :src="src" alt="" class="w-full h-full object-contain [image-rendering:pixelated]" />
    <span v-else class="text-ui-muted text-xs">◇</span>
  </span>
</template>
