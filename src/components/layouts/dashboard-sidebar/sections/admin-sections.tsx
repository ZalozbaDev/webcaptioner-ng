import { Event, Home, HowToReg, Person, PersonAddAlt1 } from '@mui/icons-material'

export const adminSections = [
  {
    title: 'Home',
    items: [{ title: 'Home', path: '/', icon: <Home fontSize='small' /> }]
  },
  {
    title: 'Persons',
    items: [
      {
        title: 'Overview',
        path: '/persons/true',
        icon: <HowToReg fontSize='small' />
      },
      {
        title: 'Unlock',
        path: '/persons/false',
        icon: <PersonAddAlt1 fontSize='small' />
      },
      {
        title: 'Add new',
        path: '/register',
        icon: <Person fontSize='small' />
      }
    ]
  },
  {
    title: 'Purchases',
    items: [
      {
        title: 'Overview',
        path: '/purchases',
        icon: <Home fontSize='small' />
      },
      {
        title: 'Stats',
        path: '/purchases/stats',
        icon: <Event fontSize='small' />
      },
      {
        title: 'New purchase',
        path: '/create-purchase',
        icon: <Event fontSize='small' />
      }
    ]
  }
]
