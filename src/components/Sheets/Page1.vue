<script setup lang="ts">
// Props
interface Props {
  title: string
  content: string
  image: string
}

const props = defineProps<Props>()
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center">
    <!-- Page content -->
    <div class="text-center max-w-4xl">
      <h2 class="text-4xl font-athelas font-bold text-black mb-8">
        {{ title }}
      </h2>

      <!-- Image -->
      <div class="mb-8">
        <img :src="image" :alt="title" class="w-full max-w-2xl mx-auto object-cover rounded-lg" />
      </div>

      <!-- Content text -->
      <p class="text-xl font-soleil text-gray-800 leading-relaxed">
        {{ content }}
      </p>
    </div>
  </div>
</template>
