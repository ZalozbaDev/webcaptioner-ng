import type { InputWord } from '../types/transcript'
import { normalizeTranscriptKey } from '../types/transcript'

export type TranslationWithTokens = {
  text: string
  translationTokens?: InputWord[]
}

export const attachTokensToLatestTranslation = <
  T extends TranslationWithTokens,
>(
  translations: T[],
  translation: string,
  translationTokens: InputWord[],
): { translations: T[]; attached: boolean } => {
  if (!translation || !translationTokens?.length) {
    return { translations, attached: false }
  }

  const normalizedTranslation = normalizeTranscriptKey(translation)

  const exactIndex = [...translations]
    .map((_, i) => i)
    .reverse()
    .find(
      i =>
        normalizeTranscriptKey(translations[i].text) ===
          normalizedTranslation && !translations[i].translationTokens,
    )

  const fallbackIndex =
    exactIndex === undefined
      ? [...translations]
          .map((_, i) => i)
          .reverse()
          .find(i => !translations[i].translationTokens)
      : undefined

  const resolvedIndex = exactIndex ?? fallbackIndex
  if (resolvedIndex === undefined) {
    return { translations, attached: false }
  }

  const next = [...translations]
  next[resolvedIndex] = {
    ...next[resolvedIndex],
    translationTokens,
  }

  return { translations: next, attached: true }
}

export const enqueuePendingTranslationTokens = (
  pending: Map<string, InputWord[][]>,
  translation: string,
  translationTokens: InputWord[],
): void => {
  if (!translation || !translationTokens?.length) return

  const key = normalizeTranscriptKey(translation)
  const queue = pending.get(key) ?? []
  pending.set(key, [...queue, translationTokens])
}

export const dequeuePendingTranslationTokens = (
  pending: Map<string, InputWord[][]>,
  translation: string,
): InputWord[] | undefined => {
  const key = normalizeTranscriptKey(translation)
  const queue = pending.get(key)
  if (!queue?.length) return undefined

  const [nextTokens, ...rest] = queue
  if (rest.length) {
    pending.set(key, rest)
  } else {
    pending.delete(key)
  }

  return nextTokens
}
