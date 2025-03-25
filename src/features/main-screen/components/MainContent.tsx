import { Box, Button } from '@mui/material'
import { Download } from '@mui/icons-material'
import { RecordButtonsContainer } from './record-buttons-container'
import { Settings } from '../../../types/settings'
import { TranslationResponse, YoutubeSettings } from '../types'
import { download } from '../../../helper/download'
import { Typography } from '@mui/material'
import { MAX_TEXT_LINES } from '../../../constants'
import dayjs from 'dayjs'

type MainContentProps = {
  recording: {
    isRecording: boolean
    voskResponse: boolean
    stream: MediaStream | null
    startRecording: () => void
    breakRecording: (newState: 'stop' | 'pause') => void
  }
  selectedMicrophone: MediaDeviceInfo
  settings: Settings
  onChangeSetting: (key: keyof Settings, value: boolean | number) => void
  youtubeSettings: YoutubeSettings
  onChangeYoutubeSettings: (settings: YoutubeSettings) => void
  inputText: string[]
  translation: TranslationResponse[]
  speakers: BamborakSpeaker[]
}

export const MainContent = ({
  recording,
  selectedMicrophone,
  settings,
  onChangeSetting,
  youtubeSettings,
  onChangeYoutubeSettings,
  inputText,
  translation,
  speakers,
}: MainContentProps) => {
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <RecordButtonsContainer
        voskResponse={recording.voskResponse}
        isDisabled={{
          record: recording.isRecording || !selectedMicrophone,
          pause: !recording.isRecording,
          stop: !recording.isRecording,
        }}
        isRecording={recording.isRecording}
        settings={settings}
        onChangeSetting={onChangeSetting}
        onPressRecord={recording.startRecording}
        onPressPause={() => recording.breakRecording('pause')}
        onPressStop={() => recording.breakRecording('stop')}
        onChangeMicrophone={() => {}} // Add proper handler
        activeMicrophone={selectedMicrophone}
        youtubeSettings={youtubeSettings}
        onSaveYoutubeSettings={onChangeYoutubeSettings}
        speakers={speakers}
        stream={recording.stream}
      />

      <Box sx={{ padding: 2 }}>
        {inputText.slice(-MAX_TEXT_LINES).map((t, i) => (
          <Typography key={i}>{t}</Typography>
        ))}
        {!recording.isRecording && inputText.length > 0 && (
          <Button
            onClick={() => download(inputText, 'original')}
            startIcon={<Download />}
          >
            Download
          </Button>
        )}
      </Box>

      <div style={{ height: 1, width: '80%', backgroundColor: 'white' }} />

      <Box sx={{ padding: 2 }}>
        {translation.slice(-MAX_TEXT_LINES).map((t, i) => (
          <Typography key={i}>
            {t.counter
              ? `[${t.counter}]: ${t.text} ${
                  t.successfull ? '✅' : '❌'
                } ${dayjs(t.timestamp)
                  .tz(dayjs.tz.guess())
                  .format('HH:mm:ss:SSS')} 
                `
              : t.text}
            {t.counter && (
              <Typography
                display='inline'
                sx={{
                  color: !t.timestampDiff
                    ? 'white'
                    : Math.abs(t.timestampDiff) < 20
                    ? 'green'
                    : Math.abs(t.timestampDiff) < 40
                    ? 'yellow'
                    : 'red',
                }}
              >
                {t.timestampDiff && t.timestampDiff > 0 ? '+' : ''}
                {t.timestampDiff ?? 0}s
              </Typography>
            )}
          </Typography>
        ))}
        {!recording.isRecording && translation.length > 0 && (
          <Button
            onClick={() =>
              download(
                translation.map(t => t.text),
                'prelozk'
              )
            }
            startIcon={<Download />}
          >
            Download
          </Button>
        )}
      </Box>
    </Box>
  )
}
