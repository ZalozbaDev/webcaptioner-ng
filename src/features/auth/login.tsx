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

export const LoginScreen: FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()

  const [password, setPassword] = useState('')

  const onLogin = () => {
    const successfull = login(password)
    if (!successfull) toast.error('Wopačne tajne hesło')
  }

  return (
    <Container maxWidth='xs'>
      <TextField
        fullWidth
        label='tajne hesło'
        margin='normal'
        autoComplete='false'
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        variant='filled'
        sx={{
          backgroundColor: 'white',
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
        >
          Login
        </Button>
      </Box>
    </Container>
  )
}
