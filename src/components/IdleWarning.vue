<template>
  <div v-if="showWarning" class="fixed inset-0 z-50 flex bg-background bg-opacity-40 items-center justify-center"
    @click="cancelIdleReturn">
    <div class="text-center bg-background p-12 border-2 border-red max-w-4xl rounded-xl">
      <div class="text-red text-3xl md:text-6xl font-semibold mb-8">
        {{ warningMessage }}
      </div>
      <div class="text-red text-8xl md:text-9xl font-semibold">
        {{ countdown }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  showWarning: boolean
  countdown: number
  warningMessage: string
}

defineProps<Props>()

const emit = defineEmits<{
  cancel: []
}>()

const cancelIdleReturn = () => {
  emit('cancel')
}
</script>
