// utils/adaptiveTtsSpeed.ts

export const NORMAL_WPM = 150
export const MIN_TTS_SPEED = 0.75
export const MAX_TTS_SPEED = 1.45
export const SPEED_SMOOTHING = 0.35

export const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value))
}

export const countWords = (text: string) => {
  return text.trim().split(/\s+/).filter(Boolean).length
}
