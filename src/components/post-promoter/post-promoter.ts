import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { apis } from '../../apis/index.js'

@customElement('post-promoter')
export class PostPromoter extends LitElement {
  @property({ type: Number })
  private lastPostingDate: number = Date.now()

  static styles = css`
    :host {
      display: flex;
    }
    span {
      margin: auto;
      font-size: 0.8rem;
      font-weight: 600;
    }
    strong {
      color: var(--theme-red-color);
    }
  `

  protected firstUpdated() {
    this.fetchLastPostDate()
  }

  private async fetchLastPostDate() {
    const lastPostingDate = await apis.getLastPostingDate()
    if (!lastPostingDate) return
    this.lastPostingDate = lastPostingDate
  }

  render() {
    const leftDays = Math.floor(
      (Date.now() - new Date(this.lastPostingDate).getTime()) /
        (24 * 60 * 60 * 1000)
    )

    return html`
      <span>
        마지막 포스팅을 <strong>${leftDays}</strong>일 전에 작성했습니다
      </span>
    `
  }
}
