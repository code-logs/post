import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '../markdown-editor/markdown-editor.js'
import '../markdown-preview/markdown-preview.js'

@customElement('markdown-view-editor')
export class MarkdownViewEditor extends LitElement {
  @property({ type: Boolean })
  enablePreview?: boolean = false

  @property({ type: Boolean })
  enableAutoFormatting?: boolean = false

  @property({ type: String })
  content: string = ''

  static styles = css`
    :host {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
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
    section {
      display: flex;
      flex-direction: column;
      flex: 1;
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

          <label>
            <span>Auto formatting</span>
            <input
              type="checkbox"
              .checked=${Boolean(this.enableAutoFormatting)}
              @change=${() => {
                this.enableAutoFormatting = !this.enableAutoFormatting
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
              .autoFormat=${Boolean(this.enableAutoFormatting)}
              @valueChange=${(event: CustomEvent) => {
                this.content = event.detail.value
              }}
            ></markdown-editor>`}
      </section>
    `
  }
}
