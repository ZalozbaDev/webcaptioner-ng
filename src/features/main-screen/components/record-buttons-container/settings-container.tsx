import {
  Checkbox,
  Divider,
  Input,
  Menu,
  MenuItem,
  MenuList,
  Select,
  Typography,
} from '@mui/material'
import { FC } from 'react'
import { MicrophoneSelector } from '../microphone-selector.tsx'
import { parseSotraModelToText } from '../../../../helper/text-parser'

export type Settings = {
  autoGainControl: boolean
  noiseSuppression: boolean
  echoCancellation: boolean
  channelCount: number
  sampleRate: number
  sampleSize: number
  deviceId: undefined | string
  bufferSize: number
  sotraModel: SotraModel
}

const menuItemWithCheckbox = (
  key: string,
  disabled: boolean,
  checked: boolean,
  title: string,
  onSetChecked: (value: boolean) => void
) => (
  <MenuItem disabled={disabled} sx={{ marginLeft: -1, height: 30 }} key={key}>
    <Checkbox
      checked={checked}
      onChange={event => onSetChecked(event.target.checked)}
    />
    <Typography variant='body2'>{title}</Typography>
  </MenuItem>
)

const menuItemWithSelection = (
  key: string,
  title: string,
  value: string | number,
  disabled: boolean,
  options: SotraModel[],
  onSetValue: (value: number) => void
) => (
  <MenuItem
    disabled={disabled}
    sx={{
      marginLeft: 1,
      paddingRight: 4,
      height: 30,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    }}
    key={key}
  >
    {disabled ? (
      <>
        <Typography variant='body2'>{title}:</Typography>
        <Typography variant='body2'>{value}</Typography>
      </>
    ) : (
      <>
        <Typography variant='body2'>{title}:</Typography>
        <Select
          size='small'
          sx={{ marginLeft: 1, textAlign: 'right' }}
          type='number'
          defaultValue={value}
          title={title}
          onChange={newValue =>
            onSetValue(newValue.target.value as unknown as number)
          }
        >
          {options.map(option => (
            <MenuItem value={option}>{parseSotraModelToText(option)}</MenuItem>
          ))}
        </Select>
      </>
    )}
  </MenuItem>
)

const menuitemWithText = (
  key: string,
  title: string,
  value: string | number,
  disabled: boolean,
  editable: boolean,
  onSetValue: (value: number) => void
) => (
  <MenuItem
    disabled={disabled}
    sx={{
      marginLeft: 1,
      paddingRight: 4,
      height: 30,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    }}
    key={key}
  >
    {disabled || !editable ? (
      <>
        <Typography variant='body2'>{title}:</Typography>
        <Typography variant='body2'>{value}</Typography>
      </>
    ) : (
      <>
        <Typography variant='body2'>{title}:</Typography>
        <Input
          size='small'
          sx={{ width: 70, marginLeft: 1, textAlign: 'right' }}
          type='number'
          defaultValue={value}
          title={title}
          onChange={newValue =>
            onSetValue(newValue.target.value as unknown as number)
          }
        />
      </>
    )}
  </MenuItem>
)

const checkboxes: { key: keyof Settings; title: string }[] = [
  { key: 'autoGainControl', title: 'Auto Gain Control' },
  { key: 'noiseSuppression', title: 'Noise Suppression' },
  { key: 'echoCancellation', title: 'Echo Cancellation' },
]

const menuTextItems: {
  key: keyof Settings
  title: string
  editable: boolean
}[] = [
  { key: 'bufferSize', title: 'Buffer Size', editable: true },
  { key: 'channelCount', title: 'Channel Count', editable: false },
  { key: 'sampleRate', title: 'Sample Rate', editable: false },
  { key: 'sampleSize', title: 'Sample Size', editable: false },
  { key: 'deviceId', title: 'Device ID', editable: false },
]

const menuSelectionItems: {
  key: keyof Settings
  title: string
  options: SotraModel[]
}[] = [
  {
    key: 'sotraModel',
    title: 'Sotra Model',
    options: ['ctranslate', 'fairseq', 'passthrough'],
  },
]

export const SettingsContainer: FC<{
  anchorEl: null | HTMLElement
  open: boolean
  disabled: boolean
  onClose: () => void
  settings: Settings
  onChangeSetting: (key: keyof Settings, value: boolean | number) => void
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
            key,
            disabled,
            typeof setting !== 'boolean' ? false : setting,
            title,
            value => onChangeSetting(key, value)
          )
        })}
        {menuTextItems.map(({ key, title, editable }) => {
          const setting = settings[key]
          if (setting !== undefined && typeof setting !== 'boolean')
            return menuitemWithText(
              key,
              title,
              setting,
              disabled,
              editable,
              value => onChangeSetting(key, value)
            )
          return null
        })}
        {menuSelectionItems.map(({ key, title, options }) => {
          const setting = settings[key]
          if (setting !== undefined && typeof setting !== 'boolean')
            return menuItemWithSelection(
              key,
              title,
              setting,
              disabled,
              options,
              value => onChangeSetting(key, value)
            )
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
