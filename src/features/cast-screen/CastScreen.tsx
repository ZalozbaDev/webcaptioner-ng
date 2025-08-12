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
import { ZoomIn, ZoomOut } from '@mui/icons-material'
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
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('castScreenFontSize')
    return saved ? parseInt(saved) : 16
  })
  const [autoscroll, setAutoscroll] = useState(() => {
    const saved = localStorage.getItem('castScreenAutoscroll')
    return saved ? JSON.parse(saved) : true
  })
  const wsRef = useRef<WebSocket | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    localStorage.setItem('castScreenFontSize', fontSize.toString())
  }, [fontSize])

  useEffect(() => {
    localStorage.setItem('castScreenAutoscroll', JSON.stringify(autoscroll))
  }, [autoscroll])

  useEffect(() => {
    if (autoscroll && contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight
    }
  }, [cast?.originalText, cast?.translatedText, autoscroll])

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(32, prev + 2))
  }

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(12, prev - 2))
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
    <Container maxWidth='md'>
      <Typography
        variant='h5'
        sx={{ color: 'white', mb: 3, textAlign: 'center' }}
      >
        {cast.title}
      </Typography>

      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 2,
          p: 2,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant='body2' sx={{ color: 'black', fontWeight: 500 }}>
            Font size:
          </Typography>
          <IconButton
            onClick={decreaseFontSize}
            size='small'
            sx={{ color: 'black' }}
            disabled={fontSize <= 12}
          >
            <ZoomOut />
          </IconButton>
          <Typography
            variant='body2'
            sx={{ color: 'black', minWidth: '30px', textAlign: 'center' }}
          >
            {fontSize}px
          </Typography>
          <IconButton
            onClick={increaseFontSize}
            size='small'
            sx={{ color: 'black' }}
            disabled={fontSize >= 32}
          >
            <ZoomIn />
          </IconButton>
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={autoscroll}
              onChange={e => setAutoscroll(e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#1976d2',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#1976d2',
                },
              }}
            />
          }
          label={
            <Typography
              variant='body2'
              sx={{ color: 'black', fontWeight: 500 }}
            >
              Auto-scroll
            </Typography>
          }
        />
      </Box>

      <Box
        ref={contentRef}
        sx={{
          maxHeight: '70vh',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
      >
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            p: 3,
            mb: 3,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <Typography
            variant='h6'
            sx={{
              mb: 2,
              color: 'black',
              fontWeight: 600,
              fontSize: '1.25rem',
            }}
          >
            Originalny tekst
          </Typography>
          {cast.originalText.map((text: string, index: number) => (
            <Typography
              key={index}
              sx={{
                mb: 1,
                color: 'black',
                fontSize: `${fontSize}px`,
                lineHeight: 1.6,
              }}
            >
              {text}
            </Typography>
          ))}
        </Box>

        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            p: 3,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <Typography
            variant='h6'
            sx={{
              mb: 2,
              color: 'black',
              fontWeight: 600,
              fontSize: '1.25rem',
            }}
          >
            Přełožk
          </Typography>
          {cast.translatedText.map((text: string, index: number) => (
            <Typography
              key={index}
              sx={{
                mb: 1,
                color: 'black',
                fontSize: `${fontSize}px`,
                lineHeight: 1.6,
              }}
            >
              {text}
            </Typography>
          ))}
        </Box>
      </Box>
    </Container>
  )
}

export default CastScreen
