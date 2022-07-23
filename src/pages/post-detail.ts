import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '../components/markdown-view-editor/markdown-view-editor.js'
import { Post } from '../types/post.js'
import fetcher from '../utils/fetcher.js'
import { PageElement } from './abstracts/page-element.js'

@customElement('post-detail')
export class PostDetail extends PageElement {
  pageTitle: string = ''

  @property({ type: Boolean })
  enablePreview?: boolean = false

  @property({ type: String })
  postFileName?: string

  @property({ type: Object })
  post?: Post

  @property({ type: String })
  content: string = ''

  constructor() {
    super()
    this.postFileName = window.location.pathname.replace(/^\/posts\//g, '')
    if (!this.postFileName) window.location.href = '/'
    this.pageTitle = `Post Logs - ${this.postFileName}`
  }

  protected firstUpdated(): void {
    if (this.postFileName) this.fetchPost(this.postFileName)
  }

  async fetchPost(postFileName: string) {
    const { post, content } = await fetcher.get<{
      post: Post
      content: string
    }>(`/posts/${postFileName}`)

    this.post = post
    this.content = content
  }

  render() {
    return html`
      <markdown-view-editor
        enablePreview
        .content=${this.content}
      ></markdown-view-editor>
    `
  }
}
