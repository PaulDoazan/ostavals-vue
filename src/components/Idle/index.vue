<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

const videoElement = ref<HTMLVideoElement | null>(null)
const isVideoLoaded = ref(false)
const hasError = ref(false)

// Handle click to exit idle screen
const handleClick = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()

  // Emit event to parent component to hide idle screen
  emit('click')
}

// Handle video loaded
const onVideoLoaded = () => {
  isVideoLoaded.value = true
  hasError.value = false
}

// Handle video error
const onVideoError = (event: Event) => {
  console.error('Idle video playback error:', event)
  hasError.value = true
  isVideoLoaded.value = false
}

// Handle video can play
const onVideoCanPlay = () => {
  if (videoElement.value) {
    // For BrightSign compatibility, ensure video is ready before playing
    videoElement.value.play().catch(error => {
      console.error('Error playing idle video:', error)
      hasError.value = true
    })
  }
}

// Handle video load start
const onVideoLoadStart = () => {
  console.log('Idle video load started')
}

// Handle video waiting (buffering)
const onVideoWaiting = () => {
  console.log('Idle video is buffering')
}

// Cleanup video when component unmounts
onUnmounted(() => {
  if (videoElement.value) {
    videoElement.value.pause()
    videoElement.value.src = ''
    videoElement.value.load()
  }
})

// Emit click event to parent
const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <div class="w-screen h-screen flex items-center justify-center cursor-pointer" @click="handleClick">
    <video ref="videoElement" src="/videos/idle.mp4" autoplay muted loop playsinline preload="auto" webkit-playsinline
      class="w-screen h-screen object-cover" @loadeddata="onVideoLoaded" @error="onVideoError" @canplay="onVideoCanPlay"
      @loadstart="onVideoLoadStart" @waiting="onVideoWaiting" />

    <!-- Fallback content if video fails to load -->
    <div v-if="hasError" class="absolute inset-0 flex items-center justify-center bg-gray-900 text-white text-4xl">
      <div class="text-center">
        <p>Click to continue</p>
        <p class="text-2xl mt-4 opacity-75">Tap anywhere on screen</p>
      </div>
    </div>
  </div>
</template>