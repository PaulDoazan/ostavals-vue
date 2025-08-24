<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import RedThinDecoration from '../Icon/RedThinDecoration.vue';

// Props
interface Props {
  characteristics: string[],
  products: string[],
  keyFigures: string[],
}

defineProps<Props>()

const { t } = useI18n()
</script>

<template>
  <div class="h-full">
    <RedThinDecoration class="absolute -top-48 right-56 rotate-90" />
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
