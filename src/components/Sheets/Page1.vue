<script setup lang="ts">
import RedThinDecoration from '../Icon/RedThinDecoration.vue';
import ImageSkeleton from './ImageSkeleton.vue';

// Props
interface Props {
  title: string
  description: string
  imageDescription: string
}

defineProps<Props>()
</script>

<template>
  <div class="h-full flex flex-col">
    <RedThinDecoration class="absolute z-10" style="bottom: 0; left: 786px" />
    <!-- Two-column layout: image left, description right -->
    <div class="flex flex-1 gap-20">
      <!-- Left column: Image (763px / 1729px ≈ 44.1%) -->
      <div class="w-[44%]">
        <!-- Show skeleton while image is loading v-if="!imageLoaded"-->
        <ImageSkeleton :width="'100%'" :height="'calc(100vh - 400px)'" class="rounded-lg" />
        <!-- Show image once loaded -->
        <!-- <img v-show="imageLoaded" :src="imageDescription" :alt="title" class="w-full h-full object-cover rounded-lg"
          style="max-height: calc(100vh - 200px);" @load="handleImageLoad" @error="handleImageLoad" /> -->
      </div>

      <!-- Right column: Description (966px / 1729px ≈ 55.9%) -->
      <div class="w-[56%]">
        <p class="font-soleil text-gray-800 leading-relaxed" style="font-size: 30px">
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>
