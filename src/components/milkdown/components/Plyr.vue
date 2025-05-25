<script setup>
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'

defineProps({
  src: {
    type: String,
    required: true
  },
  className: {
    type: String,
    default: ''
  }
})

const videoRef = ref()
let player = null

onMounted(() => {
  if (videoRef.value && !player) {
    player = new Plyr(videoRef.value, {
      controls: [
        'play-large',
        'play',
        'progress',
        'current-time',
        'mute',
        'volume',
        'captions',
        'settings',
        'pip',
        'airplay',
        'fullscreen'
      ],
      settings: ['captions', 'quality', 'speed']
    })
  }
})

onBeforeUnmount(() => {
  if (player) {
    player.destroy()
  }
})
</script>

<template>
  <video ref="videoRef" class="plyr-react" :class="className" playsinline>
    <source :src="src" type="video/mp4" />
  </video>
</template>
