import { FC } from 'react'
import { useFetchMicrophones } from '../../../../hooks/use-get-microphones'
import { FormControl, MenuItem, Select, Typography } from '@mui/material'

export const MicrophoneSelector: FC<{
  activeMicrophone: MediaDeviceInfo | null
  onChange: (mic: MediaDeviceInfo) => void
  fullWidth?: boolean
}> = ({ onChange, activeMicrophone, fullWidth = false }) => {
  const { loading, error, microphones } = useFetchMicrophones()

  const handleChange = (event: { target: { value: string } }) => {
    const activeMic = microphones.find(m => m.deviceId === event.target.value)
    if (activeMic) {
      onChange(activeMic)
    }
  }

  if (loading) {
    return <h1>Wotwołać ...</h1>
  }

  if (error) {
    if (error.name === 'NotAllowedError') {
      return <h3>Prošu aktiwěruj twoj mikro w nastajenjach.</h3>
    }
    return <h1>{error.message}</h1>
  }

  return (
    <FormControl
      sx={{
        backgroundColor: 'var(--input-bg)',
        borderRadius: 1,
        width: fullWidth ? '100%' : 'auto',
      }}
    >
      <Select
        value={activeMicrophone?.deviceId || ''}
        defaultValue={''}
        displayEmpty
        onChange={handleChange}
      >
        <MenuItem disabled value={''} key={'Mikro0'}>
          <Typography variant='body1' color='var(--text-secondary)'>
            Wuzwoleny Mikrofon
          </Typography>
        </MenuItem>
        {microphones.map(mic => (
          <MenuItem key={mic.deviceId} value={mic.deviceId}>
            {mic.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
