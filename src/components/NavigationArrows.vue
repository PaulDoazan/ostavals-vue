<template>
  <div class="navigation-arrows">
    <!-- Previous page arrow -->
    <Arrow class="absolute bottom-10 right-56 rotate-180 cursor-pointer transition-opacity"
      :class="{ 'opacity-0 cursor-default': !canGoPrev }" @click="handlePrevPage" />

    <!-- Next page arrow -->
    <Arrow class="absolute bottom-10 right-20 cursor-pointer transition-opacity"
      :class="{ 'opacity-0 cursor-default': !canGoNext }" @click="handleNextPage" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Arrow from './Icon/Arrow.vue'

// Props
interface Props {
  currentPage: number
  totalPages: number
  onPageChange?: (newPage: number) => void
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'page-change': [newPage: number]
}>()

// Computed properties for navigation state
const canGoNext = computed(() => props.currentPage < props.totalPages - 1)
const canGoPrev = computed(() => props.currentPage > 0)

// Navigation handlers
const handleNextPage = () => {
  if (canGoNext.value) {
    const newPage = props.currentPage + 1
    emit('page-change', newPage)
    if (props.onPageChange) {
      props.onPageChange(newPage)
    }
  }
}

const handlePrevPage = () => {
  if (canGoPrev.value) {
    const newPage = props.currentPage - 1
    emit('page-change', newPage)
    if (props.onPageChange) {
      props.onPageChange(newPage)
    }
  }
}
</script>
