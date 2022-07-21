import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { Post } from '../../types/post.js'

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
      grid-template-columns: 1fr auto;
    }

    h2 {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--theme-font-color);
      margin: 10px;
    }
    p {
      margin: 10px;
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
    }

    .thumbnail {
      border-radius: 6px;
      width: 200px;
    }
  `

  render() {
    return html`
      <section class="post-card">
        <div>
          <header>
            <h2 class="title">${this.post.title}</h2>
          </header>
          <p>${this.post.description}</p>
        </div>

        <div class="right-column">
          ${this.post.published
            ? html`<span class="published-at"
                >${new Date(this.post.publishedAt).toDateString()}</span
              >`
            : 'Draft'}
          ${this.post.thumbnailName &&
          html`<img
            class="thumbnail"
            alt="${this.post.title}"
            src=${`https://code-logs.github.io/assets/images/${this.post.thumbnailName}`}
          />`}
        </div>
      </section>
    `
  }
}
