import { Post } from '../types/post.js'
import fetcher from '../utils/fetcher.js'

export const apis = {
  async getPosts() {
    return fetcher.get<Post[]>('/posts')
  },

  async getLastSyncDatetime() {
    return fetcher.get<number | null>('/configurations/last-sync-datetime')
  },

  async syncRepository() {
    return fetcher.post<boolean, void>('/configurations/sync-repository')
  },
}
