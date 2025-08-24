<script setup lang="ts">
// Props
interface Props {
  characteristics: string[],
  products: string[],
  keyFigures: string[],
}

defineProps<Props>()
</script>

<template>
  <div class="h-full">
    <div class="flex flex-col gap-4">
      <h2 class="text-4xl font-athelas font-bold text-black mb-8 text-center">
        {{ characteristics[0] }}
      </h2>
      <p class="text-xl font-soleil text-gray-800 leading-relaxed" style="font-size: 28px; line-height: 1.4">
        {{ products[0] }}
      </p>
      <p class="text-xl font-soleil text-gray-800 leading-relaxed" style="font-size: 28px; line-height: 1.4">
        {{ keyFigures[0] }}
      </p>
    </div>
  </div>
</template>
