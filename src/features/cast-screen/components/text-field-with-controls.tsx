import { Box, Typography, IconButton } from '@mui/material'
import {
  ZoomIn,
  ZoomOut,
  Fullscreen,
  FullscreenExit,
} from '@mui/icons-material'

interface TextFieldWithControlsProps {
  title: string
  texts: string[]
  fontSize: number
  onIncreaseFontSize: () => void
  onDecreaseFontSize: () => void
  onToggleFullscreen: () => void
  isFullscreen: boolean
  dataTextField: string
  height: number
}

export const TextFieldWithControls = ({
  title,
  texts,
  fontSize,
  onIncreaseFontSize,
  onDecreaseFontSize,
  onToggleFullscreen,
  isFullscreen,
  dataTextField,
  height,
}: TextFieldWithControlsProps) => {
  return (
    <Box
      sx={{
        backgroundColor: 'white',
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
            color: 'black',
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
              color: 'rgba(0, 0, 0, 0.6)',
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
              color: 'rgba(0, 0, 0, 0.6)',
              padding: '4px',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
            }}
            disabled={fontSize <= 12}
          >
            <ZoomOut sx={{ fontSize: '1rem' }} />
          </IconButton>
          <IconButton
            onClick={onIncreaseFontSize}
            size='small'
            sx={{
              color: 'rgba(0, 0, 0, 0.6)',
              padding: '4px',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
            }}
            disabled={fontSize >= 128}
          >
            <ZoomIn sx={{ fontSize: '1rem' }} />
          </IconButton>
          <IconButton
            onClick={onToggleFullscreen}
            size='small'
            sx={{
              color: 'rgba(0, 0, 0, 0.6)',
              padding: '4px',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
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
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '3px',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        }}
      >
        {texts.map((text: string, index: number) => (
          <Typography
            key={index}
            sx={{
              color: 'black',
              fontSize: `${fontSize}px`,
              lineHeight: 1.6,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'pre-wrap',
            }}
          >
            {text}
          </Typography>
        ))}
      </Box>
    </Box>
  )
}
