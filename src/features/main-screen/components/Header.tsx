import { IconButton, Typography } from '@mui/material'
import { Logout } from '@mui/icons-material'
import { APP_VERSION } from '../../../constants'

type HeaderProps = {
  user: User | null
  onLogout: () => void
}

export const Header = ({ user, onLogout }: HeaderProps) => {
  return (
    <>
      {!user && (
        <IconButton
          onClick={onLogout}
          color='inherit'
          sx={{ position: 'absolute', top: 5, left: 5 }}
        >
          <Logout />
        </IconButton>
      )}
      <Typography
        variant='caption'
        sx={{
          position: 'absolute',
          bottom: 5,
          right: 5,
          opacity: 0.7,
        }}
      >
        v{APP_VERSION}
      </Typography>
      <h1>Serbski Webcaptioner</h1>
    </>
  )
}
