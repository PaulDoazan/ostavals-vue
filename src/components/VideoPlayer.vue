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
            class="w-full h-full rounded-lg shadow-2xl object-cover" controls :playsinline="true"
            :webkit-playsinline="true" :muted="false" @ended="onVideoEnded" @error="onVideoError"
            @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata" @loadstart="onLoadStart" @canplay="onCanPlay"
            @canplaythrough="onCanPlayThrough" @waiting="onWaiting" @playing="onVideoPlay" @pause="onVideoPause"
            @stalled="onStalled" @suspend="onSuspend">
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
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import videosData from '../data/videos.json'
import { useVideoOptimization } from '../composables/useVideoOptimization'

const route = useRoute()
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

  // Debug logging for BrightSign
  if (isEmbeddedDevice.value) {
    console.log('Video playing on BrightSign - controls should be visible:', controlsVisible.value)
  }
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




// Control visibility methods
const showControls = () => {
  controlsVisible.value = true
  if (controlsTimeout.value) {
    clearTimeout(controlsTimeout.value)
    controlsTimeout.value = null
  }

  // Auto-hide controls after 5 seconds on embedded devices (longer timeout)
  if (isEmbeddedDevice.value && isPlaying.value) {
    controlsTimeout.value = window.setTimeout(() => {
      controlsVisible.value = false
    }, 5000)
  }
}

const hideControls = () => {
  // Don't hide controls on embedded devices when mouse leaves
  // Only hide on regular browsers
  if (!isEmbeddedDevice.value && isPlaying.value) {
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

    // Use native browser controls
    videoElement.value.controls = true
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

  // Initialize controls visibility for embedded devices
  if (isEmbeddedDevice.value) {
    controlsVisible.value = true
    console.log('BrightSign device detected - controls will remain visible')
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
