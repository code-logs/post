import { PostRef, TempPostRef } from './post-ref.js'
import { Series, TempSeries } from './series.js'
import { Tag, TempTag } from './tag.js'

export interface Post {
  id: string
  title: string
  fileName: string
  description: string
  category: string
  published: boolean
  publishedAt: string
  thumbnailName: string
  content: string
  tags: Tag[]
  references: PostRef[]
  series?: Series
  isCreated: boolean
  isUpdated: boolean
}

export interface TempPost
  extends Omit<
    Post,
    | 'id'
    | 'tags'
    | 'references'
    | 'series'
    | 'content'
    | 'thumbnailName'
    | 'publishedAt'
    | 'isCreated'
    | 'isUpdated'
  > {
  id?: string
  tags: TempTag[]
  references?: TempPostRef[]
  series?: TempSeries
  content?: string
  publishedAt?: string
}
