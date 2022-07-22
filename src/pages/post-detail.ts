import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '../components/markdown-editor/markdown-editor.js'
import { Post } from '../types/post.js'
import fetcher from '../utils/fetcher.js'
import { PageElement } from './abstracts/page-element.js'
import '../components/markdown-preview/markdown-preview.js'

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

  static styles = css`
    #editor {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
  `

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
      <section>
        <header>
          <label>
            <input
              type="checkbox"
              .checked=${Boolean(this.enablePreview)}
              @change=${() => {
                this.enablePreview = !this.enablePreview
              }}
            />
            <span>Preview</span>
          </label>
        </header>

        ${this.enablePreview
          ? html`<markdown-preview
              .markdown=${this.content}
            ></markdown-preview>`
          : html`<markdown-editor
              .value=${this.content}
              @valueChange=${(event: CustomEvent) => {
                this.content = event.detail.value
              }}
            ></markdown-editor>`}
      </section>
    `
  }
}
