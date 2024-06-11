import { Mic, Pause, Stop } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'
import { FC, useEffect, useMemo, useState } from 'react'
import { Visualizer } from 'react-sound-visualizer'
import { getDurationFromSeconds } from '../../../../helper/date-time-helper'

export const RecordButtonsContainer: FC<{
  stream: MediaStream
  isDisabled: { record: boolean; pause: boolean; stop: boolean }
  isRecording: boolean
  onPressRecord: () => void
  onPressPause: () => void
  onPressStop: () => void
}> = ({
  stream,
  isRecording,
  isDisabled,
  onPressRecord,
  onPressPause,
  onPressStop,
}) => {
  const [totalTime, setTotalTime] = useState<number>(0)

  const visualizerArea = useMemo(
    () => (
      <Visualizer
        audio={stream}
        mode='continuous'
        autoStart
        strokeColor='white'
        lineWidth='default'
      >
        {({ canvasRef }) => <canvas ref={canvasRef} height={100} />}
      </Visualizer>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stream]
  )

  useEffect(() => {
    if (isRecording) {
      const interval = setTimeout(() => {
        setTotalTime((prev) => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [totalTime, isRecording])

  return (
    <Box
      sx={{
        backgroundColor: 'clear',
        borderRadius: 2,
        border: '2px white solid',
        minWidth: 300,
      }}
    >
      <Typography variant='body1' textAlign='end' paddingRight={2}>
        Čas: {getDurationFromSeconds(totalTime)}
      </Typography>
      {visualizerArea}

      <Box>
        <Button
          onClick={onPressRecord}
          disabled={isDisabled.record}
          size='large'
          sx={{
            '&.Mui-disabled': { color: 'gray', borderColor: 'white' },
            color: 'white',
            height: 40,
            borderColor: 'white',
            borderTop: 2,
            borderRight: 1,
            borderRadius: 0,
          }}
        >
          <Mic fontSize='small' />
          <Typography variant='body2'>Start</Typography>
        </Button>
        <Button
          onClick={onPressPause}
          disabled={isDisabled.pause}
          size='large'
          sx={{
            '&.Mui-disabled': { color: 'gray', borderColor: 'white' },
            color: 'white',
            height: 40,
            borderColor: 'white',
            borderTop: 2,
            borderLeft: 1,
            borderRight: 1,
            borderRadius: 0,
          }}
        >
          <Pause fontSize='small' />
          <Typography variant='body2'>Prestalka</Typography>
        </Button>
        <Button
          onClick={() => {
            onPressStop()
            setTotalTime(0)
          }}
          disabled={isDisabled.stop}
          size='large'
          sx={{
            '&.Mui-disabled': { color: 'gray', borderColor: 'white' },
            color: 'white',
            height: 40,
            borderColor: 'white',
            borderTop: 2,
            borderLeft: 1,
            borderRadius: 0,
          }}
        >
          <Stop fontSize='small' />
          <Typography variant='body2'>Stop</Typography>
        </Button>
      </Box>
    </Box>
  )
}
