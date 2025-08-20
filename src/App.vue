<script setup lang="ts">
import IdleScreen from './components/IdleScreen.vue'
import Home from './components/Home.vue'
import { ref } from 'vue';

const showIdleScreen = ref(false)
</script>

<template>
  <div class="bg-background">
    <IdleScreen v-if="showIdleScreen" @click="showIdleScreen = false" />
    <Home v-else />
    <!-- <Menu /> -->
  </div>
</template>