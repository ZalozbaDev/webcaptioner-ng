/* eslint-disable no-nested-ternary */
import { useEffect, useRef } from 'react'
import type { FC } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import {
  Box,
  Hidden,
  Avatar,
  Typography,
  Divider,
  Drawer,
  ListItemIcon,
  MenuItem,
} from '@mui/material'
import { adminSections } from './sections/admin-sections'
import NavSection from './nav-section'
import { Logout } from '@mui/icons-material'
import { userSections } from './sections/user-sections'
import { NAVBAR_HEIGHT } from '../constants'
import useAuth from '../../../hooks/use-auth'

const DashboardSidebar: FC<{
  onMobileClose: () => void
  openMobile: boolean
  onSignOut: () => void
}> = ({ onMobileClose, openMobile, onSignOut }) => {
  const location = useLocation()
  const { user } = useAuth()

  const previousPathnameRef = useRef(location.pathname)

  useEffect(() => {
    if (previousPathnameRef.current !== location.pathname) {
      previousPathnameRef.current = location.pathname

      if (openMobile) {
        onMobileClose()
      }
    }
  }, [location.pathname, onMobileClose, openMobile])

  const getUserSection = (activeUser: User | null) => {
    if (activeUser) {
      switch (activeUser.role) {
        case 'ADMIN':
          return adminSections
        case 'USER':
          return userSections
      }
    } else return null
  }

  const content = (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        height: 'calc(100% - 40px)',
        pt: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '90%',
        }}
      >
        <Hidden lgUp>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              p: 2,
            }}
          >
            <RouterLink to='/'>
              {/* <Logo
                style={{
                  height: '10px',
                  backgroundColor: 'red',
                }}
              /> */}
            </RouterLink>
          </Box>
        </Hidden>
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 1,
              display: 'flex',
              overflow: 'hidden',
              p: 2,
            }}
          >
            <RouterLink to='/account'>
              <Avatar
                // src={user.avatar}
                style={{
                  cursor: 'pointer',
                  height: 48,
                  width: 48,
                }}
              />
            </RouterLink>
            <Box sx={{ ml: 2 }}>
              <Typography
                sx={{ color: 'var(--text-primary)' }}
                variant='subtitle2'
              >
                {user ? `${user.firstname} ${user.lastname}` : '-'}
              </Typography>
              <Typography
                sx={{ color: 'var(--text-secondary)' }}
                variant='body2'
              >
                Your Role: {user ? user.role : '-'}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ borderColor: 'var(--border-color)' }} />
        <Box sx={{ p: 2 }}>
          {getUserSection(user)?.map(section => (
            <NavSection
              key={section.title}
              pathname={location.pathname}
              sx={{
                '& + &': {
                  mt: 3,
                },
              }}
              {...section}
            />
          ))}
        </Box>
      </Box>
      <MenuItem onClick={onSignOut} sx={{ color: 'var(--text-primary)' }}>
        <ListItemIcon sx={{ color: 'inherit' }}>
          <Logout fontSize='small' />
        </ListItemIcon>
        <Typography>Logout</Typography>
      </MenuItem>
    </Box>
  )

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor='left'
          onClose={onMobileClose}
          open={openMobile}
          PaperProps={{
            sx: {
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              width: 280,
            },
          }}
          variant='temporary'
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          anchor='left'
          open
          PaperProps={{
            sx: {
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              height: `calc(100% - ${NAVBAR_HEIGHT - 7}) !important`,
              top: NAVBAR_HEIGHT - 7,
              width: 280,
            },
          }}
          variant='persistent'
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  )
}

export default DashboardSidebar
