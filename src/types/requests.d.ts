type SotraResponse = {
  ctranslate2_input: string
  ctranslate2_output: string
  marked_input: string
  marked_translation: string
  model: string
  ok: boolean
  translation: string
}

type VOSKResponse = {
  text?: string
  partial?: string
  listen: boolean
  start?: number
  stop?: number
}
