export {}

declare global {
  interface Window {
    hljs: {
      highlightElement: (element: Element) => void
    }
  }
}
