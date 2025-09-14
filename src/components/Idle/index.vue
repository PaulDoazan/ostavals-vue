<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Hand from './Hand.vue';
import Ostaval from './Ostaval.vue';

const { t } = useI18n()
</script>

<template>
  <div class="w-screen h-screen flex items-center justify-center">
    <!-- <div class="absolute font-soleil italic text-white"
      :style="{ left: '171px', top: '259px', fontSize: '60px', textShadow: '2px 0px 0px #000, -2px 0px 0px #000, 0px 2px 0px #000, 0px -2px 0px #000' }">
      {{ t('idleScreen.clickScreen') }}
    </div>
    <Hand class="absolute" :style="{ left: '547px', top: '501px' }" />
    <Ostaval class="absolute" :style="{ left: '1445px', top: '921px' }" /> -->
    <video src="/videos/idle.mp4" autoplay muted loop playsinline class="w-screen h-screen object-cover" />
  </div>
</template>