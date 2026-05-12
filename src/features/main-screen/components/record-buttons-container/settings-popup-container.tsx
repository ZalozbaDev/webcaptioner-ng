import { FC, ReactNode } from 'react'
import { Menu, MenuList, SxProps, Theme } from '@mui/material'

export const SettingsPopupContainer: FC<{
  anchorEl: null | HTMLElement
  open: boolean
  onClose: () => void
  children: ReactNode
  width?: number
  disableScrollLock?: boolean
  sx?: SxProps<Theme>
}> = ({
  anchorEl,
  open,
  onClose,
  children,
  width = 420,
  disableScrollLock = false,
  sx,
}) => {
  return (
    <Menu
      onClose={onClose}
      anchorEl={anchorEl}
      open={open}
      disableScrollLock={disableScrollLock}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            width: {
              xs: 'calc(100vw - 32px)',
              sm: width,
            },
            maxWidth: 'calc(100vw - 32px)',
            maxHeight: '90vh',
            boxSizing: 'border-box',
            border: '1px solid black',
            overflowY: 'auto',
            overflowX: 'hidden',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 0.5,
            ...sx,
          },
        },
      }}
    >
      <MenuList
        dense
        sx={{
          width: '100%',
          boxSizing: 'border-box',
          p: {
            xs: 1.5,
            sm: 2,
          },
        }}
      >
        {children}
      </MenuList>
    </Menu>
  )
}
