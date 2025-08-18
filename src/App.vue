<script setup lang="ts">
import IdleScreen from './components/IdleScreen.vue'
</script>

<template>
  <div class="w-screen h-screen" :style="{ backgroundColor: 'rgb(var(--v-theme-background))' }">
    <IdleScreen />
  </div>
</template>