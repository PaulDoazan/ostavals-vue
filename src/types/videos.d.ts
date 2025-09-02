export interface VideoItem {
  id: number
  title: {
    fr: string
    eus: string
  }
  thumbnail: string
  urls: {
    fr?: string
    eus?: string
  }
}

export type VideosData = VideoItem[]
