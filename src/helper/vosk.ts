export const typedVoskResponse = (data: any): VOSKResponse => {
  const typed = JSON.parse(data)
  typed.listen = typed.listen === 'true'
  const startMs = typed.startMs ? ('000' + typed.startMs).slice(-3) : '000'
  const stopMs = typed.stopMs ? ('000' + typed.stopMs).slice(-3) : '000'
  typed.start = typed.start ? parseInt(`${typed.start}${startMs}`) : undefined
  typed.stop = typed.stop ? parseInt(`${typed.stop}${stopMs}`) : undefined

  console.log({
    text: typed.text,
    start: `${typed.start}${startMs}`,
    stop: `${typed.stop}${stopMs}`,
  })

  return typed
}

const MAX_LENGTH_SECONDS = 5
const MAX_LENGTH_WORDS = 4
const MAX_LENGTH_CHARS = 40

export const createYoutubePackages = (
  text: string,
  timestamps: { start: Date; stop: Date }
) => {
  const duration = timestamps.stop.getTime() - timestamps.start.getTime()
  const textLength = text.length
  const textWordsLength = text.split(' ').length

  // if (textLength <= MAX_LENGTH_CHARS) {
  //   if (textWordsLength <= MAX_LENGTH_WORDS) {
  //     if (duration <= MAX_LENGTH_SECONDS) {
  //       return [{ date: timestamps.start, text: text }]
  //     } else {
  //     }
  //   }
  // }

  if (duration <= MAX_LENGTH_SECONDS) {
    return [{ date: timestamps.start, text: text }]
  }

  // TODO: Add Logic
  return [{ date: timestamps.start, text: text }]
}
