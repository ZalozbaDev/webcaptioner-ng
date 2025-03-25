type SotraResponse = {
  translation: string
  model: string
  audio: string | undefined | any
}

type VOSKResponse = {
  text?: string
  partial?: string
  listen: boolean
  start?: number
  stop?: number
}

type BamborakSpeaker = {
  id: string
  info: string
  name: string
}
