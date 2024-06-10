import { FC, useEffect, useState } from 'react'
import { handleSuccess } from './audio-recorder/handler/handle-success'
import { initWebsocket } from './audio-recorder/handler/init-websocket'
import { LoadingSpinner } from './loading-spinner'
import { getTranslation } from '../lib/sotra-manager'
import { getParseDataForYoutube } from '../lib/youtube-manager'

const SAMPLE_RATE = 48000
let processor: AudioWorkletNode
let webSocket: WebSocket
let source: MediaStreamAudioSourceNode
let context: AudioContext
let localeStream: MediaStream

const youtubeUrl =
  'http://upload.youtube.com/closedcaption?cid=1234-5678-9012-3456'
let seq = 0

export const AudioRecorder: FC<{}> = () => {
  const [inputText, setInputText] = useState<string>('')
  const [translation, setTranslation] = useState<string>('')
  const [youtubeSubtitle, setYoutubeSubtitle] = useState<string>('')

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
        const now = new Date()
        seq += 1
        const trimmedText = parsed.text.slice(2, -2).trim()
        setInputText((prev) => prev + ' ' + trimmedText)
        getTranslation(trimmedText).then((response) => {
          const youtubeData = getParseDataForYoutube(
            seq,
            response.data.translation,
            now,
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
      stopRecording()
    }
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

  const startRecording = async () => {
    webSocket = initWebsocket(
      process.env.REACT_APP_VOSK_SERVER_URL!,
      onReceiveMessage
    )
    webSocket.onopen = () => {
      try {
        navigator.mediaDevices
          .getUserMedia({
            audio: {
              // for our use case audio should be as little processed as possible
              echoCancellation: false,
              noiseSuppression: false,
              autoGainControl:  false,
              channelCount: 1,
              sampleRate: SAMPLE_RATE,
              sampleSize: 16,
            },
            video: false,
          })
          .then((stream) => {
            localeStream = stream
            setIsRecording(true)
            handleSuccess(
              stream,
              SAMPLE_RATE,
              webSocket,
              onSetNewProcessor,
              onSetNewSource,
              onSetNewContext
            )
          })
      } catch (error) {
        console.error('Error accessing microphone:', error)
      }
    }
  }

  const stopRecording = () => {
    if (isRecording) {
      webSocket?.send('{"eof" : 1}')
      webSocket?.close()

      processor?.port.close()
      source?.disconnect(processor)
      context?.close()

      if (localeStream?.active)
        localeStream.getTracks().forEach((track) => track.stop())

      seq = 0
      setIsRecording(false)
    }
  }

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
      {isRecording && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <h3>Słucham</h3>
          <LoadingSpinner />
        </div>
      )}
      <textarea
        color='white'
        style={{ width: '100%' }}
        value={inputText}
        readOnly
      />
      <textarea
        color='white'
        style={{ width: '100%' }}
        value={translation}
        readOnly
      />
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>

      <textarea
        color='white'
        style={{ width: '300px', minHeight: '400px' }}
        value={youtubeSubtitle}
        readOnly
      />
    </div>
  )
}
