import { Settings } from '../types/settings'

export const DEFAULT_SPEAKER_ID = 'weronika'
const DEFAULT_SAMPLE_RATE = process.env.REACT_APP_DEFAULT_VOSK_SAMPLE_RATE
  ? parseInt(process.env.REACT_APP_DEFAULT_VOSK_SAMPLE_RATE)
  : 48000

export const DEFAULT_SETTINGS: Settings = {
  autoGainControl: false,
  noiseSuppression: false,
  echoCancellation: false,
  channelCount: 1,
  sampleRate: DEFAULT_SAMPLE_RATE,
  sampleSize: 16,
  deviceId: undefined,
  bufferSize: 4096,
  sotraModel: process.env
    .REACT_APP_DEFAULT_SOTRA_MODEL as Settings['sotraModel'],
  autoPlayAudio: false,
  selectedSpeakerId: DEFAULT_SPEAKER_ID,
} as const
