import { IconButton, Tooltip } from '@mui/material'
import { VolumeUp, VolumeOff } from '@mui/icons-material'
import { FC } from 'react'

export const AudioToggle: FC<{
  audioEnabled: boolean
  setAudioEnabled: (enabled: boolean) => void
  disabled?: boolean
}> = ({ audioEnabled, setAudioEnabled, disabled = false }) => {
  return (
    <Tooltip
      title={
        disabled ? 'Audio playback not available' : 'Toggle audio playback'
      }
    >
      <IconButton
        onClick={() => !disabled && setAudioEnabled(!audioEnabled)}
        disabled={disabled}
        size='small'
        sx={{
          color: disabled ? '#999' : audioEnabled ? '#1976d2' : '#666',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '4px',
          padding: '6px',
          '&:hover': {
            backgroundColor: disabled
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
