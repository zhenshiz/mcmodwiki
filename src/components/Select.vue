<script setup>
import Tag from '@/components/Tag.vue'
import Popover from '@/components/Popover.vue'
import { Icon } from '@iconify/vue'
import { usePageStore } from '@/stores/index.js'
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  valueName: {
    type: String,
    default: 'value'
  },
  labelName: {
    type: String,
    default: 'label'
  },
  width: Number,
  trigger: {
    type: String,
    default: 'hover',
    validator(value) {
      return ['hover', 'click'].includes(value)
    }
  },
  mode: {
    type: String,
    default: 'bottom',
    validator(value) {
      return ['top', 'bottom'].includes(value)
    }
  },
  offset: {
    type: Number,
    default: 0
  },
  isNoCaseSensitive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])
const isDark = computed(() => usePageStore().isDark)

const selected = computed(() => {
  let obj = {}
  obj[props.labelName] = ''
  obj[props.valueName] = ''
  if (props.isNoCaseSensitive) {
    return props.options.find(
      (option) => option[props.valueName]?.toUpperCase() === props.modelValue?.toUpperCase()
    ) ?? obj
  } else {
    return props.options.find(
      (option) => option[props.valueName] === props.modelValue
    ) ?? obj
  }
})

const selectOption = (item) => {
  emit('update:modelValue', item[props.valueName])
}

const select = ref()
const option = ref()
onMounted(() => {
  if (props.width) {
    option.value.style.width = props.width + 'px'
    select.value.$el.style.width = props.width + 'px'
  } else {
    option.value.style.width = select.value.$el.getBoundingClientRect().width + 'px'
  }
})
</script>

<template>
  <Popover
    :mode="mode"
    :trigger="trigger"
    :offset="offset"
    :backgroundColor="isDark ? '#003247' : '#fff'"
  >
    <template #trigger>
      <Tag
        ref="select"
        class="min-w-[120px] cursor-pointer whitespace-nowrap"
        backgroundColor="transparent"
        :color="isDark ? '#fff' : '#000'"
        :border-color="isDark ? '#fff' : '#999'"
        round
      >
        <div class="min-w-[80px]">{{ selected[labelName] }}</div>
        <template #footer>
          <div class="w-full flex justify-end">
            <Icon class="dark:text-white ml-2 w-[20px] h-[20px]"
                  icon="ri:arrow-down-s-line" />
          </div>
        </template>
      </Tag>
    </template>

    <div
      ref="option"
      class="p-3 border shadow border-light-blue dark:border-dark-blue overflow-auto max-h-[200px]"
    >
      <div
        v-for="(item, index) in options"
        :key="index"
        @click="selectOption(item)"
        class="mb-1 last:mb-0 dark:text-white theme-cursor-blue p-1 whitespace-nowrap"
      >
        {{ item[labelName] }}
      </div>
    </div>
  </Popover>
</template>
