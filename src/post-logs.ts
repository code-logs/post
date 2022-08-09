import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import './components/app-title/app-title.js'
import { Page } from './components/dom-router/types/page.js'
import './components/menu-list/menu-list.js'
import './components/modal-spinner/modal-spinner.js'
import { pages } from './constants/pages.js'
import './pages/index.js'
import './components/article-materials/article-materials.js'
import './components/total-post/total-post.js'
import './components/post-promoter/post-promoter.js'

@customElement('post-logs')
export class PostLogs extends LitElement {
  @property({ type: Object })
  activePage?: Page

  static styles = css`
    :host {
      min-height: 100vh;
      display: grid;
      grid-template-areas: 'header aside' 'main aside' 'footer aside';
      grid-template-columns: 1fr 250px;
      grid-template-rows: auto 1fr auto;
    }
    header {
      grid-area: header;
      z-index: 1;
      position: sticky;
      top: 0;
      background-color: var(--theme-background-color);
    }
    main {
      grid-area: main;
      flex-grow: 1;
      width: 800px;
      max-width: 800px;
      margin: 20px auto 0 auto;
      padding-bottom: 10px;
    }
    aside {
      grid-area: aside;
      background-color: var(--theme-light-background-color);
      border-left: 1px dashed var(--theme-red-color);
      z-index: 2;
    }
    footer {
      position: sticky;
      z-index: 3;
      bottom: 0;
      grid-area: footer;
      width: 100%;
      background-color: var(--theme-light-background-color);
      border-top: 1px dashed var(--theme-red-color);
      display: grid;
      grid-template-columns: 1fr auto;
      padding: 10px 0;
    }
  `

  render() {
    return html`
      <modal-spinner></modal-spinner>

      <header>
        <app-title title="Post Logs"></app-title>
        <nav>
          <menu-list .menus=${pages}></menu-list>
        </nav>
      </header>
      <main>
        <dom-router .pages=${pages}></dom-router>
      </main>
      <aside>
        <article-materials></article-materials>
      </aside>

      <footer>
        <post-promoter></post-promoter>
        <total-post></total-post>
      </footer>
    `
  }
}
