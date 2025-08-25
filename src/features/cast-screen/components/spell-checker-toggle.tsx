import { IconButton, Tooltip } from '@mui/material'
import { Spellcheck } from '@mui/icons-material'

interface SpellCheckerToggleProps {
  spellCheckerEnabled: boolean
  setSpellCheckerEnabled: (enabled: boolean) => void
}

export const SpellCheckerToggle = ({
  spellCheckerEnabled,
  setSpellCheckerEnabled,
}: SpellCheckerToggleProps) => {
  const handleToggle = () => {
    setSpellCheckerEnabled(!spellCheckerEnabled)
  }

  return (
    <Tooltip
      title={spellCheckerEnabled ? 'Spell checker on' : 'Spell checker off'}
    >
      <IconButton
        onClick={handleToggle}
        size='small'
        sx={{
          color: spellCheckerEnabled
            ? 'var(--accent-color)'
            : 'var(--text-secondary)',
          backgroundColor: spellCheckerEnabled
            ? 'var(--accent-bg)'
            : 'transparent',
          padding: '8px',
          borderRadius: '8px',
          '&:hover': {
            backgroundColor: spellCheckerEnabled
              ? 'var(--accent-hover)'
              : 'var(--button-hover)',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <Spellcheck sx={{ fontSize: '1.2rem' }} />
      </IconButton>
    </Tooltip>
  )
}
