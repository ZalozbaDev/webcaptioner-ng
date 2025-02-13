import { lazy } from 'react'
import DashboardLayout from '../components/layouts/dashboard-layout'
import { defaultRoutes } from './default-routes'

const AuthGuard = lazy(() => import('../components/guards/auth-guard'))

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
      // {
      //   path: '',
      //   element: <Overview />
      // },
      // {
      //   path: 'register',
      //   element: <RegisterPerson />
      // },
      // {
      //   path: 'persons/:unlocked',
      //   element: <PersonsOverview />
      // },
      // {
      //   path: 'person/:id',
      //   element: <PersonOverview />
      // },
      // { path: '*', element: <Overview /> }
    ],
  },
]
