import { ref } from 'vue'

export const useTextSize = () => {
  const textSize = ref<'small' | 'medium' | 'large'>('medium')

  const setTextSize = (size: 'small' | 'medium' | 'large') => {
    textSize.value = size
    // Update CSS variables for text size
    const root = document.documentElement
    switch (size) {
      case 'small':
        root.style.setProperty('--text-size-base', '1.25rem')
        root.style.setProperty('--text-size-large', '1.75rem')
        root.style.setProperty('--text-size-xlarge', '2.5rem')
        break
      case 'medium':
        root.style.setProperty('--text-size-base', '1.5rem')
        root.style.setProperty('--text-size-large', '2.5rem')
        root.style.setProperty('--text-size-xlarge', '4rem')
        break
      case 'large':
        root.style.setProperty('--text-size-base', '2rem')
        root.style.setProperty('--text-size-large', '3rem')
        root.style.setProperty('--text-size-xlarge', '5rem')
        break
    }
  }

  return {
    textSize,
    setTextSize
  }
} 