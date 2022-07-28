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
  pageTitle: string = 'Post Logs | 설정'

  @property({ type: Number })
  private lastSyncDatetime: number | null = null

  static styles = css`
    ${sectionStyle}
    ${h2Style}
    ${labelStyle}
    ${inputStyle}
    ${buttonBoxStyle}
    :host {
      font-size: 0.8rem;
    }
    #config {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }
    input {
      max-width: inherit;
      text-align: center;
    }
    p {
      font-size: 0.8rem;
    }
  `

  protected async firstUpdated() {
    this.refreshLastSyncDatetime()
  }

  private async refreshLastSyncDatetime() {
    this.lastSyncDatetime = await apis.getLastSyncDatetime()
  }

  private async syncRepository() {
    if (this.lastSyncDatetime) {
      const answer = window.confirm(
        '기존 포스팅 데이터를 삭제하고 저장소와 동기화 하시겠습니까?'
      )

      if (!answer) return
    }

    await apis.syncRepository()
    await this.refreshLastSyncDatetime()
  }

  render() {
    return html`<section id="config">
      <section class="container">
        <header>
          <h2>Config</h2>
        </header>

        ${this.lastSyncDatetime
          ? html`
              <label>
                <span>최근 동기화</span>
                <input
                  type="datetime-local"
                  readonly
                  .value=${toLocalizedDatetimeInputValue(this.lastSyncDatetime)}
                />
              </label>
            `
          : html`<p>최근 동기화 기록이 존재하지 않습니다.</p>
              <p>Sync 버튼을 통해 저장소 동기화를 진행해 주세요</p> `}
      </section>

      <section class="button-container">
        <button @click=${this.syncRepository}>Sync</button>
      </section>
    </section> `
  }
}
