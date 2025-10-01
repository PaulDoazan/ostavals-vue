export interface VideoItem {
  id: number
  title: {
    fr: string
    eus: string
  }
  thumbnail: string
  url: string
  icons: string[]
}

export type VideosData = VideoItem[]
