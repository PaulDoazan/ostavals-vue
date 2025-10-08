<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useImagePreloader } from '../composables/useImagePreloader'

const emit = defineEmits<{
  complete: []
}>()

const { allImages, currentPreloadIndex, startPreload, markPreloadComplete } = useImagePreloader()
const displayedImage = ref<string | null>(null)
const imageLoadDelay = 100 // ms between each image display

onMounted(() => {
  startPreload()
  displayNextImage()
})

const displayNextImage = () => {
  if (currentPreloadIndex.value >= allImages.value.length) {
    // All images have been displayed
    setTimeout(() => {
      markPreloadComplete()
      emit('complete')
    }, 200) // Small delay before completing
    return
  }

  // Display current image
  displayedImage.value = allImages.value[currentPreloadIndex.value]

  // Wait for image to load, then move to next
  const img = new Image()
  img.onload = () => {
    setTimeout(() => {
      currentPreloadIndex.value++
      displayNextImage()
    }, imageLoadDelay)
  }
  img.onerror = () => {
    // If image fails to load, skip to next
    setTimeout(() => {
      currentPreloadIndex.value++
      displayNextImage()
    }, imageLoadDelay)
  }
  img.src = displayedImage.value
}

const progress = ref(0)
watch(currentPreloadIndex, (newIndex) => {
  progress.value = allImages.value.length > 0
    ? Math.round((newIndex / allImages.value.length) * 100)
    : 0
})
</script>

<template>
  <div class="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center">
    <!-- Preloading images display -->
    <div class="absolute inset-0 flex items-center justify-center">
      <img v-if="displayedImage" :src="displayedImage" :key="displayedImage"
        class="max-w-full max-h-full object-contain" style="opacity: 0.1" alt="Preloading" />
    </div>

    <!-- Loader UI -->
    <div class="relative z-10 flex flex-col items-center gap-8">
      <!-- Loading spinner -->
      <div class="w-24 h-24 border-4 border-red border-t-transparent rounded-full animate-spin"></div>

      <!-- Loading text -->
      <div class="text-white text-3xl font-bold">
        Chargement...
      </div>

      <!-- Progress bar -->
      <div class="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div class="h-full bg-red transition-all duration-300" :style="{ width: `${progress}%` }"></div>
      </div>

      <!-- Progress percentage -->
      <div class="text-white text-xl">
        {{ progress }}%
      </div>

      <!-- Image count -->
      <div class="text-gray-400 text-sm">
        {{ currentPreloadIndex }} / {{ allImages.length }} images
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
