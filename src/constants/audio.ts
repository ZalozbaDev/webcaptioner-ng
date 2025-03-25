import { Settings } from '../types/settings'

export const DEFAULT_SPEAKER_ID = 'weronika'

export const DEFAULT_SETTINGS: Settings = {
  autoGainControl: false,
  noiseSuppression: false,
  echoCancellation: false,
  channelCount: 1,
  sampleRate: 48000,
  sampleSize: 16,
  deviceId: undefined,
  bufferSize: 4096,
  sotraModel: process.env
    .REACT_APP_DEFAULT_SOTRA_MODEL as Settings['sotraModel'],
  autoPlayAudio: false,
  selectedSpeakerId: DEFAULT_SPEAKER_ID,
} as const
