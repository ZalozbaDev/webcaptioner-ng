import { Box, Typography, TextField, Button, Container } from '@mui/material'

interface TokenInputFormProps {
  inputToken: string
  setInputToken: (token: string) => void
  error: string | null
  isLoading: boolean
  onSubmit: (e: React.FormEvent) => void
}

export const TokenInputForm = ({
  inputToken,
  setInputToken,
  error,
  isLoading,
  onSubmit,
}: TokenInputFormProps) => {
  return (
    <Container maxWidth='xs'>
      <Typography
        variant='h5'
        sx={{ color: 'var(--text-primary)', mb: 3, textAlign: 'center' }}
      >
        Zapodaj token
      </Typography>
      <form onSubmit={onSubmit}>
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
            backgroundColor: 'var(--input-bg)',
            borderRadius: 2,
            '& .MuiFormHelperText-root': {
              color: 'var(--error-color)',
              marginLeft: 0,
              marginTop: 1,
              fontSize: '0.875rem',
              fontWeight: 500,
            },
            '& .MuiInputLabel-root': {
              color: 'var(--text-secondary)',
              fontSize: '1rem',
            },
            '& .MuiFilledInput-root': {
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: 'var(--button-hover)',
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
