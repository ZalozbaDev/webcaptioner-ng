import type { CSSProperties } from 'react'

export const TOKEN_SUCCESS_TEXT = 'var(--success-color)'
export const TOKEN_SUCCESS_BG = 'var(--token-success-bg)'

export const TOKEN_WARNING_TEXT = 'var(--warning-color)'
export const TOKEN_WARNING_BG = 'var(--token-warning-bg)'

export const TOKEN_ERROR_TEXT = 'var(--error-color)'
export const TOKEN_ERROR_BG = 'var(--token-error-bg)'

export const TOKEN_ERROR_UNDERLINE = 'var(--token-error-underline)'

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
  // Firefox renders wavy underlines much thicker than Chrome when thickness is large.
  // Keep it thin and offset slightly for a cleaner look.
  textDecorationThickness: '1px',
  textUnderlineOffset: '2px',
  textDecorationSkipInk: 'none',
})

export const getSpellCheckTokenStyle = (isCorrect: boolean): CSSProperties => {
  const style: CSSProperties = {
    ...baseTokenStyle,
    color: isCorrect ? 'var(--success-color)' : TOKEN_ERROR_TEXT,
    backgroundColor: isCorrect ? TOKEN_SUCCESS_BG : TOKEN_ERROR_BG,
  }

  return isCorrect ? style : withWavyUnderline(style)
}

export const getConfidenceTokenColor = (conf: number): string => {
  if (conf >= 0.9) return TOKEN_SUCCESS_TEXT
  if (conf >= 0.6) return TOKEN_WARNING_TEXT
  return TOKEN_ERROR_TEXT
}

export const getConfidenceTokenStyle = (
  conf: number,
  isMisspelled: boolean,
): CSSProperties => {
  const isHighConfidence = conf >= 0.9
  const isMediumConfidence = conf >= 0.6 && conf < 0.9
  const style: CSSProperties = {
    ...baseTokenStyle,
    color: getConfidenceTokenColor(conf),
    backgroundColor: isHighConfidence
      ? TOKEN_SUCCESS_BG
      : isMediumConfidence
        ? TOKEN_WARNING_BG
        : TOKEN_ERROR_BG,
  }

  return isMisspelled ? withWavyUnderline(style) : style
}
