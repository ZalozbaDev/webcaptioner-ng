import { LibreTranslateTargetLanguage } from '../constants/libretranslate'
import { TranslationTargetLanguage } from '../constants/translation'

export interface Settings {
  autoGainControl: boolean
  noiseSuppression: boolean
  echoCancellation: boolean
  channelCount: number
  sampleRate: number
  sampleSize: number
  deviceId: string | undefined
  bufferSize: number
  sotraModel: SotraModel
  translationTargetLanguage: TranslationTargetLanguage
  libretranslateTargetLanguage: LibreTranslateTargetLanguage
  autoPlayAudio: boolean
  selectedSpeakerId: string
}
