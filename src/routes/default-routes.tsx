import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

const LoginWithEmail = lazy(() => import('../features/auth/login-with-email'))
const Login = lazy(() => import('../features/auth/login'))
// const PasswordRecovery = lazy(() => import('../features/authentication/password-recovery'))
// const PasswordReset = lazy(() => import('../features/authentication/password-reset'))
// const Register = lazy(() => import('../features/authentication/register'))
// const VerifyCode = lazy(() => import('../features/authentication/verify-code'))
const GuestGuard = lazy(() => import('../components/guards/guest-guard'))

// const Imprint = lazy(() => import('../features/imprint'))
// const DataProtection = lazy(() => import('../features/data-protection'))

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
      // {
      //   path: 'password-recovery',
      //   element: <PasswordRecovery />
      // },
      // {
      //   path: 'password-reset',
      //   element: <PasswordReset />
      // },
      // {
      //   path: 'register',
      //   element: (
      //     <GuestGuard>
      //       <Register />
      //     </GuestGuard>
      //   )
      // },
      // {
      //   path: 'verify-code',
      //   element: <VerifyCode />
      // }
    ],
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
