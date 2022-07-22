import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { Post, PostRef } from '../../types/post.js'
import fetcher from '../../utils/fetcher.js'

@customElement('post-info')
export class PostInfo extends LitElement {
  @property({ type: Object })
  post?: Post

  @property({ type: Array })
  references: PostRef[] = []

  @property({ type: Array })
  private categories: string[] = []

  @property({ type: Array })
  private posts: Post[] = []

  @property({ type: Array })
  private tags: string[] = []

  static styles = css`
    :host {
      font-family: sans-serif;
      color: var(--theme-font-color);
      font-size: 0.8rem;
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }
    section {
      border: 1px dashed var(--theme-red-color);
      padding: 10px;
      background-color: var(--theme-light-background-color);
    }
    section > h2 {
      margin: 0 0 10px;
      padding-bottom: 5px;
      border-bottom: 1px dashed var(--theme-red-color);
    }
    form {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }
    form > label {
      display: grid;
      grid-template-rows: auto 1fr;
      gap: 5px;
    }
    form input,
    form select {
      box-sizing: border-box;
      border: 1px dashed var(--theme-red-color);
      outline: none;
      background-color: transparent;
      max-width: 180px;
      height: 30px;
      margin: auto 0;
      padding: 0 5px;
    }
    form input[type='checkbox'] {
      margin: auto auto auto 0;
    }
    #tag-selector > div {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
    }
    #tag-selector label {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 5px;
      overflow: hidden;
      white-space: nowrap;
    }
    #tag-selector label > span {
      text-overflow: ellipsis;
      overflow: hidden;
    }
  `

  protected firstUpdated() {
    this.fetchPosts()
    this.fetchCategories()
    this.fetchTags()
  }

  private async fetchCategories() {
    this.categories = await fetcher.get<string[]>('/categories')
  }

  private async fetchPosts() {
    this.posts = await fetcher.get<Post[]>('/posts')
  }

  private async fetchTags() {
    this.tags = await fetcher.get<string[]>('/tags')
  }

  render() {
    return html`
      <section>
        <h2>Info</h2>
        <form>
          <label>
            <span>제목</span>
            <input />
          </label>

          <label>
            <span>설명</span>
            <input />
          </label>

          <label>
            <span>카테고리</span>
            <select>
              ${this.categories.map(
                (category) => html`<option>${category}</option>`
              )}
            </select>
          </label>

          <label>
            <span>작성일</span>
            <input type="date" />
          </label>

          <label>
            <span>이전글</span>
            <select>
              ${this.posts.map((post) => html`<option>${post.title}</option>`)}
            </select>
          </label>

          <label>
            <span>다음글</span>
            <select>
              ${this.posts.map((post) => html`<option>${post.title}</option>`)}
            </select>
          </label>

          <label>
            <span>배포</span>
            <input type="checkbox" />
          </label>
        </form>
      </section>

      <section id="thumbnail-selector">
        <h2>Thumbnail</h2>
        <input type="file" />
      </section>

      <section id="tag-selector">
        <h2>Tags</h2>
        <div>
          ${this.tags.map(
            (tag) => html` <label>
              <input type="checkbox" .value=${tag} />
              <span>${tag}</span>
            </label>`
          )}
        </div>
      </section>

      <section id="reference-selector">
        <h2>References</h2>
        <ul>
          ${this.references.map(
            (ref) => html`<li>
              <label>
                <input type="checkbox" .value=${ref.url} />
                <div>
                  <input .value=${ref.title} />
                  <input readonly .value=${ref.url} />
                </div>
              </label>
            </li>`
          )}
        </ul>
      </section>
    `
  }
}
