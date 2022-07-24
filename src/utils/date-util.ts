export const toLocalizedInputValue = (timestamp: number) => {
  const timezoneOffset = new Date().getTimezoneOffset()
  return new Date(timestamp - timezoneOffset * 60 * 1000)
    .toISOString()
    .split('.')[0]
}
