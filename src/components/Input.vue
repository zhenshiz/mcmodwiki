<script setup>
import _ from 'lodash'

const props = defineProps({
  placeholder: String,
  modelValue: String,
  type:{
    type: String,
    default: 'text'
  },
  defaultModel: {
    type: String,
    default: 'none',
    validator(value, props) {
      return ['none', 'login', 'search'].includes(value)
    }
  },
  isDebounce: {
    type: Boolean,
    default: false
  },
  debounceTime: {
    type: Number,
    default: 500
  },
  defaultColor: {
    type: Array,
    validator(value, props) {
      return value.length === 2
    }
  }
})
const emit = defineEmits(['update:modelValue'])
const borderColor = ref()
const color = ref([])

const defaultModelClass = {
  none: { class: '', borderColor: [] },
  login: { class: 'border-b-2', borderColor: ['#BAE6FD', '#0EA5E9'] },
  search: { class: 'border-2 rounded p-2', borderColor: ['#00C0F5', '#F35FAB'] }
}


const input = ref()
const change = props.isDebounce ? _.debounce(() => {
    emit('update:modelValue', input.value.value)
  }, props.debounceTime) :
  (event) => {
    emit('update:modelValue', event.target.value)
  }

const focus = () => {
  borderColor.value = color.value[1]
}
const blur = () => {
  borderColor.value = color.value[0]
}

const getInput = ()=>{
  return input.value
}

onMounted(() => {
  color.value = props.defaultColor ?? defaultModelClass[props.defaultModel].borderColor
  borderColor.value = color.value[0]
})

defineExpose({
  getInput
})
</script>

<template>
  <div class="w-full relative rounded center flex-row" :class="defaultModelClass[defaultModel].class"
       :style="{borderColor:borderColor}">
    <slot name="header"></slot>
    <input
      ref="input"
      class="size-full bg-transparent text-base focus:outline-none focus:dark:caret-white dark:text-white"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="change($event)"
      @focus="focus"
      @blur="blur"
    >
    <slot name="footer"></slot>
  </div>
</template>
