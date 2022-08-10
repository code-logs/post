import { css, html, PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { apis } from '../apis/index.js'
import { navigate } from '../components/dom-router/dom-router.js'
import '../components/markdown-view-editor/markdown-view-editor.js'
// eslint-disable-next-line import/no-duplicates
import '../components/post-info/post-info.js'
// eslint-disable-next-line import/no-duplicates
import { PostInfo } from '../components/post-info/post-info.js'
import { TempPostRef } from '../types/post-ref.js'
import { debounce } from '../utils/debounce.js'
import { PageElement } from './abstracts/page-element.js'

@customElement('create-post')
export class CreatePost extends PageElement {
  pageTitle: string = 'Post Logs | 글쓰기'

  @property({ type: Array })
  refCandidates: TempPostRef[] = []

  @property({ type: String })
  private content?: string

  @property({ type: String })
  private template: string | null = null

  static styles = css`
    section#create-post {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }
    #view-editor-container {
      display: flex;
      flex-direction: column;
      height: 700px;
    }
    markdown-view-editor {
      flex: 1;
    }
    section#button-container {
      display: grid;
      gap: 10px;
      justify-content: end;
    }

    button {
      background-color: var(--theme-light-background-color);
      height: 40px;
      min-width: 120px;
      border: 1px dashed var(--theme-red-color);
      font-weight: 600;
      transition: transform 0.2s ease-in-out 0s;
    }
    button:hover {
      transform: scale(1.2, 1.2);
    }
    button:active {
      transform: scale(1, 1);
    }
  `

  protected firstUpdated(changedProps: PropertyValues) {
    super.firstUpdated(changedProps)
    this.getTemplate()
  }

  private async getTemplate() {
    this.template = await apis.getTemplate()
  }

  get postInfo() {
    const postInfo = this.renderRoot.querySelector<PostInfo>('post-info')
    if (!postInfo) throw new Error('Failed to find post-info element')

    return postInfo
  }

  private async createPostHandler() {
    const { tempPost, thumbnail } = this.postInfo.serialize()
    if (!this.content) throw new Error('작성된 포스팅이 없습니다.')

    await apis.createPost(tempPost, this.content, thumbnail!)

    alert('새로운 포스트가 등록 됐습니다.')
    navigate('/')
  }

  render() {
    const valueChangeHandler = debounce((event: Event) => {
      if (event instanceof CustomEvent) {
        const { value } = (event as CustomEvent<{ value: string }>).detail
        this.content = value
      }
    })

    return html`<section id="create-post">
      <post-info .content=${this.content || ''} createMode></post-info>

      <div id="view-editor-container">
        <markdown-view-editor
          enableAutoFormatting
          @valueChange=${valueChangeHandler}
          .content=${this.template || ''}
        ></markdown-view-editor>
      </div>

      <section id="button-container">
        <button @click=${this.createPostHandler}>저장</button>
      </section>
    </section> `
  }
}
