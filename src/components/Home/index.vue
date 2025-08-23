<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import ArrowIn from '../Icon/ArrowIn.vue'
import BlueDecoration from '../Icon/BlueDecoration.vue';
import RedDecoration from '../Icon/RedDecoration.vue';
import Menu from '../Menu/index.vue';

const { t } = useI18n()
const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}
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
      <div @click="navigateTo('/resources')" class="bg-creme flex items-center justify-center">
        <div class="h-84 w-100 flex flex-col justify-between transform -translate-y-12">
          <div class="font-bold leading-20" style="font-size: 40px;">
            {{ t('home.title') }}
          </div>
          <div class="font-soleil leading-9.5 text-2xl" style="font-size: 28px;">
            {{ t('home.description') }}
          </div>
        </div>
      </div>
      <div @click="navigateTo('/sheets?from=home')" class="bg-kaki flex items-center justify-center">
        <div class="h-84 flex flex-col items-center justify-between transform -translate-y-14">
          <div class="text-2xl font-athelas text-center leading-20" style="font-size: 70px;">
            {{ t('home.explanatorySheets') }}<br>
          </div>
          <div>
            <ArrowIn />
          </div>
        </div>
      </div>
      <div @click="navigateTo('/videos')" class="bg-lightkaki flex items-center justify-center">
        <div class="h-84 flex flex-col items-center justify-between transform -translate-y-14">
          <div class="text-2xl font-athelas text-center leading-20" style="font-size: 70px;">
            {{ t('home.videotheque') }}
          </div>
          <ArrowIn />
        </div>
      </div>
    </div>
  </div>
</template>