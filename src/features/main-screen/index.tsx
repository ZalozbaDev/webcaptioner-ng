import { useEffect, useState } from 'react'
import { handleSuccess } from './components/audio-recorder/handler/handle-success'
import { initWebsocket } from './components/audio-recorder/handler/init-websocket'
import { getTranslation } from '../../lib/sotra-manager'
import { getParseDataForYoutube } from '../../lib/youtube-manager'
import { MicrophoneSelector } from './components/microphone-selector.tsx'
import { RecordButtonsContainer } from './components/record-buttons-container'
import { Box, Typography } from '@mui/material'
import { Settings } from './components/record-buttons-container/settings-container'
import { toast } from 'sonner'
import { LoadingSpinner } from '../../components/loading-spinner'

const SAMPLE_RATE = 48000
let processor: AudioWorkletNode
let webSocket: WebSocket
let source: MediaStreamAudioSourceNode
let context: AudioContext
let localeStream: MediaStream

const initialSettings: Settings = {
  autoGainControl: false,
  noiseSuppression: false,
  echoCancellation: false,
  channelCount: 1,
  sampleRate: SAMPLE_RATE,
  sampleSize: 16,
  deviceId: undefined,
}
let settings: Settings = initialSettings
const youtubeUrl =
  'http://upload.youtube./com/closedcaption?cid=1234-5678-9012-3456'
let seq = 0

export const MainScreen = () => {
  const [mediaStreamSettings, setMediaStreamSettings] =
    useState<Settings>(initialSettings)
  const [inputText, setInputText] = useState<string>('')
  const [translation, setTranslation] = useState<string>('')
  const [youtubeSubtitle, setYoutubeSubtitle] = useState<string>('')
  const [selectedMicrophone, setSelectedMicrophone] =
    useState<MediaDeviceInfo | null>(null)
  const [isRecording, setIsRecording] = useState<boolean>(false)

  const onReceiveMessage = (event: MessageEvent) => {
    if (event.data) {
      let parsed = JSON.parse(event.data)
      if (
        parsed.text &&
        parsed.text !== '-- ***/whisper/ggml-model.q8_0.bin --' &&
        parsed.text !== '-- **/whisper/ggml-model.q8_0.bin --' &&
        parsed.text !== '-- */whisper/ggml-model.q8_0.bin --'
      ) {
        seq += 1
        const trimmedText = parsed.text.slice(2, -2).trim()
        setInputText((prev) => prev + ' ' + trimmedText)
        getTranslation(trimmedText).then((response) => {
          const youtubeData = getParseDataForYoutube(
            seq,
            response.data.translation,
            new Date(parsed.start * 1000),
            youtubeUrl,
            false
          )

          setTranslation((prev) => prev + ' ' + response.data.translation)
          setYoutubeSubtitle((prev) => prev + ' ' + youtubeData + '\n')
        })
      }
    }
  }

  useEffect(() => {
    return () => {
      breakRecording('stop')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSetNewProcessor = (newProcessor: AudioWorkletNode) => {
    processor = newProcessor
  }

  const onSetNewSource = (newSource: MediaStreamAudioSourceNode) => {
    source = newSource
  }

  const onSetNewContext = (newContext: AudioContext) => {
    context = newContext
  }

  const startRecordingWithNewStream = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          // for our use case audio should be as little processed as possible
          ...settings,
          deviceId: selectedMicrophone?.deviceId,
        },
        video: false,
      })
      .then((stream) => {
        localeStream = stream
        settings = { ...settings, deviceId: selectedMicrophone?.deviceId }
        setMediaStreamSettings(settings)

        setIsRecording(true)
        if (localeStream !== null)
          handleSuccess(
            localeStream,
            SAMPLE_RATE,
            webSocket,
            onSetNewProcessor,
            onSetNewSource,
            onSetNewContext
          )
      })
      .catch((error) => {
        toast.error(
          `Error accessing microphone ${selectedMicrophone?.label}`,
          error.message
        )
      })
  }

  const startRecording = async () => {
    webSocket = initWebsocket(
      process.env.REACT_APP_VOSK_SERVER_URL!,
      onReceiveMessage
    )
    webSocket.onopen = () => {
      try {
        toast.success('Websocket connected')
        console.info('Websocket connected')
        startRecordingWithNewStream()
      } catch (error) {
        toast.error('Error accessing microphone 2')
        console.error('Error accessing microphone 2:', error)
      }
    }
  }

  const breakRecording = (newState: 'stop' | 'pause') => {
    if (isRecording) {
      webSocket?.send('{"eof" : 1}')
      webSocket?.close()

      processor?.port.close()
      source?.disconnect(processor)
      context?.close()

      if (localeStream?.active)
        localeStream.getTracks().forEach((track) => track.stop())

      if (newState === 'stop') {
        seq = 0
        setInputText('')
        setTranslation('')
        setYoutubeSubtitle('')
      }
      setIsRecording(false)
    }
  }

  const updateMediaStreamSettings = (key: keyof Settings, value: boolean) => {
    settings = { ...settings, [key]: value }
    breakRecording('pause')
    startRecordingWithNewStream()
  }

  const [permission, setPermission] = useState<
    'loading' | 'granted' | 'denied'
  >('loading')

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      if (devices.length === 0) {
        setPermission('denied')
      } else {
        setPermission(devices[0].label ? 'granted' : 'denied')
      }
    })
  }, [])

  return (
    <div
      style={{
        width: '80%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <h1>Serbski Webcaptioner</h1>

      {permission === 'granted' && (
        <Box
          style={
            selectedMicrophone === null
              ? {}
              : { position: 'absolute', top: 10, right: 10 }
          }
        >
          <MicrophoneSelector
            activeMicrophone={selectedMicrophone}
            onChange={(mic) => {
              breakRecording('pause')
              setSelectedMicrophone(mic)
            }}
          />
        </Box>
      )}

      {permission === 'loading' && <LoadingSpinner />}

      {permission === 'denied' && (
        <Typography>
          Permission denied, please active it in the browser settings
        </Typography>
      )}

      {selectedMicrophone && (
        <>
          <RecordButtonsContainer
            stream={localeStream}
            isDisabled={{
              record: isRecording || !selectedMicrophone,
              pause: !isRecording,
              stop: !isRecording,
            }}
            isRecording={isRecording}
            settings={mediaStreamSettings}
            onChangeSetting={updateMediaStreamSettings}
            onPressRecord={startRecording}
            onPressPause={() => breakRecording('pause')}
            onPressStop={() => breakRecording('stop')}
            onChangeMicrophone={(mic) => {
              breakRecording('pause')
              setSelectedMicrophone(mic)
            }}
            activeMicrophone={selectedMicrophone}
          />
          <p>{inputText}</p>
          <div style={{ height: 1, width: '80%', backgroundColor: 'white' }} />
          <p>{translation}</p>
          <textarea
            color='white'
            style={{ width: '300px', minHeight: '400px' }}
            value={youtubeSubtitle}
            readOnly
          />
        </>
      )}
    </div>
  )
}
