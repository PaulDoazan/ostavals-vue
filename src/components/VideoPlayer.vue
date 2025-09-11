<template>
  <Transition enter-active-class="transition-all duration-700 ease-out" enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-500 ease-in"
    leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
    <div class="fixed inset-0 z-50 bg-black flex flex-col">

      <!-- Video container -->

      <div class="flex-1 flex items-center justify-center animate-fade-in-up">
        <div class="w-full relative">
          <video ref="videoElement" :src="videoUrl" autoplay class="w-full h-full rounded-lg shadow-2xl"
            @ended="onVideoEnded" @error="onVideoError" @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata"
            @play="onVideoPlay" @pause="onVideoPause">
            Your browser does not support the video tag.
          </video>

          <!-- Custom Controls -->
          <div class="absolute bottom-0 left-0 right-0 w-full">
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
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import videosData from '../data/videos.json'
import Back from './Icon/Back.vue'

const route = useRoute()
const router = useRouter()
const { locale } = useI18n()

const videoElement = ref<HTMLVideoElement | null>(null)
const progressBar = ref<HTMLDivElement | null>(null)

// Video control state
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

// Drag state
const isDragging = ref(false)

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
  console.error('Video playback error:', event)
  // You could show an error message here
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
  duration.value = videoElement.value.duration
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
