class Fetcher {
  private baseUrl: string

  private readonly headers: Record<string, string>

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    this.headers = {
      'content-type': 'application/json',
    }
  }

  async get<TRes>(path: string, headers = {}): Promise<TRes> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: 'get',
        headers: { ...this.headers, ...headers },
      })

      const json = await response.json()
      return json as TRes
    } catch (e) {
      this.handleError(e)
      throw e
    }
  }

  async post<TRes, TBody>(
    path: string,
    body?: TBody,
    headers = {}
  ): Promise<TRes> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: 'post',
        headers: { ...this.headers, ...headers },
        body: body ? JSON.stringify(body) : undefined,
      })

      const json = await response.json()
      return json as TRes
    } catch (e) {
      this.handleError(e)
      throw e
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

export default new Fetcher('http://localhost:8080/apis')
