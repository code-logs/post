import { LitElement, PropertyValues } from 'lit'
import { property } from 'lit/decorators.js'

export abstract class PageElement extends LitElement {
  @property({ type: String })
  abstract pageTitle: string

  protected beforeActive(): boolean {
    return true
  }

  protected beforeInactive(): boolean {
    return true
  }

  @property({ type: Boolean })
  active: boolean = false

  protected shouldUpdate(changedProps: PropertyValues<PageElement>) {
    super.shouldUpdate(changedProps)
    if (changedProps.has('active')) {
      if (this.active) {
        return this.beforeActive()
      }

      return this.beforeInactive()
    }

    return true
  }

  protected updated(props: PropertyValues<PageElement>) {
    if (props.has('active') && this.active) {
      document.title = this.pageTitle
    }
  }
}
