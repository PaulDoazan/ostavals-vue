<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Menu from '../Menu/index.vue'
import NavigationArrows from '../NavigationArrows.vue'
import sheetsData from '../../data/sheets.json'
import { useLanguage } from '../../composables/useLanguage'
import { useGlobalIdle } from '../../composables/useGlobalIdle'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const { currentLanguage } = useLanguage()

// Global idle manager
const { resetIdleTimer } = useGlobalIdle()

// Current page state - restore from localStorage if available
const currentPage = ref(0)

// Watch for route changes to handle navigation from Home to Sheets
watch(() => route.path, (newPath) => {
  if (newPath === '/sheets') {
    // Check if we're coming from Home navigation via query parameter
    if (route.query.from === 'home') {
      // Fresh navigation from Home - reset to page 1 and clear saved state
      currentPage.value = 0
      localStorage.removeItem('sheets-current-page')
    } else {
      // Check if we have a saved page state (returning from presentation)
      const savedPage = localStorage.getItem('sheets-current-page')
      if (savedPage !== null) {
        currentPage.value = parseInt(savedPage, 10)
      }
    }
  }
})

// Set initial page state on component mount
onMounted(() => {
  // Check if we're coming from Home navigation via query parameter
  if (route.query.from === 'home') {
    // Fresh navigation from Home - reset to page 1 and clear saved state
    currentPage.value = 0
    localStorage.removeItem('sheets-current-page')
  } else {
    // Check if we have a saved page state (returning from presentation)
    const savedPage = localStorage.getItem('sheets-current-page')
    if (savedPage !== null) {
      currentPage.value = parseInt(savedPage, 10)
    } else {
      // No saved state - start on first page
      currentPage.value = 0
    }
  }
})

// Pagination logic
const itemsPerPage = 15
const totalPages = Math.ceil(sheetsData.length / itemsPerPage)

// Get current page items
const currentPageItems = computed(() => {
  const start = currentPage.value * itemsPerPage
  const end = start + itemsPerPage
  return sheetsData.slice(start, end)
})

// Navigation is now handled by the NavigationArrows component
const handlePageChange = (newPage: number) => {
  currentPage.value = newPage
  localStorage.setItem('sheets-current-page', newPage.toString())
  // Reset idle timer on navigation
  resetIdleTimer()
}

// Navigation to presentation
const goToPresentation = (itemId: number) => {
  // Save current page state before navigating
  localStorage.setItem('sheets-current-page', currentPage.value.toString())
  router.push(`/presentation/${itemId}`)
  // Reset idle timer on navigation
  resetIdleTimer()
}

// Image loading state management
const loadedImages = ref<Set<number>>(new Set())

const handleImageLoad = (itemId: number) => {
  loadedImages.value.add(itemId)
}

const isImageLoaded = (itemId: number) => {
  return loadedImages.value.has(itemId)
}
</script>

<template>
  <div class="w-screen h-screen bg-background">
    <!-- Top title -->
    <div class="absolute top-8 left-20 z-10">
      <h1 class="text-6xl font-athelas font-bold text-black">
        {{ t('sheets.title') }}
      </h1>
    </div>

    <!-- Grid container -->
    <div class="h-screen flex flex-col">
      <!-- Grid that takes full width between title and menu -->
      <div class="px-20 pt-36 pb-32">
        <div class="grid grid-cols-5 grid-rows-3 gap-x-16 gap-y-6 h-full">
          <div v-for="item in currentPageItems" :key="item.id"
            class="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
            @click="goToPresentation(item.id); resetIdleTimer()">
            <!-- Thumbnail image -->
            <div class="mb-3 overflow-hidden relative" style="width: 256px; height: 145px;">
              <!-- Show skeleton while image is loading -->
              <!-- <ImageSkeleton :width="'300px'" :height="'169px'" /> -->
              <!-- Show image once loaded -->
              <img v-show="isImageLoaded(item.id)" :src="item.thumbnail" class="w-full h-full object-cover"
                @load="handleImageLoad(item.id)" @error="handleImageLoad(item.id)" />
            </div>
            <!-- Title below thumbnail -->
            <h3 class="text-lg font-soleil font-medium text-center text-gray-800 px-2" style="font-size: 28px">
              {{ typeof item.title === 'string' ? item.title : item.title[currentLanguage as 'fr' | 'eus'] }}
            </h3>
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