<script setup>
import { computed, defineEmits, onMounted, ref, watch } from 'vue'
import { usePageStore } from '@/stores/index.js'
import { translatable } from '../assets/translatable/translatable.js'
import { Icon } from '@iconify/vue'
import { get, set } from 'idb-keyval'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  storageKey: {
    type: String,
    required: true
  },
  processText: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])
const lang = computed(() => usePageStore().setting.language)
let fileHandle

// === 文件选择 ===
const loadFile = async () => {
  ;[fileHandle] = await window.showOpenFilePicker()
  const file = await fileHandle.getFile()
  if (file && (file.type === 'application/json' || file.name.endsWith('.json'))) {
    await set(props.storageKey, fileHandle)
    const reader = new FileReader()
    reader.onload = function (e) {
      const fileContent = e.target.result
      try {
        emit('update:modelValue', JSON.parse(fileContent))
      } catch (error) {
        console.error('文件内容不是有效的 JSON 格式！')
      }
    }
    reader.readAsText(file)
  } else {
    fileHandle = undefined
  }
}

// === 拖拽 ===
const isDragOver = ref(false)
const onDragOver = () => (isDragOver.value = true)
const onDragLeave = () => (isDragOver.value = false)

const onDrop = async (event) => {
  isDragOver.value = false
  event.preventDefault()
  const handle = await [...event.dataTransfer.items]
    .filter((item) => item.kind === 'file')[0]
    .getAsFileSystemHandle()

  if (handle.kind === 'file' && (await verifyPermission(handle, true))) {
    fileHandle = handle
    await set(props.storageKey, handle)
    let file = await fileHandle.getFile()
    let text = await file.text()

    try {
      emit('update:modelValue', JSON.parse(text))
    } catch (error) {
      console.error('文件内容不是有效的 JSON 格式！')
    }
  } else {
    fileHandle = undefined
  }
}

// === 权限检查 ===
async function verifyPermission(fileHandle, readWrite) {
  const options = {}
  if (readWrite) {
    options.mode = 'readwrite'
  }
  if ((await fileHandle.queryPermission(options)) === 'granted') {
    return true
  }
  return (await fileHandle.requestPermission(options)) === 'granted'
}

// === 写入文件 ===
const modifyFile = async (data) => {
  if (fileHandle !== undefined && (await verifyPermission(fileHandle, true))) {
    const writable = await fileHandle.createWritable()
    let text
    try {
      if (typeof props.processText === 'function') {
        text = props.processText(data)
      }
      if (typeof text !== 'string') {
        text = JSON.stringify(data, null, 2)
      }
    } catch (err) {
      console.error('processText 执行出错：', err)
      text = JSON.stringify(data, null, 2)
    }
    if (typeof text !== 'string') {
      console.warn('写入文件失败：processText 未返回字符串，将使用 JSON 格式')
      text = JSON.stringify(data, null, 2)
    }

    await writable.write(text)
    await writable.close()
  }
}


// === 初始化 ===
onMounted(async () => {
  fileHandle = await get(props.storageKey)
})

// === 监听 modelValue 自动保存 ===
watch(
  () => props.modelValue,
  (newValue) => {
    modifyFile(newValue)
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <div
    class="flex items-center justify-center border-2 border-dashed rounded cursor-pointer p-8 gap-2 dark:text-white hover:text-text-blue hover:border-text-blue"
    :class="{ 'upload-drag': isDragOver }"
    @click="loadFile"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <slot>
      <Icon width="30" icon="material-symbols:upload" />
      {{ translatable(lang, 'more.chatbox.theme.upload') }}
    </slot>
  </div>
</template>

<style lang="scss" scoped>
.upload-drag {
  border-color: #00c0f5 !important;
  color: #00c0f5 !important;
}
</style>
