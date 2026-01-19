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
  result?: Array<{
    conf: number
    end: number
    spell: boolean
    start: number
    word: string
  }>
}

type Language = 'hsb' | 'de' | 'dsb'

type BamborakSpeaker = {
  id: string
  info: string
  name: string
  language: Language
}
