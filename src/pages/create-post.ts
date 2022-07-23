import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { marked } from 'marked'
import { navigate } from '../components/dom-router/dom-router.js'
import '../components/markdown-view-editor/markdown-view-editor.js'
// eslint-disable-next-line import/no-duplicates
import '../components/post-info/post-info.js'
// eslint-disable-next-line import/no-duplicates
import { PostInfo } from '../components/post-info/post-info.js'
import { Post, PostRef } from '../types/post.js'
import fetcher from '../utils/fetcher.js'
import { PageElement } from './abstracts/page-element.js'

@customElement('create-post')
export class CreatePost extends PageElement {
  pageTitle: string = 'Post Logs - 글쓰기'

  @property({ type: Array })
  refCandidates: PostRef[] = []

  private content?: string

  static styles = css`
    section#create-post {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
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

  get postInfo() {
    const postInfo = this.renderRoot.querySelector<PostInfo>('post-info')
    if (!postInfo) throw new Error('Failed to find post-info element')

    return postInfo
  }

  private searchReferences(markdownContent: string) {
    const tempContainer = document.createElement('div')
    tempContainer.innerHTML = marked.parse(markdownContent)
    const anchorTags = tempContainer.querySelectorAll<HTMLAnchorElement>('a')
    if (!anchorTags.length) this.refCandidates = []

    const tempRefCandidates: PostRef[] = []
    const hrefList = new Set()
    anchorTags.forEach((anchorTag) => {
      const { href, innerText } = anchorTag
      if (href && !hrefList.has(href)) {
        hrefList.add(href)
        tempRefCandidates.push({
          title: innerText || href,
          url: href,
        })
      }
    })

    this.refCandidates = [...tempRefCandidates]
    tempContainer.remove()
  }

  private async saveHandler() {
    try {
      const { thumbnail, ...post } = this.postInfo.serialize()
      if (!this.content) throw new Error('작성된 포스팅이 없습니다.')

      await fetcher.post<Post, Post & { content: string; thumbnail: File }>(
        '/posts',
        {
          ...post,
          content: this.content,
          thumbnail,
        }
      )

      if (post.published) {
        alert('새로운 포스트가 등록되어 배포중 입니다.')
      } else {
        alert('새로운 포스트가 등록 되었습니다.')
      }

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
    return html`<section id="create-post">
      <post-info .references=${this.refCandidates}></post-info>

      <markdown-view-editor
        @change=${(event: Event) => {
          if (event instanceof CustomEvent) {
            const { value } = (event as CustomEvent<{ value: string }>).detail
            this.searchReferences(value)
            this.content = value
          }
        }}
      ></markdown-view-editor>

      <section id="button-container">
        <button @click=${this.saveHandler}>저장</button>
      </section>
    </section> `
  }
}
