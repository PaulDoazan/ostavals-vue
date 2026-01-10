<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import RedThinDecoration from '../Icon/RedThinDecoration.vue';
import ImageSkeleton from './ImageSkeleton.vue';
import { useQRCode } from '../../composables/useQRCode';

// Props
interface Props {
  title: string
  description: string
  imageDescription: string
  grallUrl?: string
}

const props = defineProps<Props>()

// Image loading state
const imageLoaded = ref(false)

const handleImageLoad = () => {
  imageLoaded.value = true
}

// QR Code composable
const { generateQRCodeFromUrl: generateGrallQR } = useQRCode()

// QR Code data URL
const grallQRCode = ref<string>('')

// Generate QR code when grallUrl changes
const generateQRCode = async () => {
  if (props.grallUrl && props.grallUrl.trim() !== '') {
    const qr = await generateGrallQR(props.grallUrl, { width: 96 })
    grallQRCode.value = qr || ''
  } else {
    grallQRCode.value = ''
  }
}

// Watch for changes in grallUrl and generate QR code
watch(() => props.grallUrl, generateQRCode, { immediate: true })

// Generate QR code on mount
onMounted(generateQRCode)
</script>

<template>
  <div class="h-full flex flex-col relative">
    <RedThinDecoration class="absolute z-10" style="bottom: 0; left: 707px" />
    <!-- Two-column layout: image left, description right -->
    <div class="flex flex-1 gap-20">
      <!-- Left column: Image (763px / 1729px ≈ 44.1%) -->
      <div class="w-[44%]">
        <!-- Show skeleton while image is loading -->
        <ImageSkeleton v-if="!imageLoaded" :width="'100%'" :height="'calc(100vh - 400px)'" class="rounded-lg" />
        <!-- Show image once loaded -->
        <img v-show="imageLoaded" :src="imageDescription" :alt="title" class="w-full object-cover"
          style="height: calc(100vh - 400px);" @load="handleImageLoad" @error="handleImageLoad" />
      </div>

      <!-- Right column: Description (966px / 1729px ≈ 55.9%) -->
      <div class="w-[56%]">
        <p class="font-soleil text-gray-800 leading-relaxed" style="font-size: 30px">
          {{ description }}
        </p>
      </div>
    </div>
    <!-- Grall icon rectangle - positioned at bottom right of page -->
    <div class="absolute bottom-0 left-[820px] rounded-lg">
      <div class="flex bg-redgrey">
        <div v-if="grallQRCode" class="p-3">
          <img :src="grallQRCode" alt="Grall QR Code" class="w-32 h-32" />
        </div>
        <!-- Grall icon -->
        <div class="p-3">
          <img src="/icons/grall.svg" alt="Grall" class="w-32 h-32" />
        </div>
      </div>
    </div>
  </div>
</template>
