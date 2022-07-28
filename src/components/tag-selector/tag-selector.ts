import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { apis } from '../../apis/index.js'
import { Tag, TempTag } from '../../types/tag.js'
import { h2Style, sectionStyle } from '../styles/styles.js'

@customElement('tag-selector')
export class TagSelector extends LitElement {
  @property({ type: Array })
  private tags: Tag[] = []

  @property({ type: Array })
  chosenTags: (Tag | TempTag)[] = []

  @property({ type: Array })
  newTags: TempTag[] = []

  static styles = css`
    ${sectionStyle}
    ${h2Style}
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
  `

  private get tagSelectorInputs() {
    return Array.from<HTMLInputElement>(
      this.renderRoot.querySelectorAll('#exists-tags input[type=checkbox]')
    )
  }

  private newTagChangeHandler(event: Event) {
    const newTagInput = event.currentTarget as unknown as HTMLInputElement
    const tags = Array.from(
      new Set(
        newTagInput.value
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag)
      )
    )
    const { newTags, existsTags } = tags.reduce<{
      newTags: TempTag[]
      existsTags: Tag[]
    }>(
      (acc, tag) => {
        const existsTag = this.tags.find(({ name }) => name === tag)

        if (existsTag) {
          acc.existsTags.push(existsTag)
        } else {
          acc.newTags.push({ name: tag })
        }

        return acc
      },
      { newTags: [], existsTags: [] }
    )
    this.newTags = newTags
    newTagInput.value = newTags.map(({ name }) => name).join(', ')

    if (existsTags.length && this.tagSelectorInputs.length) {
      const existsTagNames = existsTags.map(({ name }) => name)
      this.tagSelectorInputs
        .filter((input) => existsTagNames.indexOf(input.value) >= 0)
        .forEach((input) => {
          input.setAttribute('checked', '')
        })
    }
  }

  protected firstUpdated() {
    this.fetchTags()
  }

  private async fetchTags() {
    this.tags = await apis.getTags()
  }

  public get selectedTags(): (Tag | TempTag)[] {
    const existsTags = Array.from(
      this.renderRoot.querySelectorAll<HTMLInputElement>(
        'input[type=checkbox].exists-tag'
      )
    )
      .filter(({ checked }) => checked)
      .map(({ id, value }) => ({ id, name: value } as Tag))
    const newTags = Array.from(
      this.renderRoot.querySelectorAll<HTMLInputElement>(
        'input[type=checkbox].new-tag'
      )
    )
      .filter(({ checked }) => checked)
      .map(({ value }) => ({ name: value } as TempTag))

    return [...existsTags, ...newTags]
  }

  render() {
    return html`
      <section id="tag-selector" class="container">
        <header>
          <h2>Tags</h2>
        </header>

        <label id="new-tag-input-label">
          <input
            id="new-tag-input"
            @change=${this.newTagChangeHandler}
            placeholder="Type tags here as csv format."
          />
        </label>

        ${this.newTags.length
          ? html`
              <div id="new-tags">
                ${this.newTags.map(
                  (tag) => html`<label>
                    <input
                      class="new-tag"
                      type="checkbox"
                      checked
                      .value=${tag.name}
                      disabled
                    />
                    <span>${tag.name}</span>
                  </label>`
                )}
              </div>
            `
          : ''}

        <div id="exists-tags">
          ${this.tags.map(
            (tag) => html` <label>
              <input
                class="exists-tag"
                type="checkbox"
                ?checked=${this.chosenTags.findIndex(
                  ({ name }) => name === tag.name
                ) >= 0}
                id=${tag.id}
                .value=${tag.name}
              />
              <span>${tag.name}</span>
            </label>`
          )}
        </div>
      </section>
    `
  }
}
