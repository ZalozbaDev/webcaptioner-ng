import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { Settings } from '../../../types/settings'
import { handleSuccess } from '../components/audio-recorder/handler/handle-success'
import { initWebsocket } from '../components/audio-recorder/handler/init-websocket'
import { typedVoskResponse } from '../../../helper/vosk'
import { createYoutubePackages } from '../../../helper/vosk'
import {
  getTranslation,
  getParseDataForYoutube,
  getAudioFromText,
  createAudioRecord,
} from '../../../lib/server-manager'
import { localStorage } from '../../../lib/local-storage'
import dayjs from 'dayjs'
import { InputLine, TranslationResponse, YoutubeSettings } from '../types'
import { audioQueueService } from '../../../services/AudioQueueService'

export const useRecording = (
  settings: Settings,
  selectedMicrophone: MediaDeviceInfo | null,
  options: {
    youtubeSettings: YoutubeSettings
    timeOffsetRef: React.RefObject<number>
    setInputText: (cb: (prev: InputLine[]) => InputLine[]) => void
    setTranslation: (
      cb: (prev: TranslationResponse[]) => TranslationResponse[],
    ) => void
    audioContext: {
      playAudioData: (data: ArrayBuffer) => Promise<void>
    } | null
  },
  audioRecordId: string | undefined,
) => {
  const [isRecording, setIsRecording] = useState(false)
  const [voskResponse, setVoskResponse] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)

  let processor: AudioWorkletNode
  let source: MediaStreamAudioSourceNode
  let context: AudioContext
  let seq = 0

  // Replace local variable with a ref to persist the websocket
  const webSocketRef = useRef<WebSocket | null>(null)

  // Initialize the audio service when the hook mounts, only if audioContext is provided
  useEffect(() => {
    if (options.audioContext) {
      audioQueueService.initialize(options.audioContext)
    }
  }, [options.audioContext])

  const onReceiveMessage = async (
    event: MessageEvent,
    recordId: string | undefined,
  ) => {
    if (event.data) {
      let parsed = typedVoskResponse(event.data)
      setVoskResponse(parsed.listen)
      if (
        parsed.text &&
        parsed.text !== '-- ***/whisper/ggml-model.q8_0.bin --' &&
        parsed.text !== '-- **/whisper/ggml-model.q8_0.bin --' &&
        parsed.text !== '-- */whisper/ggml-model.q8_0.bin --'
      ) {
        if (options.youtubeSettings.streamingKey) {
          seq += 1
          localStorage.setCounterForYoutubeStreaming(
            options.youtubeSettings.streamingKey,
            seq,
          )
        }

        const tokens = (parsed.result ?? []).filter(w => !!w?.word?.trim())
        const trimmedText = parsed.text.slice(2, -2).trim()
        const plainText = tokens.length
          ? tokens.map(w => w.word).join(' ')
          : trimmedText
        if (plainText.length <= 0) return

        options.setInputText(prev => [...prev, { plain: plainText, tokens }])
        if (settings.sotraModel === 'passthrough') {
          options.setTranslation(prev => [
            ...prev,
            {
              text: plainText,
              counter: seq,
            },
          ])
          if (options.youtubeSettings.streamingKey) {
            const youtubePackages = createYoutubePackages(plainText, {
              start: parsed.start ? new Date(parsed.start) : new Date(),
              stop: parsed.stop ? new Date(parsed.stop) : new Date(),
            })

            for (const youtubePackage of youtubePackages) {
              const youtubeData = await getParseDataForYoutube(
                seq,
                youtubePackage.text,
                dayjs(youtubePackage.date)
                  .add(options.timeOffsetRef.current ?? 0, 'seconds')
                  .toDate(),
                options.youtubeSettings.streamingKey,
              )

              if (youtubeData.errorMessage) {
                console.error(youtubeData.errorMessage)
                toast.error(youtubeData.errorMessage)
              }

              options.setTranslation(prev =>
                prev.map(p =>
                  p.text === youtubeData.text
                    ? {
                        text: youtubeData.text,
                        timestamp: youtubeData.timestamp,
                        successfull: youtubeData.successfull,
                        counter: youtubeData.seq,
                        timestampDiff:
                          (new Date().getTime() -
                            new Date(youtubeData.timestamp).getTime()) /
                          1000,
                      }
                    : p,
                ),
              )
            }
          }
        } else {
          // Get bamborak audio file
          getTranslation(recordId, plainText, settings.sotraModel).then(
            async response => {
              // Only play audio if autoPlayAudio is enabled AND audioContext is provided
              if (settings.autoPlayAudio && options.audioContext) {
                getAudioFromText(
                  response.data.translation,
                  settings.selectedSpeakerId,
                ).then(audioResponse => {
                  audioQueueService.addToQueue(audioResponse.data)
                })
              }

              // Save the translation
              options.setTranslation(prev => [
                ...prev,
                { text: response.data.translation },
              ])
              if (options.youtubeSettings.streamingKey) {
                const youtubePackages = createYoutubePackages(
                  response.data.translation,
                  {
                    start: parsed.start ? new Date(parsed.start) : new Date(),
                    stop: parsed.stop ? new Date(parsed.stop) : new Date(),
                  },
                )

                for (const youtubePackage of youtubePackages) {
                  const youtubeData = await getParseDataForYoutube(
                    seq,
                    youtubePackage.text,
                    dayjs(youtubePackage.date)
                      .add(options.timeOffsetRef.current ?? 0, 'seconds')
                      .toDate(),
                    options.youtubeSettings.streamingKey,
                  )

                  if (youtubeData.errorMessage) {
                    console.error(youtubeData.errorMessage)
                    toast.error(youtubeData.errorMessage)
                  }

                  options.setTranslation(prev =>
                    prev.map(p =>
                      p.text === youtubeData.text
                        ? {
                            text: youtubeData.text,
                            timestamp: youtubeData.timestamp,
                            successfull: youtubeData.successfull,
                            counter: youtubeData.seq,
                            timestampDiff:
                              (new Date().getTime() -
                                new Date(youtubeData.timestamp).getTime()) /
                              1000,
                          }
                        : p,
                    ),
                  )
                }
              }
            },
          )
        }
      }
    }
  }

  const onStopRecording = () => {
    webSocketRef.current?.send('{"eof" : 1}')
    webSocketRef.current?.close()

    processor?.port.close()
    source?.disconnect(processor)
    context?.close()

    if (stream?.active) {
      stream.getTracks().forEach(track => track.stop())
    }

    setIsRecording(false)
  }

  const startRecordingWithNewStream = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          ...settings,
          deviceId: selectedMicrophone?.deviceId,
        },
        video: false,
      })
      .then(stream => {
        setStream(stream)
        setIsRecording(true)

        if (stream !== null) {
          handleSuccess(
            stream,
            settings.sampleRate,
            webSocketRef.current!,
            settings.bufferSize,
            (p: AudioWorkletNode) => {
              processor = p
            },
            (s: MediaStreamAudioSourceNode) => {
              source = s
            },
            (c: AudioContext) => {
              context = c
            },
            onStopRecording,
          )
        }
      })
      .catch(error => {
        toast.error(
          `Error accessing microphone ${selectedMicrophone?.label}`,
          error.message,
        )
      })
  }

  const startRecording = async (
    handleRecordCreated: (id: string, token: string) => void,
    oldRecordId?: string,
  ) => {
    try {
      let recordId = oldRecordId
      if (!recordId) {
        // Create audio record first with current autoPlayAudio settings
        const response = await createAudioRecord(
          settings.autoPlayAudio,
          settings.selectedSpeakerId,
        )
        recordId = response.data._id
        const token = response.data.token

        // Notify parent component about the new record
        handleRecordCreated(recordId, token)
      }

      webSocketRef.current = initWebsocket(
        `${process.env
          .REACT_APP_WEBCAPTIONER_SERVER!}/vosk?recordId=${recordId}`,
        e => onReceiveMessage(e, recordId),
      )

      webSocketRef.current.onopen = () => {
        try {
          toast.success('Websocket connected')
          webSocketRef.current?.send(
            `sample_rate=${settings.sampleRate},buffer_size=${settings.bufferSize}`,
          )
          startRecordingWithNewStream()
        } catch (error) {
          toast.error('Error accessing microphone')
          console.error('Error accessing microphone:', error)
        }
      }

      webSocketRef.current.onerror = () => {
        toast('Connection error. Please try again.')
        breakRecording('stop')
      }
    } catch (error) {
      toast.error('Error creating audio record')
      console.error('Error creating audio record:', error)
    }
  }

  const breakRecording = (newState: 'stop' | 'pause') => {
    console.log('breakRecording', newState)
    if (isRecording) {
      onStopRecording()
    }
  }

  return {
    isRecording,
    voskResponse,
    stream,
    setVoskResponse,
    startRecording,
    breakRecording,
    onReceiveMessage,
  }
}
