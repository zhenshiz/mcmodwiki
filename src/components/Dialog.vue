<script setup>
import Button from '@/components/Button.vue'
import { Icon } from '@iconify/vue'
import { usePageStore } from '@/stores/index.js'
import { translatable } from '@/assets/translatable/translatable.js'

const props = defineProps({
  title: String,
  content: String,
  positiveText: {
    type: String,
    default: translatable('component.dialog.positive')
  },
  negativeText: {
    type: String,
    default: translatable('component.dialog.negative')
  },
  type: {
    type: String,
    default: 'info',
    validator(value, props) {
      return ['info', 'warn', 'success', 'error'].includes(value)
    }
  },
  maskClosable: {
    type: Boolean,
    default: true
  },
  escClosable: {
    type: Boolean,
    default: true
  },
  onPositiveClick: {
    type: Function,
    default: () => {
    }
  },
  onNegativeClick: {
    type: Function,
    default: () => {
    }
  },
  onMaskClick: {
    type: Function,
    default: () => {
    }
  },
  onEscClick: {
    type: Function,
    default: () => {
    }
  }
})

const isDark = computed(() => usePageStore().setting.themeIndex === 1)
const emit = defineEmits(['onPositiveClick', 'onNegativeClick', 'onMaskClick', 'onEscClick'])
const show = ref(true)

const emitEvent = (event) => {
  if (event === 'onPositiveClick') {
    show.value = false
    props.onPositiveClick()
  } else if (event === 'onNegativeClick') {
    show.value = false
    props.onNegativeClick()
  } else if (event === 'onMaskClick') {
    if (props.maskClosable) show.value = false
    props.onMaskClick()
  } else if (event === 'onEsc') {
    if (props.escClosable) show.value = false
    props.onEscClick()
  }
}

const escEvent = event => {
  if (event.key === 'Escape') {
    emitEvent('onEsc')
  }
}

document.addEventListener('keydown', escEvent)
onBeforeUnmount(() => {
  document.removeEventListener('keydown', escEvent)
})

</script>

<template>
  <teleport to="body">
    <div v-if="show" class="fixed top-0 left-0 size-full center z-[998]">
      <div
        class="relative w-[95%] bg-white center flex-col rounded dark:bg-dark-blue sm:w-[30%] z-[1000]">
        <div class="flex flex-row justify-between mt-5 w-[90%] text-[20px]">
          <div class="flex flex-row">
            <Icon
              class="mr-[17px] font-[30px] icon"
              width="30"
              height="30"
              :color="`${
              {
                warn: '#d4a72c',
                success: '#2da44e',
                error: '#fa4549',
                info: `${isDark?'#80ccff':'#0969da'}`
              }[type]
            }`"
              :icon="`lucide:${
            {
              warn: 'triangle-alert',
              success: 'check',
              error: 'x',
              info: 'info'
            }[type]
            }`"
            />
            <div class="flex items-center font-bold dark:text-white">{{ title }}</div>
          </div>
          <div @click="show=false" class="flex items-center w-5 h-5 select-none dark:text-white cursor-pointer">x</div>
        </div>
        <div class="min-h-[50px] w-[90%] flex justify-start items-start my-3 dark:text-white">
          {{ content }}
        </div>
        <div class="flex w-full justify-end items-center mb-5">
          <Button @click="emitEvent('onNegativeClick')" is-toggle-color
                        :color="'#fa454a'"
                        :background="isDark?'#032742':'#fff'"
                        class="w-[100px]">
            {{ negativeText }}
          </Button>
          <Button @click="emitEvent('onPositiveClick')" is-toggle-color
                        :background="isDark?'#032742':'#fff'"
                        class="w-[100px] ml-5 mr-5">
            {{ positiveText }}
          </Button>
        </div>
      </div>
      <div class="mask z-[999]" @click="emitEvent('onMaskClick')" />
    </div>
  </teleport>
</template>
