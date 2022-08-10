import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import StringUtil from '../../utils/string-util.js'

@customElement('markdown-editor')
export class MarkdownEditor extends LitElement {
  @property({ type: String })
  value: string = ''

  private set _value(value: string) {
    this.dispatchValueChangeEvent(value)
  }

  static styles = css`
    :host {
      display: flex;
      flex: 1;
    }
    #editor {
      font-family: sans-serif;
      color: var(--theme-font-color);
      font-size: 14px;
      background-color: var(--theme-light-background-color);
      padding: 10px;
      border: 1px dashed var(--theme-red-color);
      width: 100%;
      outline: none;
      tab-size: 2;
      overflow: auto;
      box-sizing: border-box;
      resize: none;
      max-height: 700px;
    }
    #editor:focus {
      border-style: solid;
    }
    #editor::-webkit-scrollbar {
      cursor: default;
      width: 5px;
    }
    #editor::-webkit-scrollbar-thumb {
      background-color: var(--theme-red-color);
    }
  `

  private dispatchValueChangeEvent(value: string) {
    this.dispatchEvent(
      new CustomEvent('valueChange', { detail: { value }, composed: true })
    )
  }

  private dispatchChangeEvent() {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.value },
        composed: true,
      })
    )
  }

  get editor() {
    const editor = this.renderRoot.querySelector<HTMLTextAreaElement>('#editor')
    if (!editor) throw new Error('Failed to find editor')
    return editor
  }

  private keydownHandler(event: KeyboardEvent) {
    const { key, shiftKey, metaKey, ctrlKey } = event
    if (key === 'Tab') {
      event.preventDefault()

      if (shiftKey) {
        this.unTab()
      } else {
        this.doTab()
      }
    }

    if (key === 'Enter') {
      if (this.duplicatePrevFragment()) {
        event.preventDefault()
      }
    }

    if (metaKey || ctrlKey) {
      if (key === '[') {
        event.preventDefault()
        this.unTab()
      }

      if (key === ']') {
        event.preventDefault()
        this.appendTab()
      }
    }
  }

  private getFrontContent() {
    const { selectionStart } = this.editor
    const front = StringUtil.splitByIndex(this.value, selectionStart)[0]
    const phrases = front.split('\n')
    return phrases[phrases.length - 1]
  }

  private duplicatePrevFragment() {
    const prevLineContent = this.getFrontContent()
    const regex = /(\s?)+([0-9]\. |- |> )/
    if (regex.test(prevLineContent)) {
      const matched = prevLineContent.match(regex)
      if (matched) {
        this.appendText(`\n${matched[matched.length - 1]}`)
        return true
      }
    }

    return false
  }

  private placeCaret(range: number) {
    setTimeout(() => {
      this.editor.setSelectionRange(range, range)
    })
  }

  private getCurrentLineIndex() {
    const { selectionStart } = this.editor
    const front = StringUtil.splitByIndex(this.value, selectionStart)[0]
    return front.split('\n').length - 1
  }

  private async appendText(text: string) {
    const { selectionStart, selectionEnd } = this.editor
    const front = StringUtil.splitByIndex(this.value, selectionStart)[0]
    const rear = StringUtil.splitByIndex(this.value, selectionEnd)[1]
    this._value = `${front}${text}${rear}`
    await this.updateComplete
    setTimeout(() => {
      this.editor.setSelectionRange(
        selectionStart + text.length,
        selectionStart + text.length
      )
    })
  }

  private async appendTab() {
    const { selectionStart } = this.editor
    const currentLineIndex = this.getCurrentLineIndex()

    this._value = this.value
      .split('\n')
      .map((phrase, index) => {
        if (index !== currentLineIndex) return phrase
        return `\t${phrase}`
      })
      .join('\n')

    await this.updateComplete
    this.placeCaret(selectionStart + 1)
  }

  private doTab() {
    this.appendText('\t')
  }

  private async unTab() {
    const currentLineContent = this.getFrontContent()
    if (/^( |\t)/.test(currentLineContent)) {
      const { selectionStart } = this.editor
      const currentLineIndex = this.getCurrentLineIndex()

      this._value = this.value
        .split('\n')
        .map((phrase, index) => {
          if (index !== currentLineIndex) return phrase

          return phrase.replace(/^( |\t)/, '')
        })
        .join('\n')

      await this.updateComplete
      this.placeCaret(selectionStart - 1)
    }
  }

  public reset() {
    this._value = ''
    this.editor.value = ''
  }

  public focus() {
    this.editor.focus()
  }

  render() {
    return html`
      <textarea
        id="editor"
        @keydown=${this.keydownHandler}
        @input=${() => {
          this._value = this.editor.value
        }}
        .value=${this.value}
        @change=${() => {
          this.dispatchChangeEvent()
        }}
      ></textarea>
    `
  }
}
