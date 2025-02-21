import { lazy } from 'react'
import DashboardLayout from '../components/layouts/dashboard-layout'
import { defaultRoutes } from './default-routes'

const AuthGuard = lazy(() => import('../components/guards/auth-guard'))
const MainScreen = lazy(() => import('../features/main-screen'))
const HistoryScreen = lazy(() => import('../features/history-screen'))

// const Overview = lazy(() => import('../features/overview/admin'))
// const RegisterPerson = lazy(() => import('../features/persons/register'))
// const PersonsOverview = lazy(() => import('../features/persons/overview'))
// const PersonOverview = lazy(() => import('../features/persons/detail'))

export const adminRoutes = [
  ...defaultRoutes,
  {
    path: '*',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: '',
        element: <MainScreen />,
      },
      {
        path: 'history',
        element: <HistoryScreen />,
      },
      // {
      //   path: 'search',
      //   element: <SearchPersons />,
      // },
      { path: '*', element: <MainScreen /> },
    ],
  },
]
