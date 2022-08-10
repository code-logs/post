export {}

declare global {
  interface Window {
    hljs: {
      highlightElement: (element: Element) => void
    }
    prettier: {
      format: (
        text: string,
        options: { parser: 'markdown'; plugins: typeof window.prettierPlugins }
      ) => string
    }
    prettierPlugins: any
  }
}
