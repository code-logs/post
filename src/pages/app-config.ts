import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import {
  buttonBoxStyle,
  h2Style,
  inputStyle,
  labelStyle,
  sectionStyle,
} from '../components/styles/styles.js'
import { apis } from '../apis/index.js'
import { PageElement } from './abstracts/page-element.js'
import { toLocalizedDatetimeInputValue } from '../utils/date-util.js'

@customElement('app-config')
export class AppConfig extends PageElement {
  pageTitle: string = 'Post Logs - 설정'

  @property({ type: Number })
  private lastSyncDatetime: number | null = null

  static styles = css`
    ${sectionStyle}
    ${h2Style}
    ${labelStyle}
    ${inputStyle}
    ${buttonBoxStyle}
    input {
      max-width: inherit;
      text-align: center;
    }
  `

  protected async firstUpdated() {
    this.refreshLastSyncDatetime()
  }

  private async refreshLastSyncDatetime() {
    this.lastSyncDatetime = await apis.getLastSyncDatetime()
  }

  private async syncRepository() {
    await apis.syncRepository()
    await this.refreshLastSyncDatetime()
  }

  render() {
    return html`<section id="config" class="container">
        <h2>Config</h2>
        ${this.lastSyncDatetime
          ? html`
              <label>
                <span>마지막 동기화</span>
                <input
                  type="datetime-local"
                  readonly
                  .value=${toLocalizedDatetimeInputValue(this.lastSyncDatetime)}
                />
              </label>
            `
          : html`<p>최근 동기화 기록이 존재하지 않습니다.</p>
              <p>'Sync' 버튼을 통해 저장소 동기화를 진행해 주세요</p> `}
      </section>

      <section class="button-container">
        <button @click=${this.syncRepository}>Sync</button>
      </section> `
  }
}
