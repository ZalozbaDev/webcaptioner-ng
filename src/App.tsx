import React, { useMemo } from 'react'
import './App.css'
import { MainScreen } from './features/main-screen'
import { LoginScreen } from './features/auth/login'
import { Toaster } from 'sonner'
import useAuth from './hooks/use-auth'

function App() {
  const { isAuthenticated } = useAuth()

  const content = useMemo(() => {
    return isAuthenticated ? <MainScreen /> : <LoginScreen />
  }, [isAuthenticated])

  return (
    <div className='App'>
      <Toaster />
      {content}
    </div>
  )
}

export default App
