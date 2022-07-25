import { Post } from './post.js'

export interface PostRef {
  id: string
  title: string
  url: string
  post: Post
}

export type TempPostRef = Omit<PostRef, 'id' | 'post'> &
  Partial<Pick<PostRef, 'id' | 'post'>>
