import { Box, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

interface QRCodeProps {
  token: string | undefined
  show: boolean
}

export const QRCode: FC<QRCodeProps> = ({ token, show }) => {
  const [isFullScreen, setIsFullScreen] = useState(false)

  if (!show || !token) return null

  const handleToggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  const handleCloseFullScreenClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFullScreen(false)
  }

  const handleOpenLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFullScreen(false)
    window.open(`${window.location.origin}/cast/${token}`, '_blank')
  }

  if (isFullScreen) {
    return (
      <Box
        onClick={handleCloseFullScreenClick}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <Box
          onClick={handleOpenLinkClick}
          sx={{
            backgroundColor: 'var(--card-bg)',
            padding: 6,
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 16px 64px rgba(0, 0, 0, 0.4)',
            maxWidth: '90vw',
            maxHeight: '90vh',
          }}
        >
          <QRCodeSVG
            value={`${window.location.origin}/cast/${token}`}
            size={600}
          />
          <Typography
            variant='h5'
            sx={{
              mt: 3,
              color: 'var(--card-text-color)',
              fontFamily: 'monospace',
              fontSize: '2rem',
              letterSpacing: '0.1em',
            }}
          >
            {token}
          </Typography>
          <Typography
            variant='body1'
            sx={{
              color: 'var(--card-text-color)',
              textAlign: 'center',
            }}
          >
            {window.location.origin}/cast/{token}
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 10,
        right: 10,
        backgroundColor: 'var(--card-bg)',
        padding: 1,
        borderRadius: 1,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }}
      onClick={handleToggleFullScreen}
    >
      <QRCodeSVG value={`${window.location.origin}/cast/${token}`} size={150} />
      <Typography
        variant='body1'
        sx={{
          mt: 1,
          color: 'var(--card-text-color)',
          fontFamily: 'monospace',
          fontSize: '1rem',
          letterSpacing: '0.1em',
        }}
      >
        {token}
      </Typography>
      <Typography
        variant='caption'
        sx={{
          mt: 0.5,
          color: 'primary.main',
          fontSize: '0.75rem',
          fontWeight: 500,
          textAlign: 'center',
          opacity: 0.8,
        }}
      >
        Klik tule za powjetšenje
      </Typography>
    </Box>
  )
}
