<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Menu from '../Menu/index.vue'
import NavigationArrows from '../NavigationArrows.vue'
import videosData from '../../data/videos.json'
import type { VideoItem } from '../../types/videos'
import PlayBtn from '../Icon/PlayBtn.vue'

const { t, locale } = useI18n()
const router = useRouter()
const videos = ref<VideoItem[]>(videosData)

// Language state for each video
const videoLanguages = ref<Record<number, 'fr' | 'eus'>>({})

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

// Check if specific language URL exists
const hasLanguageUrl = (video: VideoItem, language: 'fr' | 'eus'): boolean => {
  const url = language === 'fr' ? video.urls.fr : video.urls.eus
  console.log('Checking URL for', language, ':', url, 'Result:', !!(url && url.trim() !== ''))
  return !!(url && url.trim() !== '')
}

const playVideo = (video: VideoItem) => {
  const videoLang = getVideoLanguage(video.id)
  const videoUrl = videoLang === 'eus' ? video.urls.eus : video.urls.fr
  if (videoUrl) {
    // Navigate to the video player with the video ID
    router.push(`/video/${video.id}`)
  }
}

const handlePageChange = (newPage: number) => {
  currentPage.value = newPage
}
</script>

<template>
  <div class="w-screen bg-background">
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
          <div v-for="video in currentPageItems" :key="video.id"
            class="relative group cursor-pointer flex flex-col items-center justify-center" @click="playVideo(video)">
            <!-- Language Toggle Buttons (show if at least one language has URL) -->
            <div v-if="hasLanguageUrl(video, 'fr') || hasLanguageUrl(video, 'eus')" class="mb-12 flex gap-4 self-start">
              <div class="flex flex-col items-center cursor-pointer" @click.stop="toggleVideoLanguage(video.id)">
                <div v-if="!hasLanguageUrl(video, 'fr')">
                  <img src="/icons/lsf.svg" alt="FR" class="w-24 h-24" />
                </div>
                <div v-else>
                  <img src="/icons/fr.svg" alt="FR" class="w-24 h-24" />
                </div>
              </div>
              <div class="flex flex-col items-center cursor-pointer" @click.stop="toggleVideoLanguage(video.id)">
                <div v-if="!hasLanguageUrl(video, 'eus')">
                  <img src="/icons/lsf.svg" alt="EUS" class="w-24 h-24" />
                </div>

                <div v-else>
                  <img src="/icons/eus-sub.svg" alt="EUS" class="w-24 h-24" />
                </div>
              </div>
            </div>

            <!-- Video Title -->
            <div class="mb-12">
              <h3
                class="text-3xl font-soleil font-bold text-gray-800 group-hover:text-gray-600 transition-colors duration-300"
                style="font-size: 28px;">
                <!-- {{ getVideoLanguage(video.id) === 'eus' ? video.title.eus : video.title.fr }} -->
                {{ video.title.fr }}
              </h3>
            </div>

            <!-- Video Thumbnail -->
            <div class="relative overflow-hidden rounded-lg shadow-lg bg-gray-200 aspect-video w-full">
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
  </div>
</template>