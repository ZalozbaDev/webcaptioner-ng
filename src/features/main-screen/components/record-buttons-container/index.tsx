import { Mic, Pause, Settings as SettingsIcon, Stop } from '@mui/icons-material'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { FC, useEffect, useMemo, useState } from 'react'
import { Visualizer } from 'react-sound-visualizer'
import { getDurationFromSeconds } from '../../../../helper/date-time-helper'
import { Settings, SettingsContainer } from './settings-container'

export const RecordButtonsContainer: FC<{
  stream: MediaStream
  isDisabled: { record: boolean; pause: boolean; stop: boolean }
  isRecording: boolean
  settings: Settings
  onChangeSetting: (key: keyof Settings, value: boolean) => void
  onPressRecord: () => void
  onPressPause: () => void
  onPressStop: () => void
}> = ({
  stream,
  isRecording,
  isDisabled,
  settings,
  onChangeSetting,
  onPressRecord,
  onPressPause,
  onPressStop,
}) => {
  const [totalTime, setTotalTime] = useState<number>(0)

  const [settingsAnchorEl, setSettingsAnchorEl] = useState<null | HTMLElement>(
    null
  )
  const settingsOpen = Boolean(settingsAnchorEl)
  const handleSettingsOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSettingsAnchorEl(event.currentTarget)
  }
  const handleSettingsClose = () => {
    setSettingsAnchorEl(null)
  }

  const visualizerArea = useMemo(
    () => (
      <Visualizer
        audio={stream}
        mode='continuous'
        autoStart
        strokeColor='white'
        lineWidth='default'
      >
        {({ canvasRef }) => <canvas ref={canvasRef} height={100} />}
      </Visualizer>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stream]
  )

  useEffect(() => {
    if (isRecording) {
      const interval = setTimeout(() => {
        setTotalTime((prev) => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [totalTime, isRecording])

  const settingsContainer = useMemo(
    () => (
      <SettingsContainer
        anchorEl={settingsAnchorEl}
        open={settingsOpen}
        onClose={handleSettingsClose}
        settings={settings}
        onChangeSetting={onChangeSetting}
      />
    ),
    [onChangeSetting, settings, settingsAnchorEl, settingsOpen]
  )

  return (
    <Box
      sx={{
        backgroundColor: 'clear',
        borderRadius: 2,
        border: '2px white solid',
        minWidth: 300,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant='body1' paddingLeft={1}>
          Čas: {getDurationFromSeconds(totalTime)}
        </Typography>
        <IconButton sx={{ color: 'white' }} onClick={handleSettingsOpen}>
          <SettingsIcon />
        </IconButton>
      </Box>
      {visualizerArea}

      <Box>
        <Button
          onClick={onPressRecord}
          disabled={isDisabled.record}
          size='large'
          sx={{
            '&.Mui-disabled': { color: 'gray', borderColor: 'white' },
            color: 'white',
            height: 40,
            borderColor: 'white',
            borderTop: 2,
            borderRight: 1,
            borderRadius: 0,
          }}
        >
          <Mic fontSize='small' />
          <Typography variant='body2'>Start</Typography>
        </Button>
        <Button
          onClick={onPressPause}
          disabled={isDisabled.pause}
          size='large'
          sx={{
            '&.Mui-disabled': { color: 'gray', borderColor: 'white' },
            color: 'white',
            height: 40,
            borderColor: 'white',
            borderTop: 2,
            borderLeft: 1,
            borderRight: 1,
            borderRadius: 0,
          }}
        >
          <Pause fontSize='small' />
          <Typography variant='body2'>Prestalka</Typography>
        </Button>
        <Button
          onClick={() => {
            onPressStop()
            setTotalTime(0)
          }}
          disabled={isDisabled.stop}
          size='large'
          sx={{
            '&.Mui-disabled': { color: 'gray', borderColor: 'white' },
            color: 'white',
            height: 40,
            borderColor: 'white',
            borderTop: 2,
            borderLeft: 1,
            borderRadius: 0,
          }}
        >
          <Stop fontSize='small' />
          <Typography variant='body2'>Stop</Typography>
        </Button>
      </Box>
      {settingsContainer}
    </Box>
  )
}
