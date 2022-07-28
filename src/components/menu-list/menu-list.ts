import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { navigate } from '../dom-router/dom-router.js'
import { Page } from '../dom-router/types/page.js'

@customElement('menu-list')
export class MenuList extends LitElement {
  @property({ type: Array })
  menus: Page[] = []

  @property({ type: String })
  activeRoute: string | null = null

  static styles = css`
    ul {
      list-style: none;
      padding: 20px 0;
      margin: 0;
      display: flex;
      gap: 20px;
      justify-content: center;
      border-bottom: 1px dashed var(--theme-red-color);
    }
    button {
      border: 0;
      background-color: transparent;
      transition: transform 0.2s ease-in-out 0s;
      color: inherit;
    }
    button:hover,
    button[active] {
      font-weight: 600;
      transform: scale(1.5);
      transition: transform 0.2s ease-in-out 0s;
    }
  `

  constructor() {
    super()
    window.addEventListener('popstate', () => {
      this.requestUpdate()
    })
  }

  render() {
    return html`
      <ul>
        ${this.menus
          .filter((menu) => menu.title)
          .map(
            ({ title, route }) => html`
              <li>
                <button
                  ?active=${this.isActiveMenu(route)}
                  @click=${() => {
                    this.moveToPage(route)
                  }}
                  @keydown=${(event: KeyboardEvent) => {
                    if (event.key === 'enter' || event.key === 'space') {
                      this.moveToPage(route)
                    }
                  }}
                >
                  ${title}
                </button>
              </li>
            `
          )}
      </ul>
    `
  }

  private isActiveMenu(route: string) {
    return window.location.pathname === route
  }

  private moveToPage(route: string) {
    navigate(route)
    this.requestUpdate()
  }
}
