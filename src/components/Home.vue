<script setup lang="ts">
import ArrowIn from './Icon/ArrowIn.vue'
import BlueDecoration from './Icon/BlueDecoration.vue';
import RedDecoration from './Icon/RedDecoration.vue';
import Menu from './Menu.vue';
</script>

<template>
  <div class="w-screen bg-background">
    <div class="absolute" style="top: -57.5px; left: 22px;">
      <RedDecoration />
    </div>
    <div class="absolute" style="top: 968px; left: 1652px;">
      <BlueDecoration />
    </div>
    <Menu />
    <div class="h-screen grid grid-cols-3">
      <div class="bg-creme flex items-center justify-center">
        <div class="h-84 w-100 flex flex-col justify-between transform -translate-y-12">
          <div class="font-bold leading-20" style="font-size: 40px;">
            Borne ressource
          </div>
          <div class="font-soleil leading-9.5 text-2xl" style="font-size: 28px;">
            Accédez à une sélection de fiches explicatives et de vidéos pour découvrir le patrimoine, les filières,
            les
            démarches collectives et les productions agricoles du territoire.
          </div>
        </div>
      </div>
      <div class="bg-kaki flex items-center justify-center">
        <div class="h-84 flex flex-col items-center justify-between transform -translate-y-14">
          <div class="text-2xl font-athelas text-center leading-20" style="font-size: 70px;">
            Fiches<br>explicatives
          </div>
          <div>
            <ArrowIn />
          </div>
        </div>
      </div>
      <div class="bg-lightkaki flex items-center justify-center">
        <div class="h-84 flex flex-col items-center justify-between transform -translate-y-14">
          <div class="text-2xl font-athelas text-center leading-20" style="font-size: 70px;">
            Vidéothèque
          </div>
          <ArrowIn />
        </div>
      </div>
    </div>
  </div>
</template>