import {
  Checkbox,
  Divider,
  Menu,
  MenuItem,
  MenuList,
  Typography,
} from '@mui/material'
import { FC } from 'react'
import { MicrophoneSelector } from '../microphone-selector.tsx'

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
  onChangeMicrophone: (mic: MediaDeviceInfo) => void
  activeMicrophone: MediaDeviceInfo | null
}> = ({
  anchorEl,
  open,
  onClose,
  settings,
  onChangeSetting,
  onChangeMicrophone,
  activeMicrophone,
}) => {
  return (
    <Menu
      onClose={onClose}
      anchorEl={anchorEl}
      open={open}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mt: 1.5,
          '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          '&::before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuList dense>
        <Typography variant='body1' textAlign='right' paddingRight={1}>
          Zastajenja
        </Typography>

        <MenuItem
          sx={{ marginLeft: -1 }}
          onClick={() =>
            onChangeSetting('autoGainControl', !settings.autoGainControl)
          }
        >
          <Checkbox checked={settings.autoGainControl} />
          <Typography variant='body2'>Auto Gain Control</Typography>
        </MenuItem>
        <MenuItem
          sx={{ marginLeft: -1 }}
          onClick={() =>
            onChangeSetting('noiseSuppression', !settings.noiseSuppression)
          }
        >
          <Checkbox checked={settings.noiseSuppression} />
          <Typography variant='body2'>Noise Supression</Typography>
        </MenuItem>
        <MenuItem
          sx={{ marginLeft: -1 }}
          onClick={() =>
            onChangeSetting('echoCancellation', !settings.echoCancellation)
          }
        >
          <Checkbox checked={settings.echoCancellation} />
          <Typography variant='body2'>Echo Cancellation</Typography>
        </MenuItem>
        <Divider />
        <MenuItem>
          <MicrophoneSelector
            activeMicrophone={activeMicrophone}
            onChange={onChangeMicrophone}
          />
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
