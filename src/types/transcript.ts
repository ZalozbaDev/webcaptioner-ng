export type InputWord = {
  word: string
  conf: number
  spell?: boolean
  start?: number
  end?: number
}

export type InputLine = {
  plain: string
  tokens?: InputWord[]
}

export type TranscriptLine = string | InputLine

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const normalizeSpell = (value: unknown): boolean | undefined => {
  if (value === undefined || value === null) return undefined
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value === 1
  if (typeof value === 'string') return value === '1' || value === 'true'
  return undefined
}

const normalizeNumber = (value: unknown): number | undefined => {
  if (value === undefined || value === null) return undefined
  const n = typeof value === 'number' ? value : Number.parseFloat(String(value))
  return Number.isFinite(n) ? n : undefined
}

const normalizeInputWords = (raw: unknown): InputWord[] | undefined => {
  if (!Array.isArray(raw)) return undefined
  const tokens = raw
    .map((t): InputWord | null => {
      if (!isRecord(t)) return null
      const word = typeof t.word === 'string' ? t.word : String(t.word ?? '')
      const conf = normalizeNumber(t.conf)
      if (!word.trim() || conf === undefined) return null

      return {
        word,
        conf,
        spell: normalizeSpell(t.spell),
        start: normalizeNumber(t.start),
        end: normalizeNumber(t.end),
      }
    })
    .filter((t): t is InputWord => Boolean(t))

  return tokens.length ? tokens : undefined
}

export const isInputLine = (value: unknown): value is InputLine => {
  if (!isRecord(value)) return false
  const plain = value.plain
  const text = value.text
  return typeof plain === 'string' || typeof text === 'string'
}
//TODO: optimize

export const getTranscriptLinePlain = (value: unknown): string => {
  if (typeof value === 'string') return value
  if (!isRecord(value)) return ''

  if (typeof value.plain === 'string') return value.plain
  if (typeof value.text === 'string') return value.text

  const tokens = normalizeInputWords(
    value.tokens ?? value.result ?? value.words,
  )
  if (tokens?.length) return tokens.map(t => t.word).join(' ')
  return ''
}

export const getTranscriptLineTokens = (
  value: unknown,
): InputWord[] | undefined => {
  if (typeof value === 'string') return undefined
  if (!isRecord(value)) return undefined
  return normalizeInputWords(value.tokens ?? value.result ?? value.words)
}
