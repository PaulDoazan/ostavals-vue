export interface SheetPage {
  title: string
  description: string
  image: string
}

export interface SheetItem {
  id: number
  title: string
  thumbnail: string
  description: string
  pages: SheetPage[]
}

export type SheetsData = SheetItem[]
