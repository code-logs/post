export const debounce = (
  callback: (...args: any) => void,
  timingMillieSeconds: number = 300
) => {
  let timeout: NodeJS.Timeout | null = null

  return (...args: any) => {
    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(() => {
      callback(...args)
    }, timingMillieSeconds)
  }
}
