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
    #editor {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
  `

  render() {
    return html`
      <section>
        <header>
          <label>
            <input
              type="checkbox"
              .checked=${Boolean(this.enablePreview)}
              @change=${() => {
                this.enablePreview = !this.enablePreview
              }}
            />
            <span>Preview</span>
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
