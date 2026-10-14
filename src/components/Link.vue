<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  href: {
    type: String
  },
  isRouter: {
    type: Boolean,
    default: true
  },
  //none | normal | toLeft | toRight | toCenter | toFlanks
  hoverLineType: {
    type: String,
    default: 'none',
    validator(value) {
      return ['none', 'normal', 'toLeft', 'toRight', 'toCenter', 'toFlanks'].includes(value)
    }
  },
  lineColor: {
    type: String,
    default: 'rgb(var(--ui-link))'
  }
})

const emit = defineEmits(['callback'])

const goto = () => {
  props.isRouter ? router.push(props.href) : window.open(props.href)
  emit('callback')
}
</script>

<template>
  <a class="center cursor-pointer relative before-line after-line"
       :href="href" :class="hoverLineType" @click.prevent="goto">
    <slot></slot>
  </a>
</template>

<style scoped lang="scss">
.normal {
  &::before {
    background: v-bind(lineColor);
    right: 0;
    transition: none;
  }

  &:hover::before {
    width: 100%;
  }
}

.toLeft {
  &::before {
    background: v-bind(lineColor);
    right: 0;
  }

  &:hover::before {
    width: 100%;
  }
}

.toRight {
  &::before {
    background: v-bind(lineColor);
    left: 0;
  }

  &:hover::before {
    width: 100%;
  }
}

.toCenter {
  &::after {
    background: v-bind(lineColor);
    left: 0;
  }

  &::before {
    background: v-bind(lineColor);
    right: 0;
  }

  &:hover::before,
  &:hover::after {
    width: 50%;
  }
}

.toFlanks {
  &::before {
    background: v-bind(lineColor);
    left: 50%;
    transform: translateX(-50%);
  }

  &:hover::before {
    width: 100%;
  }
}
</style>

