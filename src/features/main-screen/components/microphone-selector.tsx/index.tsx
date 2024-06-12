import { FC } from 'react'
import { useFetchMicrophones } from '../../../../hooks/use-get-microphones'
import { FormControl, MenuItem, Select } from '@mui/material'

export const MicrophoneSelector: FC<{
  activeMicrophone: MediaDeviceInfo | null
  onChange: (mic: MediaDeviceInfo) => void
}> = ({ onChange, activeMicrophone }) => {
  const { loading, error, microphones } = useFetchMicrophones()

  const handleChange = (event: { target: { value: string } }) => {
    const activeMic = microphones.find((m) => m.deviceId === event.target.value)
    if (activeMic) {
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
        value={activeMicrophone?.deviceId || ''}
        defaultValue={''}
        displayEmpty
        onChange={handleChange}
      >
        <MenuItem disabled value={''}>
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
