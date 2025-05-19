import {
  Mic,
  Settings as SettingsIcon,
  Stop,
  YouTube,
} from '@mui/icons-material'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { FC, useEffect, useMemo, useState } from 'react'
import { Visualizer } from 'react-sound-visualizer'
import { getDurationFromSeconds } from '../../../../helper/date-time-helper'
import { SettingsContainer } from './settings-container'
import { YoutubeContainer, YoutubeSettings } from './youtube-container'
import { Settings } from '../../../../types/settings'

export const RecordButtonsContainer: FC<{
  voskResponse: boolean
  stream: MediaStream | null
  isDisabled: { record: boolean; pause: boolean; stop: boolean }
  isRecording: boolean
  settings: Settings
  onChangeSetting: (key: keyof Settings, value: any) => void
  onPressRecord: () => void
  onPressPause: () => void
  onPressStop: () => void
  onChangeMicrophone: (mic: MediaDeviceInfo) => void
  activeMicrophone: MediaDeviceInfo | null
  youtubeSettings: YoutubeSettings
  onSaveYoutubeSettings: (settings: YoutubeSettings) => void
  speakers: BamborakSpeaker[]
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
  youtubeSettings,
  onSaveYoutubeSettings,
  speakers,
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
      >
        {({ canvasRef }) => <canvas ref={canvasRef} height={100} />}
      </Visualizer>
    ),
    [stream]
  )

  useEffect(() => {
    if (isRecording) {
      const interval = setTimeout(() => {
        setTotalTime(prev => prev + 1)
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
        speakers={speakers}
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
      speakers,
    ]
  )

  const youtubeContainer = useMemo(
    () => (
      <YoutubeContainer
        anchorEl={youtubeAnchorEl}
        open={youtubeOpen}
        disabled={isRecording}
        onClose={handleYoutubeClose}
        settings={youtubeSettings}
        onSave={settings => {
          handleYoutubeClose()
          onSaveYoutubeSettings(settings)
        }}
      />
    ),
    [
      isRecording,
      onSaveYoutubeSettings,
      youtubeAnchorEl,
      youtubeOpen,
      youtubeSettings,
    ]
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
      <Box
        sx={{
          borderTop: '2px white solid',
          height: 100,
        }}
      >
        {visualizerArea}
      </Box>
      <Typography variant='caption'>
        {process.env.REACT_APP_RECORDING_INFORMATION_LINE}
      </Typography>
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
            width: '50%',
          }}
        >
          <Mic fontSize='small' />
          <Typography variant='body2'>Start</Typography>
        </Button>
        {/* <Button
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
        </Button> */}
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
            width: '50%',
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
