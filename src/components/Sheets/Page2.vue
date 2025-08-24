<script setup lang="ts">
// Props
interface Props {
  title: string
  description: string
  image: string
}

const props = defineProps<Props>()
</script>

<template>
  <div class="h-full flex items-center">
    <!-- Left side - Content -->
    <div class="flex-1 pr-12">
      <h2 class="text-4xl font-athelas font-bold text-black mb-8">
        {{ title }}
      </h2>

      <div class="space-y-6">
        <p class="text-xl font-soleil text-gray-800 leading-relaxed">
          {{ description }}
        </p>

        <!-- Additional content sections for Page 2 -->
        <div class="bg-gray-50 p-6 rounded-lg">
          <h3 class="text-2xl font-athelas font-bold text-black mb-4">Key Features</h3>
          <ul class="space-y-2 text-lg font-soleil text-gray-700">
            <li class="flex items-center">
              <span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
              Feature point one
            </li>
            <li class="flex items-center">
              <span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
              Feature point two
            </li>
            <li class="flex items-center">
              <span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
              Feature point three
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Right side - Image -->
    <div class="flex-1">
      <img :src="image" :alt="title" class="w-full h-96 object-cover rounded-lg shadow-lg" />
    </div>
  </div>
</template>
