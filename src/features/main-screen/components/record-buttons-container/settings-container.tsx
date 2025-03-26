import {
  Checkbox,
  Divider,
  Input,
  Menu,
  MenuItem,
  MenuList,
  Select,
  Typography,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
} from '@mui/material'
import { FC } from 'react'
import { MicrophoneSelector } from '../microphone-selector.tsx'
import { parseSotraModelToText } from '../../../../helper/text-parser'
import { Settings } from '../../../../types/settings'

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
  options: { title: string; value: string | number }[],
  onSetValue: (value: string | number) => void
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
          onChange={newValue => onSetValue(newValue.target.value)}
        >
          {options.map(option => (
            <MenuItem value={option.value}>{option.title}</MenuItem>
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
  options?: { title: string; value: string | number }[]
}[] = [
  { key: 'bufferSize', title: 'Buffer Size', editable: true },
  { key: 'channelCount', title: 'Channel Count', editable: false },
  {
    key: 'sampleRate',
    title: 'Sample Rate',
    editable: true,
    options: [
      { title: '16000', value: 16000 },
      { title: '48000', value: 48000 },
    ],
  },
  { key: 'sampleSize', title: 'Sample Size', editable: false },
  { key: 'deviceId', title: 'Device ID', editable: false },
]

const menuSelectionItems: {
  key: keyof Settings
  title: string
  options: { title: string; value: string }[]
}[] = [
  {
    key: 'sotraModel',
    title: 'Sotra Model',
    options: [
      { title: parseSotraModelToText('ctranslate'), value: 'ctranslate' },
      { title: parseSotraModelToText('fairseq'), value: 'fairseq' },
      { title: parseSotraModelToText('passthrough'), value: 'passthrough' },
    ],
  },
]

export const SettingsContainer: FC<{
  anchorEl: null | HTMLElement
  open: boolean
  disabled: boolean
  onClose: () => void
  settings: Settings
  onChangeSetting: (key: keyof Settings, value: any) => void
  onChangeMicrophone: (mic: MediaDeviceInfo) => void
  activeMicrophone: MediaDeviceInfo | null
  speakers: BamborakSpeaker[]
}> = ({
  anchorEl,
  open,
  disabled,
  onClose,
  settings,
  onChangeSetting,
  onChangeMicrophone,
  activeMicrophone,
  speakers,
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
        {menuTextItems.map(({ key, title, editable, options }) => {
          const setting = settings[key]
          if (setting !== undefined && typeof setting !== 'boolean') {
            if (options) {
              return menuItemWithSelection(
                key,
                title,
                setting,
                disabled,
                options,
                value => onChangeSetting(key, value)
              )
            } else {
              return menuitemWithText(
                key,
                title,
                setting,
                disabled,
                editable,
                value => onChangeSetting(key, value)
              )
            }
          }
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
        <FormControlLabel
          control={
            <Switch
              checked={settings.autoPlayAudio}
              onChange={e => onChangeSetting('autoPlayAudio', e.target.checked)}
            />
          }
          disabled={disabled}
          sx={{ paddingInline: 3 }}
          label='Audio přełožk'
        />
        {settings.autoPlayAudio && (
          <MenuItem disabled={disabled}>
            <FormControl
              margin='normal'
              sx={{
                backgroundColor: 'white',
                borderRadius: 1,
                width: '100%',
              }}
              disabled={disabled}
            >
              <InputLabel>Rěčnik</InputLabel>
              <Select
                value={settings.selectedSpeakerId}
                onChange={e =>
                  onChangeSetting('selectedSpeakerId', e.target.value)
                }
                label='Rěčnik'
              >
                {speakers.map(speaker => (
                  <MenuItem key={speaker.id} value={speaker.id}>
                    {speaker.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </MenuItem>
        )}
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
