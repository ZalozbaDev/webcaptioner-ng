import { useCallback, useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Typography, Container } from '@mui/material'
import axios from 'axios'
import { initWebsocket } from '../main-screen/components/audio-recorder/handler/init-websocket'
import {
  AutoscrollToggle,
  TokenInputForm,
  FullscreenTextDisplay,
  TextFieldWithControls,
  DraggableDivider,
} from './components'

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
      <TokenInputForm
        inputToken={inputToken}
        setInputToken={setInputToken}
        error={error}
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />
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
      }}
    >
      <AutoscrollToggle autoscroll={autoscroll} setAutoscroll={setAutoscroll} />

      <FullscreenTextDisplay
        fullscreenField={fullscreenField}
        setFullscreenField={setFullscreenField}
        originalText={cast.originalText}
        translatedText={cast.translatedText}
        originalFontSize={originalFontSize}
        translatedFontSize={translatedFontSize}
        onIncreaseFontSize={
          fullscreenField === 'original'
            ? increaseOriginalFontSize
            : increaseTranslatedFontSize
        }
        onDecreaseFontSize={
          fullscreenField === 'original'
            ? decreaseOriginalFontSize
            : decreaseTranslatedFontSize
        }
      />

      {/* Vertical Text Fields with Draggable Divider */}
      <Box
        sx={{
          height: 'calc(100vh - 120px)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Original Text Field */}

        <TextFieldWithControls
          title='Originalny tekst'
          texts={cast.originalText}
          fontSize={originalFontSize}
          onIncreaseFontSize={increaseOriginalFontSize}
          onDecreaseFontSize={decreaseOriginalFontSize}
          onToggleFullscreen={() => toggleFullscreen('original')}
          isFullscreen={fullscreenField === 'original'}
          dataTextField='original'
          height={textFieldSize}
        />

        <DraggableDivider
          onMouseDown={handleDividerMouseDown}
          isDragging={isDragging}
          textFieldSize={textFieldSize}
        />

        {/* Translated Text Field */}

        <TextFieldWithControls
          title='Přełožk'
          texts={cast.translatedText}
          fontSize={translatedFontSize}
          onIncreaseFontSize={increaseTranslatedFontSize}
          onDecreaseFontSize={decreaseTranslatedFontSize}
          onToggleFullscreen={() => toggleFullscreen('translated')}
          isFullscreen={fullscreenField === 'translated'}
          dataTextField='translated'
          height={100 - textFieldSize}
        />
      </Box>
    </Container>
  )
}

export default CastScreen
