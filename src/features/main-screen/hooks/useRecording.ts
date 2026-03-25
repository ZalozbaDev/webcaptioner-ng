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
import { InputWord, normalizeTranscriptText } from '../../../types/transcript'
import { VoskSendConfigService } from '../../../lib/vosk-config-service'
import {
  attachTokensToLatestTranslation,
  dequeuePendingTranslationTokens,
  enqueuePendingTranslationTokens,
} from '../../../helper/translation-token-sync'

const shouldIgnoreTranscriptionText = (plainText: string): boolean => {
  const t = plainText.trim()
  if (!t) return true
  // const lower = t.toLowerCase()

  // if (lower.includes('ggml-model')) return true
  // if (lower.includes('whisper.cpp')) return true
  // if (lower.includes('--whisper-')) return true

  // Ignore lines that are only punctuation/whitespace
  let hasAlphaNum = false
  for (let i = 0; i < t.length; i += 1) {
    const ch = t[i]
    if (ch >= '0' && ch <= '9') {
      hasAlphaNum = true
      break
    }

    // Rough but robust "is letter" check that works for Latin-extended
    // without requiring unicode property escapes.
    if (ch.toLowerCase() !== ch.toUpperCase()) {
      hasAlphaNum = true
      break
    }
  }
  if (!hasAlphaNum) return true

  return false
}

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
  const [isVoskBuilding, setIsVoskBuilding] = useState(false)

  let processor: AudioWorkletNode
  let source: MediaStreamAudioSourceNode
  let context: AudioContext

  const seqRef = useRef<number>(0)

  const voskReadyRef = useRef<boolean>(false)
  const voskConfigSentRef = useRef<boolean>(false)
  const voskStreamStartedRef = useRef<boolean>(false)

  // Replace local variable with a ref to persist the websocket
  const webSocketRef = useRef<WebSocket | null>(null)

  const translationsWsRef = useRef<WebSocket | null>(null)
  const translationsWsRecordIdRef = useRef<string | null>(null)
  const pendingTranslationTokensRef = useRef<Map<string, InputWord[][]>>(
    new Map(),
  )

  useEffect(() => {
    const key = options.youtubeSettings.streamingKey
    if (key) {
      seqRef.current = localStorage.getCounterForYoutubeStreaming(key)
    } else {
      seqRef.current = 0
    }
  }, [options.youtubeSettings.streamingKey])

  // Initialize the audio service when the hook mounts, only if audioContext is provided
  useEffect(() => {
    if (options.audioContext) {
      audioQueueService.initialize(options.audioContext)
    }
  }, [options.audioContext])

  const attachTranslationTokensToLatest = (
    translation: string,
    translationTokens: InputWord[],
  ) => {
    if (!translation || !translationTokens?.length) return

    options.setTranslation(prev => {
      const result = attachTokensToLatestTranslation(
        prev,
        translation,
        translationTokens,
      )

      if (!result.attached) {
        enqueuePendingTranslationTokens(
          pendingTranslationTokensRef.current,
          translation,
          translationTokens,
        )
        return prev
      }

      return result.translations
    })
  }

  const flushQueuedTokensForTranslation = (translation: string) => {
    const queuedTokens = dequeuePendingTranslationTokens(
      pendingTranslationTokensRef.current,
      translation,
    )

    if (queuedTokens?.length) {
      attachTranslationTokensToLatest(translation, queuedTokens)
    }
  }

  const maybeSendYoutubePackages = async (
    seq: number,
    text: string,
    timing: { start: Date; stop: Date },
  ) => {
    const streamingKey = options.youtubeSettings.streamingKey
    if (!streamingKey) return

    const youtubePackages = createYoutubePackages(text, timing)
    for (const youtubePackage of youtubePackages) {
      const youtubeData = await getParseDataForYoutube(
        seq,
        youtubePackage.text,
        dayjs(youtubePackage.date)
          .add(options.timeOffsetRef.current ?? 0, 'seconds')
          .toDate(),
        streamingKey,
      )

      if (youtubeData.errorMessage) {
        console.error(youtubeData.errorMessage)
        toast.error(youtubeData.errorMessage)
      }

      options.setTranslation(prev =>
        prev.map(p =>
          p.text === youtubeData.text
            ? {
                ...p,
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

  const onReceiveMessage = async (
    event: MessageEvent,
    recordId: string | undefined,
  ) => {
    if (event.data) {
      if (typeof event.data === 'string') {
        try {
          const maybeReady = JSON.parse(event.data) as any
          if (maybeReady?.type === 'vosk_ready') {
            voskReadyRef.current = true
            setIsVoskBuilding(false)

            if (!voskConfigSentRef.current) {
              voskConfigSentRef.current = true
              VoskSendConfigService.sendConfig(
                webSocketRef.current,
                settings.sampleRate,
                settings.bufferSize,
              )
            }

            if (!voskStreamStartedRef.current) {
              voskStreamStartedRef.current = true
              startRecordingWithNewStream()
            }

            return
          }
        } catch {
          // ignore non-JSON payloads
        }
      }

      let parsed = typedVoskResponse(event.data)

      // Fallback: if we receive any normal Vosk payload, we are effectively "ready".
      setIsVoskBuilding(false)

      setVoskResponse(parsed.listen)
      if (
        parsed.text
        // parsed.text !== '-- ***/whisper/ggml-model.q8_0.bin --' &&
        // parsed.text !== '-- **/whisper/ggml-model.q8_0.bin --' &&
        // parsed.text !== '-- */whisper/ggml-model.q8_0.bin --'
      ) {
        const streamingKey = options.youtubeSettings.streamingKey
        if (streamingKey) {
          seqRef.current += 1
          localStorage.setCounterForYoutubeStreaming(
            streamingKey,
            seqRef.current,
          )
        }

        const tokens = (parsed.result ?? []).filter(w => !!w?.word?.trim())
        const plainFromText = normalizeTranscriptText(parsed.text)
        const plainText = tokens.length
          ? tokens.map(w => w.word).join(' ')
          : plainFromText
        if (plainText.length <= 0) return
        if (shouldIgnoreTranscriptionText(plainText)) return

        const timing = {
          start: parsed.start ? new Date(parsed.start) : new Date(),
          stop: parsed.stop ? new Date(parsed.stop) : new Date(),
        }

        options.setInputText(prev => [...prev, { plain: plainText, tokens }])
        if (settings.sotraModel === 'passthrough') {
          options.setTranslation(prev => [
            ...prev,
            {
              text: plainText,
              counter: seqRef.current,
            },
          ])

          await maybeSendYoutubePackages(seqRef.current, plainText, timing)
        } else {
          // Get bamborak audio file
          getTranslation(
            recordId,
            plainText,
            settings.sotraModel,
            'hsb',
            'de',
          ).then(async response => {
            // Only play audio if autoPlayAudio is enabled AND audioContext is provided
            if (settings.autoPlayAudio && options.audioContext) {
              getAudioFromText(
                response.data.translation,
                settings.selectedSpeakerId,
              ).then(audioResponse => {
                audioQueueService.addToQueue(audioResponse.data)
              })
            }

            const translation = response.data.translation

            // Save the translation
            options.setTranslation(prev => [...prev, { text: translation }])

            // If tokens arrived before the state update, attach them now.
            flushQueuedTokensForTranslation(translation)

            await maybeSendYoutubePackages(seqRef.current, translation, timing)
          })
        }
      }
    }
  }

  const onStopRecording = () => {
    setIsVoskBuilding(false)

    voskReadyRef.current = false
    voskConfigSentRef.current = false
    voskStreamStartedRef.current = false

    VoskSendConfigService.sendEOF(webSocketRef.current)
    webSocketRef.current?.close()

    translationsWsRef.current?.close()
    translationsWsRef.current = null
    translationsWsRecordIdRef.current = null
    pendingTranslationTokensRef.current.clear()

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
        setIsVoskBuilding(false)
        onStopRecording()
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
      setIsVoskBuilding(true)

      voskReadyRef.current = false
      voskConfigSentRef.current = false
      voskStreamStartedRef.current = false

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

      // Subscribe to translations websocket too (provides translationTokens with conf)
      // so main screen can render confidence coloring and [unverständlich] masking.
      if (recordId && translationsWsRecordIdRef.current !== recordId) {
        try {
          translationsWsRef.current?.close()
        } catch {
          // ignore
        }

        translationsWsRecordIdRef.current = recordId
        const wsUrl = `${process.env.REACT_APP_WEBCAPTIONER_SERVER?.replace(
          'http',
          'ws',
        )}/translations?recordId=${recordId}`

        translationsWsRef.current = initWebsocket(
          wsUrl,
          (event: MessageEvent) => {
            try {
              const data = JSON.parse(event.data as string)
              const translation =
                typeof data?.translation === 'string' ? data.translation : ''
              const translationTokens = Array.isArray(data?.translationTokens)
                ? (data.translationTokens as InputWord[])
                : undefined

              if (!translation || !translationTokens?.length) return
              attachTranslationTokensToLatest(translation, translationTokens)
            } catch (error) {
              console.error('[translations/ws][main] parse error', error)
            }
          },
        )
      }

      webSocketRef.current.onerror = () => {
        toast('Connection error. Please try again.')
        setIsVoskBuilding(false)
        breakRecording('stop')
      }
    } catch (error) {
      toast.error('Error creating audio record')
      setIsVoskBuilding(false)
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
    isVoskBuilding,
    voskResponse,
    stream,
    setVoskResponse,
    startRecording,
    breakRecording,
    onReceiveMessage,
  }
}
