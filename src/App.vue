<script setup lang="ts">
import IdleScreen from './components/Idle/index.vue'
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const showIdleScreen = ref(true)
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const goToCredits = () => {
  router.push('/credits')
}

const isHomePage = computed(() => route.name === 'Home')
</script>

<template>
  <div class="bg-background relative">
    <IdleScreen v-if="showIdleScreen" @click="showIdleScreen = false" />
    <template v-else>
      <!-- Vertical Credits Button on the left side - only on Home page -->
      <button v-if="isHomePage" @click="goToCredits"
        class="fixed -left-10 top-3/4 transform z-50 bg-background border-2 border-red border-b-0 px-3 pt-6 pb-10 rounded-t-lg"
        style="transform: translateY(-50%) rotate(90deg);">
        <span class="text-red text-3xl tracking-wider">
          {{ t('credits.button') }}
        </span>
      </button>
      <router-view />
    </template>
  </div>
</template>