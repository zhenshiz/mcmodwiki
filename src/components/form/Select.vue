<script setup>
import { computed, ref } from 'vue'
import Popover from '@/components/Popover.vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
    // 双向绑定的值
    modelValue: {
        type: [String, Number, Boolean, Object],
        default: ''
    },
    // 选项列表
    options: {
        type: Array,
        default: () => []
    },
    // 占位符
    placeholder: {
        type: String,
        default: '请选择'
    },
    // 是否禁用
    disabled: {
        type: Boolean,
        default: false
    },
    // 宽度
    width: {
        type: String,
        default: '100%'
    },
    // 🔥 新增参数：是否忽略大小写，默认 true
    ignoreCase: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['update:modelValue', 'change'])

// 控制 Popover 显示
const isOpen = ref(false)

const isValueMatch = (val1, val2) => {
    if (val1 === val2) return true // 严格相等直接返回

    if (!props.ignoreCase) return false

    const str1 = String(val1 || '').toLowerCase()
    const str2 = String(val2 || '').toLowerCase()

    return str1 === str2
}

const selectedOption = computed(() => {
    return props.options.find(opt => isValueMatch(opt.value, props.modelValue))
})

// 处理选择
const handleSelect = (option) => {
    if (props.disabled) return
    emit('update:modelValue', option.value)
    emit('change', option.value)
    isOpen.value = false
}
</script>

<template>
    <Popover placement="bottom-start" trigger="click" :offset="4" class="w-full" v-model:isOpen="isOpen">
        <template #trigger>
            <div class="
          relative flex items-center justify-between
          px-3 py-2 rounded border cursor-pointer select-none transition-colors
          bg-white border-gray-200 text-gray-700
          hover:border-blue-400
          dark:bg-[#051e2f] dark:border-dark-blue dark:text-gray-200 dark:hover:border-blue-500
        " :class="{
            'opacity-60 cursor-not-allowed': disabled,
            'border-blue-500 ring-1 ring-blue-500/20': isOpen
        }" :style="{ width: width }">
                <div class="flex items-center gap-2 overflow-hidden">
                    <img v-if="selectedOption?.icon" :src="selectedOption.icon" class="w-5 h-5 object-contain"
                        alt="icon" />

                    <span class="truncate" :class="{ 'text-gray-400 dark:text-gray-500': !selectedOption }">
                        {{ selectedOption ? selectedOption.label : placeholder }}
                    </span>
                </div>

                <Icon icon="lucide:chevron-down"
                    class="w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0"
                    :class="{ 'rotate-180': isOpen }" />
            </div>
        </template>

        <div class="max-h-[250px] overflow-y-auto custom-scrollbar -m-2 p-1 min-w-[120px]"
            :style="{ width: width === '100%' ? 'auto' : width }">
            <template v-if="options.length > 0">
                <div v-for="item in options" :key="item.value" class="
            flex items-center gap-2 px-2 py-2 rounded cursor-pointer transition-colors text-sm
            hover:bg-blue-50 dark:hover:bg-slate-700
          " :class="{
            'text-blue-500 font-medium bg-blue-50 dark:bg-slate-800': isValueMatch(modelValue, item.value),
            'text-gray-700 dark:text-gray-200': !isValueMatch(modelValue, item.value)
        }" @click="handleSelect(item)">

                    <img v-if="item.icon" :src="item.icon" class="w-5 h-5 object-contain" alt="icon" />

                    <span class="flex-1 truncate">{{ item.label }}</span>

                    <Icon v-if="isValueMatch(modelValue, item.value)" icon="lucide:check"
                        class="w-4 h-4 text-blue-500" />
                </div>
            </template>

          <div v-else class="text-center text-gray-400 py-3 text-sm">{{ t('暂无数据') }}</div>
        </div>
    </Popover>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 2px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
}
</style>
