import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

const LoginWithEmail = lazy(() => import('../features/auth/login-with-email'))
const Login = lazy(() => import('../features/auth/login'))
const Register = lazy(() => import('../features/auth/register'))
const ForgotPassword = lazy(() => import('../features/auth/forgot-password'))
const GuestGuard = lazy(() => import('../components/guards/guest-guard'))
const CastScreen = lazy(() => import('../features/cast-screen'))

export const defaultRoutes = [
  {
    path: 'authentication',
    children: [
      {
        path: 'login-with-email',
        element: (
          <GuestGuard>
            <LoginWithEmail />
          </GuestGuard>
        ),
      },
      {
        path: 'login',
        element: (
          <GuestGuard>
            <Login />
          </GuestGuard>
        ),
      },
      {
        path: 'register',
        element: (
          <GuestGuard>
            <Register />
          </GuestGuard>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <GuestGuard>
            <ForgotPassword />
          </GuestGuard>
        ),
      },
    ],
  },
  {
    path: 'cast',
    element: <CastScreen />,
  },
  {
    path: 'cast/:token',
    element: <CastScreen />,
  },
  {
    path: 'login',
    element: <Navigate to='/authentication/login' />,
  },
  { path: '*', element: <Navigate to='/authentication/login' /> },
  // {
  //   path: 'imprint',
  //   element: <Imprint />
  // },
  // {
  //   path: 'data-protection',
  //   element: <DataProtection />
  // }
]
