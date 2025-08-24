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
  <div class="h-full">
    <h2 class="text-4xl font-athelas font-bold text-black mb-8 text-center">
      {{ title }}
    </h2>

    <!-- Grid layout for Page 3 -->
    <div class="grid grid-cols-2 gap-8 h-4/5">
      <!-- Top left - Main content -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-2xl font-athelas font-bold text-black mb-4">Overview</h3>
        <p class="text-lg font-soleil text-gray-700 leading-relaxed">
          {{ content }}
        </p>
      </div>

      <!-- Top right - Image -->
      <div class="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
        <img :src="image" :alt="title" class="w-full h-48 object-cover rounded-lg" />
      </div>

      <!-- Bottom left - Statistics -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-2xl font-athelas font-bold text-black mb-4">Statistics</h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-lg font-soleil text-gray-700">Category</span>
            <span class="text-xl font-soleil font-bold text-black">Heritage</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-lg font-soleil text-gray-700">Year</span>
            <span class="text-xl font-soleil font-bold text-black">2024</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-lg font-soleil text-gray-700">Status</span>
            <span class="text-xl font-soleil font-bold text-red-500">Active</span>
          </div>
        </div>
      </div>

      <!-- Bottom right - Additional info -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-2xl font-athelas font-bold text-black mb-4">Additional Information</h3>
        <div class="space-y-3">
          <div class="flex items-center">
            <span class="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
            <span class="text-lg font-soleil text-gray-700">Historical significance</span>
          </div>
          <div class="flex items-center">
            <span class="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
            <span class="text-lg font-soleil text-gray-700">Cultural value</span>
          </div>
          <div class="flex items-center">
            <span class="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
            <span class="text-lg font-soleil text-gray-700">Preservation status</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
