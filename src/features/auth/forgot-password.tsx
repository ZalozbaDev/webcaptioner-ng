import { FC, useState } from 'react'
import { TextField, Box, Button, Container, Typography } from '@mui/material'
import { toast } from 'sonner'
import useAuth from '../../hooks/use-auth'

const ForgotPasswordScreen: FC = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const { forgotPassword } = useAuth()

  const onSubmit = () => {
    setLoading(true)
    forgotPassword(email)
      .then(() => {
        setSent(true)
        toast.success('Email je so wotpósłał, jeli account eksistuje.')
      })
      .catch(() => {
        toast.error('Wotpósłanje njeje so poradźiło')
      })
      .finally(() => setLoading(false))
  }

  return (
    <Container maxWidth='xs'>
      <Typography variant='h6' sx={{ mb: 2, textAlign: 'center' }}>
        Tajne hesło wotpomnić
      </Typography>

      {sent ? (
        <Typography variant='body2' sx={{ textAlign: 'center', color: 'text.secondary' }}>
          Jeli account z tym emailom eksistuje, dóstanješ link za resetowanje
          tajneho hesła.
        </Typography>
      ) : (
        <>
          <TextField
            fullWidth
            label='email'
            margin='normal'
            autoComplete='email'
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            variant='filled'
            sx={{ backgroundColor: 'var(--input-bg)', borderRadius: 2 }}
          />

          <Box sx={{ mt: 2 }}>
            <Button
              color='primary'
              fullWidth
              size='large'
              variant='contained'
              onClick={onSubmit}
              loading={loading}
            >
              Link wotpósłać
            </Button>
          </Box>
        </>
      )}

      <Box sx={{ mt: 2 }}>
        <Button
          sx={{ color: 'var(--text-primary)' }}
          fullWidth
          size='large'
          variant='text'
          href='/authentication/login-with-email'
        >
          Wróćo k login
        </Button>
      </Box>
    </Container>
  )
}

export default ForgotPasswordScreen
