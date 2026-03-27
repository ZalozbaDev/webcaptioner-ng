import { Typography } from '@mui/material'
import { useState, useEffect } from 'react'

const NUMBER_OF_DOTS = 4

export const LoadingDotsLine = ({ fontSize }: { fontSize: number }) => {
  const [dotCount, setDotCount] = useState(1)
  const [direction, setDirection] = useState<1 | -1>(1)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setDotCount(prev => {
        if (prev >= NUMBER_OF_DOTS) {
          setDirection(-1)
          return NUMBER_OF_DOTS - 1
        }

        if (prev <= 0 && direction < 0) {
          setDirection(1)
          return 1
        }

        return prev + direction
      })
    }, 400)

    return () => window.clearInterval(intervalId)
  }, [direction])

  return (
    <Typography
      sx={{
        color: 'var(--card-text-color)',
        fontSize: `${fontSize}px`,
        lineHeight: 1.6,
        fontWeight: 600,
        letterSpacing: '0.12em',
        minHeight: `${fontSize * 1.6}px`,
      }}
      aria-label='Loading'
    >
      {'.'.repeat(dotCount)}
    </Typography>
  )
}
