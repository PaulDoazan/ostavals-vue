<script setup lang="ts">
import Hand from './Hand.vue';
import Ostaval from './Ostaval.vue';


</script>

<template>
  <div class="w-screen h-screen flex items-center justify-center">
    <div class="absolute font-soleil italic text-white"
      :style="{ left: '171px', top: '259px', fontSize: '60px', textShadow: '2px 0px 0px #000, -2px 0px 0px #000, 0px 2px 0px #000, 0px -2px 0px #000' }">
      Cliquez sur l'écran
    </div>
    <div class="absolute font-soleil italic text-white"
      :style="{ left: '171px', top: '339px', fontSize: '60px', textShadow: '2px 0px 0px #000, -2px 0px 0px #000, 0px 2px 0px #000, 0px -2px 0px #000' }">
      Egin klik pantailan
    </div>
    <Hand class="absolute" :style="{ left: '547px', top: '501px' }" />
    <Ostaval class="absolute" :style="{ left: '1445px', top: '921px' }" />
    <img src="/images/idlescreen.jpg" alt="Idle Screen" class="w-screen h-screen object-cover" />
  </div>
</template>