import { ref } from 'vue'
import videosDataRaw from '../data/videos.json'
import sheetsDataRaw from '../data/sheets.json'
import type { SheetItem } from '../types/sheets'

const videosData = videosDataRaw as any[]
const sheetsData = sheetsDataRaw as SheetItem[]

const isPreloadComplete = ref(false)
const currentPreloadIndex = ref(0)
const allImages = ref<string[]>([])

export function useImagePreloader() {
  const collectAllImages = () => {
    const images = new Set<string>()

    // Add idle screen image
    images.add('/images/idlescreen.jpg')

    // Add language icons (PNG versions for BrightSign compatibility)
    images.add('/icons/fr.png')
    images.add('/icons/fr-sub.png')
    images.add('/icons/eus.png')
    images.add('/icons/eus-sub.png')
    images.add('/icons/lsf.png')

    // Add video thumbnails
    videosData.forEach(video => {
      if (video.thumbnail) {
        images.add(video.thumbnail)
      }
    })

    // Add images from sheets
    sheetsData.forEach(sheet => {
      if (sheet.thumbnail) {
        images.add(sheet.thumbnail)
      }
      
      // Add page images
      if (sheet.pages) {
        sheet.pages.forEach(page => {
          if (page.imagePresentation) {
            images.add(page.imagePresentation)
          }
          if (page.areaProductionImage) {
            images.add(page.areaProductionImage)
          }
        })
      }
    })

    // Convert Set to Array and filter out empty strings
    allImages.value = Array.from(images).filter(img => img && img.trim() !== '')
    return allImages.value
  }

  const startPreload = () => {
    collectAllImages()
    currentPreloadIndex.value = 0
    isPreloadComplete.value = false
  }

  const markPreloadComplete = () => {
    isPreloadComplete.value = true
  }

  return {
    isPreloadComplete,
    currentPreloadIndex,
    allImages,
    collectAllImages,
    startPreload,
    markPreloadComplete
  }
}

