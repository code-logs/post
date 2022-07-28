import { BASE_URL } from '../constants/base-url.js'

class Fetcher {
  private baseUrl: string

  private beforeRequestHandler: () => void

  private afterResponseHandler: () => void

  private readonly headers: Record<string, string>

  constructor(
    baseUrl: string,
    beforeRequestHandler: () => void,
    afterResponseHandler: () => void
  ) {
    this.baseUrl = baseUrl
    this.beforeRequestHandler = beforeRequestHandler
    this.afterResponseHandler = afterResponseHandler
    this.headers = {
      'content-type': 'application/json',
    }
  }

  private buildRequestURL(path: string) {
    return `${this.baseUrl}${path}`
  }

  async get<TRes>(path: string, headers = {}): Promise<TRes> {
    try {
      this.beforeRequestHandler()
      const response = await fetch(this.buildRequestURL(path), {
        method: 'get',
        headers: { ...this.headers, ...headers },
      })

      if (!response.ok) throw new Error(await response.text())

      const json = await response.json()
      return json
    } catch (e) {
      this.handleError(e)
      throw e
    } finally {
      this.afterResponseHandler()
    }
  }

  async post<TRes, TBody>(
    path: string,
    body?: TBody,
    customHeaders = {}
  ): Promise<TRes> {
    try {
      let data: FormData | string | undefined
      let headers: Record<string, any> | undefined = {
        ...this.headers,
        ...customHeaders,
      }
      if (body instanceof FormData) {
        data = body
        headers = undefined
      } else if (body) {
        data = JSON.stringify(body)
      }

      this.beforeRequestHandler()
      const response = await fetch(this.buildRequestURL(path), {
        method: 'post',
        headers,
        body: data,
      })

      if (!response.ok) throw new Error(await response.text())

      const json = await response.json()
      return json
    } catch (e) {
      this.handleError(e)
      throw e
    } finally {
      this.afterResponseHandler()
    }
  }

  async put<TRes, TBody>(
    path: string,
    body?: TBody,
    customHeaders = {}
  ): Promise<TRes> {
    try {
      let data: FormData | string | undefined
      let headers: Record<string, any> | undefined = {
        ...this.headers,
        ...customHeaders,
      }
      if (body instanceof FormData) {
        data = body
        headers = undefined
      } else if (body) {
        data = JSON.stringify(body)
      }

      this.beforeRequestHandler()
      const response = await fetch(this.buildRequestURL(path), {
        method: 'put',
        headers,
        body: data,
      })

      if (!response.ok) throw new Error(await response.text())

      const json = await response.json()
      return json
    } catch (e) {
      this.handleError(e)
      throw e
    } finally {
      this.afterResponseHandler()
    }
  }

  async delete<TRes>(path: string, customHeaders = {}): Promise<TRes> {
    try {
      this.beforeRequestHandler()
      const response = await fetch(this.buildRequestURL(path), {
        method: 'delete',
        headers: { ...this.headers, ...customHeaders },
      })

      if (!response.ok) throw new Error(await response.text())

      const json = await response.json()
      return json
    } catch (e) {
      this.handleError(e)
      throw e
    } finally {
      this.afterResponseHandler()
    }
  }

  handleError(e: unknown) {
    if (e instanceof Error) {
      alert(e.message)
    } else {
      alert('Unexpected error ocurred')
    }
  }
}

export default new Fetcher(
  `${BASE_URL}/apis`,
  () => {
    window.dispatchEvent(new CustomEvent('loadingStart'))
  },
  () => {
    window.dispatchEvent(new CustomEvent('loadingStop'))
  }
)
