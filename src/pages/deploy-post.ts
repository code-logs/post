import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { apis } from '../apis/index.js'
import { navigate } from '../components/dom-router/dom-router.js'
import '../components/post-card/post-card.js'
import {
  buttonBoxStyle,
  h2Style,
  sectionStyle,
} from '../components/styles/styles.js'
import { Post } from '../types/post.js'
import { PageElement } from './abstracts/page-element.js'

@customElement('deploy-post')
export class DeployPost extends PageElement {
  pageTitle: string = 'Post Logs | Deploy'

  @property({ type: Array })
  modifiedPosts: Post[] = []

  static styles = css`
    :host {
      font-size: 0.8rem;
    }
    #deploy-post {
      display: grid;
      gap: 10px;
    }
    ${sectionStyle}
    ${h2Style}
    ${buttonBoxStyle}
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    li {
      margin: 0;
      padding: 0;
    }
    p {
      text-align: center;
    }
    .button-container {
      margin-top: 10px;
    }
  `

  protected firstUpdated() {
    this.fetchModifiedPosts()
  }

  async fetchModifiedPosts() {
    this.modifiedPosts = await apis.getModifiedPosts()
  }

  private async deployPosts() {
    const answer = window.confirm('변경 사항을 배포할까요?')
    if (!answer) return
    await apis.deployPosts()
    window.alert('변경사항이 배포 됐습니다.')
    navigate('/')
  }

  render() {
    const createdPosts = this.modifiedPosts.filter(({ isCreated }) => isCreated)
    const updatedPosts = this.modifiedPosts.filter(
      ({ isCreated, isUpdated }) => !isCreated && isUpdated
    )

    return html`<section id="deploy-post" class="container">
        ${!createdPosts.length && !updatedPosts.length
          ? html` <p>배포할 포스팅이 없습니다.</p> `
          : ''}
        ${createdPosts.length
          ? html`<section id="created-posts">
              <h2>새로운 포스팅</h2>
              <ul>
                ${createdPosts.map(
                  (post) => html`
                    <li>
                      <post-card .post=${post}></post-card>
                    </li>
                  `
                )}
              </ul>
            </section>`
          : ''}
        ${updatedPosts.length
          ? html`<section id="created-posts">
              <h2>수정된 포스팅</h2>
              <ul>
                ${updatedPosts.map(
                  (post) => html`
                    <li>
                      <post-card .post=${post}></post-card>
                    </li>
                  `
                )}
              </ul>
            </section>`
          : ''}
      </section>

      ${createdPosts.length || updatedPosts.length
        ? html`<section class="button-container">
            <button danger @click=${this.deployPosts}>배포</button>
          </section> `
        : ''} `
  }
}
