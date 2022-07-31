import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { apis } from '../apis/index.js'
// eslint-disable-next-line import/no-duplicates
import '../components/markdown-editor/markdown-editor.js'
// eslint-disable-next-line import/no-duplicates
import { MarkdownEditor } from '../components/markdown-editor/markdown-editor.js'
import {
  buttonBoxStyle,
  h2Style,
  inputStyle,
  labelStyle,
  sectionStyle,
} from '../components/styles/styles.js'
import { toLocalizedDatetimeInputValue } from '../utils/date-util.js'
import { PageElement } from './abstracts/page-element.js'

@customElement('app-config')
export class AppConfig extends PageElement {
  pageTitle: string = 'Post Logs | 설정'

  @property({ type: Number })
  private lastSyncDatetime: number | null = null

  @property({ type: String })
  private template: string | null = null

  private templateContent?: string

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
    input#sync-date-input {
      max-width: inherit;
      text-align: center;
    }
    p {
      font-size: 0.8rem;
      text-align: center;
    }
    markdown-editor {
      margin-top: 10px;
    }
    .button-container {
      margin-top: 10px;
    }

    #template-list {
      margin: 10px 0;
      padding: 0;
      list-style: none;
    }
  `

  private get markdownEditor() {
    const editor =
      this.renderRoot.querySelector<MarkdownEditor>('markdown-editor')
    if (!editor) throw new Error('Failed to find markdown editor')

    return editor
  }

  protected async firstUpdated() {
    this.refreshLastSyncDatetime()
    this.fetchTemplate()
  }

  private async refreshLastSyncDatetime() {
    this.lastSyncDatetime = await apis.getLastSyncDatetime()
  }

  private async fetchTemplate() {
    this.template = await apis.getTemplate()
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

  private async saveTemplate() {
    if (!this.templateContent) {
      alert('템플릿을 입력해 주세요')
      this.markdownEditor.focus()
      return
    }
    const content = this.templateContent

    await apis.saveTemplate(content)
    alert('새로운 템플릿이 등록 됐습니다.')
    this.fetchTemplate()
  }

  render() {
    return html`<section id="config">
      <section id="repo-sync" class="container">
        <header>
          <h2>Repository Sync</h2>
        </header>

        ${this.lastSyncDatetime
          ? html`
              <label>
                <span>최근 동기화</span>
                <input
                  id="sync-date-input"
                  type="datetime-local"
                  readonly
                  .value=${toLocalizedDatetimeInputValue(this.lastSyncDatetime)}
                />
              </label>
            `
          : html`<p>최근 동기화 기록이 존재하지 않습니다.</p>
              <p>Sync 버튼을 통해 저장소 동기화를 진행해 주세요</p> `}

        <section class="button-container">
          <button @click=${this.syncRepository}>Sync</button>
        </section>
      </section>

      <section id="template" class="container">
        <header>
          <h2>Template</h2>
        </header>

        <markdown-editor
          @valueChange=${(event: CustomEvent<{ value: string }>) => {
            const { value } = event.detail
            this.templateContent = value
          }}
          .value=${this.template || ''}
        ></markdown-editor>

        <section class="button-container">
          <button @click=${this.saveTemplate}>Save Template</button>
        </section>
      </section>
    </section> `
  }
}
