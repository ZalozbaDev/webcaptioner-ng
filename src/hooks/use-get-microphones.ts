import { useEffect, useState } from 'react'

export const useFetchMicrophones = () => {
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const mics = devices.filter((device) => device.kind === 'audioinput')
        setMicrophones(mics)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { microphones, error, loading }
}
