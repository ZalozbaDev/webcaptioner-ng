import React from 'react'
import { Typography, Box } from '@mui/material'
import { getConfidenceTokenStyle } from '../../../styles/token-highlighting'
import type { TranscriptLine } from '../../../types/transcript'
import {
  getTranscriptLinePlain,
  getTranscriptLineTokens,
} from '../../../types/transcript'

const CONFIDENCE_THRESHOLD = 0.8
interface SpellCheckedTextProps {
  line: TranscriptLine
  fontSize: number
  isTranslation?: boolean
}

export const SpellCheckedText: React.FC<SpellCheckedTextProps> = ({
  line,
  fontSize,
  isTranslation = false,
}) => {
  const text = getTranscriptLinePlain(line)
  const tokens = getTranscriptLineTokens(line)

  const shouldShowText =
    !isTranslation || (tokens?.at(0)?.conf ?? 0) > CONFIDENCE_THRESHOLD

  const renderText = () => {
    if (tokens?.length && isTranslation === false) {
      return (
        <Typography
          sx={{
            color: 'var(--card-text-color)',
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
          color: 'var(--card-text-color)',
          fontSize: `${fontSize}px`,
          lineHeight: 1.6,
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          whiteSpace: 'pre-wrap',
        }}
      >
        {shouldShowText ? text : '[unverständlich]'}
      </Typography>
    )
  }

  return <Box sx={{ position: 'relative' }}>{renderText()}</Box>
}
