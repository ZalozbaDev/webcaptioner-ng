import type { FC, ReactNode } from 'react'
import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../../../hooks/use-auth'

const AuthGuard: FC<{
  children: ReactNode
}> = ({ children }) => {
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const [requestedLocation, setRequestedLocation] = useState<string | null>(
    null
  )

  if (!isAuthenticated) {
    if (location.pathname !== requestedLocation) {
      setRequestedLocation(location.pathname)
    }

    return <Navigate to='authentication/login' />
  }

  // This is done so that in case the route changes by any chance through other
  // means between the moment of request and the render we navigate to the initially
  // requested route.
  if (requestedLocation && location.pathname !== requestedLocation) {
    setRequestedLocation(null)
    return <Navigate to={requestedLocation} />
  }

  return <>{children}</>
}

export default AuthGuard
