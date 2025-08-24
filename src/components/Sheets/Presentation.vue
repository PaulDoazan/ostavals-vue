<script setup lang="ts">
import { ref, computed } from 'vue'
import Menu from '../Menu/index.vue'
import NavigationArrows from '../NavigationArrows.vue'
import Page1 from './Page1.vue'
import Page2 from './Page2.vue'
import Page3 from './Page3.vue'

// Props
interface Props {
  gridItemId: number
}

const props = defineProps<Props>()

// Current page state (0, 1, or 2 for the 3 pages)
const currentPage = ref(0)

// Sample data for the presentation - you can customize this based on your needs
const presentationData = computed(() => {
  // This is sample data - you can replace with real data based on gridItemId
  return {
    title: `Patrimoine ${props.gridItemId}`,
    pages: [
      {
        title: 'Page 1',
        content: 'This is the first page content for the selected item.',
        image: '/images/idlescreen.jpg'
      },
      {
        title: 'Page 2',
        content: 'This is the second page content with more details.',
        image: '/images/idlescreen.jpg'
      },
      {
        title: 'Page 3',
        content: 'This is the final page with additional information.',
        image: '/images/idlescreen.jpg'
      }
    ]
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
      <div class="px-20 pt-36 pb-40 flex-1">
        <!-- Dynamic page component -->
        <component :is="getCurrentPageComponent" :title="presentationData.pages[currentPage].title"
          :content="presentationData.pages[currentPage].content" :image="presentationData.pages[currentPage].image" />
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
