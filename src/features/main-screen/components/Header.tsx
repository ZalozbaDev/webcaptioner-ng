import { IconButton, Link, Typography } from '@mui/material'
import { Logout } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'
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
      {!user && (
        <div style={{ position: 'absolute', top: 5, right: 5 }}>
          <ThemeToggle />
        </div>
      )}

      {!user && (
        <Typography
          variant='caption'
          sx={{
            position: 'absolute',
            bottom: 5,
            left: 5,
            opacity: 0.7,
            display: 'flex',
            gap: 1,
          }}
        >
          <Link
            component={RouterLink}
            to='/impressum'
            underline='hover'
            sx={{ color: 'inherit' }}
          >
            Impressum
          </Link>
          <span>|</span>
          <Link
            component={RouterLink}
            to='/datenschutz'
            underline='hover'
            sx={{ color: 'inherit' }}
          >
            Datenschutz
          </Link>
        </Typography>
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
