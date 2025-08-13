import { useCallback, useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  IconButton,
  FormControlLabel,
  Switch,
} from '@mui/material'
import {
  ZoomIn,
  ZoomOut,
  Fullscreen,
  FullscreenExit,
} from '@mui/icons-material'
import axios from 'axios'
import { initWebsocket } from '../main-screen/components/audio-recorder/handler/init-websocket'

interface AudioRecord {
  _id: string
  title: string
  createdAt: Date
  originalText: string[]
  translatedText: string[]
  token: string
}

const CastScreen = () => {
  const { token: urlToken } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const [cast, setCast] = useState<AudioRecord | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [inputToken, setInputToken] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [originalFontSize, setOriginalFontSize] = useState(() => {
    const saved = localStorage.getItem('castScreenOriginalFontSize')
    return saved ? parseInt(saved) : 16
  })
  const [translatedFontSize, setTranslatedFontSize] = useState(() => {
    const saved = localStorage.getItem('castScreenTranslatedFontSize')
    return saved ? parseInt(saved) : 16
  })
  const [autoscroll, setAutoscroll] = useState(() => {
    const saved = localStorage.getItem('castScreenAutoscroll')
    return saved ? JSON.parse(saved) : true
  })
  const [textFieldSize, setTextFieldSize] = useState(() => {
    const saved = localStorage.getItem('castScreenTextFieldSize')
    return saved ? parseInt(saved) : 50
  })
  const [isDragging, setIsDragging] = useState(false)

  const [fullscreenField, setFullscreenField] = useState<
    'none' | 'original' | 'translated'
  >('none')
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    localStorage.setItem(
      'castScreenOriginalFontSize',
      originalFontSize.toString()
    )
  }, [originalFontSize])

  useEffect(() => {
    localStorage.setItem(
      'castScreenTranslatedFontSize',
      translatedFontSize.toString()
    )
  }, [translatedFontSize])

  useEffect(() => {
    localStorage.setItem('castScreenAutoscroll', JSON.stringify(autoscroll))
  }, [autoscroll])

  useEffect(() => {
    localStorage.setItem('castScreenTextFieldSize', textFieldSize.toString())
  }, [textFieldSize])

  useEffect(() => {
    if (autoscroll) {
      // Scroll both text fields to bottom when new content arrives
      const originalTextContainer = document.querySelector(
        '[data-text-field="original"]'
      )
      const translatedTextContainer = document.querySelector(
        '[data-text-field="translated"]'
      )

      // If in fullscreen mode, scroll the fullscreen container instead
      if (fullscreenField === 'original' || fullscreenField === 'translated') {
        const fullscreenContainer = document.querySelector(
          '[data-fullscreen-content]'
        )
        if (fullscreenContainer) {
          fullscreenContainer.scrollTop = fullscreenContainer.scrollHeight
          return
        }
      }

      // Normal mode - scroll both containers
      if (originalTextContainer) {
        originalTextContainer.scrollTop = originalTextContainer.scrollHeight
      }
      if (translatedTextContainer) {
        translatedTextContainer.scrollTop = translatedTextContainer.scrollHeight
      }
    }
  }, [cast?.originalText, cast?.translatedText, autoscroll, fullscreenField])

  const increaseOriginalFontSize = () => {
    setOriginalFontSize(prev => Math.min(128, prev + 2))
  }

  const decreaseOriginalFontSize = () => {
    setOriginalFontSize(prev => Math.max(12, prev - 2))
  }

  const increaseTranslatedFontSize = () => {
    setTranslatedFontSize(prev => Math.min(128, prev + 2))
  }

  const decreaseTranslatedFontSize = () => {
    setTranslatedFontSize(prev => Math.max(12, prev - 2))
  }

  const handleDividerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()

    const startY = e.clientY
    const startTextFieldSize = textFieldSize
    const containerHeight = (70 * window.innerHeight) / 100 // 70vh in pixels

    setIsDragging(true)

    // Add visual feedback during dragging
    document.body.style.cursor = 'ns-resize'
    document.body.style.userSelect = 'none'

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY
      const deltaPercentage = (deltaY / containerHeight) * 100
      const newTextFieldSize = Math.max(
        10,
        Math.min(90, startTextFieldSize + deltaPercentage)
      )
      setTextFieldSize(newTextFieldSize)
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const toggleFullscreen = (field: 'original' | 'translated') => {
    if (fullscreenField === field) {
      setFullscreenField('none')
    } else {
      setFullscreenField(field)
    }
  }

  const validateToken = useCallback(
    async (tokenToValidate: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await axios.get<AudioRecord>(
          `${process.env.REACT_APP_WEBCAPTIONER_SERVER}/casts/${tokenToValidate}`
        )
        setCast(response.data)

        if (response.data?._id) {
          if (wsRef.current) {
            wsRef.current.close()
          }

          const wsUrl = `${process.env.REACT_APP_WEBCAPTIONER_SERVER?.replace(
            'http',
            'ws'
          )}/translations?recordId=${response.data._id}`

          wsRef.current = initWebsocket(wsUrl, (event: MessageEvent) => {
            try {
              const data = JSON.parse(event.data)

              if (data.original && data.translation) {
                setCast(prevCast =>
                  prevCast
                    ? {
                        ...prevCast,
                        originalText: [...prevCast.originalText, data.original],
                        translatedText: [
                          ...prevCast.translatedText,
                          data.translation,
                        ],
                      }
                    : prevCast
                )
              }
            } catch (e) {
              console.error('Invalid WS message', e)
            }
          })
        }
        if (!urlToken) {
          navigate(`/cast/${tokenToValidate}`)
        }
      } catch (err) {
        setError('Njepłaćiwe token. Prošu přepruwuj swoje zapodaće.')
        console.error('Error validating token:', err)
      } finally {
        setIsLoading(false)
      }
    },
    [navigate, urlToken]
  )

  useEffect(() => {
    if (urlToken) {
      validateToken(urlToken)
    }
  }, [urlToken, validateToken])

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputToken.trim()) {
      validateToken(inputToken.trim())
    }
  }

  if (!urlToken) {
    return (
      <Container maxWidth='xs'>
        <Typography
          variant='h5'
          sx={{ color: 'white', mb: 3, textAlign: 'center' }}
        >
          Zapodaj token
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label='Token'
            margin='normal'
            value={inputToken}
            onChange={e => setInputToken(e.target.value)}
            error={!!error}
            disabled={isLoading}
            variant='filled'
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              '& .MuiFormHelperText-root': {
                color: '#ff6b6b',
                marginLeft: 0,
                marginTop: 1,
                fontSize: '0.875rem',
                fontWeight: 500,
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(0, 0, 0, 0.6)',
                fontSize: '1rem',
              },
              '& .MuiFilledInput-root': {
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
              },
            }}
            helperText={error}
          />
          <Box sx={{ mt: 2 }}>
            <Button
              color='primary'
              fullWidth
              size='large'
              type='submit'
              variant='contained'
              disabled={isLoading || !inputToken.trim()}
            >
              {isLoading ? 'Waliduj...' : 'Dale'}
            </Button>
          </Box>
        </form>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth='xs'>
        <Typography color='error' sx={{ textAlign: 'center' }}>
          {error}
        </Typography>
      </Container>
    )
  }

  if (!cast) {
    return (
      <Container maxWidth='xs'>
        <Typography sx={{ color: 'white', textAlign: 'center' }}>
          Loading...
        </Typography>
      </Container>
    )
  }

  return (
    <Container
      maxWidth={false}
      sx={{
        width: '95%',
        maxWidth: 'none',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      {/* Top Controls */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 16,
          zIndex: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '0 0 8px 8px',
          padding: '8px 12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {/* Autoscroll Toggle */}
        <FormControlLabel
          control={
            <Switch
              checked={autoscroll}
              onChange={e => setAutoscroll(e.target.checked)}
              size='small'
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#1976d2',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#1976d2',
                },
                '& .MuiSwitch-root': {
                  width: 32,
                  height: 18,
                },
                '& .MuiSwitch-thumb': {
                  width: 14,
                  height: 14,
                },
              }}
            />
          }
          label={
            <Typography
              variant='caption'
              sx={{
                color: 'black',
                fontWeight: 500,
                fontSize: '0.75rem',
                marginLeft: 0.5,
              }}
            >
              Auto
            </Typography>
          }
          sx={{ margin: 0 }}
        />
      </Box>

      <Typography
        variant='h5'
        sx={{ color: 'white', mb: 3, textAlign: 'center' }}
      >
        {cast.title}
      </Typography>

      {/* Fullscreen Text Field View */}
      {fullscreenField !== 'none' && (
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
            p: 3,
          }}
        >
          {/* Fullscreen Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
              color: 'white',
            }}
          >
            <Typography variant='h5' sx={{ color: 'white', fontWeight: 600 }}>
              {fullscreenField === 'original' ? 'Originalny tekst' : 'Přełožk'}
            </Typography>
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

          {/* Fullscreen Content */}
          <Box
            sx={{
              flex: 1,
              backgroundColor: 'white',
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
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            }}
            data-fullscreen-content
          >
            {(fullscreenField === 'original'
              ? cast.originalText
              : cast.translatedText
            ).map((text: string, index: number) => (
              <Typography
                key={index}
                sx={{
                  mb: 2,
                  color: 'black',
                  fontSize: `${originalFontSize}px`,
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
      )}

      {/* Vertical Text Fields with Draggable Divider */}
      <Box
        sx={{
          height: '70vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Original Text Field */}
        <Box
          sx={{
            height: `${textFieldSize}%`,
            backgroundColor: 'white',
            borderRadius: 2,
            p: 3,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
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
              Originalny tekst
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
                {originalFontSize}px
              </Typography>
              <IconButton
                onClick={decreaseOriginalFontSize}
                size='small'
                sx={{
                  color: 'rgba(0, 0, 0, 0.6)',
                  padding: '4px',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
                }}
                disabled={originalFontSize <= 12}
              >
                <ZoomOut sx={{ fontSize: '1rem' }} />
              </IconButton>
              <IconButton
                onClick={increaseOriginalFontSize}
                size='small'
                sx={{
                  color: 'rgba(0, 0, 0, 0.6)',
                  padding: '4px',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
                }}
                disabled={originalFontSize >= 128}
              >
                <ZoomIn sx={{ fontSize: '1rem' }} />
              </IconButton>
              <IconButton
                onClick={() => toggleFullscreen('original')}
                size='small'
                sx={{
                  color: 'rgba(0, 0, 0, 0.6)',
                  padding: '4px',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
                }}
              >
                {fullscreenField === 'original' ? (
                  <FullscreenExit sx={{ fontSize: '1rem' }} />
                ) : (
                  <Fullscreen sx={{ fontSize: '1rem' }} />
                )}
              </IconButton>
            </Box>
          </Box>
          <Box
            data-text-field='original'
            sx={{
              flex: 1,
              overflowY: 'auto',
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
            {cast.originalText.map((text: string, index: number) => (
              <Typography
                key={index}
                sx={{
                  mb: 1,
                  color: 'black',
                  fontSize: `${originalFontSize}px`,
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

        {/* Draggable Divider */}
        <Box
          sx={{
            height: '12px',
            // backgroundColor: 'rgba(255, 255, 255, 0.9)',
            cursor: 'ns-resize',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            transition: 'background-color 0.2s ease',
            '&::before': {
              content: '""',
              width: '50px',
              height: '6px',
              backgroundColor: 'rgba(207, 207, 207, 0.602)',
              borderRadius: '3px',
              transition: 'background-color 0.2s ease',
            },
          }}
          onMouseDown={handleDividerMouseDown}
          title='Drag to resize text fields'
        >
          {/* Size indicator during dragging */}
          {isDragging && (
            <Box
              sx={{
                position: 'absolute',
                top: '-30px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                zIndex: 1000,
              }}
            >
              {Math.round(textFieldSize)}% / {Math.round(100 - textFieldSize)}%
            </Box>
          )}
        </Box>

        {/* Translated Text Field */}
        <Box
          sx={{
            height: `${100 - textFieldSize}%`,
            backgroundColor: 'white',
            borderRadius: 2,
            p: 3,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
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
              Přełožk
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
                {translatedFontSize}px
              </Typography>
              <IconButton
                onClick={decreaseTranslatedFontSize}
                size='small'
                sx={{
                  color: 'rgba(0, 0, 0, 0.6)',
                  padding: '4px',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
                }}
                disabled={translatedFontSize <= 12}
              >
                <ZoomOut sx={{ fontSize: '1rem' }} />
              </IconButton>
              <IconButton
                onClick={increaseTranslatedFontSize}
                size='small'
                sx={{
                  color: 'rgba(0, 0, 0, 0.6)',
                  padding: '4px',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
                }}
                disabled={translatedFontSize >= 128}
              >
                <ZoomIn sx={{ fontSize: '1rem' }} />
              </IconButton>
              <IconButton
                onClick={() => toggleFullscreen('translated')}
                size='small'
                sx={{
                  color: 'rgba(0, 0, 0, 0.6)',
                  padding: '4px',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
                }}
              >
                {fullscreenField === 'translated' ? (
                  <FullscreenExit sx={{ fontSize: '1rem' }} />
                ) : (
                  <Fullscreen sx={{ fontSize: '1rem' }} />
                )}
              </IconButton>
            </Box>
          </Box>
          <Box
            data-text-field='translated'
            sx={{
              flex: 1,
              overflowY: 'auto',
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
            {cast.translatedText.map((text: string, index: number) => (
              <Typography
                key={index}
                sx={{
                  mb: 1,
                  color: 'black',
                  fontSize: `${translatedFontSize}px`,
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
      </Box>
    </Container>
  )
}

export default CastScreen
