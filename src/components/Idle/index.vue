<script setup lang="ts">
import { ref, onUnmounted, onBeforeUnmount } from 'vue'

const videoElement = ref<HTMLVideoElement | null>(null)

// Define emits for parent communication
const emit = defineEmits<{
  exit: []
}>()

// Clean up video element properly for BrightSign devices
const cleanupVideo = () => {
  if (videoElement.value) {
    // Pause the video first
    videoElement.value.pause()

    // Remove all event listeners to prevent memory leaks
    videoElement.value.removeAttribute('src')
    videoElement.value.load()

    // Clear the video source completely
    videoElement.value.src = ''
    videoElement.value.currentTime = 0

    // Force a reload to clear any cached video data
    videoElement.value.load()

    // Additional cleanup for BrightSign devices
    videoElement.value.remove()
  }
}

// Handle click to exit idle screen
const handleClick = () => {
  // Clean up video before emitting exit event
  cleanupVideo()

  // Emit exit event to parent (App.vue)
  emit('exit')
}

onBeforeUnmount(() => {
  // Clean up video element before component is unmounted
  cleanupVideo()
})

onUnmounted(() => {
  // Additional cleanup when component is unmounted
  cleanupVideo()
})
</script>

<template>
  <div class="w-screen h-screen flex items-center justify-center" @click="handleClick">
    <video ref="videoElement" src="/videos/idle.mp4" autoplay muted loop playsinline preload="auto" webkit-playsinline
      class="w-screen h-screen object-cover" />
  </div>
</template>