import { Clear } from '@mui/icons-material'
import {
  Box,
  Button,
  IconButton,
  Input,
  Menu,
  MenuList,
  TextField,
  Typography,
} from '@mui/material'
import { FC, useEffect, useState } from 'react'

export type YoutubeSettings = {
  streamingKey: string | undefined
  timeOffset: number
}

export const YoutubeContainer: FC<{
  anchorEl: null | HTMLElement
  open: boolean
  disabled: boolean
  onClose: () => void
  settings: YoutubeSettings
  onSave: (settings: YoutubeSettings) => void
}> = ({ anchorEl, open, disabled, onClose, settings, onSave }) => {
  const [tempSettings, setTempSettings] = useState<YoutubeSettings>({
    streamingKey: settings.streamingKey ?? '',
    timeOffset: settings.timeOffset,
  })

  useEffect(() => {
    setTempSettings({
      streamingKey: settings.streamingKey ?? '',
      timeOffset: settings.timeOffset,
    })
  }, [settings, open, anchorEl])

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
      <MenuList dense sx={{ width: 600, padding: 1 }}>
        <Typography variant='body1' gutterBottom>
          Youtube Streamkluč:
        </Typography>

        <TextField
          placeholder='1234-5678-9012-3456'
          value={tempSettings.streamingKey}
          fullWidth
          disabled={disabled}
          onChange={(e) =>
            setTempSettings((prev) => ({
              ...prev,
              streamingKey: e.target.value,
            }))
          }
          InputProps={{
            endAdornment: tempSettings.streamingKey!.length > 0 && (
              <IconButton
                disabled={disabled}
                onClick={() =>
                  setTempSettings((prev) => ({ ...prev, streamingKey: '' }))
                }
              >
                <Clear />
              </IconButton>
            ),
          }}
        />

        <Box>
          <Typography variant='body2'>Časowy offset (s):</Typography>
          <Input
            size='small'
            sx={{ width: 70, marginLeft: 1, textAlign: 'right' }}
            type='number'
            defaultValue={tempSettings.timeOffset}
            title='Časowy offset (s)'
            onChange={(newValue) =>
              setTempSettings((prev) => ({
                ...prev,
                timeOffset: newValue.target.value as unknown as number,
              }))
            }
          />
        </Box>
        <Button disabled={disabled} onClick={() => onSave(tempSettings)}>
          Save
        </Button>
        <Button disabled={disabled} onClick={onClose}>
          Cancel
        </Button>
      </MenuList>
    </Menu>
  )
}
