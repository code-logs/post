import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '../markdown-editor/markdown-editor.js'
import '../markdown-preview/markdown-preview.js'

@customElement('markdown-view-editor')
export class MarkdownViewEditor extends LitElement {
  @property({ type: Boolean })
  enablePreview?: boolean = false

  @property({ type: String })
  content: string = ''

  static styles = css`
    #header {
      margin-bottom: 10px;
    }
    #header label {
      display: inline-flex;
    }
    #header span {
      font-size: 0.8rem;
      margin: auto 0;
    }
  `

  render() {
    return html`
      <section>
        <header id="header">
          <label>
            <span>Preview</span>
            <input
              type="checkbox"
              .checked=${Boolean(this.enablePreview)}
              @change=${() => {
                this.enablePreview = !this.enablePreview
              }}
            />
          </label>
        </header>

        ${this.enablePreview
          ? html`<markdown-preview
              .markdown=${this.content}
            ></markdown-preview>`
          : html`<markdown-editor
              .value=${this.content}
              @valueChange=${(event: CustomEvent) => {
                this.content = event.detail.value
              }}
            ></markdown-editor>`}
      </section>
    `
  }
}
