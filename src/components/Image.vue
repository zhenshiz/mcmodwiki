<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { t } from '@/languages/index.js'
import defaultImage from '@/assets/defaultImage.png'
import { Icon } from '@iconify/vue'
import { imageUtil } from '@/utils/imageUtil.js'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  fallbackSrc: String,
  size: Number,
  //'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  objectFit: {
    type: String,
    default: 'fill',
    validator(value) {
      return ['fill', 'contain', 'cover', 'none', 'scale-down'].includes(value)
    }
  },
  previewDisabled: {
    type: Boolean,
    default: false
  },
  showToolbar: {
    type: Boolean,
    default: true
  },
  imgClass: String
})

const emit = defineEmits(['onError', 'imgClick'])

const show = ref(false)
const closeOnEscape = event => { if (event.key === 'Escape') show.value = false }
onMounted(() => window.addEventListener('keydown', closeOnEscape))
onUnmounted(() => window.removeEventListener('keydown', closeOnEscape))
const previewImg = ref()
let rotateX = 0
let rotateY = 0
let rotateZ = 0
let scale = 1
const iconList = ref([
  {
    icon: 'ant-design:rotate-left-outlined', onClick: () => {
      rotateZ -= 90
      previewImg.value.style.transform = `rotateZ(${rotateZ}deg)`
    }
  },
  {
    icon: 'ant-design:rotate-right-outlined', onClick: () => {
      rotateZ += 90
      previewImg.value.style.transform = `rotateZ(${rotateZ}deg)`
    }
  },
  {
    icon: 'ph:magnifying-glass-plus', onClick: () => {
      scale = Math.min(scale + 0.1, 1.5)
      previewImg.value.style.transform = `scale(${scale}, ${scale})`
    }
  },
  {
    icon: 'ph:magnifying-glass-minus', onClick: () => {
      scale = Math.max(scale - 0.1, 0.5)
      previewImg.value.style.transform = `scale(${scale}, ${scale})`
    }
  },
  {
    icon: 'fa:text-width', onClick: () => {
      rotateY += 180
      previewImg.value.style.transform = `rotateY(${rotateY}deg)`
    }
  },
  {
    icon: 'fa:text-height', onClick: () => {
      rotateX += 180
      previewImg.value.style.transform = `rotateX(${rotateX}deg)`
    }
  },
  {
    icon: 'material-symbols:download', onClick: () => {
      imageUtil.downloadImg(previewImg.value.src)
    }
  },
  {
    icon: 'iwwa:delete', onClick: () => {
      show.value = false
    }
  }
])
const iconSize = ref(30)

const ImgPreview = () => {
  show.value = true
  emit('imgClick', props.src)
}

const handleImageError = (event) => {
  event.target.src = props.fallbackSrc ?? defaultImage
  emit('onError', event)
}
</script>

<template>
  <img :class="[imgClass]"
       :style="{width:size+'px',height:size+'px',objectFit:objectFit}"
       @error="handleImageError($event)"
       @click="ImgPreview"
       :src="src"
       crossorigin="anonymous"
       :alt="t('加载失败')">
  <teleport to="body">
    <div v-if="show && !previewDisabled" role="dialog" aria-modal="true" :aria-label="t('图片预览')" class="fixed top-0 left-0 size-full center z-[997]">
      <div class="mask z-[998]" @click="()=>show=false" />
      <button type="button" class="absolute top-4 right-4 z-[1001] text-white bg-black/70 px-3 py-2" :aria-label="t('关闭图片预览')" @click="show=false">×</button>
      <img ref="previewImg" class="z-[999] transform duration-500 select-none max-w-[90vw] max-h-[80vh] object-contain"
           @error="handleImageError($event)"
           :src="src"
           :alt="t('加载失败')">
      <div
        v-if="showToolbar"
        class="z-[1000] absolute bottom-10 left-1/2 -translate-x-1/2 bg-[#747474] gap-3 h-[50px] w-[300px] center rounded-full text-white bg-opacity-70">
        <Icon v-for="item in iconList" :key="item.icon" :icon="item.icon" @click="item.onClick"
              class="first:ml-3 last:mr-3 cursor-pointer hover:text-text-blue" :width="iconSize"
              :height="iconSize" />
      </div>
    </div>
  </teleport>
</template>
