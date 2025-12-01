import { IconButton, Tooltip } from '@mui/material'
import { VolumeUp, VolumeOff } from '@mui/icons-material'
import { FC } from 'react'

export const AudioToggle: FC<{
  audioEnabled: boolean
  setAudioEnabled: (enabled: boolean) => void
  disabled?: boolean
  onToggle?: () => void
  disabledByMainScreen?: boolean
}> = ({
  audioEnabled,
  setAudioEnabled,
  disabled = false,
  onToggle,
  disabledByMainScreen = false,
}) => {
  const getTooltipTitle = () => {
    if (disabledByMainScreen) {
      return 'Audio disabled by main screen settings'
    }
    if (disabled) {
      return 'Audio playback not available'
    }
    return 'Toggle audio playback'
  }

  return (
    <Tooltip title={getTooltipTitle()}>
      <IconButton
        onClick={() => {
          if (!disabled && !disabledByMainScreen) {
            setAudioEnabled(!audioEnabled)
            onToggle?.()
          }
        }}
        disabled={disabled || disabledByMainScreen}
        size='small'
        sx={{
          color:
            disabled || disabledByMainScreen
              ? '#999'
              : audioEnabled
              ? '#1976d2'
              : '#666',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '4px',
          padding: '6px',
          '&:hover': {
            backgroundColor:
              disabled || disabledByMainScreen
                ? 'rgba(255, 255, 255, 0.9)'
                : 'rgba(255, 255, 255, 1)',
          },
          '&:disabled': {
            opacity: 0.5,
          },
        }}
      >
        {audioEnabled ? (
          <VolumeUp fontSize='small' />
        ) : (
          <VolumeOff fontSize='small' />
        )}
      </IconButton>
    </Tooltip>
  )
}
