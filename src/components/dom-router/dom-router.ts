import { css, html, LitElement, PropertyValueMap } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { Page } from './types/page.js'

export const navigate = (route: string) => {
  if (route === window.location.pathname) return

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

  private loadedPageRoutes: Set<string> = new Set<string>()

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
    const targetPage = this.findMatchedPage()
    this.mount(targetPage)
  }

  private async mount(targetPage: Page) {
    if (!this.loadedPageRoutes.has(targetPage.route)) {
      await this.importPage(targetPage)
      this.loadedPageRoutes.add(targetPage.route)
    }

    this.appendPage(targetPage)
    const targetPageElement = this.getPageElement(targetPage)
    targetPageElement.setAttribute(this.PAGE_ACTIVE_FLAG, '')
  }

  private unmount() {
    this.currentPageElement?.remove()
  }

  private async importPage(targetPage: Page) {
    await import(targetPage.importPath)
  }

  private async appendPage(targetPage: Page) {
    const pageElement = document.createElement(targetPage.tagName)
    this.appendChild(pageElement)
  }

  private onPopStateHandler() {
    const page = this.findMatchedPage()

    this.unmount()
    this.mount(page)
  }

  private findMatchedPage() {
    const page = this.pages.find(({ route }) => {
      const pageRouteElements = route.split(/\//)
      const pathElements = window.location.pathname.split(/\//)

      return pageRouteElements.every((routeElement, index) => {
        if (routeElement.startsWith(':')) return true

        return routeElement === pathElements[index]
      })
    })

    if (!page) throw new Error('Failed to find matched page')

    return page
  }
}
