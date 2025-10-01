import { ref, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const IDLE_TIMEOUT = 60000 // 1 minutes
const WARNING_TIMEOUT = 10000 // 10 seconds warning

export function useIdleScreen() {
  const { locale } = useI18n()
  
  // State
  const isIdleScreenVisible = ref(true)
  const showWarning = ref(false)
  const countdown = ref(5)
  const isIdleActive = ref(false)
  const isVideoPlaying = ref(false)
  
  // Timers
  let idleTimer: number | null = null
  let warningTimer: number | null = null
  let countdownTimer: number | null = null
  
  // Warning messages
  const warningMessages = {
    fr: "Cliquez si vous ne voulez pas revenir à l'écran de veille",
    eus: "Egin klik ez baduzu pantaila atsedeneko itzuli nahi"
  }
  
  // Start the idle timer
  const startIdleTimer = () => {
    clearAllTimers()
    
    if (isIdleScreenVisible.value) return // Don't start timer if already on idle screen
    if (isVideoPlaying.value) return // Don't start timer if video is playing
    
    idleTimer = window.setTimeout(() => {
      // Double-check video is not playing before showing warning
      if (isVideoPlaying.value) {
        startIdleTimer() // Restart timer if video started playing
        return
      }
      
      showWarning.value = true
      countdown.value = 5
      isIdleActive.value = true
      
      // Start countdown
      countdownTimer = window.setInterval(() => {
        // Check if video started playing during countdown
        if (isVideoPlaying.value) {
          clearAllTimers()
          startIdleTimer() // Restart timer
          return
        }
        
        countdown.value--
        if (countdown.value <= 0) {
          showIdleScreen()
        }
      }, 1000)
      
      // Auto-hide warning after 5 seconds
      warningTimer = window.setTimeout(() => {
        showIdleScreen()
      }, WARNING_TIMEOUT)
      
    }, IDLE_TIMEOUT)
  }
  
  // Show idle screen
  const showIdleScreen = () => {
    clearAllTimers()
    isIdleScreenVisible.value = true
    showWarning.value = false
    isIdleActive.value = false
    countdown.value = 5
  }
  
  // Hide idle screen and start timer
  const hideIdleScreen = () => {
    clearAllTimers()
    isIdleScreenVisible.value = false
    showWarning.value = false
    isIdleActive.value = false
    countdown.value = 5
    startIdleTimer()
  }
  
  // Reset idle timer (call on any user interaction)
  const resetIdleTimer = () => {
    if (isIdleScreenVisible.value) return // Don't reset if on idle screen
    clearAllTimers()
    startIdleTimer()
  }
  
  // Set video playing state
  const setVideoPlaying = (playing: boolean) => {
    isVideoPlaying.value = playing
    if (playing) {
      // Clear any active timers when video starts playing
      clearAllTimers()
      showWarning.value = false
      isIdleActive.value = false
    } else {
      // Start timer when video stops playing
      if (!isIdleScreenVisible.value) {
        startIdleTimer()
      }
    }
  }
  
  // Clear all timers
  const clearAllTimers = () => {
    if (idleTimer) {
      clearTimeout(idleTimer)
      idleTimer = null
    }
    if (warningTimer) {
      clearTimeout(warningTimer)
      warningTimer = null
    }
    if (countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }
  
  // Cancel idle screen return
  const cancelIdleReturn = () => {
    clearAllTimers()
    showWarning.value = false
    isIdleActive.value = false
    countdown.value = 5
    startIdleTimer() // Restart the timer
  }
  
  // Get current warning message
  const getWarningMessage = () => {
    return warningMessages[locale.value as 'fr' | 'eus'] || warningMessages.fr
  }
  
  // Cleanup on unmount
  onUnmounted(() => {
    clearAllTimers()
  })
  
  return {
    isIdleScreenVisible,
    showWarning,
    countdown,
    isIdleActive,
    isVideoPlaying,
    showIdleScreen,
    hideIdleScreen,
    resetIdleTimer,
    cancelIdleReturn,
    setVideoPlaying,
    getWarningMessage
  }
}
