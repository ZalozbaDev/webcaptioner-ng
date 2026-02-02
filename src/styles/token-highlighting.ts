import type { CSSProperties } from 'react'

const clamp01 = (value: number) => Math.max(0, Math.min(1, value))

export const TOKEN_SUCCESS_TEXT = '#15803d'
export const TOKEN_SUCCESS_BG = 'rgba(21, 128, 61, 0.12)'

export const TOKEN_ERROR_TEXT = '#b91c1c'
export const TOKEN_ERROR_BG = 'rgba(220, 38, 38, 0.10)'

export const TOKEN_ERROR_UNDERLINE = '#dc2626'

const baseTokenStyle = {
  fontWeight: 600,
  padding: '0 2px',
  borderRadius: 3,
} satisfies CSSProperties

const withWavyUnderline = (style: CSSProperties): CSSProperties => ({
  ...style,
  textDecorationLine: 'underline',
  textDecorationStyle: 'wavy',
  textDecorationColor: TOKEN_ERROR_UNDERLINE,
  textDecorationThickness: '3px',
})

export const getSpellCheckTokenStyle = (isCorrect: boolean): CSSProperties => {
  const style: CSSProperties = {
    ...baseTokenStyle,
    color: isCorrect ? TOKEN_SUCCESS_TEXT : TOKEN_ERROR_TEXT,
    backgroundColor: isCorrect ? TOKEN_SUCCESS_BG : TOKEN_ERROR_BG,
  }

  return isCorrect ? style : withWavyUnderline(style)
}

export const getConfidenceTokenColor = (conf: number): string => {
  // Use a dark, accessible green for high confidence.
  if (conf >= 0.9) return TOKEN_SUCCESS_TEXT

  // Otherwise use a darker red scale (more readable than very light pinks).
  const redness = clamp01((0.9 - conf) / 0.9)
  const lightness = 55 - 25 * redness
  return `hsl(0, 85%, ${lightness}%)`
}

export const getConfidenceTokenStyle = (
  conf: number,
  isMisspelled: boolean,
): CSSProperties => {
  const isHighConfidence = conf >= 0.9
  const style: CSSProperties = {
    ...baseTokenStyle,
    color: getConfidenceTokenColor(conf),
    backgroundColor: isHighConfidence ? TOKEN_SUCCESS_BG : TOKEN_ERROR_BG,
  }

  return isMisspelled ? withWavyUnderline(style) : style
}
