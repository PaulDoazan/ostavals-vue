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
        <div class="w-full">
          <video ref="videoElement" :src="videoUrl" controls autoplay class="w-full h-full rounded-lg shadow-2xl"
            @ended="onVideoEnded" @error="onVideoError">
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Menu from './Menu/index.vue'
import videosData from '../data/videos.json'
import Back from './Icon/Back.vue'

const route = useRoute()
const router = useRouter()
const { locale } = useI18n()

const videoElement = ref<HTMLVideoElement | null>(null)

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

// Get video title based on current language
const videoTitle = computed(() => {
  if (!video.value) return ''
  const lang = locale.value as 'fr' | 'eus'
  return video.value.title[lang] || video.value.title.fr || ''
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

</script>

<style scoped>
/* Ensure the video player takes full screen */
.fixed {
  position: fixed;
}

/* Custom video controls styling if needed */
video {
  outline: none;
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
