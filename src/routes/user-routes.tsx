import { lazy } from 'react'
import { defaultRoutes } from './default-routes'
import { Navigate } from 'react-router-dom'

const MainScreen = lazy(() => import('../features/main-screen'))

export const userRoutes = [
  ...defaultRoutes,
  {
    path: '/',
    element: <MainScreen />,
  },
  { path: '*', element: <Navigate to='/' /> },
]
