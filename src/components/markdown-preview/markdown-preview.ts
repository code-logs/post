import { css, html, LitElement, PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { marked } from 'marked'
import highlightStyle from './highlight-style.js'

@customElement('markdown-preview')
export class MarkdownPreview extends LitElement {
  @property({ type: String })
  markdown!: string

  static styles = css`
    ${highlightStyle}
    #preview {
      font-family: sans-serif;
      color: var(--theme-font-color);
      font-size: 14px;
      background-color: var(--theme-light-background-color);
      padding: 10px;
      border: 1px dashed var(--theme-red-color);
      height: 700px;
      outline: none;
      tab-size: 2;
      overflow: auto;
      box-sizing: border-box;
    }
    #preview::-webkit-scrollbar {
      cursor: default;
      width: 5px;
    }
    #preview::-webkit-scrollbar-thumb {
      background-color: var(--theme-red-color);
    }
  `

  get preview() {
    const preview = this.renderRoot.querySelector('#preview')
    if (!preview) throw new Error('Failed to find preview element')

    return preview as HTMLDivElement
  }

  protected updated(changedProps: PropertyValues) {
    if (changedProps.has('markdown') && this.markdown) {
      this.renderHtml()
      this.highlightCodeBlock()
    }
  }

  private async highlightCodeBlock() {
    const blocks = this.preview.querySelectorAll('pre code')
    blocks.forEach((block) => {
      window.hljs.highlightElement(block)
    })
  }

  private renderHtml() {
    if (!this.markdown) return

    this.preview.innerHTML = `
      ${marked.parse(this.markdown)}
    `
  }

  render() {
    return html` <div id="preview"></div> `
  }
}
