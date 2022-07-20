import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { PageElement } from './abstracts/page-element.js'

@customElement('post-list')
export class PostList extends PageElement {
  pageTitle: string = 'Post Logs - 포스팅'

  static styles = css`
  `

  render() {
    return html`
      
    `
  }
}
