<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  videoUrl: string
}

defineProps<Props>()

const videoElement = ref<HTMLVideoElement | null>(null)

// Handle escape key to close modal
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    // Emit close event to parent
    emit('close')
  }
}

const emit = defineEmits<{
  close: []
}>()

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
    <video ref="videoElement" :src="videoUrl" class="w-full h-full object-cover" controls preload="metadata"
      @click.stop>
      Your browser does not support the video tag.
    </video>
  </div>
</template>