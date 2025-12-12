import { Box, Button } from '@mui/material'
import { Download } from '@mui/icons-material'
import { RecordButtonsContainer } from './record-buttons-container'
import { Settings } from '../../../types/settings'
import { TranslationResponse, YoutubeSettings } from '../types'
import { download } from '../../../helper/download'
import { Typography } from '@mui/material'
import { MAX_TEXT_LINES } from '../../../constants'
import dayjs from 'dayjs'
import { QRCode } from './qr-code'
import { useState } from 'react'
import { createAudioRecord } from '../../../lib/server-manager'

type MainContentProps = {
  recording: {
    isRecording: boolean
    voskResponse: boolean
    stream: MediaStream | null
    startRecording: (
      handleRecordCreated: (id: string, token: string) => void,
      oldRecordId?: string
    ) => void
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
  record: { id: string; token: string } | null
  setRecord: (record: { id: string; token: string }) => void
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
  record,
  setRecord,
}: MainContentProps) => {
  const [showQrCode, setShowQrCode] = useState<boolean>(false)

  const handleShare = async () => {
    if (!showQrCode) {
      if (record) {
        setShowQrCode(true)
        return
      }
      // If we're showing the QR code for the first time, create a new record
      try {
        const response = await createAudioRecord(
          settings.autoPlayAudio,
          settings.selectedSpeakerId
        )
        const newRecord = { id: response.data._id, token: response.data.token }
        setRecord(newRecord)
        setShowQrCode(true)
      } catch (error) {
        console.error('Error creating audio record:', error)
        // Still show QR code if there's an existing record
        if (record) {
          setShowQrCode(true)
        }
      }
    } else {
      // If QR code is already visible, hide it
      setShowQrCode(false)
    }
  }

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <QRCode token={record?.token} show={showQrCode} />
      <RecordButtonsContainer
        voskResponse={recording.voskResponse}
        isDisabled={{
          record: recording.isRecording || !selectedMicrophone,
          pause: !recording.isRecording,
          stop: !recording.isRecording,
        }}
        isRecording={recording.isRecording}
        isQrCodeVisible={showQrCode}
        settings={settings}
        onChangeSetting={onChangeSetting}
        onPressRecord={() => {
          recording.startRecording((recordId, token) => {
            setRecord({ id: recordId, token })
          }, record?.id)
        }}
        onPressPause={() => recording.breakRecording('pause')}
        onPressStop={() => recording.breakRecording('stop')}
        onChangeMicrophone={() => {}} // Add proper handler
        activeMicrophone={selectedMicrophone}
        youtubeSettings={youtubeSettings}
        onSaveYoutubeSettings={onChangeYoutubeSettings}
        speakers={speakers}
        stream={recording.stream}
        onShare={handleShare}
        record={record}
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

      <div
        style={{
          height: 1,
          width: '80%',
          backgroundColor: 'var(--border-color)',
        }}
      />

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
                    ? 'var(--text-primary)'
                    : Math.abs(t.timestampDiff) < 20
                    ? '#4caf50'
                    : Math.abs(t.timestampDiff) < 40
                    ? '#ff9800'
                    : '#f44336',
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
