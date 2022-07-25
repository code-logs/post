import { Post, TempPost } from '../types/post.js'
import { Tag } from '../types/tag.js'
import fetcher from '../utils/fetcher.js'

export const apis = {
  async getPosts() {
    return fetcher.get<Post[]>('/posts')
  },

  async getPost(name: string) {
    return fetcher.get<Post>(`/posts/${name}`)
  },

  async createPost(tempPost: TempPost, content: string, thumbnail: File) {
    const formData = new FormData()
    formData.append('tempPost', JSON.stringify(tempPost))
    formData.append('content', content)
    formData.append('thumbnail', thumbnail)

    return fetcher.post<Post, FormData>('/posts', formData, {
      'content-type': 'multipart/form-data',
    })
  },

  async getCategories() {
    return fetcher.get<string[]>('/categories')
  },

  async getTags() {
    return fetcher.get<Tag[]>('/tags')
  },

  async getLastSyncDatetime() {
    return fetcher.get<number | null>('/configurations/last-sync-datetime')
  },

  async syncRepository() {
    return fetcher.post<boolean, void>('/configurations/sync-repository')
  },
}
