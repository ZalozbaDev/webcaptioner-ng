import { IconButton, Typography } from '@mui/material'
import { Logout } from '@mui/icons-material'
import { APP_VERSION } from '../../../constants'
import ThemeToggle from '../../../components/theme-toggle'

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

      {/* Theme Toggle - positioned in top-right */}
      <div style={{ position: 'absolute', top: 5, right: 5 }}>
        <ThemeToggle />
      </div>

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
