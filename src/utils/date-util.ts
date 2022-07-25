export const toLocalizedDatetimeInputValue = (timestamp: number) => {
  const timezoneOffset = new Date().getTimezoneOffset()
  return new Date(timestamp - timezoneOffset * 60 * 1000)
    .toISOString()
    .split('.')[0]
}

export const toLocalizedDateInputValue = (timestamp: number) => {
  const timezoneOffset = new Date().getTimezoneOffset()
  return new Date(timestamp - timezoneOffset * 60 * 1000)
    .toISOString()
    .slice(0, 10)
}
