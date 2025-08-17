import React, { useState, useEffect, useCallback } from 'react'
import { Typography, Box } from '@mui/material'
import { SpellChecker, SpellCheckResult } from '../../../helper/spell-checker'

interface SpellCheckedTextProps {
  text: string
  fontSize: number
}

export const SpellCheckedText: React.FC<SpellCheckedTextProps> = ({
  text,
  fontSize,
}) => {
  const [spellCheckResults, setSpellCheckResults] = useState<
    SpellCheckResult[]
  >([])
  const [isLoading, setIsLoading] = useState(false)

  const checkSpelling = useCallback(async (textToCheck: string) => {
    if (!textToCheck.trim()) {
      setSpellCheckResults([])
      return
    }

    setIsLoading(true)
    try {
      const results = await SpellChecker.checkText(textToCheck)
      setSpellCheckResults(results)
    } catch (error) {
      console.error('Spell checking failed:', error)
      setSpellCheckResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkSpelling(text)
  }, [text, checkSpelling])

  const renderTextWithSpellChecking = () => {
    if (isLoading) {
      return (
        <Typography
          sx={{
            color: 'black',
            fontSize: `${fontSize}px`,
            lineHeight: 1.6,
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          {text}
        </Typography>
      )
    }

    const words = text.split(/(\s+)/)

    return words.map((word, index) => {
      if (/\s+/.test(word)) {
        // This is whitespace, render as-is
        return <span key={index}>{word}</span>
      }

      // Clean word for spell checking (remove punctuation and special characters)
      const cleanWord = word.replace(
        /[^\w\u0107\u010D\u0111\u0119\u0142\u0144\u00F3\u015B\u017A\u017C\u0106\u010C\u0110\u0118\u0141\u0143\u00D3\u015A\u0179\u017A]/g,
        ''
      )

      const spellResult = spellCheckResults.find(
        result => result.word.toLowerCase() === cleanWord.toLowerCase()
      )

      if (spellResult && !spellResult.isCorrect) {
        return (
          <Typography
            component='span'
            sx={{
              color: 'black',
              fontSize: `${fontSize}px`,
              lineHeight: 1.6,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              textDecoration: 'underline wavy red',
            }}
          >
            {word}
          </Typography>
        )
      }

      // Correctly spelled word
      return (
        <Typography
          key={index}
          component='span'
          sx={{
            color: 'black',
            fontSize: `${fontSize}px`,
            lineHeight: 1.6,
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          {word}
        </Typography>
      )
    })
  }

  return (
    <Box sx={{ position: 'relative' }}>{renderTextWithSpellChecking()}</Box>
  )
}
