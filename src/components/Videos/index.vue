<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'
import Menu from '../Menu/index.vue'
import NavigationArrows from '../NavigationArrows.vue'
import videosData from '../../data/videos.json'
import type { VideoItem } from '../../types/videos'
import PlayBtn from '../Icon/PlayBtn.vue'
import TruncatedVideoPlayer from '../DialogVideoPlayer.vue'
import { useGlobalIdle } from '../../composables/useGlobalIdle'

const { t, locale } = useI18n()
const videos = ref<VideoItem[]>(videosData)

// Global idle manager
const { resetIdleTimer } = useGlobalIdle()

// Language state for each video
const videoLanguages = ref<Record<number, 'fr' | 'eus'>>({})

// Dialog state
const isDialogOpen = ref(false)
const selectedVideo = ref<VideoItem | null>(null)

// Pagination logic
const currentPage = ref(0)
const itemsPerPage = 3
const totalPages = Math.ceil(videos.value.length / itemsPerPage)

// Get current page items
const currentPageItems = computed(() => {
  const start = currentPage.value * itemsPerPage
  const end = start + itemsPerPage
  return videos.value.slice(start, end)
})

// Get the current language for a video (defaults to global locale)
const getVideoLanguage = (videoId: number): 'fr' | 'eus' => {
  return videoLanguages.value[videoId] || locale.value
}

// Toggle language for a specific video
const toggleVideoLanguage = (videoId: number) => {
  const currentLang = getVideoLanguage(videoId)
  videoLanguages.value[videoId] = currentLang === 'fr' ? 'eus' : 'fr'
}

// Check if specific language icon exists
const hasLanguageIcon = (video: VideoItem, language: 'fr' | 'eus'): boolean => {
  const iconToCheck = language === 'fr' ? 'fr' : 'eus-sub'
  return video.icons.includes(iconToCheck)
}

// Calculate the number of lines a title will take (rough estimation based on character count)
const getTitleLines = (title: string): number => {
  // Based on the font size (28px) and container width, ~42 characters per line
  if (title.length < 42) return 1
  if (title.length < 84) return 2
  return 3
}

// Get max lines across all three videos on current page to align them
// Returns the height in pixels for the title container
const getMaxLinesTitle = computed(() => {
  let maxLines = 1

  for (const video of currentPageItems.value) {
    const currentLang = getVideoLanguage(video.id)
    const title = currentLang === 'eus' ? video.title.eus : video.title.fr
    const lines = getTitleLines(title)
    if (lines > maxLines) {
      maxLines = lines
    }
  }

  // Return height in pixels: 36px per line (28px font + 8px line spacing)
  // Plus 48px fixed margin-bottom
  return maxLines * 36 + 48
})

const playVideo = (video: VideoItem) => {
  // Since we now have a single URL, we can play it directly
  selectedVideo.value = video
  isDialogOpen.value = true
  // Reset idle timer on video interaction
  resetIdleTimer()
}

const closeDialog = () => {
  isDialogOpen.value = false
  selectedVideo.value = null
}

const getSelectedVideoUrl = (): string => {
  if (!selectedVideo.value) return ''
  return selectedVideo.value.url
}

const handlePageChange = (newPage: number) => {
  currentPage.value = newPage
  // Reset idle timer on navigation
  resetIdleTimer()
}
</script>

<template>
  <div class="w-screen h-screen bg-background">
    <!-- Top title -->
    <div class="absolute top-8 left-20 z-10">
      <h1 class="text-6xl font-athelas font-bold text-black">
        {{ t('videos.title', 'Videotheque') }}
      </h1>
    </div>

    <!-- Content container -->
    <div class="h-screen flex flex-col">
      <!-- Video Gallery that takes full width between title and menu -->
      <div class="px-20 pt-36 pb-40">  
        <div class="grid grid-cols-3 gap-16 h-full">
          <div v-for="video in currentPageItems" :key="video.id" class="relative group flex flex-col items-center">
            <!-- Language Toggle Buttons (show if at least one language has icon) -->
            <div v-if="hasLanguageIcon(video, 'fr') || hasLanguageIcon(video, 'eus')"
              class="mb-12 flex gap-4 self-start">
              <div class="flex flex-col items-center" @click.stop="toggleVideoLanguage(video.id); resetIdleTimer()">
                <div v-if="!hasLanguageIcon(video, 'fr')">
                  <img src="/icons/lsf.svg" alt="FR" class="w-24 h-24" />
                </div>
                <div v-else>
                  <img src="/icons/fr.svg" alt="FR" class="w-24 h-24" />
                </div>
              </div>
              <div class="flex flex-col items-center cursor-pointer"
                @click.stop="toggleVideoLanguage(video.id); resetIdleTimer()">
                <div v-if="!hasLanguageIcon(video, 'eus')">
                  <img src="/icons/lsf.svg" alt="EUS" class="w-24 h-24" />
                </div>

                <div v-else>
                  <img src="/icons/eus-sub.svg" alt="EUS" class="w-24 h-24" />
                </div>
              </div>
            </div>

            <!-- Video Title -->
            <div :style="{ minHeight: `${getMaxLinesTitle}px` }" class="flex items-start">
              <h3
                class="text-3xl font-soleil font-bold text-gray-800 group-hover:text-gray-600 transition-colors duration-300"
                style="font-size: 28px; line-height: 36px;">
                {{ getVideoLanguage(video.id) === 'eus' ? video.title.eus : video.title.fr }}
              </h3>
            </div>

            <!-- Video Thumbnail -->
            <div class="relative overflow-hidden rounded-lg shadow-lg bg-gray-200 aspect-video w-full cursor-pointer"
              @click="playVideo(video); resetIdleTimer()">
              <img :src="video.thumbnail" :alt="getVideoLanguage(video.id) === 'eus' ? video.title.eus : video.title.fr"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />

              <!-- Play Button Overlay -->
              <div
                class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-300">
                <PlayBtn />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation arrows -->
      <NavigationArrows :current-page="currentPage" :total-pages="totalPages" @page-change="handlePageChange" />

      <!-- Menu at bottom -->
      <Menu />
    </div>

    <!-- Video Modal Dialog -->
    <div v-if="isDialogOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      @click="closeDialog">
      <div class="relative w-full max-w-4xl mx-4" @click.stop>
        <!-- Close button -->
        <button @click="closeDialog"
          class="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors duration-200 text-4xl font-bold bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
          aria-label="Close video">
          ×
        </button>

        <!-- Video Player -->
        <TruncatedVideoPlayer :video-url="getSelectedVideoUrl()" :video-title="selectedVideo?.title?.fr || ''"
          @close="closeDialog" />
      </div>
    </div>
  </div>
</template>