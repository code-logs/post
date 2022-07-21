export interface PostRef {
  title: string
  url: string
}

export interface Post {
  title: string
  fileName: string
  description: string
  category: string
  published: boolean
  publishedAt: string
  thumbnailName: string
  tags: string[]
  references?: PostRef[]
  series?: {
    prevPostTitle?: string
    nextPostTitle?: string
  }
}
