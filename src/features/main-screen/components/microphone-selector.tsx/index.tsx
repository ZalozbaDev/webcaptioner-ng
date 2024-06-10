import { FC, useState } from 'react'
import { useFetchMicrophones } from '../../../../hooks/use-get-microphones'
import { FormControl, MenuItem, Select } from '@mui/material'

export const MicrophoneSelector: FC<{
  onChange: (mic: MediaDeviceInfo) => void
}> = ({ onChange }) => {
  const { loading, error, microphones } = useFetchMicrophones()
  const [activeMicrophone, setActiveMicrophone] = useState<MediaDeviceInfo>()

  const handleChange = (event: { target: { value: string } }) => {
    const activeMic = microphones.find((m) => m.deviceId === event.target.value)
    if (activeMic) {
      setActiveMicrophone(activeMic)
      onChange(activeMic)
    }
  }

  if (loading) {
    return <h1>Loading...</h1>
  }

  if (error) {
    return <h1>{error}</h1>
  }

  return (
    <FormControl sx={{ backgroundColor: 'white', borderRadius: 1 }}>
      <Select
        value={activeMicrophone?.deviceId}
        defaultValue='Wuzwoleny Mikrofon'
        displayEmpty
        onChange={handleChange}
      >
        <MenuItem disabled value='Wuzwoleny Mikrofon'>
          <em>Wuzwoleny Mikrofon</em>
        </MenuItem>
        {microphones.map((mic) => (
          <MenuItem key={mic.deviceId} value={mic.deviceId}>
            {mic.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
