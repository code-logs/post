import { css, html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('app-title')
export class AppTitle extends LitElement {
  title!: string

  static styles = css`
    h1 {
      font-size: 1.8rem;
      margin: 10px 0;
      font-weight: 600;
      letter-spacing: -2px;
      text-align: center;
    }
  `

  render() {
    return html`<h1>${this.title}</h1>`
  }
}
