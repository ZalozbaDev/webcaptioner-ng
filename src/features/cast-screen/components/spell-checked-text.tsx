import React from 'react'
import { Typography, Box } from '@mui/material'
import { getConfidenceTokenStyle } from '../../../styles/token-highlighting'
import type { TranscriptLine } from '../../../types/transcript'
import {
  getTranscriptLinePlain,
  getTranscriptLineTokens,
} from '../../../types/transcript'

interface SpellCheckedTextProps {
  line: TranscriptLine
  fontSize: number
}

export const SpellCheckedText: React.FC<SpellCheckedTextProps> = ({
  line,
  fontSize,
}) => {
  const text = getTranscriptLinePlain(line)
  const tokens = getTranscriptLineTokens(line)
  const renderText = () => {
    if (tokens?.length) {
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
        {text}
      </Typography>
    )
  }

  return <Box sx={{ position: 'relative' }}>{renderText()}</Box>
}
