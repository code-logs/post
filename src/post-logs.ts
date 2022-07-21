import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import './components/menu-list/menu-list.js'
import './components/app-title/app-title.js'
import { pages } from './constants/pages.js'
import { Page } from './components/dom-router/types/page.js'

@customElement('post-logs')
export class PostLogs extends LitElement {
  @property({ type: Object })
  activePage?: Page

  static styles = css`
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    header {
      position: sticky;
      top: 0;
      background-color: var(--theme-background-color);
    }

    main {
      flex-grow: 1;
      width: 800px;
      max-width: 800px;
      margin: 20px auto 0 auto;
    }
  `

  render() {
    return html`
      <header>
        <app-title title="Post Logs"></app-title>
        <nav>
          <menu-list .menus=${pages}></menu-list>
        </nav>
      </header>
      <main>
        <dom-router .pages=${pages}></dom-router>
      </main>
    `
  }
}
