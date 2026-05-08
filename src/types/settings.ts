export interface Settings {
  autoGainControl: boolean
  noiseSuppression: boolean
  echoCancellation: boolean
  channelCount: number
  sampleRate: number
  sampleSize: number
  deviceId: string | undefined
  bufferSize: number
  sotraModel: 'ctranslate' | 'fairseq'
  autoPlayAudio: boolean
  selectedSpeakerId: string
}
