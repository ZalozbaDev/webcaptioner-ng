import { Dispatch, SetStateAction } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import { Close, ZoomIn, ZoomOut } from '@mui/icons-material'
import { SpellCheckedText } from './spell-checked-text'
import { LoadingDotsLine } from './loading-dots-line'
import type { TranscriptLine } from '../../../types/transcript'
import {
  isRedundantPlainTranscriptLine,
  shouldShowPartialForDisplay,
} from '../../../helper/partial-transcript'
import { getTranscriptLinePlain } from '../../../types/transcript'

interface FullscreenTextDisplayProps {
  fullscreenField: 'none' | 'original' | 'translated'
  setFullscreenField: Dispatch<
    SetStateAction<'none' | 'original' | 'translated'>
  >
  originalText: TranscriptLine[]
  translatedText: TranscriptLine[]
  originalPartialText?: string
  originalFontSize: number
  translatedFontSize: number
  onIncreaseFontSize: () => void
  onDecreaseFontSize: () => void
  loading?: boolean
}

export const FullscreenTextDisplay = ({
  fullscreenField,
  setFullscreenField,
  originalText,
  translatedText,
  originalPartialText,
  originalFontSize,
  translatedFontSize,
  onIncreaseFontSize,
  onDecreaseFontSize,
  loading = false,
}: FullscreenTextDisplayProps) => {
  if (fullscreenField === 'none') {
    return null
  }

  const isOriginal = fullscreenField === 'original'
  const texts = isOriginal ? originalText : translatedText
  const partialText = isOriginal ? originalPartialText : undefined
  const fontSize = isOriginal ? originalFontSize : translatedFontSize
  const lastCommittedPlain = isOriginal
    ? getTranscriptLinePlain(originalText[originalText.length - 1])
    : undefined
  const lastTranslationPlain = isOriginal
    ? getTranscriptLinePlain(translatedText[translatedText.length - 1])
    : undefined
  const hasTranslationForLastOriginal =
    isOriginal &&
    originalText.length > 0 &&
    translatedText.length >= originalText.length
  const showPartial =
    !!partialText &&
    shouldShowPartialForDisplay(
      partialText,
      lastCommittedPlain,
      lastTranslationPlain,
      hasTranslationForLastOriginal,
    )
  const title = isOriginal ? 'Originalny tekst' : 'Přełožk'

  const handleClose = () => {
    setFullscreenField('none')
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        zIndex: 9999,
        backgroundColor: 'var(--card-bg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          px: 3,
          py: 2,
          backgroundColor: 'var(--card-bg)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <Typography
          variant='h6'
          sx={{
            color: 'var(--card-text-color)',
            fontWeight: 600,
          }}
        >
          {title}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <Typography
            variant='caption'
            sx={{
              color: 'var(--card-text-color)',
              fontSize: '0.75rem',
              fontWeight: 500,
              minWidth: '40px',
              textAlign: 'center',
            }}
          >
            {fontSize}px
          </Typography>

          <IconButton
            onClick={onDecreaseFontSize}
            size='small'
            disabled={fontSize <= 12}
            sx={{
              color: 'var(--card-text-color)',
              '&:hover': {
                backgroundColor: 'var(--button-hover)',
              },
            }}
          >
            <ZoomOut sx={{ fontSize: '1.25rem' }} />
          </IconButton>

          <IconButton
            onClick={onIncreaseFontSize}
            size='small'
            disabled={fontSize >= 128}
            sx={{
              color: 'var(--card-text-color)',
              '&:hover': {
                backgroundColor: 'var(--button-hover)',
              },
            }}
          >
            <ZoomIn sx={{ fontSize: '1.25rem' }} />
          </IconButton>

          <IconButton
            onClick={handleClose}
            size='small'
            sx={{
              color: 'var(--card-text-color)',
              '&:hover': {
                backgroundColor: 'var(--button-hover)',
              },
            }}
          >
            <Close sx={{ fontSize: '1.25rem' }} />
          </IconButton>
        </Box>
      </Box>

      <Box
        data-fullscreen-content
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          px: 3,
          py: 3,

          scrollbarWidth: 'none',
          msOverflowStyle: 'none',

          '&::-webkit-scrollbar': {
            display: 'none',
            width: 0,
            height: 0,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {texts.map((line, index) => {
            if (
              !isOriginal &&
              isRedundantPlainTranscriptLine(texts, index)
            ) {
              return null
            }

            return (
            <Box key={index}>
              <SpellCheckedText
                line={line}
                fontSize={fontSize}
                isTranslation={!isOriginal}
              />
            </Box>
            )
          })}

          {showPartial && (
            <SpellCheckedText
              line={partialText}
              fontSize={fontSize}
              isTranslation={!isOriginal}
              textColor='var(--text-secondary)'
            />
          )}

          {loading && <LoadingDotsLine fontSize={fontSize} />}
        </Box>
      </Box>
    </Box>
  )
}
