<template>
  <Transition enter-active-class="transition-all duration-700 ease-out" enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-500 ease-in"
    leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
    <div class="fixed inset-0 z-50 bg-black flex flex-col">
      <!-- Header with title and close button -->
      <div class="absolute top-8 left-20 right-20 z-10 flex justify-between items-center animate-fade-in-down">
        <button @click="closeVideoPlayer"
          class="text-white hover:text-gray-300 transition-colors duration-200 text-4xl font-bold"
          aria-label="Close video player">
          <Back />
        </button>
      </div>

      <!-- Video container -->

      <div class="flex-1 flex items-center justify-center animate-fade-in-up">
        <div class="w-full relative">
          <video ref="videoElement" :src="videoUrl" autoplay class="w-full h-full rounded-lg shadow-2xl"
            @ended="onVideoEnded" @error="onVideoError" @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata">
            Your browser does not support the video tag.
          </video>

          <!-- Custom Controls -->
          <div class="absolute bottom-0 left-0 right-0 w-full">
            <!-- Gradient slice on top -->
            <div class="h-10 w-full" style="background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);"></div>
            <!-- Full width shadow background -->
            <div class="py-10" style="background-color: rgba(0,0,0,0.6);">
              <!-- Controls container - half width, centered -->
              <div class="w-1/2 mx-auto flex items-center space-x-4 px-4">
                <!-- Play/Pause Button -->
                <button @click="togglePlayPause"
                  class="text-white hover:text-gray-300 transition-colors duration-200 focus:outline-none flex-shrink-0"
                  :aria-label="isPlaying ? 'Pause video' : 'Play video'">
                  <svg v-if="!isPlaying" class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <svg v-else class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                </button>

                <!-- Progress Bar -->
                <div class="flex-1 relative h-2 bg-gray-600 rounded-full cursor-pointer" @click="seekTo">
                  <div class="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-200"
                    :style="{ width: progressPercentage + '%' }"></div>
                </div>

                <!-- Timer -->
                <div class="text-white text-sm font-mono flex-shrink-0">
                  {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
                </div>
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

// Video control state
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

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
  } else {
    videoElement.value.play()
  }
}

// Handle time update
const onTimeUpdate = () => {
  if (!videoElement.value) return
  currentTime.value = videoElement.value.currentTime
}

// Handle loaded metadata
const onLoadedMetadata = () => {
  if (!videoElement.value) return
  duration.value = videoElement.value.duration
  isPlaying.value = !videoElement.value.paused
}

// Format time for display
const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Seek to specific time when clicking on progress bar
const seekTo = (event: MouseEvent) => {
  if (!videoElement.value || !event.target) return

  const progressBar = event.currentTarget as HTMLElement
  const rect = progressBar.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = clickX / rect.width
  const newTime = percentage * duration.value

  videoElement.value.currentTime = newTime
  currentTime.value = newTime
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
