<script setup lang="ts">
import { ref, computed } from 'vue'
import Menu from '../Menu/index.vue'
import NavigationArrows from '../NavigationArrows.vue'
import Page1 from './Page1.vue'
import Page2 from './Page2.vue'
import Page3 from './Page3.vue'
import sheetsData from '../../data/sheets.json'
import { useLanguage } from '../../composables/useLanguage'

// Props
interface Props {
  gridItemId: number
}

const props = defineProps<Props>()

// Get current language
const { currentLanguage } = useLanguage()

// Current page state (0, 1, or 2 for the 3 pages)
const currentPage = ref(0)

// Helper function to get localized text
const getLocalizedText = (text: any, fallback?: string): string => {
  if (typeof text === 'string') {
    return text
  }
  if (text && typeof text === 'object') {
    return text[currentLanguage.value] || text.fr || fallback || 'Content not found.'
  }
  return fallback || 'Content not found.'
}

// Helper function to get localized title
const getLocalizedTitle = (title: any): string => {
  if (typeof title === 'string') {
    return title
  }
  if (title && typeof title === 'object') {
    return title[currentLanguage.value] || title.fr || 'Untitled'
  }
  return 'Untitled'
}

// Get data for the current grid item from the JSON file
const presentationData = computed(() => {
  console.log("props:", props)
  console.log("gridItemId:", props.gridItemId, "type:", typeof props.gridItemId)
  console.log("sheetsData:", sheetsData)

  const item = sheetsData.find(item => item.id === Number(props.gridItemId))

  console.log("item", item)
  if (!item) {
    // Fallback data if item not found
    return {
      title: `Item ${props.gridItemId}`,
      pages: [
        {
          title: 'Page 1',
          description: 'Content not found.',
          imageDescription: '/images/idlescreen.jpg'
        },
        {
          title: 'Page 2',
          history: 'Content not found.',
          areaProductionImage: '/images/idlescreen.jpg',
          areaProductionDescription: 'Content not found.'
        },
        {
          title: 'Page 3',
          description: 'Content not found.',
          imageDescription: '/images/idlescreen.jpg'
        }
      ]
    }
  }

  // Handle both old and new data structures
  const title = getLocalizedTitle(item.title)

  // Transform pages to match the expected structure
  const pages = item.pages.map((page: any, index: number) => {
    if (index === 0) {
      // First page - presentation
      return {
        title: 'Presentation',
        description: getLocalizedText(page.presentation, 'Presentation content not found.'),
        imageDescription: page.imagePresentation || '/images/idlescreen.jpg'
      }
    } else if (index === 1) {
      // Second page - history
      return {
        title: 'History',
        history: getLocalizedText(page.history, 'History content not found.'),
        areaProductionImage: page.areaProductionImage || '/images/idlescreen.jpg',
        areaProductionDescription: getLocalizedText(page.areaProductionDescription, 'Area production description not found.')
      }
    } else {
      // Third page - characteristics, products, keyfigures
      const characteristics = Array.isArray(page.characteristics)
        ? page.characteristics.map((char: any) => getLocalizedText(char, 'Characteristic not found.'))
        : []

      const products = Array.isArray(page.products)
        ? page.products.map((prod: any) => getLocalizedText(prod, 'Product not found.'))
        : []

      const keyfigures = Array.isArray(page.keyfigures)
        ? page.keyfigures.map((fig: any) => getLocalizedText(fig, 'Key figure not found.'))
        : []

      const description = [
        ...characteristics.map((char: string) => `• ${char}`),
        ...products.map((prod: string) => `• ${prod}`),
        ...keyfigures.map((fig: string) => `• ${fig}`)
      ].join('\n')

      return {
        title: 'Details',
        description: description || 'Details content not found.',
        imageDescription: '/images/idlescreen.jpg',
        characteristics,
        products,
        keyFigures: keyfigures,
        linkside: page.linkside
      }
    }
  })

  return {
    title,
    pages
  }
})

// Navigation is now handled by the NavigationArrows component
const handlePageChange = (newPage: number) => {
  currentPage.value = newPage
}

// Get current page component based on page number
const getCurrentPageComponent = computed(() => {
  switch (currentPage.value) {
    case 0:
      return Page1
    case 1:
      return Page2
    case 2:
      return Page3
    default:
      return Page1
  }
})
</script>

<template>
  <div class="w-screen bg-background">
    <!-- Top title -->
    <div class="absolute top-8 left-20 z-10">
      <h1 class="text-6xl font-athelas font-bold text-black">
        {{ presentationData.title }}
      </h1>
    </div>

    <!-- Content container -->
    <div class="h-screen flex flex-col">
      <!-- Content area that takes full width between title and menu -->
      <div class="px-20 pt-40 flex-1">
        <!-- Dynamic page component -->
        <component :is="getCurrentPageComponent" v-if="currentPage === 0"
          :title="presentationData.pages[currentPage].title"
          :description="presentationData.pages[currentPage].description || ''"
          :imageDescription="presentationData.pages[currentPage].imageDescription || ''" />

        <component :is="getCurrentPageComponent" v-else-if="currentPage === 1"
          :title="presentationData.pages[currentPage].title"
          :history="presentationData.pages[currentPage].history || ''"
          :areaProductionImage="presentationData.pages[currentPage].areaProductionImage || ''"
          :areaProductionDescription="presentationData.pages[currentPage].areaProductionDescription || ''" />

        <component :is="getCurrentPageComponent" v-else-if="currentPage === 2"
          :characteristics="presentationData.pages[currentPage].characteristics || []"
          :products="presentationData.pages[currentPage].products || []"
          :keyFigures="presentationData.pages[currentPage].keyFigures || []"
          :linkside="presentationData.pages[currentPage].linkside" />
      </div>

      <!-- Navigation arrows -->
      <NavigationArrows :current-page="currentPage" :total-pages="3" @page-change="handlePageChange" />

      <!-- Page indicator -->
      <div class="absolute bottom-10 left-20 flex space-x-2">
        <div v-for="page in 3" :key="page" class="w-3 h-3 rounded-full transition-colors"
          :class="currentPage === page - 1 ? 'bg-red-500' : 'bg-gray-300'"></div>
      </div>

      <!-- Menu at bottom -->
      <Menu />
    </div>
  </div>
</template>
