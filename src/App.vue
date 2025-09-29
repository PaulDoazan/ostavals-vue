<script setup lang="ts">
import IdleScreen from './components/Idle/index.vue'
import IdleWarning from './components/IdleWarning.vue'
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useIdleScreen } from './composables/useIdleScreen'
import { useGlobalIdle } from './composables/useGlobalIdle'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

// Use idle screen composable
const {
  isIdleScreenVisible,
  showWarning,
  countdown,
  hideIdleScreen,
  resetIdleTimer,
  cancelIdleReturn,
  setVideoPlaying,
  getWarningMessage
} = useIdleScreen()

// Register global idle manager
const { registerIdleManager } = useGlobalIdle()
registerIdleManager({ resetIdleTimer, setVideoPlaying })

const goToCredits = () => {
  router.push('/credits')
}

const handleIdleScreenExit = () => {
  hideIdleScreen()
  // Navigate to home page
  router.push('/')
}

const isHomePage = computed(() => route.name === 'Home')
</script>

<template>
  <div class="bg-black relative" @click="resetIdleTimer" @keydown="resetIdleTimer" @mousemove="resetIdleTimer">
    <IdleScreen v-if="isIdleScreenVisible" @exit="handleIdleScreenExit" />

    <!-- Idle Warning -->
    <IdleWarning v-if="showWarning" :show-warning="showWarning" :countdown="countdown"
      :warning-message="getWarningMessage()" @cancel="cancelIdleReturn" />

    <template v-if="!isIdleScreenVisible">
      <!-- Vertical Credits Button on the left side - only on Home page -->
      <button v-if="isHomePage" @click="goToCredits; resetIdleTimer()"
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