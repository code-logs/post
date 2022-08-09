import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { apis } from '../../apis/index.js'

@customElement('total-post')
export class TotalPost extends LitElement {
  @property({ type: Number })
  private total: number = 0

  static styles = css`
    :host {
      display: flex;
    }
    p {
      text-align: right;
      font-size: 0.8rem;
      margin: 0 5px;
      font-weight: 800;
    }
  `

  protected firstUpdated() {
    this.fetchTotalPostCount()
  }

  private async fetchTotalPostCount() {
    this.total = await apis.getTotalPostCount()
  }

  render() {
    return html` <p>Total: ${this.total}</p> `
  }
}
