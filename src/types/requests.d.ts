type SotraResponse = {
  translation: string
  model: string
}

type VOSKResponse = {
  text?: string
  partial?: string
  listen: boolean
  start?: number
  stop?: number
}
