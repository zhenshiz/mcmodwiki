<template>
    <router-view></router-view>
</template>
<script setup>
import { watch } from 'vue'
import { usePageStore } from '@/stores/index.js'
const pageStore = usePageStore()
watch(() => pageStore.isDark, dark => document.body.classList.toggle('dark', dark), { immediate: true })
</script>
<style lang="scss">
@use "assets/css/theme.css";
@use "assets/css/main.css";
@use "assets/css/dark";
@use "assets/css/light";
</style>
