<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import RedThinDecorationTiny from '../Icon/RedThinDecorationTiny.vue';

// Props
interface Props {
  characteristics: string[],
  products: string[],
  keyFigures: string[],
  linkside?: string,
  website?: string,
  observatory?: string
}

const props = defineProps<Props>()

const { t } = useI18n()

// Compute left position based on linkside
const rectangleLeft = props.linkside === 'right' ? '904px' : '0px'
</script>

<template>
  <div class="h-full">
    <RedThinDecorationTiny class="absolute -top-48 right-56 rotate-90" />

    <!-- Rectangle shape at specified position -->
    <div class="absolute bg-gray-600 flex flex-col justify-center items-center"
      :style="{ left: rectangleLeft, top: '665px', width: '1016px', height: '240px' }">
      <!-- Website URL -->
      <div v-if="website && website.trim() !== ''" class="text-white font-soleil mb-2" style="font-size: 24px;">
        <span class="font-bold">Website:</span> {{ website }}
      </div>
      <!-- Observatory URL -->
      <div v-if="observatory && observatory.trim() !== ''" class="text-white font-soleil" style="font-size: 24px;">
        <span class="font-bold">Observatory:</span> {{ observatory }}
      </div>
    </div>

    <div class="grid grid-cols-3 gap-16 h-full">
      <!-- Characteristics Column -->
      <div class="flex flex-col">
        <h2 class="text-3xl font-soleil font-bold text-black mb-6">
          {{ t('sheets.page3.characteristicsTitle') }}
        </h2>
        <div class="flex-1 space-y-4">
          <div v-for="(characteristic, index) in characteristics" :key="index">
            <p class="font-soleil leading-relaxed" style="font-size: 28px; line-height: 1.3">
              - {{ characteristic }}
            </p>
          </div>
        </div>
      </div>

      <!-- Products Column -->
      <div class="flex flex-col">
        <h2 class="text-3xl font-soleil font-bold text-black mb-6">
          {{ t('sheets.page3.productsTitle') }}
        </h2>
        <div class="flex-1 space-y-4">
          <div v-for="(product, index) in products" :key="index">
            <p class="font-soleil leading-relaxed" style="font-size: 28px; line-height: 1.3">
              - {{ product }}
            </p>
          </div>
        </div>
      </div>

      <!-- Key Figures Column -->
      <div class="flex flex-col">
        <h2 class="text-3xl font-soleil font-bold text-black mb-6">
          {{ t('sheets.page3.keyFiguresTitle') }}
        </h2>
        <div class="flex-1 space-y-4">
          <div v-for="(figure, index) in keyFigures" :key="index">
            <p class="font-soleil leading-relaxed" style="font-size: 28px; line-height: 1.3">
              - {{ figure }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
