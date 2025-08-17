import { createContext, useEffect, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { localStorage } from '../lib/local-storage'
import { axiosInstance } from '../lib/axios'

interface State {
  isAuthenticated: boolean
  user: User | null
}

interface AuthContextValue extends State {
  login: (email: string, password: string) => Promise<void>
  loginFree: (password: string) => Promise<void>
  logout: () => void
}

interface AuthProviderProps {
  children: ReactNode
}

const initialState: State = {
  isAuthenticated: false,
  user: null,
}

const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  login: () => Promise.resolve(),
  loginFree: () => Promise.resolve(),
  logout: () => {},
})

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.isAuthenticated()
  )
  const [user, setUser] = useState(initialState.user)

  useEffect(() => {
    // setIsAuthenticated(localStorage.isAuthenticated)

    if (localStorage.getAccessToken()) {
      getMe()
    }
  }, [])

  const login = (email: string, password: string) => {
    return axiosInstance
      .post('/auth/login', { email, password })
      .then(async response => {
        const { token } = response.data
        localStorage.setAccessToken(token)
      })
      .then(() => {
        getMe()
      })
  }

  const loginFree = (password: string) => {
    return axiosInstance
      .post('/auth/loginFree', { password })
      .then(() => {
        localStorage.setIsAuthenticated()
        setIsAuthenticated(true)
      })
      .finally(() => {
        localStorage.setIsAuthenticated()
        setIsAuthenticated(true)
      })
  }

  const logout = () => {
    // localStorage.delete(false)
    setIsAuthenticated(false)
    setUser(null)
    localStorage.deleteAll()
  }

  const getMe = async () => {
    axiosInstance
      .get('auth/me')
      .then(response => {
        const { _id, email, firstname, lastname, role } = response.data
        setIsAuthenticated(true)
        setUser({ _id, email, firstname, lastname, role, audioRecords: [] })
      })

      .catch(err => {
        setIsAuthenticated(false)
        setUser(null)
      })
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        loginFree,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
