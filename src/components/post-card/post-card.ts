import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { BASE_URL } from '../../constants/base-url.js'
import { Post } from '../../types/post.js'
import { navigate } from '../dom-router/dom-router.js'

@customElement('post-card')
export class PostCard extends LitElement {
  @property({ type: Object })
  post!: Post

  static styles = css`
    .post-card {
      display: grid;
      grid-template-columns: 1fr auto;
      border: 1px dashed var(--theme-red-color);
      padding: 10px;
      margin-bottom: 10px;
      background-color: var(--theme-light-background-color);
      transition: transform 0.2s ease-in-out 0s;
      cursor: pointer;
    }

    .post-card:hover {
      transform: scale(1.15);
    }

    header {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 5px;
    }

    .category-tag {
      border: 1px dashed var(--theme-red-color);
      border-radius: 8px;
      padding: 5px;
      margin: auto 0;
      color: var(--theme-red-color);
      font-size: 0.7rem;
      font-weight: 600;
    }

    .title {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--theme-font-color);
      margin: 10px 0;
    }
    .description {
      font-size: 0.8rem;
      font-weight: 500;
      margin: 0 5px;
      white-space: pre-wrap;
    }

    .right-column {
      display: grid;
      grid-template-rows: auto 1fr;
      gap: 10px;
    }

    .published-at {
      text-align: right;
      font-size: 0.8rem;
      color: var(--theme-red-color);
      font-weight: 600;
      border: 1px dashed var(--theme-red-color);
      border-radius: 8px;
      padding: 5px 10px;
      margin-left: auto;
    }

    .draft-tag {
      border: 1px dashed var(--theme-red-color);
      border-radius: 8px;
      padding: 5px 10px;
      margin-left: auto;
      color: var(--theme-red-color);
      font-size: 0.7rem;
      font-weight: 600;
    }

    .thumbnail {
      border-radius: 6px;
      width: 250px;
    }
  `

  private openPostDetail() {
    const name = this.post.fileName.replace(/\.md$/, '')
    navigate(`/posts/${name}`)
  }

  render() {
    return html`
      <section
        class="post-card"
        @click=${this.openPostDetail}
        @keydown=${(e: KeyboardEvent) => {
          if (e.key === 'enter') this.openPostDetail()
        }}
      >
        <div>
          <header>
            <span class="category-tag">${this.post.category}</span>
            <h2 class="title">${this.post.title}</h2>
          </header>
          <p class="description">${this.post.description}</p>
        </div>

        <div class="right-column">
          ${this.post.published
            ? html`<span class="published-at"
                >${new Date(this.post.publishedAt).toDateString()}</span
              >`
            : html`<span class="draft-tag">Draft</span>`}
          ${this.post.thumbnailName &&
          html`<img
            class="thumbnail"
            alt="${this.post.title}"
            src=${`${BASE_URL}/${this.post.thumbnailName}`}
          />`}
        </div>
      </section>
    `
  }
}
