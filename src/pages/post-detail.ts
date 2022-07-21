import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { Post } from '../types/post.js'
import fetcher from '../utils/fetcher.js'
import { PageElement } from './abstracts/page-element.js'

@customElement('post-detail')
export class PostDetail extends PageElement {
  pageTitle: string = ''

  @property({ type: String })
  postFileName?: string

  @property({ type: Object })
  post?: Post

  @property({ type: String })
  content?: string

  static styles = css`
    textarea {
      font-family: sans-serif;
      color: var(--theme-font-color);
      font-size: 14px;
      resize: vertical;
      background-color: var(--theme-light-background-color);
      padding: 10px;
      border: 1px dashed var(--theme-red-color);
      width: 100%;
      min-height: 650px;
      outline: none;
    }
    textarea::-webkit-scrollbar {
      cursor: default;
      width: 5px;
    }
    textarea::-webkit-scrollbar-thumb {
      background-color: var(--theme-red-color);
      border-radius: 10px;
    }
  `

  constructor() {
    super()
    this.postFileName = window.location.pathname.replace(/^\/posts\//g, '')
    if (!this.postFileName) window.location.href = '/'
    this.pageTitle = this.postFileName
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
      ${!this.post || !this.content
        ? html`<p>데이터를 불러오는 중 입니다.</p>`
        : html`<textarea .value=${this.content}></textarea>`}
    `
  }
}
