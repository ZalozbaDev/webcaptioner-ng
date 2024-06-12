import { Clear } from '@mui/icons-material'
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
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
  url: string | undefined
  onSave: (url: string) => void
}> = ({ anchorEl, open, disabled, onClose, url, onSave }) => {
  const [tempUrl, setTempUrl] = useState<string>(url ?? '')

  const onHandleClose = () => {
    onClose()
    // setTempUrl(url ?? '')
  }

  useEffect(() => {
    setTempUrl(url ?? '')
  }, [url, open, anchorEl])

  return (
    <Menu
      onClose={onHandleClose}
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
          Youtube Link:
        </Typography>

        <TextField
          placeholder='http://upload.youtube./com/closedcaption?cid=1234-5678-9012-3456'
          value={tempUrl}
          fullWidth
          onChange={(e) => setTempUrl(e.target.value)}
          InputProps={{
            endAdornment: tempUrl.length > 0 && (
              <IconButton onClick={() => setTempUrl('')}>
                <Clear />
              </IconButton>
            ),
          }}
        />

        <Button onClick={() => onSave(tempUrl)}>Save</Button>
        <Button onClick={onHandleClose}>Cancel</Button>
      </MenuList>
    </Menu>
  )
}
