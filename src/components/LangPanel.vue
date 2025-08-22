<script setup lang="ts">
import { useLanguage } from '../composables/useLanguage'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { currentLanguage, switchLanguage } = useLanguage()

const handleLanguageClick = (langCode: string) => {
  switchLanguage(langCode)
}
</script>

<template>
  <div :class="`absolute bottom-37 left-80`">
    <div class="h-60 flex justify-between items-center bg-redgrey rounded-t-[50px] rounded-r-[50px] px-6">
      <div class="flex flex-col items-center mx-10 cursor-pointer" @click="handleLanguageClick('fr')">
        <div
          :class="`w-26 h-26 rounded-full text-white font-soleil flex items-center justify-center ${currentLanguage === 'fr' ? 'bg-red' : 'bg-gray-400'}`"
          style="font-size: 40px;">
          <span class="transform translate-y-1">
            FR
          </span>
        </div>
        <div class="font-soleil font-bold uppercase mt-6" style="font-size: 29px;">
          Français
        </div>
      </div>
      <div class="flex flex-col items-center mx-10 cursor-pointer" @click="handleLanguageClick('eus')">
        <div
          :class="`w-26 h-26 rounded-full text-white font-soleil flex items-center justify-center ${currentLanguage === 'eus' ? 'bg-red' : 'bg-gray-400'}`"
          style="font-size: 40px;">
          <span class="transform translate-y-1">
            EUS
          </span>
        </div>
        <div class="font-soleil font-bold uppercase mt-6" style="font-size: 29px;">
          Euskara
        </div>
      </div>
    </div>
  </div>
</template>
