import { Post } from './post.js'

export interface Tag {
  id: string
  name: string
  post: Post
}

export type TempTag = Omit<Tag, 'id' | 'post'> &
  Partial<Pick<Tag, 'id' | 'post'>>
