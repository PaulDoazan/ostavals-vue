<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Menu from '../Menu/index.vue'

const { t } = useI18n()
const router = useRouter()

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="w-screen bg-background">
    <Menu />
    <div class="h-screen flex flex-col items-center justify-center">
      <div class="text-center">
        <h1 class="text-4xl font-bold mb-6">{{ t('resources.title', 'Resources') }}</h1>
        <p class="text-xl mb-8">{{ t('resources.description', 'Resources section content') }}</p>
        <button @click="goBack" class="bg-creme px-6 py-3 rounded-lg hover:bg-opacity-80 transition-all">
          {{ t('common.back', 'Back to Home') }}
        </button>
      </div>
    </div>
  </div>
</template>
