export interface PresentationPage {
  title: string
  description: string
  imageDescription: string
}

export interface HistoryPage {
  title: string
  history: string
  areaProductionImage: string
  areaProductionDescription: string
}

export interface DetailsPage {
  title: string
  description: string
  imageDescription: string
}

export type SheetPage = PresentationPage | HistoryPage | DetailsPage

export interface SheetItem {
  id: number
  title: string | { fr: string; eus: string }
  thumbnail: string
  pages: Array<{
    presentation?: { fr: string; eus: string }
    imagePresentation?: string
    history?: { fr: string; eus: string }
    areaProductionImage?: string
    areaProductionDescription?: { fr: string; eus: string }
    characteristics?: Array<{ fr: string; eus: string }>
    products?: Array<{ fr: string; eus: string }>
    keyfigures?: Array<{ fr: string; eus: string }>
    website?: string
    observatory?: string
  }>
}

export type SheetsData = SheetItem[]
