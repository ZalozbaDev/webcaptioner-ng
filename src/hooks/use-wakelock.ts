import { useEffect, useRef, useState } from 'react'

export const useWakeLock = () => {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)
  const [isWakeLockActive, setIsWakeLockActive] = useState(false)

  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator && navigator.wakeLock) {
        const sentinel = await navigator.wakeLock.request('screen')
        wakeLockRef.current = sentinel
        setIsWakeLockActive(true)

        sentinel.addEventListener('release', () => {
          console.log('Wake lock was released')
          setIsWakeLockActive(false)
        })

        console.log('Wake lock activated')
      } else {
        console.warn('Wake lock is not supported in this browser')
      }
    } catch (err) {
      console.error('Failed to request wake lock:', err)
    }
  }

  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release()
        wakeLockRef.current = null
        setIsWakeLockActive(false)
        console.log('Wake lock released')
      } catch (err) {
        console.error('Failed to release wake lock:', err)
      }
    }
  }

  useEffect(() => {
    requestWakeLock()

    return () => {
      releaseWakeLock()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    requestWakeLock,
    releaseWakeLock,
    isWakeLockActive,
  }
}
