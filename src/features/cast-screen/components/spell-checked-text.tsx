import React from 'react'
import { Typography, Box } from '@mui/material'
import { getConfidenceTokenStyle } from '../../../styles/token-highlighting'
import type { TranscriptLine } from '../../../types/transcript'
import {
  getTranscriptLinePlain,
  getTranscriptLineTokens,
} from '../../../types/transcript'

const CONFIDENCE_THRESHOLD = 0.8

const getAverageConfidence = (
  tokens: ReturnType<typeof getTranscriptLineTokens>,
): number | undefined => {
  if (!tokens?.length) return undefined
  const sum = tokens.reduce((acc, t) => acc + t.conf, 0)
  return sum / tokens.length
}
interface SpellCheckedTextProps {
  line: TranscriptLine
  fontSize: number
  isTranslation?: boolean
  textColor?: string
}

export const SpellCheckedText: React.FC<SpellCheckedTextProps> = ({
  line,
  fontSize,
  isTranslation = false,
  textColor = 'var(--text-primary)',
}) => {
  const text = getTranscriptLinePlain(line)
  const tokens = getTranscriptLineTokens(line)
  const confidence = getAverageConfidence(tokens)
  const shouldMask =
    isTranslation &&
    confidence !== undefined &&
    confidence < CONFIDENCE_THRESHOLD

  const renderText = () => {
    if (tokens?.length && !shouldMask) {
      return (
        <Typography
          sx={{
            color: textColor,
            fontSize: `${fontSize}px`,
            lineHeight: 1.6,
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          {tokens.map((w, i) => {
            const isMisspelled = w.spell === false
            const style = getConfidenceTokenStyle(w.conf, isMisspelled)
            return (
              <span key={`${w.word}-${i}`} style={style}>
                {w.word}
                {i < tokens.length - 1 ? ' ' : ''}
              </span>
            )
          })}
        </Typography>
      )
    }

    return (
      <Typography
        sx={{
          color: textColor,
          fontSize: `${fontSize}px`,
          lineHeight: 1.6,
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          whiteSpace: 'pre-wrap',
        }}
      >
        {shouldMask ? '[unverständlich]' : text}
      </Typography>
    )
  }

  return <Box sx={{ position: 'relative' }}>{renderText()}</Box>
}
