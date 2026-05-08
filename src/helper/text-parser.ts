import { TranslationTargetLanguage } from '../constants/translation'

const SOTRA_MODEL_LABELS: Record<SotraModel, string> = {
  ctranslate: 'DE ctranslate',
  fairseq: 'DE lmu_fairseq',
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
