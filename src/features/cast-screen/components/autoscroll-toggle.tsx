import { Box, FormControlLabel, Switch, Typography } from '@mui/material'
import { FC } from 'react'

export const AutoscrollToggle: FC<{
  autoscroll: boolean
  setAutoscroll: (autoscroll: boolean) => void
}> = ({ autoscroll, setAutoscroll }) => {
  return (
    <Box
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '4px',
        padding: '8px 12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <FormControlLabel
        control={
          <Switch
            checked={autoscroll}
            onChange={e => setAutoscroll(e.target.checked)}
            size='small'
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: '#1976d2',
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#1976d2',
              },
              '& .MuiSwitch-root': {
                width: 32,
                height: 18,
              },
              '& .MuiSwitch-thumb': {
                width: 14,
                height: 14,
              },
            }}
          />
        }
        label={
          <Typography
            variant='caption'
            sx={{
              color: 'black',
              fontWeight: 500,
              fontSize: '0.75rem',
              marginLeft: 0.5,
            }}
          >
            Auto-scroll
          </Typography>
        }
        sx={{ margin: 0 }}
      />
    </Box>
  )
}
