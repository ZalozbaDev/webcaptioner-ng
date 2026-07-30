import { TranslationTargetLanguage } from '../constants/translation'
import {
  LIBRETRANSLATE_LANGUAGE_FLAGS,
  LIBRETRANSLATE_LANGUAGE_LABELS,
  LibreTranslateTargetLanguage,
} from '../constants/libretranslate'

const SOTRA_MODEL_LABELS: Record<SotraModel, string> = {
  ctranslate: 'DE ctranslate',
  fairseq: 'DE lmu_fairseq',
  libretranslate: 'LibreTranslate',
}

export const getSotraModelLabel = (model: SotraModel): string => {
  return SOTRA_MODEL_LABELS[model]
}

const TRANSLATION_TARGET_LANGUAGE_LABELS: Record<
  TranslationTargetLanguage,
  string
> = {
  de: 'Deutsch',
  hsb: 'Serbsce',
  dsb: 'Dolnoserbski',
  cs: 'Čeština',
}

export const getTranslationTargetLanguageLabel = (
  translationTargetLanguage: TranslationTargetLanguage,
): string => {
  return TRANSLATION_TARGET_LANGUAGE_LABELS[translationTargetLanguage]
}

export const getLibreTranslateTargetLanguageLabel = (
  language: LibreTranslateTargetLanguage,
): string => {
  return LIBRETRANSLATE_LANGUAGE_LABELS[language]
}

export const getLibreTranslateTargetLanguageFlag = (
  language: LibreTranslateTargetLanguage,
): string => {
  return LIBRETRANSLATE_LANGUAGE_FLAGS[language]
}
