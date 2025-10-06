<script setup lang="ts">
import { useLanguage } from '../../composables/useLanguage'

const { currentLanguage, switchLanguage } = useLanguage()

const handleLanguageClick = (langCode: string) => {
  emit('closeLangPanel')
  switchLanguage(langCode)
}

const emit = defineEmits(['closeLangPanel'])
</script>

<template>
  <div class="lang-panel absolute bottom-36 left-80 z-10">
    <div class="h-60 flex justify-between items-center bg-redgrey rounded-t-[50px] rounded-r-[50px] px-6">
      <div class="flex flex-col items-center mx-10 cursor-pointer" @click="handleLanguageClick('fr')">
        <div :class="`text-white font-soleil flex items-center justify-center transition-all duration-200 ${currentLanguage === 'fr'
          ? 'bg-red border-4 border-white'
          : 'bg-gray-400 hover:bg-gray-300'
          }`" style="width: 6.5rem; height: 6.5rem; border-radius: 9999px; font-size: 40px;">
          <span class="transform translate-y-1">
            FR
          </span>
        </div>
        <div :class="`font-soleil font-bold uppercase mt-6
          }`" style="font-size: 29px;">
          Français
        </div>
      </div>
      <div class="flex flex-col items-center mx-10 cursor-pointer" @click="handleLanguageClick('eus')">
        <div :class="`text-white font-soleil flex items-center justify-center transition-all duration-200 ${currentLanguage === 'eus'
          ? 'bg-red border-4 border-white'
          : 'bg-gray-400 hover:bg-gray-300'
          }`" style="width: 6.5rem; height: 6.5rem; border-radius: 9999px; font-size: 40px;">
          <span class="transform translate-y-1">
            EUS
          </span>
        </div>
        <div :class="`font-soleil font-bold uppercase mt-6
          }`" style="font-size: 29px;">
          Euskara
        </div>
      </div>
    </div>
  </div>
</template>