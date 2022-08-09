import { ArticleMaterial } from '../types/article-material.js'
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

  async updatePost(
    postId: string,
    tempPost: TempPost,
    content: string,
    thumbnail?: File
  ) {
    const formData = new FormData()
    formData.append('tempPost', JSON.stringify(tempPost))
    formData.append('content', content)
    if (thumbnail) formData.append('thumbnail', thumbnail)

    return fetcher.put<Post, FormData>(`/posts/${postId}`, formData, {
      'content-type': 'multipart/form-data',
    })
  },

  async deletePost(postFilename: string) {
    await fetcher.delete<void>(`/posts/${postFilename.replace(/\.md$/, '')}`)
  },

  async deployPosts() {
    return fetcher.post<Post, { result: boolean }>('/deploy')
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

  async getModifiedPosts() {
    return fetcher.get<Post[]>('/modified-posts')
  },

  async getTemplate() {
    return fetcher.get<string | null>('/configurations/template')
  },

  async saveTemplate(content: string) {
    return fetcher.post<string, { content: string }>(
      '/configurations/save-template',
      { content }
    )
  },

  async getArticleMaterials() {
    return fetcher.get<ArticleMaterial[]>('/article-materials')
  },

  async getTotalPostCount() {
    return fetcher.get<number>('/total-post-count')
  },

  async getLastPostingDate() {
    return fetcher.get<number | null>('/last-posting-date')
  },
}
