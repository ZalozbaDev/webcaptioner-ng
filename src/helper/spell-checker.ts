// Deprecated: Hunspell-based spell checking was removed.
// The app now relies on Vosk token metadata (conf/spell/start/end) persisted in the database.
// This file is kept as a no-op stub to avoid breaking old imports.

export interface SpellCheckResult {
  word: string
  isCorrect: boolean
}

export class SpellChecker {
  static async checkWord(word: string): Promise<SpellCheckResult> {
    return { word: word.trim(), isCorrect: true }
  }

  static async checkText(_text: string): Promise<SpellCheckResult[]> {
    return []
  }
}
