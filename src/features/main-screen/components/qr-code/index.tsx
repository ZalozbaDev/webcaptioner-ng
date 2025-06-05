import { Box, Typography } from '@mui/material'
import { FC } from 'react'
import { QRCodeSVG } from 'qrcode.react'

interface QRCodeProps {
  token: string | undefined
  show: boolean
}

export const QRCode: FC<QRCodeProps> = ({ token, show }) => {
  if (!show || !token) return null

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 10,
        right: 10,
        backgroundColor: 'white',
        padding: 1,
        borderRadius: 1,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <QRCodeSVG value={`${window.location.origin}/cast/${token}`} size={150} />
      <Typography
        variant='body1'
        sx={{
          mt: 1,
          color: 'black',
          fontFamily: 'monospace',
          fontSize: '1rem',
          letterSpacing: '0.1em',
        }}
      >
        {token}
      </Typography>
    </Box>
  )
}
