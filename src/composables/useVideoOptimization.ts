import { ref, computed } from 'vue'

export interface VideoOptimizationConfig {
  maxRetries: number
  retryDelay: number
  memoryThreshold: number
  preloadStrategy: 'none' | 'metadata' | 'auto'
  enableMemoryMonitoring: boolean
  enableProgressiveLoading: boolean
}

const defaultConfig: VideoOptimizationConfig = {
  maxRetries: 3,
  retryDelay: 2000,
  memoryThreshold: 0.8,
  preloadStrategy: 'metadata',
  enableMemoryMonitoring: true,
  enableProgressiveLoading: true
}

export function useVideoOptimization(config: Partial<VideoOptimizationConfig> = {}) {
  const finalConfig = { ...defaultConfig, ...config }
  
  const isBuffering = ref(false)
  const isLoading = ref(false)
  const hasError = ref(false)
  const retryCount = ref(0)
  const memoryUsage = ref(0)
  
  // Check if device is likely a BrightSign or similar embedded device
  const isEmbeddedDevice = computed(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    return userAgent.includes('brightsign') || 
           userAgent.includes('embedded') ||
           navigator.hardwareConcurrency <= 4 // Low core count suggests embedded device
  })
  
  // Get optimal preload strategy based on device capabilities
  const getOptimalPreloadStrategy = computed(() => {
    if (isEmbeddedDevice.value) {
      return 'metadata' // Conservative for embedded devices
    }
    return finalConfig.preloadStrategy
  })
  
  // Check memory usage
  const checkMemoryUsage = () => {
    // Check if performance.memory is available (Chrome-specific API)
    if ('memory' in performance && performance.memory) {
      const memory = (performance as any).memory
      const used = memory.usedJSHeapSize / 1024 / 1024
      const limit = memory.jsHeapSizeLimit / 1024 / 1024
      memoryUsage.value = used / limit
      
      return {
        usedMB: used,
        limitMB: limit,
        percentage: memoryUsage.value,
        isHigh: memoryUsage.value > finalConfig.memoryThreshold
      }
    }
    return null
  }
  
  // Clean up video resources
  const cleanupVideo = (videoElement: HTMLVideoElement) => {
    if (!videoElement) return
    
    videoElement.pause()
    videoElement.src = ''
    videoElement.load()
    
    // Clear any buffered data
    if (videoElement.buffered && videoElement.buffered.length > 0) {
      // Force clear buffer by setting currentTime to 0
      videoElement.currentTime = 0
    }
  }
  
  // Progressive loading strategy
  const setupProgressiveLoading = (videoElement: HTMLVideoElement) => {
    if (!finalConfig.enableProgressiveLoading) return
    
    let lastBufferCheck = 0
    const bufferCheckInterval = 5000 // Check every 5 seconds
    
    const checkBuffer = () => {
      const now = Date.now()
      if (now - lastBufferCheck < bufferCheckInterval) return
      lastBufferCheck = now
      
      if (videoElement.buffered.length > 0) {
        const bufferedEnd = videoElement.buffered.end(videoElement.buffered.length - 1)
        const currentTime = videoElement.currentTime
        const duration = videoElement.duration
        
        // If we have enough buffer (30 seconds or 50% of remaining video), pause loading
        const remainingTime = duration - currentTime
        const bufferAhead = bufferedEnd - currentTime
        
        if (bufferAhead > 30 || bufferAhead > remainingTime * 0.5) {
          // Pause loading to save memory
          videoElement.preload = 'none'
        } else if (bufferAhead < 10) {
          // Resume loading if buffer is low
          videoElement.preload = getOptimalPreloadStrategy.value
        }
      }
    }
    
    // Check buffer periodically
    const interval = setInterval(checkBuffer, 2000)
    
    return () => clearInterval(interval)
  }
  
  // Retry mechanism with exponential backoff
  const retryWithBackoff = async (fn: () => Promise<void> | void) => {
    if (retryCount.value >= finalConfig.maxRetries) {
      hasError.value = true
      return false
    }
    
    retryCount.value++
    const delay = finalConfig.retryDelay * Math.pow(2, retryCount.value - 1)
    
    try {
      await new Promise(resolve => setTimeout(resolve, delay))
      await fn()
      return true
    } catch (error) {
      console.error(`Retry ${retryCount.value} failed:`, error)
      return retryWithBackoff(fn)
    }
  }
  
  // Reset states
  const resetStates = () => {
    isBuffering.value = false
    isLoading.value = false
    hasError.value = false
    retryCount.value = 0
  }
  
  // Get video optimization recommendations
  const getOptimizationRecommendations = () => {
    const recommendations = []
    
    if (isEmbeddedDevice.value) {
      recommendations.push('Use H.264 codec with baseline profile')
      recommendations.push('Keep video bitrate under 2 Mbps')
      recommendations.push('Use 1080p or lower resolution')
      recommendations.push('Prefer MP4 container format')
    }
    
    if (memoryUsage.value > 0.7) {
      recommendations.push('Consider reducing video quality')
      recommendations.push('Enable progressive loading')
      recommendations.push('Monitor memory usage closely')
    }
    
    return recommendations
  }
  
  return {
    // State
    isBuffering,
    isLoading,
    hasError,
    retryCount,
    memoryUsage,
    
    // Computed
    isEmbeddedDevice,
    getOptimalPreloadStrategy,
    
    // Methods
    checkMemoryUsage,
    cleanupVideo,
    setupProgressiveLoading,
    retryWithBackoff,
    resetStates,
    getOptimizationRecommendations
  }
}
