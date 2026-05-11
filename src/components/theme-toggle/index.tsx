import React from 'react'
import { IconButton, Tooltip } from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import { useTheme } from '../../contexts/theme-context'

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <Tooltip
      title={`K ${theme === 'light' ? 'ćmowemu' : 'swětłemu'} designej měnjeć.`}
    >
      <IconButton
        onClick={toggleTheme}
        color='inherit'
        className='theme-toggle-button'
        aria-label={`K ${theme === 'light' ? 'ćmowemu' : 'swětłemu'} designej měnjeć.`}
      >
        {theme === 'light' ? <Brightness4 /> : <Brightness7 />}
      </IconButton>
    </Tooltip>
  )
}

export default ThemeToggle
