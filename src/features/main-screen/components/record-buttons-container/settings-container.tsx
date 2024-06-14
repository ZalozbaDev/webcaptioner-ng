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

const menuItemWithCheckbox = (
  disabled: boolean,
  checked: boolean,
  title: string,
  onSetChecked: (value: boolean) => void
) => (
  <MenuItem disabled={disabled} sx={{ marginLeft: -1, height: 30 }}>
    <Checkbox
      checked={checked}
      onChange={(event) => onSetChecked(event.target.checked)}
    />
    <Typography variant='body2'>{title}</Typography>
  </MenuItem>
)

const menuitemWithText = (title: string, value: string | number | boolean) => (
  <MenuItem disabled={true} sx={{ marginLeft: 1, height: 30 }}>
    <Typography variant='body2'>
      {title}: {value}
    </Typography>
  </MenuItem>
)

const checkboxes: { key: keyof Settings; title: string }[] = [
  { key: 'autoGainControl', title: 'Auto Gain Control' },
  { key: 'noiseSuppression', title: 'Noise Suppression' },
  { key: 'echoCancellation', title: 'Echo Cancellation' },
]

const menuTextItems: { key: keyof Settings; title: string }[] = [
  { key: 'channelCount', title: 'Channel Count' },
  { key: 'sampleRate', title: 'Sample Rate' },
  { key: 'sampleSize', title: 'Sample Size' },
  { key: 'deviceId', title: 'Device ID' },
]

export const SettingsContainer: FC<{
  anchorEl: null | HTMLElement
  open: boolean
  disabled: boolean
  onClose: () => void
  settings: Settings
  onChangeSetting: (key: keyof Settings, value: boolean) => void
  onChangeMicrophone: (mic: MediaDeviceInfo) => void
  activeMicrophone: MediaDeviceInfo | null
}> = ({
  anchorEl,
  open,
  disabled,
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
          border: '1px solid black',
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mt: 0.5,
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
      <MenuList dense sx={{ width: 300 }}>
        <Typography variant='body1' textAlign='right' paddingRight={1}>
          Zastajenja
        </Typography>
        {checkboxes.map(({ key, title }) => {
          const setting = settings[key]
          return menuItemWithCheckbox(
            disabled,
            typeof setting !== 'boolean' ? false : setting,
            title,
            (value) => onChangeSetting(key, value)
          )
        })}
        {menuTextItems.map(({ key, title }) => {
          const setting = settings[key]
          if (setting !== undefined) return menuitemWithText(title, setting)
          return null
        })}
        <Divider />
        <MenuItem disabled={disabled}>
          <MicrophoneSelector
            activeMicrophone={activeMicrophone}
            onChange={onChangeMicrophone}
            fullWidth
          />
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
