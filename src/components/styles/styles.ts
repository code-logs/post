import { css } from 'lit'

export const inputStyle = css`
  input,
  select {
    font-family: sans-serif;
    color: var(--theme-font-color);
    font-size: 0.8rem;
    box-sizing: border-box;
    border: 1px dashed var(--theme-red-color);
    outline: none;
    background-color: transparent;
    max-width: 180px;
    height: 30px;
    margin: auto 0;
    padding: 0 5px;
  }
  input[type='checkbox'] {
    margin: auto auto auto 0;
  }
  input[type='file'] {
    height: inherit;
    border: none;
    max-width: inherit;
  }
  input:focus,
  select:focus {
    border-style: solid;
  }
  input[type='file']:focus {
    border-style: none;
  }
`

export const labelStyle = css`
  label {
    font-family: sans-serif;
    color: var(--theme-font-color);
    font-size: 0.8rem;
    display: grid;
    grid-template-rows: auto 1fr;
    gap: 5px;
  }
`

export const h2Style = css`
  h2 {
    margin: 0 0 10px;
    padding-bottom: 5px;
    border-bottom: 1px dashed var(--theme-red-color);
  }
`

export const h3Style = css`
  h3 {
    margin: 10px 0;
    padding-bottom: 5px;
    border-bottom: 1px dashed var(--theme-red-color);
  }
`

export const sectionStyle = css`
  section.container {
    border: 1px dashed var(--theme-red-color);
    padding: 10px;
    background-color: var(--theme-light-background-color);
  }
`

export const buttonBoxStyle = css`
  .button-container {
    display: grid;
    grid-auto-flow: column;
    gap: 10px;
    justify-content: end;
  }

  button {
    background-color: var(--theme-light-background-color);
    height: 40px;
    min-width: 120px;
    border: 1px dashed var(--theme-red-color);
    font-weight: 600;
    transition: transform 0.2s ease-in-out 0s;
  }
  button:hover {
    transform: scale(1.2, 1.2);
  }
  button:active {
    transform: scale(1, 1);
  }
  button[danger] {
    color: var(--theme-red-color);
  }
`
