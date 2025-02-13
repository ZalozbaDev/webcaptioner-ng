import type { FC, ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import useAuth from '../../../hooks/use-auth'

const GuestGuard: FC<{
  children: ReactNode
}> = ({ children }) => {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to='/' />
  }

  return <>{children}</>
}

export default GuestGuard
