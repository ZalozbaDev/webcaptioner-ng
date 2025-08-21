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
  createdAt: Date
  originalText: string[]
  translatedText: string[]
  token: string
  speakerId: number | null
}
