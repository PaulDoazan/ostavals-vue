import { ref, computed } from 'vue'
import QRCode from 'qrcode'

export function useQRCode() {
  const qrCodeDataUrl = ref<string>('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const generateQRCode = async (text: string, options?: QRCode.QRCodeToDataURLOptions): Promise<string | null> => {
    if (!text || text.trim() === '') {
      error.value = 'Text cannot be empty'
      return null
    }

    isLoading.value = true
    error.value = null

    try {
      const defaultOptions: QRCode.QRCodeToDataURLOptions = {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        ...options
      }

      const dataUrl = await QRCode.toDataURL(text, defaultOptions)
      qrCodeDataUrl.value = dataUrl
      return dataUrl
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to generate QR code'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const generateQRCodeFromUrl = async (url: string, options?: QRCode.QRCodeToDataURLOptions): Promise<string | null> => {
    if (!url || url.trim() === '') {
      return null
    }

    // Ensure URL has protocol if missing
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`
    
    return await generateQRCode(formattedUrl, options)
  }

  const clearQRCode = () => {
    qrCodeDataUrl.value = ''
    error.value = null
  }

  return {
    qrCodeDataUrl: computed(() => qrCodeDataUrl.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    generateQRCode,
    generateQRCodeFromUrl,
    clearQRCode
  }
}
