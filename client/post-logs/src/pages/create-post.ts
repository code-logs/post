import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { PageElement } from './abstracts/page-element.js'

@customElement('create-post')
export class CreatePost extends PageElement {
  pageTitle: string = 'Post Logs - 글쓰기'

  render() {
    return html` <h2>Create Post</h2> `
  }
}
