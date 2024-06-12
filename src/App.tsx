import React from 'react'
import './App.css'
import { MainScreen } from './features/main-screen'
import { Toaster } from 'sonner'

function App() {
  return (
    <div className='App'>
      <Toaster />
      <MainScreen />
    </div>
  )
}

export default App
