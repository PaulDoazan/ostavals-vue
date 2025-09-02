<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'
import Menu from '../Menu/index.vue'
import NavigationArrows from '../NavigationArrows.vue'
import videosData from '../../data/videos.json'
import type { VideoItem } from '../../types/videos'
import PlayBtn from '../Icon/PlayBtn.vue'

const { t, locale } = useI18n()
const videos = ref<VideoItem[]>(videosData)

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

const playVideo = (video: VideoItem) => {
  const videoUrl = locale.value === 'eus' ? video.urls.eus : video.urls.fr
  if (videoUrl) {
    // For now, we'll just log the video URL
    // In a real implementation, you might want to open a modal or navigate to a video player
    console.log('Playing video:', videoUrl)
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
            <!-- Video Title -->
            <div class="text-center mb-6">
              <h3
                class="text-3xl font-soleil font-bold text-gray-800 group-hover:text-gray-600 transition-colors duration-300"
                style="font-size: 28px;">
                {{ locale === 'eus' ? video.title.eus : video.title.fr }}
              </h3>
            </div>

            <!-- Video Thumbnail -->
            <div class="relative overflow-hidden rounded-lg shadow-lg bg-gray-200 aspect-video w-full">
              <img :src="video.thumbnail" :alt="locale === 'eus' ? video.title.eus : video.title.fr"
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
