import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { apis } from '../apis/index.js'
import '../components/markdown-view-editor/markdown-view-editor.js'
import '../components/now-loading/now-loading.js'
import '../components/post-info/post-info.js'
import { Post } from '../types/post.js'
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
    this.post = await apis.getPost(postFileName)
  }

  render() {
    if (!this.post?.content) return html`<now-loading></now-loading>`

    return html`
      <markdown-view-editor
        enablePreview
        .content=${this.post.content}
      ></markdown-view-editor>
    `
  }
}
