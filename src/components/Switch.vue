<script setup>

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  width: {
    type: Number,
    default: 60
  },
  switchOnColor: {
    type: String,
    default: '#00c0f5'
  },
  switchOffColor: {
    type: String,
    default: '#999'
  }
})

const emit = defineEmits(['update:modelValue'])
const knobWidth = computed(() => props.modelValue ? props.width - 28 : 2)

const toggleSwitch = () => {
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <div
    class="h-[30px] rounded-full relative cursor-pointer transition duration-300"
    :style="{width: props.width + 'px',backgroundColor: props.modelValue ? props.switchOnColor:props.switchOffColor}"
    @click="toggleSwitch"
  >
    <div
      class="w-[26px] h-[26px] rounded-full absolute top-0.5 transition-all duration-300 bg-white"
      :style="{'left': knobWidth + 'px'}" />
  </div>
</template>
