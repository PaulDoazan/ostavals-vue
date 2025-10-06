<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted, onUnmounted } from 'vue'
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

  console.log('handleMouseMove', newScrollTop)
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
  console.log('handleMouseUp')
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
  console.log('handleTrackClick', clickRatio * maxScroll)
}

onMounted(() => {
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
  <div class="h-full flex items-start">
    <!-- Left side - Content -->
    <RedThinDecorationTiny class="absolute -top-48 right-56 rotate-90" />
    <div class="w-[55%] pr-20 h-full flex flex-col">
      <h2 class="text-3xl font-soleil font-bold text-black mb-8 flex-shrink-0">
        {{ t('history') }}
      </h2>

      <div class="relative flex" style="height: 650px">
        <!-- Content area -->
        <div ref="scrollContainer" class="overflow-y-auto pr-4 flex-1" style="height: 650px" @scroll="handleScroll">
          <div class="text-xl font-soleil leading-relaxed" style="font-size: 28px; line-height: 1.5">
            {{ history }}
          </div>
        </div>

        <!-- Custom scrollbar -->
        <div ref="scrollTrack" class="w-6 bg-gray-200 rounded-lg cursor-pointer relative flex-shrink-0"
          style="height: 650px" @mousedown="handleTrackClick">
          <!-- Scroll thumb -->
          <div ref="scrollThumb" class="w-4 bg-red-600 rounded-lg cursor-pointer absolute left-0" :style="{
            height: thumbHeight + 'px',
            top: thumbTop
          }" @mousedown="handleThumbMouseDown" @touchstart="handleThumbTouchStart"></div>
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
