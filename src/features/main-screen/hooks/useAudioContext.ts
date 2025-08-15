import { useState } from 'react'

export const useAudioContext = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [audioQueue, setAudioQueue] = useState<ArrayBuffer[]>([])
  const [isAudioContextInitialized, setIsAudioContextInitialized] =
    useState(false)

  const initializeAudioContext = () => {
    if (!isAudioContextInitialized) {
      const newContext = new AudioContext()
      setAudioContext(newContext)
      setIsAudioContextInitialized(true)

      // Resume any queued audio
      if (audioQueue.length > 0) {
        audioQueue.forEach(audioData => playAudioData(audioData))
        setAudioQueue([])
      }
    }
  }

  const playAudioData = async (audioData: ArrayBuffer): Promise<void> => {
    if (!audioContext) {
      setAudioQueue(prev => [...prev, audioData])
      return
    }

    try {
      const audioBuffer = await audioContext.decodeAudioData(audioData)
      const source = audioContext.createBufferSource()
      source.buffer = audioBuffer
      source.connect(audioContext.destination)

      return new Promise<void>(resolve => {
        source.onended = () => {
          resolve()
        }

        source.start(0)
      })
    } catch (error) {
      console.error('Error playing audio:', error)
      throw error
    }
  }

  return {
    audioContext,
    isAudioContextInitialized,
    initializeAudioContext,
    playAudioData,
  }
}
