<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue';
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

// Custom scrollbar state
const scrollContainer = ref<HTMLElement>()
const scrollThumb = ref<HTMLElement>()
const scrollTrack = ref<HTMLElement>()
const scrollPosition = ref(0)
const scrollHeight = ref(0)
const containerHeight = ref(0)
const thumbHeight = ref(0)

// Calculate scrollbar dimensions
const updateScrollbar = () => {
  if (!scrollContainer.value) return

  const container = scrollContainer.value
  containerHeight.value = container.clientHeight
  scrollHeight.value = container.scrollHeight
  scrollPosition.value = container.scrollTop

  // Calculate thumb height as percentage of visible content
  const visibleRatio = scrollHeight.value > 0 ? containerHeight.value / scrollHeight.value : 1
  thumbHeight.value = Math.max(20, containerHeight.value * visibleRatio) // Minimum 20px for touch
}

// Handle scroll events - always update position
const handleScroll = () => {
  if (!scrollContainer.value) return
  scrollPosition.value = scrollContainer.value.scrollTop
}

// Check if content is scrollable
const isScrollable = computed(() => {
  return scrollHeight.value > containerHeight.value
})

// Computed thumb position
const thumbTop = computed(() => {
  if (scrollHeight.value <= containerHeight.value) return '0px'
  const maxScroll = scrollHeight.value - containerHeight.value
  const scrollRatio = scrollPosition.value / maxScroll
  const maxThumbTop = containerHeight.value - thumbHeight.value
  return (scrollRatio * maxThumbTop) + 'px'
})

// Handle thumb drag
let isDragging = false
let startY = 0
let startScrollTop = 0

const handleThumbMouseDown = (e: MouseEvent) => {
  isDragging = true
  startY = e.clientY
  startScrollTop = scrollPosition.value
  e.preventDefault()
}

const handleThumbTouchStart = (e: TouchEvent) => {
  isDragging = true
  startY = e.touches[0].clientY
  startScrollTop = scrollPosition.value
  e.preventDefault()
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging || !scrollContainer.value) return

  const deltaY = e.clientY - startY
  const maxScroll = Math.max(0, scrollHeight.value - containerHeight.value)
  const thumbMaxY = Math.max(1, containerHeight.value - thumbHeight.value)
  const scrollDelta = (deltaY / thumbMaxY) * maxScroll

  const newScrollTop = Math.max(0, Math.min(maxScroll, startScrollTop + scrollDelta))
  scrollContainer.value.scrollTop = newScrollTop
  scrollPosition.value = newScrollTop
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging || !scrollContainer.value) return

  const deltaY = e.touches[0].clientY - startY
  const maxScroll = Math.max(0, scrollHeight.value - containerHeight.value)
  const thumbMaxY = Math.max(1, containerHeight.value - thumbHeight.value)
  const scrollDelta = (deltaY / thumbMaxY) * maxScroll

  const newScrollTop = Math.max(0, Math.min(maxScroll, startScrollTop + scrollDelta))
  scrollContainer.value.scrollTop = newScrollTop
  scrollPosition.value = newScrollTop
}

const handleMouseUp = () => {
  isDragging = false
}

const handleTouchEnd = () => {
  isDragging = false
}

// Handle track clicks
const handleTrackClick = (e: MouseEvent) => {
  if (!scrollContainer.value || !scrollTrack.value) return

  // Don't handle if clicking on the thumb
  if (e.target === scrollThumb.value) return

  e.preventDefault()
  e.stopPropagation()

  const trackRect = scrollTrack.value.getBoundingClientRect()
  const clickY = e.clientY - trackRect.top
  const clickRatio = clickY / trackRect.height

  const maxScroll = scrollHeight.value - containerHeight.value
  scrollContainer.value.scrollTop = clickRatio * maxScroll
}

// Watch for content changes to update scrollbar
watch(() => props.description, () => {
  nextTick(() => {
    updateScrollbar()
  })
}, { flush: 'post' })

// Generate QR code on mount
onMounted(() => {
  generateQRCode()
  updateScrollbar()
  window.addEventListener('resize', updateScrollbar)
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  document.addEventListener('touchmove', handleTouchMove)
  document.addEventListener('touchend', handleTouchEnd)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScrollbar)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', handleTouchEnd)
})
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
        <div class="relative flex" style="height: calc(100vh - 400px)">
          <!-- Content area -->
          <div ref="scrollContainer" class="overflow-y-auto pr-4 flex-1" style="height: calc(100vh - 400px)"
            @scroll="handleScroll">
            <p class="font-soleil text-gray-800 leading-relaxed" style="font-size: 30px">
              {{ description }}
            </p>
          </div>

          <!-- Custom scrollbar - only show when content is scrollable -->
          <div v-if="isScrollable" ref="scrollTrack"
            class="w-6 bg-gray-200 rounded-lg cursor-pointer relative flex-shrink-0" style="height: calc(100vh - 400px)"
            @mousedown="handleTrackClick">
            <!-- Scroll thumb -->
            <div ref="scrollThumb" class="w-4 bg-red rounded-lg cursor-pointer absolute left-0" :style="{
              height: thumbHeight + 'px',
              top: thumbTop
            }" @mousedown="handleThumbMouseDown" @touchstart="handleThumbTouchStart"></div>
          </div>
        </div>
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

<style scoped>
/* Hide default scrollbar */
.overflow-y-auto {
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* IE */
}

.overflow-y-auto::-webkit-scrollbar {
  display: none;
  /* WebKit */
}

/* Custom scrollbar track */
.bg-gray-200 {
  background-color: #f3f4f6;
  border: 2px solid #e5e7eb;
}

/* Custom scrollbar thumb */
.bg-red-600 {
  background-color: #dc2626;
  min-height: 20px;
}

/* BrightSign device optimizations */
@media screen and (max-width: 1920px) {
  .w-4 {
    width: 1.25rem;
    /* 20px for smaller screens */
  }
}
</style>
