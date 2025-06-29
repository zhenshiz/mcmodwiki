<template>
  <DndProvider :backend="HTML5Backend">
    <router-view></router-view>
  </DndProvider>
</template>
<script setup>
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'vue3-dnd'
</script>
<style lang="scss">
@use '@/assets/css/theme.css';
@use "@/assets/css/editor/content/light";
@use "@/assets/css/editor/content/dark";
</style>
