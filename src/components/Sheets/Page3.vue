<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, watch } from 'vue'
import RedThinDecorationTiny from '../Icon/RedThinDecorationTiny.vue'
import { useQRCode } from '../../composables/useQRCode'

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

// QR Code composables
const { generateQRCodeFromUrl: generateWebsiteQR } = useQRCode()
const { generateQRCodeFromUrl: generateObservatoryQR } = useQRCode()

// QR Code data URLs
const websiteQRCode = ref<string>('')
const observatoryQRCode = ref<string>('')

// Compute left position based on linkside
const rectangleLeft = props.linkside === 'right' ? '904px' : '0px'

// Generate QR codes when URLs change
const generateQRCodes = async () => {
  if (props.website && props.website.trim() !== '') {
    const qr = await generateWebsiteQR(props.website, { width: 120 })
    websiteQRCode.value = qr || ''
  } else {
    websiteQRCode.value = ''
  }

  if (props.observatory && props.observatory.trim() !== '') {
    const qr = await generateObservatoryQR(props.observatory, { width: 120 })
    observatoryQRCode.value = qr || ''
  } else {
    observatoryQRCode.value = ''
  }
}

// Watch for changes in URLs and generate QR codes
watch([() => props.website, () => props.observatory], generateQRCodes, { immediate: true })

// Generate QR codes on mount
onMounted(generateQRCodes)

// Determine layout class based on number of URLs
const getLayoutClass = () => {
  const hasWebsite = props.website && props.website.trim() !== ''
  const hasObservatory = props.observatory && props.observatory.trim() !== ''
  const urlCount = (hasWebsite ? 1 : 0) + (hasObservatory ? 1 : 0)

  return urlCount === 1 ? 'justify-center' : 'justify-around'
}
</script>

<template>
  <div class="h-full">
    <RedThinDecorationTiny class="absolute -top-48 right-56 rotate-90" />

    <!-- Rectangle shape at specified position -->
    <div class="absolute bg-gray-600 flex items-center px-8"
      :style="{ left: rectangleLeft, top: '665px', width: '1016px', height: '240px' }">

      <div class="w-full flex" :class="getLayoutClass()">
        <!-- Website Column -->
        <div v-if="website && website.trim() !== ''" class="flex items-center text-white font-soleil">
          <div class="font-bold mr-6" style="font-size: 32px;">{{ t('sheets.page3.website') }} </div>
          <img v-if="websiteQRCode" :src="websiteQRCode" alt="Website QR Code" class="w-48 h-48" />
        </div>

        <!-- Observatory Column -->
        <div v-if="observatory && observatory.trim() !== ''" class="flex items-center text-white font-soleil">
          <div class="font-bold mr-6" style="font-size: 32px;">{{ t('sheets.page3.observatory') }} </div>
          <img v-if="observatoryQRCode" :src="observatoryQRCode" alt="Observatory QR Code" class="w-48 h-48" />
        </div>
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
