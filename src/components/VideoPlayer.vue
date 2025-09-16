<template>
  <Transition enter-active-class="transition-all duration-700 ease-out" enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-500 ease-in"
    leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
    <div class="fixed inset-0 z-50 bg-black flex flex-col">

      <!-- Video container -->

      <div class="flex-1 flex items-center justify-center animate-fade-in-up">
        <div class="w-full h-full relative video-container" @click="showControls">
          <!-- Loading indicator -->
          <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg">
            <div class="text-white text-2xl flex flex-col items-center">
              <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4"></div>
              <div>{{ t('video.loading', 'Loading video...') }}</div>
            </div>
          </div>

          <!-- Error state -->
          <div v-if="hasError" class="absolute inset-0 flex items-center justify-center bg-red-900 rounded-lg">
            <div class="text-white text-2xl text-center">
              <div class="mb-4">⚠️</div>
              <div>{{ t('video.error', 'Error loading video') }}</div>
              <button @click="retryLoad" class="mt-4 px-6 py-2 bg-white text-red-900 rounded hover:bg-gray-200">
                {{ t('video.retry', 'Retry') }}
              </button>
            </div>
          </div>

          <video ref="videoElement" :src="videoUrl" :preload="getOptimalPreloadStrategy" :poster="video?.thumbnail"
            class="w-full h-full rounded-lg shadow-2xl object-cover" :controls="false" :playsinline="true"
            :webkit-playsinline="true" :muted="false" @ended="onVideoEnded" @error="onVideoError"
            @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata" @loadstart="onLoadStart" @canplay="onCanPlay"
            @canplaythrough="onCanPlayThrough" @waiting="onWaiting" @playing="onVideoPlay" @pause="onVideoPause"
            @stalled="onStalled" @suspend="onSuspend" @click="showControls">
            Your browser does not support the video tag.
          </video>

          <!-- Custom Controls -->
          <div class="absolute left-0 right-0 w-full z-10" :class="{ 'brightsign-controls': isEmbeddedDevice }" :style="{
            bottom: '0px',
            opacity: controlsVisible ? 1 : 0,
            transition: 'opacity 0.3s ease',
            position: 'absolute'
          }" @mouseenter="showControls" @mouseleave="hideControls" @touchstart="showControls" @click.stop>
            <!-- Gradient slice on top -->
            <div class="h-10 w-full" style="background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);"></div>
            <!-- Full width shadow background -->
            <div class="py-2" style="background-color: rgba(0,0,0,0.6);">
              <!-- Controls container - 3 column layout -->
              <div class="w-full flex items-center px-8">
                <!-- Left column - back button -->
                <div class="w-1/4 flex justify-start">
                  <button @click="closeVideoPlayer"
                    class="text-white hover:text-gray-300 transition-colors duration-200 text-4xl font-bold"
                    aria-label="Close video player">
                    <Back arrow-color="#4b5563" />
                  </button>
                </div>

                <!-- Center column - controls -->
                <div class="w-1/2 flex items-center justify-center space-x-6">
                  <!-- Play/Pause Button -->
                  <button @click="togglePlayPause"
                    class="text-white hover:text-gray-300 transition-colors duration-200 focus:outline-none flex-shrink-0"
                    :aria-label="isPlaying ? 'Pause video' : 'Play video'">
                    <svg v-if="!isPlaying" class="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <svg v-else class="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
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
                      class="absolute top-1/2 transform -translate-y-1/2 w-12 h-12 bg-transparent rounded-full cursor-pointer"
                      :class="{ 'hover:scale-110 transition-transform duration-200': !isDragging }"
                      :style="{ left: `calc(${progressPercentage}% - 24px)` }"></div>
                  </div>

                  <!-- Timer -->
                  <div class="text-white text-3xl font-mono flex-shrink-0 pl-4">
                    {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
                  </div>
                </div>

                <!-- Right column - empty for balance -->
                <div class="w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <Menu /> -->
    </div>

  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import videosData from '../data/videos.json'
import Back from './Icon/Back.vue'
import { useVideoOptimization } from '../composables/useVideoOptimization'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()

// Video optimization composable
const {
  isBuffering,
  isLoading,
  hasError,
  retryCount,
  isEmbeddedDevice,
  getOptimalPreloadStrategy,
  checkMemoryUsage,
  cleanupVideo,
  setupProgressiveLoading,
  retryWithBackoff,
  resetStates,
  getOptimizationRecommendations
} = useVideoOptimization({
  maxRetries: 3,
  retryDelay: 2000,
  memoryThreshold: 0.8,
  preloadStrategy: 'metadata',
  enableMemoryMonitoring: true,
  enableProgressiveLoading: true
})

const videoElement = ref<HTMLVideoElement | null>(null)
const progressBar = ref<HTMLDivElement | null>(null)

// Video control state
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

// Drag state
const isDragging = ref(false)

// Control visibility state
const controlsVisible = ref(true)
const controlsTimeout = ref<number | null>(null)

// Memory management
const memoryCheckInterval = ref<number | null>(null)
const progressiveLoadingCleanup = ref<(() => void) | null>(null)

// Video loading timeout
const loadingTimeout = ref<number | null>(null)

// Get video ID from route params
const videoId = computed(() => parseInt(route.params.id as string))

// Find the video data
const video = computed(() => {
  return videosData.find(v => v.id === videoId.value)
})

// Get video URL based on current language
const videoUrl = computed(() => {
  if (!video.value) return ''
  const lang = locale.value as 'fr' | 'eus'
  return video.value.urls[lang] || video.value.urls.fr || ''
})

// Progress percentage for progress bar
const progressPercentage = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

// Close video player and go back to videos page
const closeVideoPlayer = () => {
  router.push('/videos')
}

// Handle video end
const onVideoEnded = () => {
  // Optionally close the player when video ends
  // closeVideoPlayer()
}

// Handle video error
const onVideoError = (event: Event) => {
  const video = event.target as HTMLVideoElement
  const error = video.error

  console.error('Video playback error:', {
    error,
    code: error?.code,
    message: error?.message,
    networkState: video.networkState,
    readyState: video.readyState
  })

  hasError.value = true
  isLoading.value = false
  isBuffering.value = false

  // Auto-retry for network errors
  if (retryCount.value < 3) {
    console.log(`Retrying video load (attempt ${retryCount.value + 1})`)
    setTimeout(() => {
      retryLoad()
    }, 2000)
  } else {
    console.error('Max retries reached, video failed to load')
  }
}

// Handle load start
const onLoadStart = () => {
  isLoading.value = true
  hasError.value = false
  console.log('Video load started')

  // Set a timeout for video loading
  if (loadingTimeout.value) {
    clearTimeout(loadingTimeout.value)
  }

  loadingTimeout.value = window.setTimeout(() => {
    if (isLoading.value && !hasError.value) {
      console.warn('Video loading timeout')
      hasError.value = true
      isLoading.value = false
    }
  }, 10000) // 10 second timeout
}

// Handle can play
const onCanPlay = () => {
  console.log('Video can start playing')
  isLoading.value = false
  isBuffering.value = false

  // Clear loading timeout
  if (loadingTimeout.value) {
    clearTimeout(loadingTimeout.value)
    loadingTimeout.value = null
  }
}

// Handle can play through
const onCanPlayThrough = () => {
  console.log('Video can play through without stopping')
  isLoading.value = false
  isBuffering.value = false

  // Clear loading timeout
  if (loadingTimeout.value) {
    clearTimeout(loadingTimeout.value)
    loadingTimeout.value = null
  }
}

// Handle waiting (buffering)
const onWaiting = () => {
  console.log('Video is waiting for data')
  isBuffering.value = true
}

// Handle stalled
const onStalled = () => {
  console.log('Video stalled - trying to recover')
  isBuffering.value = true
}

// Handle suspend
const onSuspend = () => {
  console.log('Video loading suspended')
  // Don't set loading to false here as it might resume
}

// Retry loading video
const retryLoad = async () => {
  const success = await retryWithBackoff(() => {
    if (videoElement.value) {
      videoElement.value.load()
    }
  })

  if (!success) {
    console.error('Max retries reached')
  }
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

// Handle time update
const onTimeUpdate = () => {
  if (!videoElement.value || isDragging.value) return
  currentTime.value = videoElement.value.currentTime
}

// Handle loaded metadata
const onLoadedMetadata = () => {
  if (!videoElement.value) return

  console.log('Video metadata loaded:', {
    duration: videoElement.value.duration,
    videoWidth: videoElement.value.videoWidth,
    videoHeight: videoElement.value.videoHeight,
    readyState: videoElement.value.readyState
  })

  duration.value = videoElement.value.duration || 0
  isPlaying.value = !videoElement.value.paused

  // If duration is still 0 or NaN, try to get it from the video element
  if (!duration.value || isNaN(duration.value)) {
    console.warn('Duration not available, video might not be fully loaded')
  }
}

// Handle video play event
const onVideoPlay = () => {
  isPlaying.value = true
  // Show controls briefly when video starts playing
  showControls()
}

// Handle video pause event
const onVideoPause = () => {
  isPlaying.value = false
  // Keep controls visible when paused
  controlsVisible.value = true
  if (controlsTimeout.value) {
    clearTimeout(controlsTimeout.value)
    controlsTimeout.value = null
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

// Control visibility methods
const showControls = () => {
  controlsVisible.value = true
  if (controlsTimeout.value) {
    clearTimeout(controlsTimeout.value)
    controlsTimeout.value = null
  }

  // Auto-hide controls after 3 seconds on embedded devices
  if (isEmbeddedDevice.value && isPlaying.value) {
    controlsTimeout.value = window.setTimeout(() => {
      controlsVisible.value = false
    }, 3000)
  }
}

const hideControls = () => {
  if (isEmbeddedDevice.value && isPlaying.value) {
    controlsVisible.value = false
  }
}

// Memory management for BrightSign
const handleMemoryCheck = () => {
  const memoryInfo = checkMemoryUsage()
  if (memoryInfo && memoryInfo.isHigh) {
    console.warn('High memory usage detected, attempting cleanup')
    if (videoElement.value) {
      cleanupVideo(videoElement.value)
    }
  }
}

// Watch for video URL changes to reset states
watch(videoUrl, (newUrl) => {
  if (newUrl) {
    resetStates()
    // Force reload the video when URL changes
    if (videoElement.value) {
      videoElement.value.load()
    }
  }
})

// Lifecycle hooks
onMounted(() => {
  // Start memory monitoring
  memoryCheckInterval.value = window.setInterval(handleMemoryCheck, 30000) // Check every 30 seconds

  // Set conservative video settings for BrightSign
  if (videoElement.value) {
    videoElement.value.preload = getOptimalPreloadStrategy.value
    videoElement.value.muted = false
    videoElement.value.playsInline = true

    // Always use custom controls (no native controls)
    videoElement.value.controls = false
    videoElement.value.autoplay = false
    videoElement.value.loop = false

    // Setup progressive loading
    progressiveLoadingCleanup.value = setupProgressiveLoading(videoElement.value) || null

    // Force load the video to get metadata
    if (videoUrl.value) {
      videoElement.value.load()
    }
  }

  // Log optimization recommendations
  const recommendations = getOptimizationRecommendations()
  if (recommendations.length > 0) {
    console.log('Video optimization recommendations:', recommendations)
  }
})

onUnmounted(() => {
  // Cleanup
  if (memoryCheckInterval.value) {
    clearInterval(memoryCheckInterval.value)
  }

  if (progressiveLoadingCleanup.value) {
    progressiveLoadingCleanup.value()
  }

  if (loadingTimeout.value) {
    clearTimeout(loadingTimeout.value)
  }

  if (controlsTimeout.value) {
    clearTimeout(controlsTimeout.value)
  }

  // Clean up video element
  if (videoElement.value) {
    cleanupVideo(videoElement.value)
  }
})

</script>

<style scoped>
/* Ensure the video player takes full screen */
.fixed {
  position: fixed;
}

/* Custom video controls styling if needed */
video {
  outline: none;
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Ensure video container maintains stable dimensions */
.video-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Hide all default video controls and UI elements */
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

/* BrightSign-specific control styling */
.brightsign-controls {
  pointer-events: auto;
  z-index: 1000;
}

.brightsign-controls * {
  pointer-events: auto;
}

/* Ensure controls stay fixed at bottom */
.absolute.left-0.right-0 {
  position: absolute !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  transform: none !important;
}


/* Ensure the video container is responsive */
.max-w-6xl {
  max-width: 72rem;
}

/* Custom animations for staggered entrance */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fadeInDown 0.8s ease-out 0.2s both;
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out 0.4s both;
}
</style>
