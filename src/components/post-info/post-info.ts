import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { apis } from '../../apis/index.js'
import { TempPostRef } from '../../types/post-ref.js'
import { Post, TempPost } from '../../types/post.js'
import { toLocalizedDateInputValue } from '../../utils/date-util.js'
import { h2Style, sectionStyle } from '../styles/styles.js'
// eslint-disable-next-line import/no-duplicates
import '../reference-selector/reference-selector.js'
// eslint-disable-next-line import/no-duplicates
import { ReferenceSelector } from '../reference-selector/reference-selector.js'
// eslint-disable-next-line import/no-duplicates
import '../tag-selector/tag-selector.js'
// eslint-disable-next-line import/no-duplicates
import { TagSelector } from '../tag-selector/tag-selector.js'

type PostFormType = Omit<
  Post,
  'fileName' | 'thumbnailName' | 'tags' | 'references' | 'series'
> & { prevPostTitle: string; nextPostTitle: string }
@customElement('post-info')
export class PostInfo extends LitElement {
  @property({ type: Object })
  post?: Post

  @property({ type: Array })
  refCandidates: TempPostRef[] = []

  @property({ type: Array })
  private categories: string[] = []

  @property({ type: Array })
  private posts: Post[] = []

  @property({ type: String })
  thumbnailObjURL?: string

  static styles = css`
    ${sectionStyle}
    ${h2Style}
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
      grid-row-start: 2;
      grid-column: 1 / 5;
    }
    form > label.description > input {
      max-width: inherit;
    }
    form input,
    form select {
      box-sizing: border-box;
      border: 1px dashed var(--theme-red-color);
      outline: none;
      background-color: transparent;
      max-width: 180px;
      height: 30px;
      margin: auto 0;
      padding: 0 5px;
    }
    form input[type='checkbox'] {
      margin: auto auto auto 0;
    }
    #thumbnail-selector {
      display: grid;
    }
    #thumbnail-selector img {
      margin: auto;
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

  public serialize(): { tempPost: TempPost; thumbnail: File } {
    const {
      title,
      description,
      category,
      publishedAt,
      published,
      nextPostTitle,
      prevPostTitle,
    } = Object.fromEntries(new FormData(this.form)) as unknown as PostFormType
    if (!title) throw new Error('포스팅의 제목을 입력해 주세요.')
    if (!category) throw new Error('포스팅의 카테고리를 선택해 주세요.')
    if (!publishedAt) throw new Error('포스팅 작성일을 선택해 주세요.')
    if (!description) throw new Error('포스팅의 설명을 입력해 주세요.')
    if (!this.thumbnailInput.files?.length)
      throw new Error('포스팅 썸네일 이미지를 선택해 주세요.')

    const tags = this.tagSelector.selectedTags
    if (!tags.length) throw new Error('포스팅의 태그를 선택해 주세요.')

    const references = this.refSelector.selectedRefs

    const tempPost: TempPost = {
      title,
      category,
      publishedAt,
      published,
      description,
      thumbnailName: this.thumbnailInput.files[0].name,
      fileName: `${category.toLocaleLowerCase()}-${title.toLowerCase()}-${publishedAt}.md`,
      tags,
      references,
    }

    if (prevPostTitle) tempPost.series = { prevPostTitle }
    if (nextPostTitle) tempPost.series = { ...tempPost.series, nextPostTitle }

    return { tempPost, thumbnail: this.thumbnailInput.files[0] }
  }

  render() {
    return html`
      <section class="container">
        <h2>Info</h2>
        <form>
          <label>
            <span>제목</span>
            <input name="title" />
          </label>

          <label>
            <span>카테고리</span>
            <input list="category" name="category" />
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
              .value=${toLocalizedDateInputValue(Date.now())}
            />
          </label>

          <label>
            <span>배포</span>
            <input name="published" type="checkbox" />
          </label>

          <label class="description">
            <span>설명</span>
            <input name="description" />
          </label>

          <label>
            <span>이전글</span>
            <select name="prevPostTitle">
              <option></option>
              ${this.posts.map((post) => html`<option>${post.title}</option>`)}
            </select>
          </label>

          <label>
            <span>다음글</span>
            <select name="nextPostTitle">
              <option></option>
              ${this.posts.map((post) => html`<option>${post.title}</option>`)}
            </select>
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

        ${this.thumbnailObjURL
          ? html`<img src=${this.thumbnailObjURL} alt="Thumbnail preview" />`
          : ''}
      </section>

      <tag-selector></tag-selector>

      <reference-selector
        .refCandidates=${this.refCandidates}
      ></reference-selector>
    `
  }
}
