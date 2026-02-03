import { useCallback, useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Typography, Container } from '@mui/material'
import axios from 'axios'
import { initWebsocket } from '../main-screen/components/audio-recorder/handler/init-websocket'
import { getAudioFromText, getAudioRecord } from '../../lib/server-manager'
import { audioQueueService } from '../../services/AudioQueueService'
import {
  AutoscrollToggle,
  TokenInputForm,
  FullscreenTextDisplay,
  TextFieldWithControls,
  DraggableDivider,
  AudioToggle,
} from './components'
import ThemeToggle from '../../components/theme-toggle'
import { useWakeLock } from '../../hooks/use-wakelock'
import type { TranscriptLine } from '../../types/transcript'

const CastScreen = () => {
  const { token: urlToken } = useParams<{ token: string }>()
  const navigate = useNavigate()

  useWakeLock()

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
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [textFieldSize, setTextFieldSize] = useState(() => {
    const saved = localStorage.getItem('castScreenTextFieldSize')
    return saved ? parseInt(saved) : 50
  })
  const [isDragging, setIsDragging] = useState(false)

  const [fullscreenField, setFullscreenField] = useState<
    'none' | 'original' | 'translated'
  >('none')
  const wsRef = useRef<WebSocket | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const castRef = useRef<AudioRecord | null>(null)
  const audioEnabledRef = useRef<boolean>(false)

  useEffect(() => {
    localStorage.setItem(
      'castScreenOriginalFontSize',
      originalFontSize.toString(),
    )
  }, [originalFontSize])

  useEffect(() => {
    localStorage.setItem(
      'castScreenTranslatedFontSize',
      translatedFontSize.toString(),
    )
  }, [translatedFontSize])

  useEffect(() => {
    localStorage.setItem('castScreenAutoscroll', JSON.stringify(autoscroll))
  }, [autoscroll])

  useEffect(() => {
    localStorage.setItem('castScreenAudioEnabled', JSON.stringify(audioEnabled))
  }, [audioEnabled])

  // Refetch audio record when audio state changes to ensure synchronization
  useEffect(() => {
    if (cast?._id && audioEnabled) {
      // When audio is enabled, check if it's actually available on the server
      getAudioRecord(cast._id)
        .then(response => {
          const updatedCast = response.data
          if (updatedCast.speakerId === null && audioEnabled) {
            // If server shows audio is disabled, update local state
            setAudioEnabled(false)
            setCast(updatedCast)
          }
        })
        .catch(error => {
          console.error('Error checking audio availability:', error)
        })
    }
  }, [audioEnabled, cast?._id])

  // Debounced refetch to avoid too many API calls
  useEffect(() => {
    if (!cast?._id) return

    const timeoutId = setTimeout(async () => {
      try {
        const response = await getAudioRecord(cast._id)
        const updatedCast = response.data

        // Only update if there are actual changes
        if (updatedCast.speakerId !== cast.speakerId) {
          setCast(updatedCast)

          // If audio is disabled on the main screen (speakerId is null), disable it on cast screen
          if (updatedCast.speakerId === null && audioEnabled) {
            setAudioEnabled(false)
          }
        }
      } catch (error) {
        console.error('Error in debounced audio record refetch:', error)
      }
    }, 1000) // 1 second delay

    return () => clearTimeout(timeoutId)
  }, [cast?._id, cast?.speakerId, audioEnabled])

  // Debounced refetch to avoid too many API calls
  useEffect(() => {
    if (!cast?._id) return

    const timeoutId = setTimeout(async () => {
      try {
        const response = await getAudioRecord(cast._id)
        const updatedCast = response.data

        // Only update if there are actual changes
        if (updatedCast.speakerId !== cast.speakerId) {
          setCast(updatedCast)

          // If audio is disabled on the main screen (speakerId is null), disable it on cast screen
          if (updatedCast.speakerId === null && audioEnabled) {
            setAudioEnabled(false)
          }
        }
      } catch (error) {
        console.error('Error in debounced audio record refetch:', error)
      }
    }, 1000) // 1 second delay

    return () => clearTimeout(timeoutId)
  }, [cast?._id, cast?.speakerId, audioEnabled])

  useEffect(() => {
    localStorage.setItem('castScreenTextFieldSize', textFieldSize.toString())
  }, [textFieldSize])

  // Initialize audio context and AudioQueueService
  useEffect(() => {
    if (!audioContextRef.current) {
      const audioContext = new (
        window.AudioContext || (window as any).webkitAudioContext
      )()
      audioContextRef.current = audioContext

      // Create wrapper with playAudioData method
      const audioContextWrapper = {
        playAudioData: async (data: ArrayBuffer) => {
          try {
            // Resume audio context if it's suspended (browser autoplay policy)
            if (audioContext.state === 'suspended') {
              await audioContext.resume()
            }

            const audioBuffer = await audioContext.decodeAudioData(data)
            const source = audioContext.createBufferSource()
            source.buffer = audioBuffer
            source.connect(audioContext.destination)

            return new Promise<void>(resolve => {
              source.onended = () => {
                resolve()
              }

              source.start()
            })
          } catch (error) {
            console.error('Error playing audio:', error)
            throw error
          }
        },
      }

      audioQueueService.initialize(audioContextWrapper)
    }
  }, [])

  // Update refs when state changes
  useEffect(() => {
    castRef.current = cast
  }, [cast])

  useEffect(() => {
    audioEnabledRef.current = audioEnabled
  }, [audioEnabled])

  // Automatically disable audio if cast settings don't allow it
  useEffect(() => {
    if (cast?.speakerId === null) {
      setAudioEnabled(false)
    }
  }, [cast?.speakerId])

  // Poll for audio setting changes from the main screen
  useEffect(() => {
    if (!cast?._id) return

    const pollInterval = setInterval(async () => {
      try {
        const response = await getAudioRecord(cast._id)
        const updatedCast = response.data

        // Check if audio settings have changed
        if (updatedCast.speakerId !== cast.speakerId) {
          setCast(updatedCast)

          // If audio is disabled on the main screen (speakerId is null), disable it on cast screen
          if (updatedCast.speakerId === null && audioEnabled) {
            setAudioEnabled(false)
          }
        }
      } catch (error) {
        console.error('Error polling for audio record updates:', error)
      }
    }, 5000) // Check every 5 seconds

    return () => clearInterval(pollInterval)
  }, [cast?._id, cast?.speakerId, audioEnabled])

  useEffect(() => {
    if (autoscroll) {
      // Scroll both text fields to bottom when new content arrives
      const originalTextContainer = document.querySelector(
        '[data-text-field="original"]',
      )
      const translatedTextContainer = document.querySelector(
        '[data-text-field="translated"]',
      )

      // If in fullscreen mode, scroll the fullscreen container instead
      if (fullscreenField === 'original' || fullscreenField === 'translated') {
        const fullscreenContainer = document.querySelector(
          '[data-fullscreen-content]',
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
    document.body.classList.add('dragging')

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY
      const deltaPercentage = (deltaY / containerHeight) * 100
      const newTextFieldSize = Math.max(
        10,
        Math.min(90, startTextFieldSize + deltaPercentage),
      )
      setTextFieldSize(newTextFieldSize)
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      document.body.classList.remove('dragging')
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleDividerTouchStart = (event: React.TouchEvent) => {
    setIsDragging(true)
    const touch = event.touches[0]
    const startY = touch.clientY
    const startSize = textFieldSize

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const currentY = moveEvent.touches[0].clientY
      const deltaY = currentY - startY
      const windowHeight = window.innerHeight
      const newSize = Math.max(
        10,
        Math.min(90, startSize + (deltaY / windowHeight) * 100),
      )
      setTextFieldSize(newSize)
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }

    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)
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
          `${process.env.REACT_APP_WEBCAPTIONER_SERVER}/casts/${tokenToValidate}`,
        )
        setCast(response.data)

        // Immediately refetch to ensure we have the latest audio settings
        if (response.data?._id) {
          try {
            const latestResponse = await getAudioRecord(response.data._id)
            setCast(latestResponse.data)
          } catch (error) {
            console.error('Error fetching latest audio record:', error)
          }
        }

        if (response.data?._id) {
          if (wsRef.current) {
            wsRef.current.close()
          }

          const wsUrl = `${process.env.REACT_APP_WEBCAPTIONER_SERVER?.replace(
            'http',
            'ws',
          )}/translations?recordId=${response.data._id}`

          wsRef.current = initWebsocket(wsUrl, (event: MessageEvent) => {
            try {
              const data = JSON.parse(event.data)

              if (data.original && data.translation) {
                const originalLine = (
                  data.originalTokens?.length
                    ? {
                        plain: data.original,
                        tokens: data.originalTokens,
                      }
                    : data.original
                ) as TranscriptLine
                const translatedLine = data.translation as TranscriptLine
                setCast(prevCast =>
                  prevCast
                    ? {
                        ...prevCast,
                        originalText: [...prevCast.originalText, originalLine],
                        translatedText: [
                          ...prevCast.translatedText,
                          translatedLine,
                        ],
                      }
                    : prevCast,
                )

                // Immediately refetch the audio record to get the latest settings
                if (castRef.current?._id) {
                  getAudioRecord(castRef.current._id)
                    .then(response => {
                      const updatedCast = response.data
                      if (
                        updatedCast.speakerId !== castRef.current?.speakerId
                      ) {
                        setCast(updatedCast)

                        // If audio is disabled on the main screen, disable it on cast screen
                        if (
                          updatedCast.speakerId === null &&
                          audioEnabledRef.current
                        ) {
                          setAudioEnabled(false)
                        }
                      }
                    })
                    .catch(error => {
                      console.error('Error refetching audio record:', error)
                    })
                }

                if (
                  audioEnabledRef.current &&
                  castRef.current?.speakerId !== null &&
                  castRef.current?.speakerId !== undefined
                ) {
                  getAudioFromText(
                    data.translation,
                    castRef.current?.speakerId.toString(),
                  )
                    .then(audioResponse => {
                      audioQueueService.addToQueue(audioResponse.data)
                    })
                    .catch(error => {
                      console.error('Error playing audio:', error)
                    })
                }
              }
            } catch (e) {
              console.error('Invalid WS message', e)
            }
          })

          // Immediately refetch audio record after websocket connection to get latest settings
          if (response.data?._id) {
            try {
              const latestResponse = await getAudioRecord(response.data._id)
              setCast(latestResponse.data)
            } catch (error) {
              console.error(
                'Error fetching latest audio record after websocket connection:',
                error,
              )
            }
          }
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
    [navigate, urlToken],
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

  const handleUserInteraction = () => {
    // Resume audio context on user interaction (required for autoplay)
    if (
      audioContextRef.current &&
      audioContextRef.current.state === 'suspended'
    ) {
      audioContextRef.current.resume()
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
        <Typography sx={{ color: 'var(--text-primary)', textAlign: 'center' }}>
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
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <ThemeToggle />
        <AudioToggle
          audioEnabled={audioEnabled}
          setAudioEnabled={setAudioEnabled}
          disabled={cast.speakerId === null}
          disabledByMainScreen={cast.speakerId === null}
          onToggle={handleUserInteraction}
        />
        <AutoscrollToggle
          autoscroll={autoscroll}
          setAutoscroll={setAutoscroll}
        />
      </Box>

      {/* Audio status message */}
      {cast.speakerId === null && (
        <Box
          sx={{
            position: 'absolute',
            top: 60,
            right: 0,
            zIndex: 10,
            padding: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 1,
            fontSize: '0.75rem',
            color: '#666',
          }}
        >
          Audio disabled by main screen
        </Box>
      )}

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
          onTouchStart={handleDividerTouchStart}
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
