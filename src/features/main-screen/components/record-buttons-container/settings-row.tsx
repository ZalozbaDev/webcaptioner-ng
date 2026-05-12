import { FC, ReactNode } from 'react'
import { Box, Typography } from '@mui/material'

export const SettingsRow: FC<{
  label: string
  children: ReactNode
}> = ({ label, children }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) auto',
        alignItems: 'center',
        gap: 1.5,
        width: '100%',
        minWidth: 0,
      }}
    >
      <Typography
        variant='body2'
        sx={{
          minWidth: 0,
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
        }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          minWidth: 0,
          maxWidth: '100%',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export const SettingsFullWidthRow: FC<{
  children: ReactNode
}> = ({ children }) => {
  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
      }}
    >
      {children}
    </Box>
  )
}
