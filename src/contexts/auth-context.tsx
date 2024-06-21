import { createContext, useEffect, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { localStorage } from '../lib/local-storage'
interface State {
  isAuthenticated: boolean
}

interface AuthContextValue extends State {
  login: (password: string) => boolean
  logout: () => void
}

interface AuthProviderProps {
  children: ReactNode
}

const initialState: State = {
  isAuthenticated: false,
}

const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  login: () => false,
  logout: () => {},
})

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setIsAuthenticated(localStorage.isAuthenticated)
  }, [])

  const login = (password: string) => {
    if (password === process.env.REACT_APP_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.setIsAuthenticated(false)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
