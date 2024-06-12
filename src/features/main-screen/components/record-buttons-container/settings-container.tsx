import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Popover,
} from '@mui/material'
import { FC } from 'react'

export type Settings = {
  autoGainControl: boolean
  noiseSuppression: boolean
  echoCancellation: boolean
  channelCount: number
  sampleRate: number
  sampleSize: number
  deviceId: undefined | string
}

export const SettingsContainer: FC<{
  anchorEl: null | HTMLElement
  open: boolean
  onClose: () => void
  settings: Settings
  onChangeSetting: (key: keyof Settings, value: boolean) => void
}> = ({ anchorEl, open, onClose, settings, onChangeSetting }) => {
  return (
    <Popover
      onClose={onClose}
      anchorEl={anchorEl}
      open={open}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <FormGroup title='Zastajenja' sx={{ padding: 1 }}>
        <FormLabel>Zastajenja</FormLabel>
        <FormControlLabel
          control={
            <Checkbox
              checked={settings.autoGainControl}
              onChange={(e) =>
                onChangeSetting('autoGainControl', e.target.checked)
              }
            />
          }
          label='Auto Gain Control'
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={settings.noiseSuppression}
              onChange={(e) =>
                onChangeSetting('noiseSuppression', e.target.checked)
              }
            />
          }
          label='Noise Suppression'
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={settings.echoCancellation}
              onChange={(e) =>
                onChangeSetting('echoCancellation', e.target.checked)
              }
            />
          }
          label='Echo Cancellation'
        />
      </FormGroup>
    </Popover>
  )
}
