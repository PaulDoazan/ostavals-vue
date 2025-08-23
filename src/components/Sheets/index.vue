<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Menu from '../Menu/index.vue'
import Arrow from '../Icon/Arrow.vue'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

// Current page state - restore from localStorage if available
const currentPage = ref(0)



// Watch for route changes to handle navigation from Home to Sheets
watch(() => route.path, (newPath, oldPath) => {
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

// 35 grid items
const gridItems = [
  { id: 1, title: 'Patrimoine 1', thumbnail: '/images/idlescreen.jpg' },
  { id: 2, title: 'Patrimoine 2', thumbnail: '/images/idlescreen.jpg' },
  { id: 3, title: 'Patrimoine 3', thumbnail: '/images/idlescreen.jpg' },
  { id: 4, title: 'Patrimoine 4', thumbnail: '/images/idlescreen.jpg' },
  { id: 5, title: 'Patrimoine 5', thumbnail: '/images/idlescreen.jpg' },
  { id: 6, title: 'Patrimoine 6', thumbnail: '/images/idlescreen.jpg' },
  { id: 7, title: 'Patrimoine 7', thumbnail: '/images/idlescreen.jpg' },
  { id: 8, title: 'Patrimoine 8', thumbnail: '/images/idlescreen.jpg' },
  { id: 9, title: 'Patrimoine 9', thumbnail: '/images/idlescreen.jpg' },
  { id: 10, title: 'Patrimoine 10', thumbnail: '/images/idlescreen.jpg' },
  { id: 11, title: 'Filière 1', thumbnail: '/images/idlescreen.jpg' },
  { id: 12, title: 'Filière 2', thumbnail: '/images/idlescreen.jpg' },
  { id: 13, title: 'Filière 3', thumbnail: '/images/idlescreen.jpg' },
  { id: 14, title: 'Filière 4', thumbnail: '/images/idlescreen.jpg' },
  { id: 15, title: 'Filière 5', thumbnail: '/images/idlescreen.jpg' },
  { id: 16, title: 'Filière 6', thumbnail: '/images/idlescreen.jpg' },
  { id: 17, title: 'Filière 7', thumbnail: '/images/idlescreen.jpg' },
  { id: 18, title: 'Filière 8', thumbnail: '/images/idlescreen.jpg' },
  { id: 19, title: 'Filière 9', thumbnail: '/images/idlescreen.jpg' },
  { id: 20, title: 'Filière 10', thumbnail: '/images/idlescreen.jpg' },
  { id: 21, title: 'Production 1', thumbnail: '/images/idlescreen.jpg' },
  { id: 22, title: 'Production 2', thumbnail: '/images/idlescreen.jpg' },
  { id: 23, title: 'Production 3', thumbnail: '/images/idlescreen.jpg' },
  { id: 24, title: 'Production 4', thumbnail: '/images/idlescreen.jpg' },
  { id: 25, title: 'Production 5', thumbnail: '/images/idlescreen.jpg' },
  { id: 26, title: 'Production 6', thumbnail: '/images/idlescreen.jpg' },
  { id: 27, title: 'Production 7', thumbnail: '/images/idlescreen.jpg' },
  { id: 28, title: 'Production 8', thumbnail: '/images/idlescreen.jpg' },
  { id: 29, title: 'Production 9', thumbnail: '/images/idlescreen.jpg' },
  { id: 30, title: 'Production 10', thumbnail: '/images/idlescreen.jpg' },
  { id: 31, title: 'Innovation 1', thumbnail: '/images/idlescreen.jpg' },
  { id: 32, title: 'Innovation 2', thumbnail: '/images/idlescreen.jpg' },
  { id: 33, title: 'Innovation 3', thumbnail: '/images/idlescreen.jpg' },
  { id: 34, title: 'Innovation 4', thumbnail: '/images/idlescreen.jpg' },
  { id: 35, title: 'Innovation 5', thumbnail: '/images/idlescreen.jpg' }
]

// Pagination logic
const itemsPerPage = 15
const totalPages = Math.ceil(gridItems.length / itemsPerPage)

// Get current page items
const currentPageItems = computed(() => {
  const start = currentPage.value * itemsPerPage
  const end = start + itemsPerPage
  return gridItems.slice(start, end)
})

// Navigation functions
const nextPage = () => {
  if (currentPage.value < totalPages - 1) {
    currentPage.value++
    // Save current page to localStorage
    localStorage.setItem('sheets-current-page', currentPage.value.toString())
  }
}

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
    // Save current page to localStorage
    localStorage.setItem('sheets-current-page', currentPage.value.toString())
  }
}

// Check if navigation is possible
const canGoNext = computed(() => currentPage.value < totalPages - 1)
const canGoPrev = computed(() => currentPage.value > 0)

// Navigation to presentation
const goToPresentation = (itemId: number) => {
  // Save current page state before navigating
  localStorage.setItem('sheets-current-page', currentPage.value.toString())
  router.push(`/presentation/${itemId}`)
}
</script>

<template>
  <div class="w-screen bg-background">
    <!-- Top title -->
    <div class="absolute top-8 left-20 z-10">
      <h1 class="text-6xl font-athelas font-bold text-black">
        {{ t('sheets.title') }}
      </h1>
    </div>

    <!-- Grid container -->
    <div class="h-screen flex flex-col">
      <!-- Grid that takes full width between title and menu -->
      <div class="px-20 pt-36 pb-40">
        <div class="grid grid-cols-5 grid-rows-3 gap-x-16 gap-y-12 h-full">
          <div v-for="item in currentPageItems" :key="item.id"
            class="flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
            @click="goToPresentation(item.id)">
            <!-- Thumbnail image -->
            <div class="mb-3 overflow-hidden">
              <img :src="item.thumbnail" :alt="item.title" class="w-full h-full object-cover" />
            </div>
            <!-- Title below thumbnail -->
            <h3 class="text-lg font-soleil font-medium text-center text-gray-800 px-2" style="font-size: 28px">
              {{ item.title }}
            </h3>
          </div>
        </div>
      </div>

      <!-- Navigation arrows -->
      <Arrow class="absolute bottom-10 right-56 rotate-180 cursor-pointer transition-opacity"
        :class="{ 'opacity-50': !canGoPrev }" @click="prevPage" />
      <Arrow class="absolute bottom-10 right-20 cursor-pointer transition-opacity" :class="{ 'opacity-50': !canGoNext }"
        @click="nextPage" />

      <!-- Menu at bottom -->
      <Menu />
    </div>
  </div>
</template>