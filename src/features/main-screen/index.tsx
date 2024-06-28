import { useEffect, useState } from 'react'
import { handleSuccess } from './components/audio-recorder/handler/handle-success'
import { initWebsocket } from './components/audio-recorder/handler/init-websocket'
import {
  getTranslation,
  getParseDataForYoutube,
} from '../../lib/server-manager'
import { MicrophoneSelector } from './components/microphone-selector.tsx'
import { RecordButtonsContainer } from './components/record-buttons-container'
import { Box, IconButton, Typography } from '@mui/material'
import { Settings } from './components/record-buttons-container/settings-container'
import { toast } from 'sonner'
import { LoadingSpinner } from '../../components/loading-spinner'
import { createYoutubePackages, typedVoskResponse } from '../../helper/vosk'
import { Logout } from '@mui/icons-material'
import useAuth from '../../hooks/use-auth'
import { localStorage } from '../../lib/local-storage'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { YoutubeSettings } from './components/record-buttons-container/youtube-container'
dayjs.extend(utc)
dayjs.extend(timezone)

const SAMPLE_RATE = 48000
let processor: AudioWorkletNode
let webSocket: WebSocket
let source: MediaStreamAudioSourceNode
let context: AudioContext
let localeStream: MediaStream

const MAX_TEXT_LINES = 10

const initialSettings: Settings = {
  autoGainControl: false,
  noiseSuppression: false,
  echoCancellation: false,
  channelCount: 1,
  sampleRate: SAMPLE_RATE,
  sampleSize: 16,
  deviceId: undefined,
  bufferSize: 4096,
  sotraModel: 'fairseq',
}
let settings: Settings = initialSettings
let seq = 0

export const MainScreen = () => {
  const [mediaStreamSettings, setMediaStreamSettings] =
    useState<Settings>(initialSettings)
  const [inputText, setInputText] = useState<string[]>([])
  const [translation, setTranslation] = useState<string[]>([])
  const [youtubeSettings, setYoutubeSettings] = useState<YoutubeSettings>({
    streamingKey: undefined,
    timeOffset: 0,
  })

  const [selectedMicrophone, setSelectedMicrophone] =
    useState<MediaDeviceInfo | null>(null)
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [voskResponse, setVoskResponse] = useState(false)
  const { logout } = useAuth()

  const onReceiveMessage = (event: MessageEvent) => {
    if (event.data) {
      let parsed = typedVoskResponse(event.data)
      setVoskResponse(parsed.listen)
      if (
        parsed.text &&
        parsed.text !== '-- ***/whisper/ggml-model.q8_0.bin --' &&
        parsed.text !== '-- **/whisper/ggml-model.q8_0.bin --' &&
        parsed.text !== '-- */whisper/ggml-model.q8_0.bin --'
      ) {
        if (youtubeSettings.streamingKey) {
          seq += 1
          localStorage.setCounterForYoutubeStreaming(
            youtubeSettings.streamingKey,
            seq
          )
        }

        const trimmedText = parsed.text.slice(2, -2).trim()
        setInputText((prev) => [...prev, trimmedText].slice(-MAX_TEXT_LINES))
        getTranslation(trimmedText, settings.sotraModel).then(
          async (response) => {
            setTranslation((prev) =>
              [...prev, response.data.translation].slice(-MAX_TEXT_LINES)
            )
            if (youtubeSettings.streamingKey) {
              const youtubePackages = createYoutubePackages(
                response.data.translation,
                {
                  start: parsed.start
                    ? new Date(parsed.start * 1000)
                    : new Date(),
                  stop: parsed.stop ? new Date(parsed.stop * 1000) : new Date(),
                }
              )

              for (let index = 0; index < youtubePackages.length; index++) {
                const youtubePackage = youtubePackages[index]
                const youtubeData = await getParseDataForYoutube(
                  seq,
                  youtubePackage.text,
                  dayjs(youtubePackage.date)
                    .add(youtubeSettings.timeOffset, 'seconds')
                    .toDate(),
                  youtubeSettings.streamingKey
                )
                setTranslation((prev) =>
                  prev
                    .map((p) =>
                      p === youtubeData.text
                        ? `[${youtubeData.seq}]: ${p} ${
                            youtubeData.successfull ? '✅' : '❌'
                          } ${dayjs(youtubeData.timestamp)
                            .tz(dayjs.tz.guess())
                            .format('HH:mm:ss:SSS')} ${
                            youtubeSettings.timeOffset > 0 ? '+' : ''
                          }${youtubeSettings.timeOffset}s`
                        : p
                    )
                    .slice(-MAX_TEXT_LINES)
                )
              }
            }
          }
        )
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

        setInputText([])
        setTranslation([])

        setIsRecording(true)
        if (localeStream !== null)
          handleSuccess(
            localeStream,
            settings.sampleRate,
            webSocket,
            settings.bufferSize,
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
      `${process.env.REACT_APP_WEBCAPTIONER_SERVER!}/vosk`,
      onReceiveMessage
    )
    if (youtubeSettings.streamingKey) {
      seq = localStorage.getCounterForYoutubeStreaming(
        youtubeSettings.streamingKey
      )
    } else seq = 0
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

      setIsRecording(false)
    }
  }

  const updateMediaStreamSettings = (
    key: keyof Settings,
    value: boolean | number
  ) => {
    breakRecording('pause')
    setMediaStreamSettings({ ...mediaStreamSettings, [key]: value })
    settings = { ...settings, [key]: value }
  }

  // const [permission, setPermission] = useState<
  //   'loading' | 'granted' | 'denied'
  // >('loading')

  // useEffect(() => {
  //   navigator.mediaDevices.enumerateDevices().then((devices) => {
  //     if (devices.length === 0) {
  //       setPermission('denied')
  //     } else {
  //       setPermission(devices[0].label ? 'granted' : 'denied')
  //     }
  //   })
  // }, [])

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
      <IconButton
        onClick={logout}
        color='inherit'
        sx={{ position: 'absolute', top: 5, left: 5 }}
      >
        <Logout />
      </IconButton>
      <h1>Serbski Webcaptioner</h1>

      {/* {permission === 'granted' && ( */}
      {selectedMicrophone === null && (
        <MicrophoneSelector
          activeMicrophone={selectedMicrophone}
          onChange={(mic) => {
            breakRecording('pause')
            setSelectedMicrophone(mic)
          }}
        />
      )}
      {/* )} */}

      {/* {permission === 'loading' && <LoadingSpinner />}

      {permission === 'denied' && (
        <Typography>
          Permission denied, please active it in the browser settings
        </Typography>
      )} */}

      {selectedMicrophone && (
        <>
          <RecordButtonsContainer
            voskResponse={voskResponse}
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
            youtubeSettings={youtubeSettings}
            onSaveYoutubeSettings={(newSettings) =>
              setYoutubeSettings(newSettings)
            }
          />
          <Box sx={{ paddingTop: 2, paddingBottom: 2 }}>
            {inputText.map((t) => (
              <Typography>{t}</Typography>
            ))}
          </Box>
          <div style={{ height: 1, width: '80%', backgroundColor: 'white' }} />
          <Box sx={{ paddingTop: 2, paddingBottom: 2 }}>
            {translation.map((t) => (
              <Typography>{t}</Typography>
            ))}
          </Box>
        </>
      )}
    </div>
  )
}
