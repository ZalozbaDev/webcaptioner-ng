import { Box, Typography, IconButton } from '@mui/material'
import {
  ZoomIn,
  ZoomOut,
  Fullscreen,
  FullscreenExit,
} from '@mui/icons-material'
import { SpellCheckedText } from './spell-checked-text'
import { useTheme } from '../../../contexts/theme-context'
import type { TranscriptLine } from '../../../types/transcript'
import {
  isRedundantPlainTranscriptLine,
  shouldShowPartialForDisplay,
} from '../../../helper/partial-transcript'
import { getTranscriptLinePlain } from '../../../types/transcript'
import { LoadingDotsLine } from './loading-dots-line'

interface TextFieldWithControlsProps {
  title: string
  texts: TranscriptLine[]
  partialText?: string
  translatedTexts?: TranscriptLine[]
  fontSize: number
  onIncreaseFontSize: () => void
  onDecreaseFontSize: () => void
  onToggleFullscreen: () => void
  isFullscreen: boolean
  dataTextField: string
  height: number
  isTranslation?: boolean
  loading?: boolean
}

export const TextFieldWithControls = ({
  title,
  texts,
  partialText,
  translatedTexts = [],
  fontSize,
  onIncreaseFontSize,
  onDecreaseFontSize,
  onToggleFullscreen,
  isFullscreen,
  dataTextField,
  height,
  isTranslation = false,
  loading = false,
}: TextFieldWithControlsProps) => {
  const { theme } = useTheme()
  const lastCommittedPlain = getTranscriptLinePlain(texts[texts.length - 1])
  const lastTranslationPlain = getTranscriptLinePlain(
    translatedTexts[translatedTexts.length - 1],
  )
  const hasTranslationForLastOriginal =
    texts.length > 0 && translatedTexts.length >= texts.length
  const showPartial =
    !!partialText &&
    shouldShowPartialForDisplay(
      partialText,
      lastCommittedPlain,
      lastTranslationPlain,
      hasTranslationForLastOriginal,
    )

  return (
    <Box
      sx={{
        backgroundColor: 'var(--card-bg)',
        borderRadius: 2,
        p: 3,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: `${height}%`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant='h6'
          sx={{
            color: 'var(--card-text-color)',
            fontWeight: 600,
            fontSize: '1.25rem',
            flexShrink: 0,
          }}
        >
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography
            variant='caption'
            sx={{
              color: 'var(--card-text-color)',
              fontSize: '0.7rem',
              fontWeight: 500,
              minWidth: '30px',
              textAlign: 'center',
            }}
          >
            {fontSize}px
          </Typography>
          <IconButton
            onClick={onDecreaseFontSize}
            size='small'
            sx={{
              color: 'var(--card-text-color)',
              padding: '4px',
              '&:hover': { backgroundColor: 'var(--button-hover)' },
            }}
            disabled={fontSize <= 12}
          >
            <ZoomOut sx={{ fontSize: '1rem' }} />
          </IconButton>
          <IconButton
            onClick={onIncreaseFontSize}
            size='small'
            sx={{
              color: 'var(--card-text-color)',
              padding: '4px',
              '&:hover': { backgroundColor: 'var(--button-hover)' },
            }}
            disabled={fontSize >= 128}
          >
            <ZoomIn sx={{ fontSize: '1rem' }} />
          </IconButton>
          <IconButton
            onClick={onToggleFullscreen}
            size='small'
            sx={{
              color: 'var(--card-text-color)',
              padding: '4px',
              '&:hover': { backgroundColor: 'var(--button-hover)' },
            }}
          >
            {isFullscreen ? (
              <FullscreenExit sx={{ fontSize: '1rem' }} />
            ) : (
              <Fullscreen sx={{ fontSize: '1rem' }} />
            )}
          </IconButton>
        </Box>
      </Box>
      <Box
        data-text-field={dataTextField}
        sx={{
          flex: 1,
          overflowY: isFullscreen ? 'hidden' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          borderRadius: 1,
          p: 1,

          scrollbarWidth: isFullscreen ? 'none' : 'thin',
          msOverflowStyle: isFullscreen ? 'none' : 'auto',

          '&::-webkit-scrollbar': {
            width: isFullscreen ? '0px' : '6px',
            display: isFullscreen ? 'none' : 'block',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor:
              theme === 'dark' ? '#e0e0e0' : 'var(--bg-secondary)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor:
              theme === 'dark' ? '#b0b0b0' : 'var(--border-color)',
            borderRadius: '3px',
            '&:hover': {
              backgroundColor:
                theme === 'dark' ? '#909090' : 'var(--text-secondary)',
            },
          },
        }}
      >
        {texts.map((line, index) => {
          if (isTranslation && isRedundantPlainTranscriptLine(texts, index)) {
            return null
          }

          return (
          <Box key={index}>
            <SpellCheckedText
              line={line}
              fontSize={fontSize}
              isTranslation={isTranslation}
            />
          </Box>
          )
        })}
        {showPartial && (
          <SpellCheckedText
            line={partialText}
            fontSize={fontSize}
            isTranslation={isTranslation}
            textColor='var(--text-secondary)'
          />
        )}
        {loading && <LoadingDotsLine fontSize={fontSize} />}
      </Box>
    </Box>
  )
}
