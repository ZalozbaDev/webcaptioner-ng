import { createContext, useEffect, useState } from 'react'
import type { FC, ReactNode } from 'react'
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
    const authenticated =
      window.localStorage.getItem('isAuthenticated') === 'true' || false
    setIsAuthenticated(authenticated)
  }, [])

  const login = (password: string) => {
    if (password === process.env.REACT_APP_PASSWORD) {
      setIsAuthenticated(true)
      window.localStorage.setItem('isAuthenticated', 'true')
      return true
    }
    return false
  }

  const logout = () => {
    window.localStorage.removeItem('isAuthenticated')
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
