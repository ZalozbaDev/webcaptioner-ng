import { useEffect, useState } from 'react'

export const useFetchMicrophones = () => {
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([])
  const [error, setError] = useState<{ name: string; message: string } | null>(
    null
  )
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const getDevices = async () => {
      await navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .catch(err => {
          setError({ name: err.name, message: err.message })
        })
      setLoading(true)
      navigator.mediaDevices
        .enumerateDevices()
        .then(devices => {
          const mics = devices.filter(device => device.kind === 'audioinput')
          setMicrophones(mics)
          setLoading(false)
        })
        .catch(err => {
          setError({ name: err.name, message: err.message })
          setLoading(false)
        })
    }

    getDevices()
  }, [])

  return { microphones, error, loading }
}
