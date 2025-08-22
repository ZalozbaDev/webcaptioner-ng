// Custom spell checker for Upper Sorbian text
// This uses the hunspell-spellchecker package with both .aff and .dic files

import HunspellSpellchecker from 'hunspell-spellchecker'
import { Buffer } from 'buffer'

export interface SpellCheckResult {
  word: string
  isCorrect: boolean
}

let spellchecker: HunspellSpellchecker | null = null
let isInitialized: boolean = false
let initializationPromise: Promise<void> | null = null

export class SpellChecker {
  private static async initialize() {
    // If already initialized, return immediately
    if (isInitialized) return

    // If initialization is already in progress, wait for it
    if (initializationPromise) {
      await initializationPromise
      return
    }

    // Start initialization and store the promise
    initializationPromise = this.performInitialization()

    try {
      await initializationPromise
    } finally {
      // Clear the promise reference after completion (success or failure)
      initializationPromise = null
    }
  }

  private static async performInitialization() {
    try {
      console.log('Loading dictionary files...')

      // Fetch the dictionary files from the public folder
      const [affResponse, dicResponse] = await Promise.all([
        fetch('/hunspell/hsb_DE_soblex_w8_3.09.11.aff'),
        fetch('/hunspell/hsb_DE_soblex_w8_3.09.11.dic'),
      ])

      if (!affResponse.ok || !dicResponse.ok) {
        throw new Error('Failed to load dictionary files')
      }

      const affContent = await affResponse.arrayBuffer()
      const dicContent = await dicResponse.arrayBuffer()

      // Create a new spellchecker instance
      spellchecker = new HunspellSpellchecker()

      // Parse an hunspell dictionary that can be serialized as JSON
      const DICT = spellchecker.parse({
        aff: Buffer.from(affContent),
        dic: Buffer.from(dicContent),
      })

      // Load a dictionary
      spellchecker.use(DICT)

      isInitialized = true
      console.log('Spell checker initialized successfully')
    } catch (error) {
      console.error('Failed to initialize spell checker:', error)
      throw error
    }
  }

  static async checkWord(word: string): Promise<SpellCheckResult> {
    // Ensure initialization is complete before checking words
    if (!isInitialized) {
      await this.initialize()
    }

    if (!spellchecker) {
      throw new Error('Spell checker not initialized')
    }

    try {
      const cleanWord = word.trim()
      const isCorrect = spellchecker.check(cleanWord)
      return {
        word: cleanWord,
        isCorrect,
      }
    } catch (error) {
      console.error('Error checking word:', word, error)
      return {
        word,
        isCorrect: true,
      }
    }
  }

  static async checkText(text: string): Promise<SpellCheckResult[]> {
    // Ensure initialization is complete before checking text
    if (!isInitialized) {
      await this.initialize()
    }

    if (!spellchecker) {
      throw new Error('Spell checker not initialized')
    }

    try {
      // Split text into words, preserving punctuation
      const words = text.split(/\s+/).filter(word => word.length > 0)
      const results: SpellCheckResult[] = []

      for (const word of words) {
        const result = await this.checkWord(word)
        results.push(result)
      }

      return results
    } catch (error) {
      console.error('Error checking text:', error)
      return []
    }
  }
}
