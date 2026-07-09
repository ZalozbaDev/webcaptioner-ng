import { lazy } from 'react'
import { defaultRoutes } from './default-routes'
import { Navigate } from 'react-router-dom'
import { legalStandaloneRoutes } from './legal-routes'

const MainScreen = lazy(() => import('../features/main-screen'))

export const userRoutes = [
  ...defaultRoutes,
  {
    path: '/',
    element: <MainScreen />,
  },
  ...legalStandaloneRoutes,
  { path: '*', element: <Navigate to='/' /> },
]
