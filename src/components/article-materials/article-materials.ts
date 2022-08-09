import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { apis } from '../../apis/index.js'
import { ArticleMaterial } from '../../types/article-material.js'

@customElement('article-materials')
export class ArticleMaterials extends LitElement {
  @property({ type: Array })
  private articleMaterials: ArticleMaterial[] = []

  static styles = css`
    :host {
      position: sticky;
      top: 0;
    }
    #article-materials {
      padding: 5px;
    }
    #material-list {
      list-style: none;
      padding: 5px;
      margin: 0;
      display: grid;
      gap: 5px;
    }
    #header-title {
      font-weight: 700;
    }
    .list-item {
      padding: 5px;
      border: 1px dashed var(--theme-red-color);
      background-color: var(--theme-light-background-color);
      transition: transform 0.15s ease-in-out 0s;
      z-index: 2;
    }
    .list-item:hover {
      transform: translateX(-30px);
    }
    .created-at {
      font-size: 0.75rem;
    }
    .title {
      font-size: 0.8rem;
      margin: 5px 0;
    }
    a {
      color: inherit;
      text-decoration: none;
    }
  `

  protected firstUpdated() {
    this.fetchArticleMaterials()
  }

  private async fetchArticleMaterials() {
    this.articleMaterials = await apis.getArticleMaterials()
  }

  render() {
    return html`
      <section id="article-materials">
        <header>
          <span id="header-title">글감</span>
        </header>
        <ul id="material-list">
          ${this.articleMaterials.map(
            ({ title, url, createdAt }) =>
              html`<li class="list-item">
                <span class="created-at"
                  >${new Date(createdAt).toLocaleString()}</span
                >
                <p class="title">
                  <a target="_blank" href=${url}>🔗 ${title}</a>
                </p>
              </li>`
          )}
        </ul>
      </section>
    `
  }
}
