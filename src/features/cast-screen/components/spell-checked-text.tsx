import React from 'react'
import { Typography, Box } from '@mui/material'
import { getConfidenceTokenStyle } from '../../../styles/token-highlighting'
import type { TranscriptLine } from '../../../types/transcript'
import { getTranscriptLineTokens } from '../../../types/transcript'

interface SpellCheckedTextProps {
  line: TranscriptLine
  fontSize: number
  isTranslation?: boolean
  textColor?: string
}

// const CONFIDENCE_THRESHOLD = 0.8

export const SpellCheckedText: React.FC<SpellCheckedTextProps> = ({
  line,
  fontSize,
  isTranslation = false,
  textColor = 'var(--text-primary)',
}) => {
  const tokens = getTranscriptLineTokens(line)

  const renderText = () => {
    if (tokens?.length) {
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
  }

  return <Box sx={{ position: 'relative' }}>{renderText()}</Box>
}
