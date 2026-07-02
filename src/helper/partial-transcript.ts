import {
  normalizeTranscriptText,
  normalizeTranscriptKey,
  getTranscriptLinePlain,
  getTranscriptLineTokens,
  type InputWord,
  type TranscriptLine,
} from '../types/transcript'

export const reducePartialText = (
  current: string,
  incoming: string | undefined,
): string => {
  if (incoming === undefined) return current
  const normalized = normalizeTranscriptText(incoming)
  return normalized.length > 0 ? normalized : current
}

export const shouldShowPartialText = (
  partial: string,
  lastCommittedPlain: string | undefined,
): boolean => {
  if (!partial.trim()) return false
  if (!lastCommittedPlain?.trim()) return true
  return (
    normalizeTranscriptKey(partial) !==
    normalizeTranscriptKey(lastCommittedPlain)
  )
}

const sharesSignificantOverlap = (a: string, b: string): boolean => {
  if (!a || !b) return false
  if (a === b) return true
  if (a.includes(b) || b.includes(a)) return true

  const minLen = Math.min(a.length, b.length)
  if (minLen < 4) return false

  let commonPrefix = 0
  for (let i = 0; i < minLen; i += 1) {
    if (a[i] === b[i]) {
      commonPrefix += 1
    } else {
      break
    }
  }

  return commonPrefix >= 12 || commonPrefix / minLen >= 0.5
}

export const shouldShowPartialForDisplay = (
  partial: string,
  lastOriginalPlain: string | undefined,
  lastTranslationPlain: string | undefined,
  hasTranslationForLastOriginal: boolean,
): boolean => {
  if (!partial.trim()) return false

  const partialKey = normalizeTranscriptKey(partial)
  const originalKey = normalizeTranscriptKey(lastOriginalPlain ?? '')
  const translationKey = normalizeTranscriptKey(lastTranslationPlain ?? '')

  if (originalKey && partialKey === originalKey) return false
  if (translationKey && partialKey === translationKey) return false

  if (
    hasTranslationForLastOriginal &&
    (sharesSignificantOverlap(partialKey, originalKey) ||
      sharesSignificantOverlap(partialKey, translationKey))
  ) {
    return false
  }

  return true
}

export const isRedundantPlainTranslationLine = <
  T extends { text: string; translationTokens?: InputWord[] },
>(
  items: T[],
  index: number,
): boolean => {
  if (index === 0) return false

  const current = items[index]
  const previous = items[index - 1]

  if (current.translationTokens?.length) return false
  if (!previous.translationTokens?.length) return false

  const currentKey = normalizeTranscriptKey(current.text)
  const previousKey = normalizeTranscriptKey(previous.text)

  return (
    currentKey === previousKey ||
    sharesSignificantOverlap(currentKey, previousKey)
  )
}

export const isRedundantPlainTranscriptLine = (
  items: TranscriptLine[],
  index: number,
): boolean => {
  if (index === 0) return false

  const currentTokens = getTranscriptLineTokens(items[index])
  const previousTokens = getTranscriptLineTokens(items[index - 1])

  if (currentTokens?.length) return false
  if (!previousTokens?.length) return false

  return (
    normalizeTranscriptKey(getTranscriptLinePlain(items[index])) ===
    normalizeTranscriptKey(getTranscriptLinePlain(items[index - 1]))
  )
}
