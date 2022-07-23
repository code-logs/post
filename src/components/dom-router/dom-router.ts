import { css, html, LitElement, PropertyValueMap } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { Page } from './types/page.js'

export const navigate = (route: string) => {
  if (route === window.location.pathname) return
  const navigateEvent = new CustomEvent('navigate', { detail: { route } })
  document.dispatchEvent(navigateEvent)
}

@customElement('dom-router')
export class DomRouter extends LitElement {
  @property({ type: Array })
  pages: Page[] = []

  private activePage?: Page

  private readonly PAGE_ACTIVE_FLAG = 'active'

  private loadedPageRoutes: Set<string> = new Set<string>()

  private navigateHandler?: (event: Event) => void

  private popStateHandler?: () => void

  connectedCallback() {
    super.connectedCallback?.()
    this.navigateHandler = this.onNavigateHandler.bind(this)
    this.popStateHandler = this.onPopStateHandler.bind(this)
    document.addEventListener('navigate', this.navigateHandler)
    window.addEventListener('popstate', this.popStateHandler)
  }

  disconnectedCallback() {
    super.disconnectedCallback?.()
    if (this.navigateHandler)
      document.removeEventListener('navigate', this.navigateHandler)
    if (this.popStateHandler)
      window.removeEventListener('popstate', this.popStateHandler)
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

  protected firstUpdated() {
    if (!this.pages.length) throw new Error('No pages initialized')
  }

  protected updated(props: PropertyValueMap<DomRouter>) {
    if (props.has('pages') && !this.activePage) {
      this.initActivePage()
    }
  }

  render() {
    return html`<slot></slot>`
  }

  private getPageElement(targetPage: Page) {
    const pageElement = this.querySelector(targetPage.tagName)
    if (!pageElement) throw new Error('No page element found')

    return pageElement
  }

  private get currentPageElement() {
    return this.querySelector(`[${this.PAGE_ACTIVE_FLAG}]`)
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
    const pageElement = this.currentPageElement
    pageElement?.removeAttribute(this.PAGE_ACTIVE_FLAG)
    pageElement?.remove()
  }

  private async importPage(targetPage: Page) {
    await import(targetPage.importPath)
  }

  private async appendPage(targetPage: Page) {
    const pageElement = document.createElement(targetPage.tagName)
    this.appendChild(pageElement)
  }

  private onNavigateHandler(event: Event) {
    if (event instanceof CustomEvent) {
      const { route } = event.detail
      window.history.pushState(null, '', route)

      this.reloadPage()
    }
  }

  private onPopStateHandler() {
    this.reloadPage()
  }

  private reloadPage() {
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
