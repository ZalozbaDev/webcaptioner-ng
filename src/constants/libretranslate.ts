export const LIBRETRANSLATE_TARGET_LANGUAGES = ['en', 'pl'] as const

export type LibreTranslateTargetLanguage =
  (typeof LIBRETRANSLATE_TARGET_LANGUAGES)[number]

export const DEFAULT_LIBRETRANSLATE_TARGET_LANGUAGE: LibreTranslateTargetLanguage =
  'en'

export const LIBRETRANSLATE_LANGUAGE_FLAGS: Record<
  LibreTranslateTargetLanguage,
  string
> = {
  en: '🇬🇧',
  pl: '🇵🇱',
}

export const LIBRETRANSLATE_LANGUAGE_LABELS: Record<
  LibreTranslateTargetLanguage,
  string
> = {
  en: 'English',
  pl: 'Polski',
}

export function isLibreTranslateTargetLanguage(
  value: string,
): value is LibreTranslateTargetLanguage {
  return LIBRETRANSLATE_TARGET_LANGUAGES.includes(
    value as LibreTranslateTargetLanguage,
  )
}
