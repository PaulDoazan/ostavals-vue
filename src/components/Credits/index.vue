<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Back from '../Icon/Back.vue'

const { t } = useI18n()
const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="w-screen h-screen bg-background flex items-center justify-center">
    <div class="max-w-4xl mx-auto p-8">
      <div class="flex items-center justify-between mb-8">
        <button @click="goBack" class="flex items-center gap-2 text-lg hover:opacity-70 transition-opacity">
          <Back />
          {{ t('common.back') }}
        </button>
        <h1 class="text-4xl font-bold font-athelas">{{ t('credits.title') }}</h1>
        <div class="w-24"></div> <!-- Spacer for centering -->
      </div>

      <div class="space-y-6 text-lg">
        <div class="text-center">
          <h2 class="text-2xl font-bold mb-4">Ostavals</h2>
          <p class="text-gray-600">Application de découverte du patrimoine agricole</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-xl font-semibold mb-3">Développement</h3>
            <p>Application Vue.js développée pour la découverte interactive du patrimoine agricole du territoire.</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">Contenu</h3>
            <p>Fiches explicatives et vidéos sur les filières agricoles, le patrimoine et les productions du territoire.
            </p>
          </div>
        </div>

        <div class="text-center text-gray-500 mt-8">
          <p>&copy; 2024 Ostavals. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  </div>
</template>
