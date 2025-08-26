<template>
  <div class="bg-gray-300 animate-pulse rounded-lg" :style="skeletonStyle">
    <!-- Simple grey background with pulse effect -->
    <div class="w-full h-full bg-gray-300"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  width?: string | number
  height?: string | number
  aspectRatio?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '100%',
  aspectRatio: 'auto'
})

const skeletonStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  aspectRatio: props.aspectRatio
}))
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}
</style>
