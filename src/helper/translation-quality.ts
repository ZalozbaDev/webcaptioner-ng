import type { InputWord } from '../types/transcript'

const LOW_CONF_THRESHOLD = 0.6
const VERY_LOW_CONF_THRESHOLD = 0.35

// Heuristic: treat a translation as "too wrong" when the model itself is
// uncertain for a big portion of tokens. This is intentionally conservative
// to avoid false positives.
export const isTranslationTooWrong = (tokens?: InputWord[]): boolean => {
  if (!tokens?.length) return false

  // Very short outputs are hard to judge; don't block audio.
  if (tokens.length < 4) return false

  let sum = 0
  let low = 0
  let veryLow = 0

  for (const t of tokens) {
    const conf = typeof t.conf === 'number' ? t.conf : Number(t.conf)
    if (!Number.isFinite(conf)) continue

    sum += conf
    if (conf < LOW_CONF_THRESHOLD) low += 1
    if (conf < VERY_LOW_CONF_THRESHOLD) veryLow += 1
  }

  const count = tokens.length
  const avg = sum / count
  const lowRatio = low / count
  const veryLowRatio = veryLow / count

  // Strong signals of "too wrong":
  // - Most tokens are low confidence
  // - or a substantial chunk is *very* low confidence
  // - or the overall average confidence is low and many tokens are low
  if (lowRatio >= 0.7) return true
  if (veryLowRatio >= 0.25) return true
  if (avg < 0.58 && lowRatio >= 0.5) return true

  return false
}
