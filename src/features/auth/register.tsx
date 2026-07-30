import { FC, useState } from 'react'
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Button,
  Container,
  Typography,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/use-auth'

const RegisterScreen: FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const onRegister = () => {
    setLoading(true)
    register({ firstname, lastname, email, password })
      .then(() => {
        toast.success('Registracija wuspěšna! Móžeš so přizjewić.')
        navigate('/authentication/login-with-email')
      })
      .catch((err: unknown) => {
        const message = isAxiosError(err)
          ? err.response?.data?.message
          : undefined
        toast.error(message ?? 'Registracija njeje so poradźiła')
      })
      .finally(() => setLoading(false))
  }

  return (
    <Container maxWidth='xs'>
      <Typography variant='h6' sx={{ mb: 2, textAlign: 'center' }}>
        Registrować
      </Typography>

      <TextField
        fullWidth
        label='předmjeno'
        margin='normal'
        autoComplete='given-name'
        value={firstname}
        onChange={e => setFirstname(e.target.value)}
        variant='filled'
        sx={{ backgroundColor: 'var(--input-bg)', borderRadius: 2 }}
      />
      <TextField
        fullWidth
        label='familiowe mjeno'
        margin='normal'
        autoComplete='family-name'
        value={lastname}
        onChange={e => setLastname(e.target.value)}
        variant='filled'
        sx={{ backgroundColor: 'var(--input-bg)', borderRadius: 2 }}
      />
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
      <TextField
        fullWidth
        label='tajne hesło'
        margin='normal'
        autoComplete='new-password'
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={e => setPassword(e.target.value)}
        variant='filled'
        sx={{ backgroundColor: 'var(--input-bg)', borderRadius: 2 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton
                aria-label='toggle password visibility'
                onClick={() => setShowPassword(!showPassword)}
                onMouseDown={() => setShowPassword(!showPassword)}
                edge='end'
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ mt: 2 }}>
        <Button
          color='primary'
          fullWidth
          size='large'
          variant='contained'
          onClick={onRegister}
          loading={loading}
        >
          Registrować
        </Button>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Button
          sx={{ color: 'var(--text-primary)' }}
          fullWidth
          size='large'
          variant='text'
          href='/authentication/login-with-email'
        >
          Maš hižo account?
        </Button>
      </Box>
    </Container>
  )
}

export default RegisterScreen
