import React from 'react'
import { IconButton, Tooltip } from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import { useTheme } from '../../contexts/theme-context'
import './theme-toggle.css'

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <Tooltip title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
      <IconButton
        onClick={toggleTheme}
        color='inherit'
        className='theme-toggle-button'
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      >
        {theme === 'light' ? <Brightness4 /> : <Brightness7 />}
      </IconButton>
    </Tooltip>
  )
}

export default ThemeToggle
