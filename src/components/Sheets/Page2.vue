<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ImageSkeleton from './ImageSkeleton.vue'
import RedThinDecorationTiny from '../Icon/RedThinDecorationTiny.vue'

// Props
interface Props {
  title: string
  history: string
  areaProductionImage: string
  areaProductionDescription: string
}

const { t } = useI18n()

defineProps<Props>()
</script>

<template>
  <div class="h-full flex items-start">
    <!-- Left side - Content -->
    <RedThinDecorationTiny class="absolute -top-48 right-56 rotate-90" />
    <div class="w-[55%] pr-20 h-full flex flex-col">
      <h2 class="text-3xl font-soleil font-bold text-black mb-8 flex-shrink-0">
        {{ t('history') }}
      </h2>

      <div class="overflow-y-auto pr-8" style="height: 650px">
        <div class="text-xl font-soleil leading-relaxed" style="font-size: 28px; line-height: 1.3">
          {{ history }}
        </div>
      </div>
    </div>

    <!-- Right side - Image -->
    <div class="w-[55%]">
      <h3 class="text-3xl font-soleil font-bold mb-4">
        {{ t('productionZone') }}
      </h3>
      <!-- Show skeleton while image is loading v-if="!imageLoaded"-->
      <ImageSkeleton :width="'100%'" :height="'560px'" class="mb-4" />
      <!-- Show image once loaded -->
      <!-- <img v-show="imageLoaded" :src="areaProductionImage" class="w-full object-cover" @load="handleImageLoad"
        @error="handleImageLoad" /> -->
      <p class="text-lg font-soleil mt-4 leading-relaxed" style="font-size: 28px; line-height: 1.3">
        {{ areaProductionDescription }}
      </p>
    </div>

  </div>
</template>
