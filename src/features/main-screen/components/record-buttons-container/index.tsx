import {
  Mic,
  Pause,
  Settings as SettingsIcon,
  Stop,
  YouTube,
} from '@mui/icons-material'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { FC, useEffect, useMemo, useState } from 'react'
import { Visualizer } from 'react-sound-visualizer'
import { getDurationFromSeconds } from '../../../../helper/date-time-helper'
import { Settings, SettingsContainer } from './settings-container'
import { YoutubeContainer } from './youtube-container'

export const RecordButtonsContainer: FC<{
  voskResponse: boolean
  stream: MediaStream
  isDisabled: { record: boolean; pause: boolean; stop: boolean }
  isRecording: boolean
  settings: Settings
  onChangeSetting: (key: keyof Settings, value: boolean) => void
  onPressRecord: () => void
  onPressPause: () => void
  onPressStop: () => void
  onChangeMicrophone: (mic: MediaDeviceInfo) => void
  activeMicrophone: MediaDeviceInfo | null
  youtubeUrl: string | undefined
  onSaveYoutubeUrl: (url: string) => void
}> = ({
  voskResponse,
  stream,
  isRecording,
  isDisabled,
  settings,
  onChangeSetting,
  onPressRecord,
  onPressPause,
  onPressStop,
  onChangeMicrophone,
  activeMicrophone,
  youtubeUrl,
  onSaveYoutubeUrl,
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

  const [youtubeAnchorEl, setYoutubeAnchorEl] = useState<null | HTMLElement>(
    null
  )
  const youtubeOpen = Boolean(youtubeAnchorEl)
  const handleYoutubeOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setYoutubeAnchorEl(event.currentTarget)
  }
  const handleYoutubeClose = () => {
    setYoutubeAnchorEl(null)
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
        disabled={isRecording}
        onClose={handleSettingsClose}
        settings={settings}
        onChangeSetting={onChangeSetting}
        onChangeMicrophone={onChangeMicrophone}
        activeMicrophone={activeMicrophone}
      />
    ),
    [
      activeMicrophone,
      isRecording,
      onChangeMicrophone,
      onChangeSetting,
      settings,
      settingsAnchorEl,
      settingsOpen,
    ]
  )

  const youtubeContainer = useMemo(
    () => (
      <YoutubeContainer
        anchorEl={youtubeAnchorEl}
        open={youtubeOpen}
        disabled={isRecording}
        onClose={handleYoutubeClose}
        url={youtubeUrl}
        onSave={(url) => {
          handleYoutubeClose()
          onSaveYoutubeUrl(url)
        }}
      />
    ),
    [isRecording, onSaveYoutubeUrl, youtubeAnchorEl, youtubeOpen, youtubeUrl]
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
          {voskResponse ? '🟢' : '🔴'} Čas: {getDurationFromSeconds(totalTime)}
        </Typography>

        <Box>
          <IconButton sx={{ color: 'white' }} onClick={handleYoutubeOpen}>
            <YouTube />
          </IconButton>
          <IconButton sx={{ color: 'white' }} onClick={handleSettingsOpen}>
            <SettingsIcon />
          </IconButton>
        </Box>
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
          <Typography variant='body2'>Přestawka</Typography>
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
      {youtubeContainer}
    </Box>
  )
}
