import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { PageElement } from './abstracts/page-element.js'
import '../components/post-info/post-info.js'
import '../components/markdown-editor/markdown-editor.js'

@customElement('create-post')
export class CreatePost extends PageElement {
  pageTitle: string = 'Post Logs - 글쓰기'

  static styles = css`
    section {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }
  `

  render() {
    return html`<section>
      <post-info></post-info>
      <markdown-editor></markdown-editor>
    </section> `
  }
}
