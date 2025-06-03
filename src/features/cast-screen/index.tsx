import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Typography, TextField, Button, Container } from '@mui/material'
import axios from 'axios'

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

  const validateToken = useCallback(
    async (tokenToValidate: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await axios.get<AudioRecord>(
          `${process.env.REACT_APP_WEBCAPTIONER_SERVER}/casts/${tokenToValidate}`
        )
        setCast(response.data)
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
              fontSize: '1rem',
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
              fontSize: '1rem',
              lineHeight: 1.6,
            }}
          >
            {text}
          </Typography>
        ))}
      </Box>
    </Container>
  )
}

export default CastScreen
