import { RecordVoiceOver, History, Gavel, PrivacyTip } from '@mui/icons-material'

export const userSections = [
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
  {
    title: 'Rechtliches',
    items: [
      {
        title: 'Impressum',
        path: '/impressum',
        icon: <Gavel fontSize='small' />,
      },
      {
        title: 'Datenschutz',
        path: '/datenschutz',
        icon: <PrivacyTip fontSize='small' />,
      },
    ],
  },
]
