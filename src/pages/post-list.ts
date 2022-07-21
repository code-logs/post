import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '../components/post-card/post-card.js'
import { Post } from '../types/post.js'
import fetcher from '../utils/fetcher.js'
import { navigate } from '../components/dom-router/dom-router.js'
import { PageElement } from './abstracts/page-element.js'

@customElement('post-list')
export class PostList extends PageElement {
  pageTitle: string = 'Post Logs - 포스팅'

  @property({ type: Array })
  posts: Post[] = []

  static styles = css`
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }
  `

  protected firstUpdated(): void {
    this.fetchPosts()
  }

  async fetchPosts() {
    this.posts = await fetcher.get<Post[]>('/posts')
  }

  openPostDetail(name: string) {
    navigate(`/posts/${name}`)
  }

  render() {
    return html`
      <section>
        <ul>
          ${this.posts.map(
            (post) =>
              html`<li>
                <post-card
                  @click=${() => {
                    this.openPostDetail(post.fileName.replace(/\.md$/, ''))
                  }}
                  .post=${post}
                ></post-card>
              </li>`
          )}
        </ul>
      </section>
    `
  }
}
