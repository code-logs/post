import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('modal-spinner')
export class ModalSpinner extends LitElement {
  @property({ type: Boolean })
  isLoading: boolean = false

  static styles = css`
    #modal {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1;
      transition: opacity 0.3s ease-in-out 0s;
      pointer-events: none;
      opacity: 0;
    }
    #modal.is-loading {
      transition: opacity 0.5s ease-in-out 0s;
      pointer-events: auto;
      opacity: 1;
    }
    #message {
      position: absolute;
      left: 50%;
      top: 30%;
      transform: translate(-50%, -50%);
      font-weight: 700;
      font-size: 1.2rem;
      text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff,
        1px 1px 0 #fff;
    }
  `

  private loadingStartHandler = () => {
    document.body.style.overflow = 'hidden'
    this.isLoading = true
    this.modal.style.opacity = '1'
  }

  private loadingStopHandler = () => {
    document.body.style.overflow = 'auto'
    this.isLoading = false
    this.modal.style.opacity = '0'
  }

  private get modal() {
    const modal = this.renderRoot.querySelector<HTMLElement>('#modal')
    if (!modal) throw new Error('Failed to find modal')

    return modal
  }

  connectedCallback() {
    super.connectedCallback?.()
    window.addEventListener('loadingStart', this.loadingStartHandler)
    window.addEventListener('loadingStop', this.loadingStopHandler)
  }

  disconnectedCallback() {
    super.disconnectedCallback?.()
    window.removeEventListener('loadingStart', this.loadingStartHandler)
    window.removeEventListener('loadingStop', this.loadingStopHandler)
  }

  render() {
    return html`<section id="modal" class=${this.isLoading ? 'is-loading' : ''}>
      <p id="message">Now Loading...</p>
    </section>`
  }
}
