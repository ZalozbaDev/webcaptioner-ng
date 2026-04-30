import { useEffect, useState } from 'react'
import { getSpeakersFromBamborak } from '../../lib/server-manager'
import { MicrophoneSelector } from './components/microphone-selector.tsx'
import useAuth from '../../hooks/use-auth'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { Settings } from '../../types/settings'
import { Header } from './components/Header'
import { MainContent } from './components/MainContent'
import { useWakeLock } from '../../hooks/use-wakelock'
import { useRecordingSession } from '../../contexts/recording-session-context'

dayjs.extend(utc)
dayjs.extend(timezone)

const MainScreen = () => {
  useWakeLock()

  const {
    mediaStreamSettings,
    setMediaStreamSettings,
    selectedMicrophone,
    setSelectedMicrophone,
    inputText,
    translation,
    record,
    setRecord,
    youtubeSettings,
    setYoutubeSettings,
    totalTime,
    setTotalTime,
    recording,
  } = useRecordingSession()

  const { user, logout } = useAuth()
  const [speakers, setSpeakers] = useState<BamborakSpeaker[]>([])

  useEffect(() => {
    getSpeakersFromBamborak()
      .then(response => {
        if (response.status !== 200) {
          console.error('Error fetching speakers:', response)
          return
        }
        setSpeakers(response.data)
      })
      .catch(err => {
        console.error('Error fetching speakers:', err)
      })
  }, [])

  const updateMediaStreamSettings = (
    key: keyof Settings,
    value: boolean | number,
  ) => {
    recording.breakRecording('pause')
    setMediaStreamSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleMicrophoneChange = (mic: MediaDeviceInfo) => {
    recording.breakRecording('pause')
    setSelectedMicrophone(mic)
  }

  return (
    <div className='main-screen'>
      <Header user={user} onLogout={logout} />

      {!selectedMicrophone ? (
        <MicrophoneSelector
          activeMicrophone={selectedMicrophone}
          onChange={handleMicrophoneChange}
        />
      ) : (
        <MainContent
          recording={recording}
          selectedMicrophone={selectedMicrophone}
          onChangeMicrophone={handleMicrophoneChange}
          settings={mediaStreamSettings}
          onChangeSetting={updateMediaStreamSettings}
          youtubeSettings={youtubeSettings}
          onChangeYoutubeSettings={setYoutubeSettings}
          totalTime={totalTime}
          setTotalTime={setTotalTime}
          inputText={inputText}
          translation={translation}
          speakers={speakers}
          record={record}
          setRecord={r => setRecord(r)}
        />
      )}
    </div>
  )
}

export default MainScreen
