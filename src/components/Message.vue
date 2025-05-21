<script setup>
import 'animate.css'
import { Icon } from '@iconify/vue'

const props = defineProps({
  message: String,
  //'warn' | 'success' | 'error' | 'info'
  type: {
    type: String,
    default: 'info'
  },
  //是否为富文本
  isRichText: {
    type: Boolean,
    default: false
  }
})

const messageClassMap = {
  warn: 'animate__animated animate__headShake',
  success: 'animate__animated animate__bounceInDown',
  error: 'animate__animated animate__tada',
  info: 'animate__animated animate__bounce'
}
const messageClass = computed(
  () => `${messageClassMap[props.type]} ${props.type}`
)
</script>

<template>
  <div class="fixed top-[100px] mx-auto my-0 left-0 right-0 w-full flex z-[9999]">
    <div class="rounded mx-auto my-0 py-[1vh] px-[10vw] bg-white dark:bg-dark-blue center flex-row"
         :class="messageClass">
      <Icon
        class="mr-[17px] font-[30px] icon"
        :icon="`lucide:${
          {
            warn: 'triangle-alert',
            success: 'check',
            error: 'x',
            info: 'info'
          }[type]
        }`"
      />

      <span v-if="!isRichText" class="center flex-col break-all dark:text-white">{{ message }}</span>
      <span v-if="isRichText" class="center flex-col dark:text-white" v-html="message" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.warn {
  border: 1px solid #d4a72c;

  .icon {
    color: #d4a72c;
  }
}

.success {
  border: 1px solid #2da44e;

  .icon {
    color: #2da44e;
  }
}

.error {
  border: 1px solid #fa4549;

  .icon {
    color: #fa4549;
  }
}

.info {
  border: 1px solid var(--blue-5);

  .icon {
    color: var(--blue-5);
  }
}
</style>
