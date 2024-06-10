import { Mic, Pause, Stop } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'
import { FC } from 'react'

export const RecordButtonsContainer: FC<{
  isDisabled: { record: boolean; pause: boolean; stop: boolean }
  onPressRecord: () => void
  onPressPause: () => void
  onPressStop: () => void
}> = ({ isDisabled, onPressRecord, onPressPause, onPressStop }) => {
  return (
    <Box sx={{ backgroundColor: 'white', borderRadius: 5 }}>
      <IconButton
        onClick={onPressRecord}
        disabled={isDisabled.record}
        size='large'
      >
        <Mic />
      </IconButton>
      <IconButton
        onClick={onPressPause}
        disabled={isDisabled.pause}
        size='large'
      >
        <Pause />
      </IconButton>
      <IconButton onClick={onPressStop} disabled={isDisabled.stop} size='large'>
        <Stop />
      </IconButton>
    </Box>
  )
}
