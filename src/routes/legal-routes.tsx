import { lazy } from 'react'

const ImpressumPage = lazy(() => import('../features/legal/impressum'))
const DatenschutzPage = lazy(() => import('../features/legal/datenschutz'))

/** Standalone route objects for free-password (userRoutes) login. */
export const legalStandaloneRoutes = [
  {
    path: 'impressum',
    element: <ImpressumPage />,
  },
  {
    path: 'datenschutz',
    element: <DatenschutzPage />,
  },
]

/** Child route objects for DashboardLayout (registered / admin). */
export const legalDashboardChildren = [
  {
    path: 'impressum',
    element: <ImpressumPage />,
  },
  {
    path: 'datenschutz',
    element: <DatenschutzPage />,
  },
]
