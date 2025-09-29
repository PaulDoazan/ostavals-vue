import { ref } from 'vue'

// Global state for idle management
const globalIdleManager = ref<{
  resetIdleTimer: () => void
  setVideoPlaying: (playing: boolean) => void
} | null>(null)

export function useGlobalIdle() {
  const registerIdleManager = (manager: { resetIdleTimer: () => void; setVideoPlaying: (playing: boolean) => void }) => {
    globalIdleManager.value = manager
  }
  
  const resetIdleTimer = () => {
    if (globalIdleManager.value) {
      globalIdleManager.value.resetIdleTimer()
    }
  }
  
  const setVideoPlaying = (playing: boolean) => {
    if (globalIdleManager.value) {
      globalIdleManager.value.setVideoPlaying(playing)
    }
  }
  
  return {
    registerIdleManager,
    resetIdleTimer,
    setVideoPlaying
  }
}
