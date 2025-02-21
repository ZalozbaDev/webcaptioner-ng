import { RecordVoiceOver, History } from '@mui/icons-material'

export const adminSections = [
  {
    title: 'Webcaptioner',
    items: [
      {
        title: 'Record',
        path: '/',
        icon: <RecordVoiceOver fontSize='small' />,
      },
      {
        title: 'Historia',
        path: '/history',
        icon: <History fontSize='small' />,
      },
    ],
  },
]
