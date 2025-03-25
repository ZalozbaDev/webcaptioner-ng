export type TranslationResponse = {
  text: string
  timestamp?: Date
  successfull?: boolean
  counter?: number
  timestampDiff?: number
}

export type YoutubeSettings = {
  streamingKey?: string
  timeOffset: number
  counter: number
}

export type AudioContextState = {
  audioContext: AudioContext | null
  audioQueue: ArrayBuffer[]
  isAudioContextInitialized: boolean
}
