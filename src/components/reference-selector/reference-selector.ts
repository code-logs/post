import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { TempPostRef } from '../../types/post-ref.js'
import { h2Style, sectionStyle } from '../styles/styles.js'

@customElement('reference-selector')
export class ReferenceSelector extends LitElement {
  @property({ type: Array })
  refCandidates: TempPostRef[] = []

  static styles = css`
    ${sectionStyle}
    ${h2Style}
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

  public get selectedRefs() {
    const refCheckboxes = Array.from(
      this.renderRoot.querySelectorAll<HTMLInputElement>(
        '#reference-selector input'
      )
    )
    const selectedCheckboxes = refCheckboxes.filter((input) => input.checked)
    return selectedCheckboxes.map(
      (checkbox) => checkbox.dataset as unknown as TempPostRef
    )
  }

  render() {
    return html`<section id="reference-selector" class="container">
      <h2>References</h2>
      <ul>
        ${this.refCandidates.map(
          (ref) => html`<li>
            <label>
              <input
                type="checkbox"
                checked
                data-title=${ref.title}
                data-url=${ref.url}
              />
              <div>
                <input .value=${ref.title} />
                <input readonly .value=${ref.url} />
              </div>
            </label>
          </li>`
        )}
      </ul>
    </section>`
  }
}
