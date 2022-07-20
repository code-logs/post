import { css, html, LitElement, PropertyValueMap } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { Page } from './types/page.js'

export const navigate = (route: string) => {
  window.history.pushState(null, '', route)
  window.history.pushState(null, '', route)
  window.history.back()
}

@customElement('dom-router')
export class DomRouter extends LitElement {
  @property({ type: Array })
  pages: Page[] = []

  private activePage?: Page

  private readonly PAGE_ACTIVE_FLAG = 'active'

  private activePageRoutes: Set<string> = new Set<string>()

  constructor() {
    super()
    window.onpopstate = () => {
      this.onPopStateHandler()
    }
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
    }
    ::slotted(*) {
      display: none;
    }
    ::slotted([active]) {
      display: initial;
    }
  `

  render() {
    return html`<slot></slot>`
  }

  protected firstUpdated() {
    if (!this.pages.length) throw new Error('No pages initialized')
  }

  protected updated(props: PropertyValueMap<DomRouter>): void {
    if (props.has('pages') && !this.activePage) {
      this.initActivePage()
    }
  }

  private getPageElement(targetPage: Page) {
    const pageElement = this.querySelector(targetPage.tagName)
    if (!pageElement) throw new Error('No page element found')

    return pageElement
  }

  private get currentPageElement() {
    return this.querySelector('[active]')
  }

  private initActivePage() {
    const targetPage = this.pages.find(
      ({ route }) => route === window.location.pathname
    )
    if (!targetPage) throw new Error('No activation target page found')
    this.activatePage(targetPage)
  }

  private async activatePage(targetPage: Page) {
    if (!this.activePageRoutes.has(targetPage.route)) {
      await this.importPage(targetPage)
      this.appendPage(targetPage)
      this.activePageRoutes.add(targetPage.route)
    }

    const targetPageElement = this.getPageElement(targetPage)
    if (targetPageElement === this.currentPageElement) return

    this.currentPageElement?.removeAttribute(this.PAGE_ACTIVE_FLAG)
    targetPageElement.setAttribute(this.PAGE_ACTIVE_FLAG, '')
  }

  private async importPage(targetPage: Page) {
    await import(targetPage.importPath)
  }

  private async appendPage(targetPage: Page) {
    const pageElement = document.createElement(targetPage.tagName)
    this.appendChild(pageElement)
  }

  private onPopStateHandler() {
    const prevPage = this.pages.find(
      ({ route }) => route === window.location.pathname
    )
    if (!prevPage) throw new Error('Failed to find previous page')
    this.activatePage(prevPage)
  }
}
