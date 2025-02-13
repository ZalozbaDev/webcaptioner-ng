import { useState } from 'react'
import type { FC, ReactNode } from 'react'
import { NavLink as RouterLink } from 'react-router-dom'
import { ListItemProps, ListItem, Button, Box, Collapse } from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

interface NavItemProps extends ListItemProps {
  active?: boolean
  children?: ReactNode
  depth: number
  icon?: ReactNode
  info?: ReactNode
  open?: boolean
  path?: string
  title: string
}

const NavItem: FC<NavItemProps> = props => {
  const {
    active = false,
    children,
    depth,
    icon,
    info,
    open: openProp = false,
    path,
    title,
    ...other
  } = props
  const [open, setOpen] = useState<boolean>(openProp)

  const handleToggle = (): void => {
    setOpen(prevOpen => !prevOpen)
  }

  let paddingLeft = 16

  if (depth > 0) {
    paddingLeft = 32 + 8 * depth
  }

  // Branch
  if (children) {
    return (
      <ListItem
        disableGutters
        sx={{
          display: 'block',
          py: 0,
        }}
        {...other}
      >
        <Button
          endIcon={
            !open ? (
              <ChevronRightIcon fontSize='small' />
            ) : (
              <ExpandMoreIcon fontSize='small' />
            )
          }
          onClick={handleToggle}
          startIcon={icon}
          sx={{
            color: 'text.secondary',
            fontWeight: 'fontWeightMedium',
            justifyContent: 'flex-start',
            pl: `${paddingLeft}px`,
            pr: '8px',
            py: '12px',
            textAlign: 'left',
            textTransform: 'none',
            width: '100%',
          }}
          variant='text'
        >
          <Box sx={{ flexGrow: 1 }}>{title}</Box>
          {info}
        </Button>
        <Collapse in={open}>{children}</Collapse>
      </ListItem>
    )
  }

  // Leaf
  return (
    <ListItem
      disableGutters
      sx={{
        display: 'flex',
        py: 0,
      }}
    >
      <Button
        component={RouterLink}
        to={path || '#'}
        startIcon={icon}
        sx={{
          color: 'text.secondary',
          fontWeight: 'fontWeightMedium',
          justifyContent: 'flex-start',
          textAlign: 'left',
          pl: `${paddingLeft}px`,
          pr: '8px',
          py: '12px',
          textTransform: 'none',
          width: '100%',
          ...(active && {
            color: 'primary.main',
            fontWeight: 'fontWeightBold',
            '& svg': {
              color: 'primary.main',
            },
          }),
        }}
        variant='text'
      >
        <Box sx={{ flexGrow: 1 }}>{title}</Box>
        {info}
      </Button>
    </ListItem>
  )
}

export default NavItem
