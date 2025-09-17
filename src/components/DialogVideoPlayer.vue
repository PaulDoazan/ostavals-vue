<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import Back from './Icon/Back.vue'

interface Props {
  videoUrl: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const videoElement = ref<HTMLVideoElement | null>(null)
const progressBar = ref<HTMLDivElement | null>(null)

// Video control state
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

// Drag state
const isDragging = ref(false)

// Controls are always visible - no visibility state needed

// Progress percentage for progress bar
const progressPercentage = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

// Handle escape key to close modal
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    cleanupVideo()
    emit('close')
  }
}

// Handle close button click
const handleClose = () => {
  cleanupVideo()
  emit('close')
}

// Toggle play/pause
const togglePlayPause = () => {
  if (!videoElement.value) return

  if (isPlaying.value) {
    videoElement.value.pause()
    isPlaying.value = false
  } else {
    videoElement.value.play()
    isPlaying.value = true
  }
}

// Format time for display
const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Seek to specific time when clicking on progress bar
const seekTo = (event: MouseEvent) => {
  if (!videoElement.value || !event.target || isDragging.value) return

  const progressBar = event.currentTarget as HTMLElement
  const rect = progressBar.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = Math.max(0, Math.min(1, clickX / rect.width))
  const newTime = percentage * duration.value

  videoElement.value.currentTime = newTime
  currentTime.value = newTime
}

// Start dragging the progress bar thumb
const startDrag = (event: MouseEvent | TouchEvent) => {
  event.preventDefault()
  isDragging.value = true

  // Pause video when starting to drag
  if (videoElement.value && !videoElement.value.paused) {
    videoElement.value.pause()
    isPlaying.value = false
  }

  // Immediately seek to the mouse position when starting drag
  if (progressBar.value && videoElement.value) {
    const rect = progressBar.value.getBoundingClientRect()
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
    const clickX = clientX - rect.left
    const percentage = Math.max(0, Math.min(1, clickX / rect.width))
    const newTime = percentage * duration.value

    videoElement.value.currentTime = newTime
    currentTime.value = newTime
  }

  let animationFrame: number | null = null
  let hasMoved = false

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging.value || !progressBar.value || !videoElement.value) return

    hasMoved = true

    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
    }

    animationFrame = requestAnimationFrame(() => {
      const rect = progressBar.value!.getBoundingClientRect()
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clickX = clientX - rect.left
      const percentage = Math.max(0, Math.min(1, clickX / rect.width))
      const newTime = percentage * duration.value

      videoElement.value!.currentTime = newTime
      currentTime.value = newTime
    })
  }

  const handleEnd = (e: MouseEvent | TouchEvent) => {
    isDragging.value = false

    // If no movement occurred, treat it as a click
    if (!hasMoved) {
      seekTo(e as MouseEvent)
    }

    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
    }
    document.removeEventListener('mousemove', handleMove)
    document.removeEventListener('mouseup', handleEnd)
    document.removeEventListener('touchmove', handleMove)
    document.removeEventListener('touchend', handleEnd)
  }

  document.addEventListener('mousemove', handleMove)
  document.addEventListener('mouseup', handleEnd)
  document.addEventListener('touchmove', handleMove)
  document.addEventListener('touchend', handleEnd)
}

// Handle time update
const onTimeUpdate = () => {
  if (!videoElement.value || isDragging.value) return
  currentTime.value = videoElement.value.currentTime
}

// Handle loaded metadata
const onLoadedMetadata = () => {
  if (!videoElement.value) return
  duration.value = videoElement.value.duration || 0
  isPlaying.value = !videoElement.value.paused
}

// Handle video play event
const onVideoPlay = () => {
  isPlaying.value = true
}

// Handle video pause event
const onVideoPause = () => {
  isPlaying.value = false
}

// Clean up video element properly
const cleanupVideo = () => {
  if (videoElement.value) {
    // Pause the video
    videoElement.value.pause()

    // Reset video properties
    videoElement.value.currentTime = 0
    videoElement.value.src = ''
    videoElement.value.load()

    // Reset state
    isPlaying.value = false
    currentTime.value = 0
    duration.value = 0
  }
}

// Watch for video URL changes to clean up previous video
watch(() => props.videoUrl, (newUrl, oldUrl) => {
  if (oldUrl && newUrl !== oldUrl) {
    cleanupVideo()
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)

  // Clean up video element when component is unmounted
  cleanupVideo()
})
</script>

<template>
  <div class="relative w-full">
    <!-- Video container -->
    <div class="aspect-video bg-black rounded-lg overflow-hidden">
      <video ref="videoElement" :src="videoUrl" class="w-full h-full object-cover" preload="metadata"
        :playsinline="true" :webkit-playsinline="true" @click.stop @timeupdate="onTimeUpdate"
        @loadedmetadata="onLoadedMetadata" @play="onVideoPlay" @pause="onVideoPause">
        Your browser does not support the video tag.
      </video>
    </div>

    <!-- Custom Controls - positioned at bottom of screen -->
    <div class="fixed left-0 right-0 w-full z-50" :style="{
      bottom: '0px',
      position: 'fixed',
    }" @click.stop>
      <!-- Full width shadow background -->
      <div class="py-4 px-6 bg-gray-900 shadow-lg">
        <!-- Controls container - 3 column layout -->
        <div class="w-full flex items-center">
          <!-- Left column - close button -->
          <div class="w-1/4 flex justify-start">
            <button @click="handleClose"
              class="text-white hover:text-gray-300 transition-colors duration-200 text-2xl font-bold"
              aria-label="Close video player">
              <Back arrow-color="#4b5563" />
            </button>
          </div>

          <!-- Center column - controls -->
          <div class="w-1/2 flex items-center justify-center space-x-4">
            <!-- Play/Pause Button -->
            <button @click="togglePlayPause"
              class="text-white hover:text-gray-300 transition-colors duration-200 focus:outline-none flex-shrink-0"
              :aria-label="isPlaying ? 'Pause video' : 'Play video'">
              <svg v-if="!isPlaying" class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <svg v-else class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            </button>

            <!-- Progress Bar -->
            <div class="flex-1 relative h-2 bg-gray-600 rounded-full cursor-pointer" @click="seekTo"
              @mousedown="startDrag" @touchstart="startDrag" ref="progressBar">
              <div class="absolute top-0 left-0 h-full bg-white rounded-full"
                :style="{ width: progressPercentage + '%' }"></div>
              <!-- Draggable thumb -->
              <div
                class="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-transparent rounded-full cursor-pointer"
                :class="{
                  'hover:scale-110 transition-transform duration-200': !isDragging,
                }" :style="{ left: `calc(${progressPercentage}% - 12px)` }"></div>
            </div>

            <!-- Timer -->
            <div class="text-white text-lg font-mono flex-shrink-0 pl-4">
              {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
            </div>
          </div>

          <!-- Right column - empty for balance -->
          <div class="w-1/4"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hide default video controls */
video::-webkit-media-controls {
  display: none !important;
}

video::-webkit-media-controls-panel {
  display: none !important;
}

video::-webkit-media-controls-play-button {
  display: none !important;
}

video::-webkit-media-controls-timeline {
  display: none !important;
}

video::-webkit-media-controls-current-time-display {
  display: none !important;
}

video::-webkit-media-controls-time-remaining-display {
  display: none !important;
}

video::-webkit-media-controls-mute-button {
  display: none !important;
}

video::-webkit-media-controls-volume-slider {
  display: none !important;
}

video::-webkit-media-controls-fullscreen-button {
  display: none !important;
}

video::-webkit-media-controls-overlay-play-button {
  display: none !important;
}

/* Hide controls for other browsers */
video::-moz-media-controls {
  display: none !important;
}

video::-ms-media-controls {
  display: none !important;
}

/* Ensure no default controls appear */
video[controls] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

/* Ensure controls are properly positioned at bottom of screen */
.fixed.left-0.right-0 {
  position: fixed !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  transform: none !important;
}

/* Video container styling */
video {
  outline: none;
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>