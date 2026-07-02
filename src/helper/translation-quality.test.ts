import { isTranslationTooWrong } from './translation-quality'
import type { InputWord } from '../types/transcript'

const t = (conf: number, word = 'w'): InputWord => ({ word, conf })

describe('isTranslationTooWrong', () => {
  it('returns false when tokens are missing', () => {
    expect(isTranslationTooWrong(undefined)).toBe(false)
    expect(isTranslationTooWrong([])).toBe(false)
  })

  it('returns false for very short outputs', () => {
    expect(isTranslationTooWrong([t(0.1), t(0.1), t(0.1)])).toBe(false)
  })

  it('returns false for mostly high confidence', () => {
    const tokens = [t(0.95), t(0.92), t(0.88), t(0.9), t(0.93)]
    expect(isTranslationTooWrong(tokens)).toBe(false)
  })

  it('returns true when most tokens are low confidence', () => {
    const tokens = [t(0.4), t(0.5), t(0.55), t(0.2), t(0.7), t(0.3), t(0.4)]
    expect(isTranslationTooWrong(tokens)).toBe(true)
  })

  it('returns true when many tokens are very low confidence', () => {
    const tokens = [t(0.9), t(0.1), t(0.2), t(0.15), t(0.85), t(0.9)]
    expect(isTranslationTooWrong(tokens)).toBe(true)
  })
})
