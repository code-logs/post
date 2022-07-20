import { LitElement, PropertyValues } from 'lit'
import { property } from 'lit/decorators.js'

export abstract class PageElement extends LitElement {
  @property({ type: String })
  abstract pageTitle: string

  @property({ type: Boolean })
  active: boolean = false

  protected updated(props: PropertyValues<PageElement>) {
    if (props.has('active') && this.active) {
      document.title = this.pageTitle
    }
  }
}
