import type { FC, ReactNode } from 'react'
import { Box, Container, Link, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import useAuth from '../../hooks/use-auth'

type LegalPageLayoutProps = {
  title: string
  children: ReactNode
}

const LegalPageLayout: FC<LegalPageLayoutProps> = ({ title, children }) => {
  const { user } = useAuth()
  const isDashboard = Boolean(user)

  return (
    <Box
      sx={{
        boxSizing: 'border-box',
        // Prevent horizontal scroll from .App flex + long unbroken URLs
        alignSelf: 'stretch',
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        overflowX: 'hidden',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        // Override .App { font-size: calc(10px + 2vmin); text-align: center }
        fontSize: '1rem',
        textAlign: 'left',
        py: isDashboard ? { xs: 3, md: 4 } : 3,
        px: isDashboard ? { xs: 3, sm: 4, md: 5 } : 2,
      }}
    >
      <Container
        maxWidth='sm'
        disableGutters
        sx={{
          px: isDashboard
            ? { xs: 2, sm: 3, md: 4 }
            : { xs: 1, sm: 2 },
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Link
          component={RouterLink}
          to='/'
          underline='hover'
          sx={{
            color: 'var(--text-secondary)',
            display: 'inline-block',
            mb: 2,
          }}
        >
          ← Zurück
        </Link>
        <Typography
          variant='h4'
          component='h1'
          sx={{ mb: 3, color: 'var(--text-primary)', fontWeight: 600 }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            fontSize: '1rem',
            lineHeight: 1.6,
            overflowWrap: 'anywhere',
            wordBreak: 'break-word',
            '& h2': {
              mt: 3,
              mb: 1.5,
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
            },
            '& h3': {
              mt: 2.5,
              mb: 1,
              fontSize: '1.05rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
            },
            '& p, & li': {
              mb: 1,
              fontSize: '1rem',
              lineHeight: 1.6,
              color: 'var(--text-primary)',
            },
            '& ul': {
              pl: 2.5,
              mb: 2,
              fontSize: '1rem',
              textAlign: 'left',
            },
            '& a': {
              color: 'var(--info-color)',
            },
          }}
        >
          {children}
        </Box>
      </Container>
    </Box>
  )
}

export default LegalPageLayout
