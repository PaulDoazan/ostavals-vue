<script setup lang="ts">
import IdleScreen from './components/Idle/index.vue'
import { ref } from 'vue';

const showIdleScreen = ref(true)
</script>

<template>
  <div class="bg-background">
    <IdleScreen v-if="showIdleScreen" @click="showIdleScreen = false" />
    <router-view v-else />
  </div>
</template>