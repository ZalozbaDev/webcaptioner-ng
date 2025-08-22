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
        {words.map((word, index) => {
          if (/\s+/.test(word)) {
            // This is whitespace, render as-is
            return <span key={index}>{word}</span>
          }

          const spellResult = spellCheckResults.find(
            result => result.word.toLowerCase() === word.toLowerCase()
          )

          if (spellResult && !spellResult.isCorrect) {
            return (
              <span
                key={index}
                style={{
                  textDecoration: 'underline',
                  textDecorationStyle: 'wavy',
                  textDecorationColor: 'red',
                }}
              >
                {word}
              </span>
            )
          }

          // Correctly spelled word
          return <span key={index}>{word}</span>
        })}
      </Typography>
    )
  }

  return (
    <Box sx={{ position: 'relative' }}>{renderTextWithSpellChecking()}</Box>
  )
}
