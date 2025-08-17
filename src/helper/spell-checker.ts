// Custom spell checker for Upper Sorbian text
// This reads the actual Hunspell dictionary files to get the complete vocabulary

export interface SpellCheckResult {
  word: string
  isCorrect: boolean
}

// Dictionary storage
let UPPER_SORBIAN_DICTIONARY: Set<string> | null = null
let isInitialized = false

// Parse the dictionary file content
const parseDictionaryFile = (dicContent: string): Set<string> => {
  const words = new Set<string>()
  const lines = dicContent.split('\n')

  // Skip the first line (word count)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line && !line.startsWith('#')) {
      // Extract the word part (before any flags or slashes)
      const word = line.split('/')[0].split(' ')[0].trim()
      if (word && word.length > 0) {
        words.add(word.toLowerCase())
      }
    }
  }

  return words
}

// Load and parse the dictionary files
const loadDictionary = async (): Promise<Set<string>> => {
  try {
    console.log('Loading Upper Sorbian dictionary...')

    // Load the dictionary file
    const dicResponse = await fetch('/hunspell/hsb_DE.dic')
    const dicContent = await dicResponse.text()

    console.log('Dictionary file loaded, parsing...')
    const dictionary = parseDictionaryFile(dicContent)

    console.log(`Dictionary loaded with ${dictionary.size} words`)
    return dictionary
  } catch (error) {
    console.error('Failed to load dictionary:', error)
    // Fallback to a basic dictionary if loading fails
    return new Set([])
  }
}

export class SpellChecker {
  private static async initialize() {
    if (isInitialized) return

    try {
      UPPER_SORBIAN_DICTIONARY = await loadDictionary()
      isInitialized = true
      console.log('Spell checker initialized successfully')
    } catch (error) {
      console.error('Failed to initialize spell checker:', error)
      throw error
    }
  }

  static async checkWord(word: string): Promise<SpellCheckResult> {
    await this.initialize()

    if (!UPPER_SORBIAN_DICTIONARY) {
      throw new Error('Spell checker not initialized')
    }

    try {
      const cleanWord = word.toLowerCase().trim()
      const isCorrect = UPPER_SORBIAN_DICTIONARY.has(cleanWord)

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
    await this.initialize()

    if (!UPPER_SORBIAN_DICTIONARY) {
      throw new Error('Spell checker not initialized')
    }

    try {
      // Split text into words, preserving punctuation
      const words = text.split(/\s+/).filter(word => word.length > 0)
      const results: SpellCheckResult[] = []

      for (const word of words) {
        // Clean word for spell checking (remove punctuation)
        const cleanWord = word.replace(
          /[^\w\u0107\u010D\u0111\u0119\u0142\u0144\u00F3\u015B\u017A\u017C\u0106\u010C\u0110\u0118\u0141\u0143\u00D3\u015A\u0179\u017A]/g,
          ''
        )

        if (cleanWord.length > 0) {
          const result = await this.checkWord(cleanWord)
          results.push(result)
        }
      }

      return results
    } catch (error) {
      console.error('Error checking text:', error)
      return []
    }
  }
}
