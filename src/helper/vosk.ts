export const typedVoskResponse = (data: any): VOSKResponse => {
  const typed = JSON.parse(data)
  typed.listen = typed.listen === 'true'
  typed.start = typed.start ? parseInt(typed.start) : undefined
  typed.stop = typed.stop ? parseInt(typed.stop) : undefined

  return typed
}

export const createYoutubePackages = (
  text: string,
  timestamps: { start: Date; stop: Date }
) => {
  const duration = timestamps.stop.getTime() - timestamps.start.getTime()
  const textLength = text.length
  const textWordsLength = text.split(' ').length

  if (duration <= 5) {
    return [{ date: timestamps.start, text: text }]
  }

  // TODO: Add Logic
  return [{ date: timestamps.start, text: text }]
}
