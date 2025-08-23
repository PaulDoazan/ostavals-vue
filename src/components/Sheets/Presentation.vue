<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Menu from '../Menu/index.vue'
import Arrow from '../Icon/Arrow.vue'

const { t } = useI18n()
const router = useRouter()

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

// Navigation functions
const nextPage = () => {
  if (currentPage.value < 2) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
  }
}

// Check if navigation is possible
const canGoNext = computed(() => currentPage.value < 2)
const canGoPrev = computed(() => currentPage.value > 0)


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
        <div class="h-full flex flex-col items-center justify-center">
          <!-- Page content -->
          <div class="text-center max-w-4xl">
            <h2 class="text-4xl font-athelas font-bold text-black mb-8">
              {{ presentationData.pages[currentPage].title }}
            </h2>

            <!-- Image -->
            <div class="mb-8">
              <img :src="presentationData.pages[currentPage].image" :alt="presentationData.pages[currentPage].title"
                class="w-full max-w-2xl mx-auto object-cover rounded-lg" />
            </div>

            <!-- Content text -->
            <p class="text-xl font-soleil text-gray-800 leading-relaxed">
              {{ presentationData.pages[currentPage].content }}
            </p>
          </div>
        </div>
      </div>

      <!-- Navigation arrows -->
      <Arrow class="absolute bottom-10 right-56 rotate-180 cursor-pointer transition-opacity"
        :class="{ 'opacity-50': !canGoPrev }" @click="prevPage" />
      <Arrow class="absolute bottom-10 right-20 cursor-pointer transition-opacity" :class="{ 'opacity-50': !canGoNext }"
        @click="nextPage" />

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
