import { Box, Typography, IconButton } from '@mui/material'
import { FullscreenExit, ZoomIn, ZoomOut } from '@mui/icons-material'

interface FullscreenTextDisplayProps {
  fullscreenField: 'none' | 'original' | 'translated'
  setFullscreenField: (field: 'none' | 'original' | 'translated') => void
  originalText: string[]
  translatedText: string[]
  originalFontSize: number
  translatedFontSize: number
  onIncreaseFontSize: () => void
  onDecreaseFontSize: () => void
}

export const FullscreenTextDisplay = ({
  fullscreenField,
  setFullscreenField,
  originalText,
  translatedText,
  originalFontSize,
  translatedFontSize,
  onIncreaseFontSize,
  onDecreaseFontSize,
}: FullscreenTextDisplayProps) => {
  if (fullscreenField === 'none') return null

  const texts = fullscreenField === 'original' ? originalText : translatedText
  const title = fullscreenField === 'original' ? 'Originalny tekst' : 'Přełožk'
  const currentFontSize =
    fullscreenField === 'original' ? originalFontSize : translatedFontSize

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        p: 2,
      }}
    >
      {/* Fullscreen Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1,
          color: 'white',
        }}
      >
        <Typography variant='h5' sx={{ color: 'white', fontWeight: 600 }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography
            variant='caption'
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.8rem',
              fontWeight: 500,
              minWidth: '35px',
              textAlign: 'center',
            }}
          >
            {currentFontSize}px
          </Typography>
          <IconButton
            onClick={onDecreaseFontSize}
            size='small'
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              padding: '4px',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
            }}
            disabled={currentFontSize <= 12}
          >
            <ZoomOut sx={{ fontSize: '1.2rem' }} />
          </IconButton>
          <IconButton
            onClick={onIncreaseFontSize}
            size='small'
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              padding: '4px',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
            }}
            disabled={currentFontSize >= 128}
          >
            <ZoomIn sx={{ fontSize: '1.2rem' }} />
          </IconButton>
          <IconButton
            onClick={() => setFullscreenField('none')}
            size='large'
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <FullscreenExit />
          </IconButton>
        </Box>
      </Box>

      {/* Fullscreen Content - Text fields positioned over the background */}
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background text display */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            p: 4,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
              },
            },
          }}
          data-fullscreen-content
        >
          {texts.map((text: string, index: number) => (
            <Typography
              key={index}
              sx={{
                mb: 2,
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: `${currentFontSize * 0.8}px`,
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

        {/* Foreground text fields with minimal padding */}
        <Box
          sx={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            right: '8px',
            bottom: '8px',
            backgroundColor: 'white',
            borderRadius: 2,
            p: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '4px',
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
                mb: 2,
                color: 'black',
                fontSize: `${currentFontSize}px`,
                lineHeight: '1.6',
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
    </Box>
  )
}
