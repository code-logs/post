class StringUtil {
  public static splitByIndex(text: string, index: number): [string, string] {
    const front = text.slice(0, index)
    const rear = text.slice(index)

    return [front, rear]
  }
}

export default StringUtil
