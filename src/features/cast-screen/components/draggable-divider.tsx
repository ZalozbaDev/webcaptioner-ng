import { Box } from '@mui/material'

interface DraggableDividerProps {
  onMouseDown: (e: React.MouseEvent) => void
  isDragging: boolean
  textFieldSize: number
}

export const DraggableDivider = ({
  onMouseDown,
  isDragging,
  textFieldSize,
}: DraggableDividerProps) => {
  return (
    <Box
      sx={{
        height: '12px',
        cursor: 'ns-resize',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transition: 'background-color 0.2s ease',
        '&::before': {
          content: '""',
          width: '50px',
          height: '6px',
          backgroundColor: 'rgba(207, 207, 207, 0.602)',
          borderRadius: '3px',
          transition: 'background-color 0.2s ease',
        },
      }}
      onMouseDown={onMouseDown}
      title='Drag to resize text fields'
    >
      {/* Size indicator during dragging */}
      {isDragging && (
        <Box
          sx={{
            position: 'absolute',
            top: '-30px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            zIndex: 1000,
          }}
        >
          {Math.round(textFieldSize)}% / {Math.round(100 - textFieldSize)}%
        </Box>
      )}
    </Box>
  )
}
