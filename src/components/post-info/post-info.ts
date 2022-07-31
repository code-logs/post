import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { apis } from '../../apis/index.js'
import { Post, TempPost } from '../../types/post.js'
import { toLocalizedDateInputValue } from '../../utils/date-util.js'
import { h2Style, inputStyle, sectionStyle } from '../styles/styles.js'
// eslint-disable-next-line import/no-duplicates
import '../reference-selector/reference-selector.js'
// eslint-disable-next-line import/no-duplicates
import { ReferenceSelector } from '../reference-selector/reference-selector.js'
// eslint-disable-next-line import/no-duplicates
import '../tag-selector/tag-selector.js'
// eslint-disable-next-line import/no-duplicates
import { TagSelector } from '../tag-selector/tag-selector.js'
import { BASE_URL } from '../../constants/base-url.js'

type PostFormType = Omit<
  Post,
  'fileName' | 'thumbnailName' | 'tags' | 'references' | 'series'
> & { prevPostTitle: string; nextPostTitle: string }
@customElement('post-info')
export class PostInfo extends LitElement {
  @property({ type: Object })
  post?: Post

  @property({ type: String })
  content!: string

  @property({ type: Array })
  private categories: string[] = []

  @property({ type: Array })
  private posts: Post[] = []

  @property({ type: String })
  thumbnailObjURL?: string

  @property({ type: Boolean })
  createMode: boolean = false

  static styles = css`
    ${sectionStyle}
    ${h2Style}
    ${inputStyle}
    :host {
      font-family: sans-serif;
      color: var(--theme-font-color);
      font-size: 0.8rem;
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }
    form {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }
    form > label {
      display: grid;
      grid-template-rows: auto 1fr;
      gap: 5px;
    }
    form > label.description {
      grid-column: 1 / 5;
    }
    form > label.description > input {
      max-width: inherit;
    }
    #thumbnail-selector {
      display: grid;
    }
    #thumbnail-selector img {
      margin: 10px auto;
    }
    #thumbnail-selector .thumbnail-preview {
      max-height: 300px;
      max-width: 100%;
    }
  `

  private get thumbnailInput() {
    const input =
      this.renderRoot.querySelector<HTMLInputElement>('#thumbnail-input')
    if (!input) throw new Error('Failed to find input')

    return input
  }

  private get tagSelector() {
    const tagSelector =
      this.renderRoot.querySelector<TagSelector>('tag-selector')
    if (!tagSelector) throw new Error('Failed to find tag selector')

    return tagSelector
  }

  private get refSelector() {
    const refSelector =
      this.renderRoot.querySelector<ReferenceSelector>('reference-selector')
    if (!refSelector) throw new Error('Failed to find reference selector')

    return refSelector
  }

  protected firstUpdated() {
    this.fetchPosts()
    this.fetchCategories()
  }

  private async fetchCategories() {
    this.categories = await apis.getCategories()
  }

  private async fetchPosts() {
    this.posts = await apis.getPosts()
  }

  private get form() {
    const form = this.renderRoot.querySelector('form')
    if (!form) throw new Error('Failed to find form element')

    return form
  }

  public serialize(): { tempPost: TempPost; thumbnail?: File } {
    const {
      title,
      description,
      category,
      publishedAt,
      published = false,
      nextPostTitle,
      prevPostTitle,
    } = Object.fromEntries(new FormData(this.form)) as unknown as PostFormType
    if (!title) throw new Error('포스팅의 제목을 입력해 주세요.')
    if (!category) throw new Error('포스팅의 카테고리를 선택해 주세요.')
    if (!this.createMode && !publishedAt)
      throw new Error('포스팅 작성일을 선택해 주세요.')
    if (!description) throw new Error('포스팅의 설명을 입력해 주세요.')
    if (!this.thumbnailInput.files?.length && !this.post?.thumbnailName)
      throw new Error('포스팅 썸네일 이미지를 선택해 주세요.')

    const tags = this.tagSelector.selectedTags
    if (!tags.length) throw new Error('포스팅의 태그를 선택해 주세요.')

    const references = this.refSelector.selectedRefs

    const tempPost: TempPost = {
      title,
      category,
      publishedAt,
      published: Boolean(published),
      description,
      fileName: `${category.toLowerCase()}-${title.toLowerCase()}.md`.replace(
        / +/g,
        '-'
      ),
      tags,
      references,
    }

    if (prevPostTitle) tempPost.series = { prevPostTitle }
    if (nextPostTitle) tempPost.series = { ...tempPost.series, nextPostTitle }

    const result: { tempPost: TempPost; thumbnail?: File } = {
      tempPost,
    }

    if (this.thumbnailInput.files?.[0]) {
      const [thumbnail] = this.thumbnailInput.files
      result.thumbnail = thumbnail
    }

    return result
  }

  render() {
    return html`
      <section class="container">
        <h2>Info</h2>
        <form>
          <label>
            <span>제목</span>
            <input name="title" .value=${this.post?.title || ''} />
          </label>

          <label>
            <span>카테고리</span>
            <input
              list="category"
              name="category"
              .value=${this.post?.category || ''}
            />
            <datalist id="category">
              ${this.categories.map(
                (category) => html`<option>${category}</option>`
              )}
            </datalist>
          </label>

          <label>
            <span>작성일</span>
            <input
              name="publishedAt"
              type="date"
              .value=${this.post?.publishedAt ||
              toLocalizedDateInputValue(Date.now())}
            />
          </label>

          <label>
            <span>배포여부</span>
            <input
              name="published"
              type="checkbox"
              ?checked=${this.post?.published || false}
            />
          </label>

          <label>
            <span>이전글</span>
            <select name="prevPostTitle">
              <option></option>
              ${this.posts.map(
                (post) =>
                  html`<option
                    ?selected=${this.post?.series?.prevPostTitle === post.title}
                  >
                    ${post.title}
                  </option>`
              )}
            </select>
          </label>

          <label>
            <span>다음글</span>
            <select name="nextPostTitle">
              <option></option>
              ${this.posts.map(
                (post) =>
                  html`<option
                    ?selected=${this.post?.series?.nextPostTitle === post.title}
                  >
                    ${post.title}
                  </option>`
              )}
            </select>
          </label>

          <label class="description">
            <span>설명</span>
            <input name="description" .value=${this.post?.description || ''} />
          </label>
        </form>
      </section>

      <section id="thumbnail-selector" class="container">
        <h2>Thumbnail</h2>
        <input
          id="thumbnail-input"
          name="thumbnailName"
          type="file"
          accept="image/png"
          @input=${(event: Event) => {
            const fileInput = event.currentTarget as HTMLInputElement
            if (fileInput.files?.[0]) {
              this.thumbnailObjURL = window.URL.createObjectURL(
                fileInput.files[0]
              )
            } else {
              this.thumbnailObjURL = undefined
            }
          }}
        />

        ${this.post?.thumbnailName || this.thumbnailObjURL
          ? html`<img
              class="thumbnail-preview"
              src=${this.thumbnailObjURL
                ? this.thumbnailObjURL
                : `${BASE_URL}/${this.post?.thumbnailName}`}
              alt=${this.post?.thumbnailName || 'Thumbnail preview'}
            />`
          : ''}
      </section>

      <tag-selector .chosenTags=${this.post?.tags || []}></tag-selector>

      <reference-selector
        .references=${this.post?.references || []}
        .content=${this.content}
      ></reference-selector>
    `
  }
}
