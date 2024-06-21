import { Clear } from '@mui/icons-material'
import {
  Button,
  IconButton,
  Menu,
  MenuList,
  TextField,
  Typography,
} from '@mui/material'
import { FC, useEffect, useState } from 'react'

export const YoutubeContainer: FC<{
  anchorEl: null | HTMLElement
  open: boolean
  disabled: boolean
  onClose: () => void
  streamingKey: string | undefined
  onSave: (url: string) => void
}> = ({ anchorEl, open, disabled, onClose, streamingKey, onSave }) => {
  const [tempStreamingKey, setTempStreamingKey] = useState<string>(
    streamingKey ?? ''
  )

  useEffect(() => {
    setTempStreamingKey(streamingKey ?? '')
  }, [streamingKey, open, anchorEl])

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
          value={tempStreamingKey}
          fullWidth
          disabled={disabled}
          onChange={(e) => setTempStreamingKey(e.target.value)}
          InputProps={{
            endAdornment: tempStreamingKey.length > 0 && (
              <IconButton
                disabled={disabled}
                onClick={() => setTempStreamingKey('')}
              >
                <Clear />
              </IconButton>
            ),
          }}
        />

        <Button disabled={disabled} onClick={() => onSave(tempStreamingKey)}>
          Save
        </Button>
        <Button disabled={disabled} onClick={onClose}>
          Cancel
        </Button>
      </MenuList>
    </Menu>
  )
}
