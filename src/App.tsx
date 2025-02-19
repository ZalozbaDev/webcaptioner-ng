import React from 'react'
import './App.css'
import { Toaster } from 'sonner'
import useAuth from './hooks/use-auth'
import { useRoutes } from 'react-router-dom'
import { userRoutes } from './routes/user-routes'
import { defaultRoutes } from './routes/default-routes'
import { adminRoutes } from './routes/admin-routes'
import { registeredUserRoutes } from './routes/registered-user-routes'

const getRoutesFor = (user: User | null, isAuthenticated: boolean) => {
  if (!user && !isAuthenticated) return defaultRoutes
  if (!user && isAuthenticated) return userRoutes

  switch (user?.role) {
    case 'ADMIN':
      return adminRoutes
    case 'USER':
      return registeredUserRoutes
    default:
      return defaultRoutes
  }
}

function App() {
  const { user, isAuthenticated } = useAuth()
  const content = useRoutes(getRoutesFor(user, isAuthenticated))

  return (
    <div className='App'>
      <Toaster />
      {content}
    </div>
  )
}

export default App
