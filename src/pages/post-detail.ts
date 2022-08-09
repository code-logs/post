import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { apis } from '../apis/index.js'
import '../components/markdown-view-editor/markdown-view-editor.js'
import '../components/now-loading/now-loading.js'
// eslint-disable-next-line import/no-duplicates
import { PostInfo } from '../components/post-info/post-info.js'
// eslint-disable-next-line import/no-duplicates
import '../components/post-info/post-info.js'
import { buttonBoxStyle } from '../components/styles/styles.js'
import { Post } from '../types/post.js'
import { PageElement } from './abstracts/page-element.js'
import { navigate } from '../components/dom-router/dom-router.js'
import { debounce } from '../utils/debounce.js'

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
  private content?: string

  static styles = css`
    ${buttonBoxStyle}
    section#post-detail {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }
    #view-editor-container {
      display: flex;
      flex-direction: column;
      min-height: 700px;
    }
  `

  constructor() {
    super()
    this.postFileName = window.location.pathname.replace(/^\/posts\//g, '')
    if (!this.postFileName) window.location.href = '/'
    this.pageTitle = `Post Logs | ${this.postFileName}`
  }

  private get postInfo() {
    const postInfo = this.renderRoot.querySelector<PostInfo>('post-info')
    if (!postInfo) throw new Error('No post info element found')

    return postInfo
  }

  protected firstUpdated(): void {
    if (this.postFileName) this.fetchPost(this.postFileName)
  }

  async fetchPost(postFileName: string) {
    this.post = await apis.getPost(postFileName)
  }

  private async deletePost() {
    if (!this.post?.fileName) throw new Error('No post fileName found')
    const answer = window.confirm('포스팅을 삭제할까요?')
    if (answer) await apis.deletePost(this.post.fileName)
    alert('포스팅이 삭제 됐습니다.')
    navigate('/')
  }

  private async updatePost() {
    try {
      const postId = this.post?.id
      if (!postId) throw new Error('포스팅 아이디를 찾을 수 없습니다.')
      const content = this.content || this.post?.content
      if (!content) throw new Error('작성된 포스팅이 없습니다.')

      const { tempPost, thumbnail } = this.postInfo.serialize()

      const answer = window.confirm('포스팅의 변경사항을 저장할까요?')
      if (!answer) return

      await apis.updatePost(postId, tempPost, content, thumbnail)

      alert('포스팅이 저장 됐습니다.')
      navigate('/')
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message)
      } else {
        alert('Unexpected error occurred')
      }

      throw e
    }
  }

  render() {
    if (!this.post?.content) return html`<now-loading></now-loading>`

    const valueChangeHandler = debounce((event: Event) => {
      if (event instanceof CustomEvent) {
        const { value } = (event as CustomEvent<{ value: string }>).detail
        this.content = value
      }
    })

    return html`
      <section id="post-detail">
        <post-info
          .post=${this.post}
          .content=${this.content || this.post.content}
        ></post-info>

        <div id="view-editor-container">
          <markdown-view-editor
            enablePreview
            @valueChange=${valueChangeHandler}
            .content=${this.post.content}
          ></markdown-view-editor>
        </div>

        <div class="button-container">
          ${this.post.isCreated
            ? html`<button danger @click=${this.deletePost}>삭제</button>`
            : ''}

          <button @click=${this.updatePost}>저장</button>
        </div>
      </section>
    `
  }
}
