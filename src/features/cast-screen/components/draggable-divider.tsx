import { Box } from '@mui/material'

interface DraggableDividerProps {
  onMouseDown: (e: React.MouseEvent) => void
  onTouchStart: (e: React.TouchEvent) => void
  isDragging: boolean
  textFieldSize: number
}

export const DraggableDivider = ({
  onMouseDown,
  onTouchStart,
  isDragging,
  textFieldSize,
}: DraggableDividerProps) => {
  return (
    <Box
      sx={{
        height: { xs: '20px', sm: '12px' }, // Larger touch area on mobile
        cursor: 'ns-resize',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transition: 'background-color 0.2s ease',
        touchAction: 'none', // Prevent default touch behaviors
        '&:hover': {
          '&::before': {
            backgroundColor: 'rgba(150, 150, 150, 0.8)',
          },
        },
        '&:active': {
          '&::before': {
            backgroundColor: 'rgba(100, 100, 100, 0.9)',
          },
        },
        '&::before': {
          content: '""',
          width: { xs: '60px', sm: '50px' }, // Wider on mobile for better touch target
          height: { xs: '8px', sm: '6px' }, // Slightly taller on mobile
          backgroundColor: 'rgba(207, 207, 207, 0.602)',
          borderRadius: { xs: '4px', sm: '3px' },
          transition: 'background-color 0.2s ease',
        },
      }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
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
            color: 'var(--text-primary)',
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
