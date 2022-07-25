import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('now-loading')
export class NowLoading extends LitElement {
  render() {
    return html`<p>Now Loading...</p>`
  }
}
