<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import RedThinDecoration from '../Icon/RedThinDecoration.vue'

// Props
interface Props {
  title: string
  history: string
  areaProductionImage: string
  areaProductionDescription: string
}

const { t } = useI18n()

defineProps<Props>()
</script>

<template>
  <div class="h-full flex items-start">
    <!-- Left side - Content -->
    <RedThinDecoration class="absolute -top-48 right-56 rotate-90" />
    <div class="w-[45%] pr-20">
      <h2 class="text-3xl font-soleil font-bold text-black mb-8">
        {{ t('history') }}
      </h2>

      <div class="space-y-6">
        <p class="text-xl font-soleil leading-relaxed" style="font-size: 28px; line-height: 1.3">
          {{ history }}
        </p>
      </div>
    </div>

    <!-- Right side - Image -->
    <div class="w-[55%]">
      <h3 class="text-3xl font-soleil font-bold mb-4">
        {{ t('productionZone') }}
      </h3>
      <img :src="areaProductionImage" class="w-full object-cover" />
      <p class="text-lg font-soleil mt-4 leading-relaxed" style="font-size: 28px; line-height: 1.3">
        {{ areaProductionDescription }}
      </p>
    </div>

  </div>
</template>
