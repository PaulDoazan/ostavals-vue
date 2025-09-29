<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

const videoElement = ref<HTMLVideoElement | null>(null)

// Clean up video element properly for BrightSign devices
const cleanupVideo = () => {
  if (videoElement.value) {
    // Pause the video
    videoElement.value.pause()

    // Reset video properties
    videoElement.value.currentTime = 0
    videoElement.value.src = ''
    videoElement.value.load()
  }
}

onUnmounted(() => {
  // Clean up video element when component is unmounted
  cleanupVideo()
})
</script>

<template>
  <div class="w-screen h-screen flex items-center justify-center">
    <video ref="videoElement" src="/videos/idle.mp4" autoplay muted loop playsinline preload="auto" webkit-playsinline
      class="w-screen h-screen object-cover" />
  </div>
</template>