// src/constants/translation.ts

export const TRANSLATION_TARGET_LANGUAGES = ['hsb', 'de', 'dsb', 'cs'] as const

export type TranslationTargetLanguage =
  (typeof TRANSLATION_TARGET_LANGUAGES)[number]

export const DEFAULT_FALLBACK_TRANSLATION_TARGET_LANGUAGE: TranslationTargetLanguage =
  'hsb'

export function isTranslationTargetLanguage(
  value: string,
): value is TranslationTargetLanguage {
  return TRANSLATION_TARGET_LANGUAGES.includes(
    value as TranslationTargetLanguage,
  )
}

export function parseTranslationTargetLanguageOrDefault(
  value: string | undefined,
): TranslationTargetLanguage {
  if (!value) {
    console.warn(
      `Missing REACT_APP_DEFAULT_TRANSLATION_TARGET_LANGUAGE. ` +
        `Using default "${DEFAULT_FALLBACK_TRANSLATION_TARGET_LANGUAGE}".`,
    )

    return DEFAULT_FALLBACK_TRANSLATION_TARGET_LANGUAGE
  }

  if (!isTranslationTargetLanguage(value)) {
    console.warn(
      `Invalid REACT_APP_DEFAULT_TRANSLATION_TARGET_LANGUAGE: "${value}". ` +
        `Allowed values are: ${TRANSLATION_TARGET_LANGUAGES.join(', ')}. ` +
        `Using default "${DEFAULT_FALLBACK_TRANSLATION_TARGET_LANGUAGE}".`,
    )

    return DEFAULT_FALLBACK_TRANSLATION_TARGET_LANGUAGE
  }

  return value
}
