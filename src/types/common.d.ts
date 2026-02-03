import type { TranscriptLine } from './transcript'

declare global {
  type SotraModel = 'ctranslate' | 'fairseq' | 'passthrough'
  type UserRole = 'ADMIN' | 'USER'

  type User = {
    _id: string
    email: string
    firstname: string
    lastname: string
    role: UserRole
    audioRecords: AudioRecord[]
  }

  type AudioRecord = {
    _id: string
    title: string
    createdAt: string
    originalText: TranscriptLine[]
    translatedText: TranscriptLine[]
    token: string
    speakerId: string | null
  }
}

export {}
