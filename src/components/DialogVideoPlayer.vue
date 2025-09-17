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

// Loading and thumbnail state
const isLoading = ref(true)
const hasStartedPlaying = ref(false)
const thumbnailUrl = ref('')

// Drag state
const isDragging = ref(false)
const dragTime = ref(0) // Time position during drag (visual only)
const isSeeking = ref(false) // Flag to prevent timeupdate from overriding seek

// Controls are always visible - no visibility state needed

// Progress percentage for progress bar
const progressPercentage = computed(() => {
  if (duration.value === 0) return 0
  // Use dragTime when dragging, otherwise use currentTime
  const time = isDragging.value ? dragTime.value : currentTime.value
  return (time / duration.value) * 100
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

  isSeeking.value = true
  videoElement.value.currentTime = newTime
  currentTime.value = newTime

  // Wait for the video to actually seek before allowing timeupdate to resume
  const checkSeekComplete = () => {
    if (Math.abs(videoElement.value!.currentTime - newTime) < 0.1) {
      isSeeking.value = false
    } else {
      setTimeout(checkSeekComplete, 50)
    }
  }

  // Fallback timeout in case seek doesn't complete
  setTimeout(() => {
    isSeeking.value = false
  }, 500)

  // Check if seek completed
  setTimeout(checkSeekComplete, 50)
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

  // Set initial drag position (visual only, don't update video yet)
  if (progressBar.value) {
    const rect = progressBar.value.getBoundingClientRect()
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
    const clickX = clientX - rect.left
    const percentage = Math.max(0, Math.min(1, clickX / rect.width))
    const newTime = percentage * duration.value

    dragTime.value = newTime
  }

  let animationFrame: number | null = null
  let hasMoved = false

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging.value || !progressBar.value) return

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

      // Only update dragTime (visual), don't update video yet
      dragTime.value = newTime
    })
  }

  const handleEnd = (e: MouseEvent | TouchEvent) => {
    isDragging.value = false

    // If no movement occurred, treat it as a click
    if (!hasMoved) {
      seekTo(e as MouseEvent)
    } else {
      // If we were dragging, now update the video to the final position
      if (videoElement.value) {
        videoElement.value.currentTime = dragTime.value
        currentTime.value = dragTime.value
      }
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
  if (!videoElement.value || isDragging.value || isSeeking.value) return
  currentTime.value = videoElement.value.currentTime
}

// Handle loaded metadata
const onLoadedMetadata = () => {
  if (!videoElement.value) return
  duration.value = videoElement.value.duration || 0
  isPlaying.value = !videoElement.value.paused

  // Generate thumbnail after metadata is loaded
  generateThumbnail()
}

// Handle video play event
const onVideoPlay = () => {
  isPlaying.value = true
}

// Handle video pause event
const onVideoPause = () => {
  isPlaying.value = false
}

// Handle video load start
const onLoadStart = () => {
  isLoading.value = true
  hasStartedPlaying.value = false
}

// Handle video can play
const onCanPlay = () => {
  isLoading.value = false
}

// Handle video first play
const onFirstPlay = () => {
  hasStartedPlaying.value = true
}

// Generate thumbnail from video
const generateThumbnail = () => {
  if (!videoElement.value) return

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Get video dimensions
  const videoWidth = videoElement.value.videoWidth || 1920
  const videoHeight = videoElement.value.videoHeight || 1080

  // Apply the same scaling as the video (scaleX 1.13)
  const scaleX = 1.13
  canvas.width = Math.round(videoWidth * scaleX)
  canvas.height = videoHeight

  // Seek to 1 second or 10% of duration, whichever is smaller
  const seekTime = Math.min(1, (duration.value || 0) * 0.1)
  videoElement.value.currentTime = seekTime

  videoElement.value.addEventListener('seeked', () => {
    // Apply the same transform as the video
    ctx.save()
    ctx.scale(scaleX, 1)
    ctx.drawImage(videoElement.value!, 0, 0, videoWidth, videoHeight)
    ctx.restore()
    thumbnailUrl.value = canvas.toDataURL('image/jpeg', 0.8)
  }, { once: true })
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
    isLoading.value = true
    hasStartedPlaying.value = false
    thumbnailUrl.value = ''
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
  <div class="relative w-screen flex flex-col fixed top-0 left-0 right-0 z-40 fullscreen-video"
    style="height: calc(100vh - 120px);">
    <!-- Video container -->
    <div class="flex-1 bg-black overflow-hidden video-container relative">
      <!-- Thumbnail overlay -->
      <div v-if="!hasStartedPlaying && thumbnailUrl"
        class="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-10"
        :style="{ backgroundImage: `url(${thumbnailUrl})` }">
      </div>

      <!-- Loading overlay -->
      <div v-if="isLoading"
        class="absolute inset-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-20">
        <div class="text-white text-center">
          <!-- Loading spinner -->
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <div class="text-xl">Loading video...</div>
        </div>
      </div>

      <video ref="videoElement" :src="videoUrl" class="w-full h-full" preload="metadata" :playsinline="true"
        :webkit-playsinline="true" @click.stop @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata"
        @play="onVideoPlay" @pause="onVideoPause" @loadstart="onLoadStart" @canplay="onCanPlay"
        @play.once="onFirstPlay">
        Your browser does not support the video tag.
      </video>
    </div>

    <!-- Custom Controls - positioned at bottom of screen -->
    <div class="w-full z-50 fixed bottom-0 left-0 right-0" @click.stop>
      <!-- Full width shadow background -->
      <div class="py-4 px-6 bg-gray-900 shadow-lg">
        <!-- Controls container - 3 column layout -->
        <div class="w-full flex items-center">
          <!-- Left column - close button -->
          <div class="w-1/4 flex justify-start">
            <div @click="handleClose" class="text-white text-2xl font-bold bg-transparent border-none p-0">
              <Back arrow-color="#4b5563" />
            </div>
          </div>

          <!-- Center column - controls -->
          <div class="w-1/2 flex items-center justify-center space-x-4">
            <!-- Play/Pause Button -->
            <div @click="togglePlayPause"
              class="text-white focus:outline-none flex-shrink-0 bg-transparent border-none p-0"
              :aria-label="isPlaying ? 'Pause video' : 'Play video'">
              <svg v-if="!isPlaying" class="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <svg v-else class="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            </div>

            <!-- Progress Bar -->
            <div class="flex-1 relative h-6 bg-gray-600 rounded-full cursor-pointer progress-bar-container"
              @click="seekTo" @mousedown="startDrag" @touchstart="startDrag" ref="progressBar">
              <div class="absolute top-0 left-0 h-full bg-white progress-bar-fill"
                :style="{ width: progressPercentage + '%' }"></div>
              <!-- Draggable thumb -->
              <div
                class="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-transparent rounded-full cursor-pointer"
                :class="{
                  'hover:scale-110 transition-transform duration-200': !isDragging,
                }" :style="{ left: `calc(${progressPercentage}% - 12px)` }"></div>
            </div>

            <!-- Timer -->
            <div class="text-white text-4xl font-mono flex-shrink-0 pl-4">
              {{ formatTime(isDragging ? dragTime : currentTime) }} / {{ formatTime(duration) }}
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

/* Video container styling for full height and width */
.video-container {
  height: calc(100vh - 120px);
  min-height: 0;
  width: 100vw;
}

/* Ensure full screen coverage */
.fullscreen-video {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: calc(100vh - 120px);
  z-index: 40;
}

/* Video container styling */
video {
  outline: none;
  position: relative;
  width: 100%;
  height: 100%;
  transform: scaleX(1.13) !important;
  transform-origin: center !important;
}

/* BrightSign button styling fixes */
button {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
  outline: none !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
}

button:focus {
  outline: none !important;
  box-shadow: none !important;
}

button:hover {
  background: transparent !important;
}

button:active {
  background: transparent !important;
}

/* Progress bar styling fixes */
.progress-bar-container {
  overflow: hidden;
  border-radius: 9999px;
}

.progress-bar-fill {
  border-radius: 9999px;
  min-width: 0;
}

/* Ensure proper masking for small progress values */
.progress-bar-fill::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  border-radius: inherit;
}
</style>