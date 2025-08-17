import {
  experimentalStyled,
  AppBar,
  Toolbar,
  Hidden,
  IconButton,
  Typography,
  Box,
  Button,
  AppBarProps,
} from '@mui/material'
import { FC, useState } from 'react'
import { NavigateFunction, Link as RouterLink } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import { NAVBAR_HEIGHT } from '../constants'
import useAuth from '../../../hooks/use-auth'
import ThemeToggle from '../../theme-toggle'

interface DashboardNavbarProps extends AppBarProps {
  onSidebarMobileOpen?: () => void
  title: string
  navigate: NavigateFunction
}

const DashboardNavbarRoot = experimentalStyled(AppBar)(({ theme }) => ({
  ...(theme.palette.mode === 'light' && {
    backgroundColor: theme.palette.background.paper,
    boxShadow: 'none',
    color: theme.palette.primary.contrastText,
  }),
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none',
  }),
  zIndex: theme.zIndex.drawer + 100,
}))

const DashboardNavbar: FC<DashboardNavbarProps> = props => {
  const { onSidebarMobileOpen, navigate, ...other } = props

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  // const handleClose = () => {
  //   setAnchorEl(null)
  // }

  const { logout } = useAuth()

  // const onSignOut = () => {
  //   logout().catch(err => {
  //     toast.error(err.message)
  //   })
  // }

  // const handleProfile = () => {
  //   handleClose()
  //   navigate('profile')
  // }

  // const handleSettings = () => {
  //   handleClose()
  //   navigate('settings')
  // }

  const { user } = useAuth()

  return (
    <DashboardNavbarRoot {...other}>
      <Toolbar
        sx={{
          minHeight: NAVBAR_HEIGHT,
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}
      >
        <Hidden lgUp>
          <IconButton color='primary' onClick={onSidebarMobileOpen}>
            <MenuIcon />
          </IconButton>
        </Hidden>

        {/* Theme Toggle - positioned in the center area */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ThemeToggle />
        </Box>

        <RouterLink to='/'>
          {/* <Logo
            style={{
              height: 40,
            }}
          /> */}
        </RouterLink>

        <Button onClick={handleClick}>
          <Hidden lgDown>
            <Box sx={{ m: 0 }}>
              <Typography
                color='primary'
                style={{ height: 20 }}
                textAlign='right'
              >
                {user?.firstname || ''} {user?.lastname || ''}
              </Typography>
              <Typography color='gray' textAlign='right'>
                {user?.role || '-'}
              </Typography>
            </Box>
          </Hidden>
        </Button>
      </Toolbar>
    </DashboardNavbarRoot>
  )
}

export default DashboardNavbar
