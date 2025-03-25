import { useEffect, useRef, useState } from 'react'
import { getSpeakersFromBamborak } from '../../lib/server-manager'
import { MicrophoneSelector } from './components/microphone-selector.tsx'
import useAuth from '../../hooks/use-auth'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { YoutubeSettings } from './components/record-buttons-container/youtube-container'
import { Settings } from '../../types/settings'
import { DEFAULT_SETTINGS } from '../../constants'
import { useAudioContext } from './hooks/useAudioContext'
import { useRecording } from './hooks/useRecording'
import { Header } from './components/Header'
import { MainContent } from './components/MainContent'

dayjs.extend(utc)
dayjs.extend(timezone)

let settings = DEFAULT_SETTINGS

type TranslationResponse = {
  text: string
  timestamp?: Date
  successfull?: boolean
  counter?: number
  timestampDiff?: number
}

const MainScreen = () => {
  const [mediaStreamSettings, setMediaStreamSettings] =
    useState<Settings>(DEFAULT_SETTINGS)
  const [selectedMicrophone, setSelectedMicrophone] =
    useState<MediaDeviceInfo | null>(null)
  const [inputText, setInputText] = useState<string[]>([])
  const [translation, setTranslation] = useState<TranslationResponse[]>([])
  const [youtubeSettings, setYoutubeSettings] = useState<YoutubeSettings>({
    streamingKey: undefined,
    timeOffset: parseInt(
      process.env.REACT_APP_DEFAULT_YOUTUBE_TIME_OFFSET ?? '8'
    ),
    counter: 0,
  })
  const timeOffsetRef = useRef<number>(youtubeSettings.timeOffset)

  const { user, logout } = useAuth()
  const audioContext = useAudioContext()
  const recording = useRecording(mediaStreamSettings, selectedMicrophone, {
    youtubeSettings,
    timeOffsetRef,
    setInputText,
    setTranslation,
    audioContext,
  })

  const [speakers, setSpeakers] = useState<BamborakSpeaker[]>([])

  useEffect(() => {
    getSpeakersFromBamborak().then(response => {
      setSpeakers(response.data)
    })
  }, [])

  useEffect(() => {
    return () => {
      recording.breakRecording('stop')
    }
  }, [recording])

  const updateMediaStreamSettings = (
    key: keyof Settings,
    value: boolean | number
  ) => {
    recording.breakRecording('pause')
    setMediaStreamSettings(prev => ({ ...prev, [key]: value }))
    settings = { ...settings, [key]: value }
  }

  return (
    <div className='main-screen' onClick={audioContext.initializeAudioContext}>
      <Header user={user} onLogout={logout} />

      {!selectedMicrophone ? (
        <MicrophoneSelector
          activeMicrophone={selectedMicrophone}
          onChange={mic => {
            recording.breakRecording('pause')
            setSelectedMicrophone(mic)
          }}
        />
      ) : (
        <MainContent
          recording={recording}
          selectedMicrophone={selectedMicrophone}
          settings={mediaStreamSettings}
          onChangeSetting={updateMediaStreamSettings}
          youtubeSettings={youtubeSettings}
          onChangeYoutubeSettings={setYoutubeSettings}
          inputText={inputText}
          translation={translation}
          speakers={speakers}
        />
      )}
    </div>
  )
}

export default MainScreen
