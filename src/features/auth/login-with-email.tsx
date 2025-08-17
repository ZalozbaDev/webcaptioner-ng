import { FC, useState } from 'react'
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Button,
  Container,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { toast } from 'sonner'
import useAuth from '../../hooks/use-auth'

const LoginWithEmailScreen: FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()

  const [password, setPassword] = useState('')

  const onLogin = () => {
    setLoading(true)
    login(email, password)
      .catch(err => {
        toast.error('Wopačne tajne hesło')
      })
      .finally(() => setLoading(false))
  }

  return (
    <Container maxWidth='xs'>
      <TextField
        fullWidth
        label='email'
        margin='normal'
        autoComplete='false'
        type='email'
        value={email}
        onChange={e => setEmail(e.target.value)}
        variant='filled'
        sx={{
          backgroundColor: 'var(--input-bg)',
          borderRadius: 2,
        }}
      />
      <TextField
        fullWidth
        label='tajne hesło'
        margin='normal'
        autoComplete='false'
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={e => setPassword(e.target.value)}
        variant='filled'
        sx={{
          backgroundColor: 'var(--input-bg)',
          borderRadius: 2,
        }}
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
          type='submit'
          variant='contained'
          onClick={onLogin}
          loading={loading}
        >
          Login
        </Button>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Button
          sx={{ color: 'var(--text-primary)' }}
          fullWidth
          size='large'
          type='submit'
          variant='text'
          href='/authentication/login'
        >
          Nimam account...
        </Button>
      </Box>
    </Container>
  )
}

export default LoginWithEmailScreen
