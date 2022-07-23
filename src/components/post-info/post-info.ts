import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { Post, PostRef } from '../../types/post.js'
import fetcher from '../../utils/fetcher.js'

type PostFormType = Omit<
  Post,
  'fileName' | 'thumbnailName' | 'tags' | 'references' | 'series'
> & { prevPostTitle: string; nextPostTitle: string }
@customElement('post-info')
export class PostInfo extends LitElement {
  @property({ type: Object })
  post?: Post

  @property({ type: Array })
  references: PostRef[] = []

  @property({ type: Array })
  newTags: string[] = []

  @property({ type: Array })
  private categories: string[] = []

  @property({ type: Array })
  private posts: Post[] = []

  @property({ type: Array })
  private tags: string[] = []

  @property({ type: String })
  thumbnailObjURL?: string

  private chosenTags: Set<string> = new Set()

  private chosenRefs: Set<Post['references']> = new Set()

  static styles = css`
    :host {
      font-family: sans-serif;
      color: var(--theme-font-color);
      font-size: 0.8rem;
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }
    section {
      border: 1px dashed var(--theme-red-color);
      padding: 10px;
      background-color: var(--theme-light-background-color);
    }
    section > h2 {
      margin: 0 0 10px;
      padding-bottom: 5px;
      border-bottom: 1px dashed var(--theme-red-color);
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
    #tag-selector > label > input {
      box-sizing: border-box;
      border: 1px dashed var(--theme-red-color);
      outline: none;
      background-color: transparent;
      max-width: 180px;
      height: 30px;
      margin: auto 0 5px 0;
      padding: 0 5px;
    }
    #tag-selector > div {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
    }
    #tag-selector #new-tags {
      border-bottom: 1px dashed var(--theme-red-color);
      padding: 0 0 5px;
      margin: 5px 0;
    }
    #tag-selector #new-tag-input-label {
      display: flex;
    }
    #tag-selector #new-tag-input {
      max-width: none;
      flex: 1;
    }
    #tag-selector label {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 5px;
      overflow: hidden;
      white-space: nowrap;
    }
    #tag-selector label > span {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    #reference-selector ul {
      display: grid;
      gap: 5px;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    #reference-selector li label {
      display: grid;
      grid-template-columns: auto 1fr 1fr;
      gap: 5px;
    }
    #reference-selector input {
      box-sizing: border-box;
      border: 1px dashed var(--theme-red-color);
      outline: none;
      background-color: transparent;
      max-width: 180px;
      height: 30px;
      margin: auto 0;
      padding: 0 5px;
    }
  `

  private get thumbnailInput() {
    const input =
      this.renderRoot.querySelector<HTMLInputElement>('#thumbnail-input')
    if (!input) throw new Error('Failed to find input')

    return input
  }

  private get tagSelectorInputs() {
    return Array.from<HTMLInputElement>(
      this.renderRoot.querySelectorAll('#exists-tags input[type=checkbox]')
    )
  }

  protected firstUpdated() {
    this.fetchPosts()
    this.fetchCategories()
    this.fetchTags()
  }

  private async fetchCategories() {
    this.categories = await fetcher.get<string[]>('/categories')
  }

  private async fetchPosts() {
    this.posts = await fetcher.get<Post[]>('/posts')
  }

  private async fetchTags() {
    this.tags = await fetcher.get<string[]>('/tags')
  }

  private get form() {
    const form = this.renderRoot.querySelector('form')
    if (!form) throw new Error('Failed to find form element')

    return form
  }

  public serialize(): Post & { thumbnail: File } {
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
    if (!this.chosenTags.size) throw new Error('포스팅의 태그를 선택해 주세요.')

    const tags = Array.from([...this.chosenTags, ...this.newTags])
    const references = this.chosenRefs.size
      ? (Array.from(this.chosenRefs) as unknown as PostRef[])
      : undefined

    const post: Post = {
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

    if (prevPostTitle) post.series = { prevPostTitle }
    if (nextPostTitle) post.series = { ...post.series, nextPostTitle }

    return { ...post, thumbnail: this.thumbnailInput.files[0] }
  }

  private newTagChangeHandler(event: Event) {
    const newTagInput = event.currentTarget as unknown as HTMLInputElement
    const tags = Array.from(
      new Set(newTagInput.value.split(',').map((tag) => tag.trim()))
    )
    const { newTags, existsTags } = tags.reduce<{
      newTags: string[]
      existsTags: string[]
    }>(
      (acc, tag) => {
        if (this.tags.indexOf(tag) >= 0) {
          acc.existsTags.push(tag)
        } else {
          acc.newTags.push(tag)
        }

        return acc
      },
      { newTags: [], existsTags: [] }
    )
    this.newTags = newTags
    newTagInput.value = newTags.join(', ')

    if (existsTags.length && this.tagSelectorInputs.length)
      this.tagSelectorInputs
        .filter((input) => existsTags.indexOf(input.value) >= 0)
        .forEach((input) => {
          input.setAttribute('checked', '')
        })
  }

  render() {
    return html`
      <section>
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
            <input name="publishedAt" type="date" />
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

      <section id="thumbnail-selector">
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

      <section id="tag-selector">
        <h2>Tags</h2>
        <label id="new-tag-input-label">
          <input
            id="new-tag-input"
            @change=${this.newTagChangeHandler}
            placeholder="Type new tags here as csv format."
          />
        </label>

        ${this.newTags.length
          ? html`
              <div id="new-tags">
                ${this.newTags.map(
                  (tag) => html`<label>
                    <input type="checkbox" checked .value=${tag} disabled />
                    <span>${tag}</span>
                  </label>`
                )}
              </div>
            `
          : ''}

        <div id="exists-tags">
          ${this.tags.map(
            (tag) => html` <label>
              <input
                type="checkbox"
                .value=${tag}
                @change=${(event: Event) => {
                  const input =
                    event.currentTarget as unknown as HTMLInputElement
                  if (!input) return
                  if (input.checked) {
                    this.chosenTags.add(tag)
                  } else {
                    this.chosenTags.delete(tag)
                  }
                }}
              />
              <span>${tag}</span>
            </label>`
          )}
        </div>
      </section>

      <section id="reference-selector">
        <h2>References</h2>
        <ul>
          ${this.references.map(
            (ref) => html`<li>
              <label>
                <input type="checkbox" .value=${ref.url} />
                <div>
                  <input .value=${ref.title} />
                  <input readonly .value=${ref.url} />
                </div>
              </label>
            </li>`
          )}
        </ul>
      </section>
    `
  }
}
