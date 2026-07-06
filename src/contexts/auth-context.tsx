import { createContext, useEffect, useState, useCallback } from 'react'
import type { FC, ReactNode } from 'react'
import { localStorage } from '../lib/local-storage'
import { axiosInstance } from '../lib/axios'

interface State {
  isAuthenticated: boolean
  isInitialized: boolean
  user: User | null
}

interface RegisterInput {
  firstname: string
  lastname: string
  email: string
  password: string
}

interface AuthContextValue extends State {
  login: (email: string, password: string) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  loginFree: (password: string) => Promise<void>
  logout: () => void
}

interface AuthProviderProps {
  children: ReactNode
}

const initialState: State = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
}

const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  forgotPassword: () => Promise.resolve(),
  loginFree: () => Promise.resolve(),
  logout: () => {},
})

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.isAuthenticated(),
  )
  const [isInitialized, setIsInitialized] = useState(false)
  const [user, setUser] = useState(initialState.user)

  const getMe = useCallback(async () => {
    try {
      const response = await axiosInstance.get('auth/me')
      const { _id, email, firstname, lastname, role } = response.data
      setIsAuthenticated(true)
      setUser({ _id, email, firstname, lastname, role, audioRecords: [] })
    } catch {
      setIsAuthenticated(false)
      setUser(null)
      localStorage.deleteAll()
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      if (localStorage.getAccessToken()) {
        await getMe()
      }
      setIsInitialized(true)
    }

    init()
  }, [getMe])

  const login = async (email: string, password: string) => {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password,
    })
    const { token, refreshToken } = response.data
    localStorage.setAccessToken(token)
    localStorage.setRefreshToken(refreshToken)
    await getMe()
  }

  const loginFree = (password: string) => {
    return axiosInstance.post('/auth/loginFree', { password }).then(() => {
      localStorage.setIsAuthenticated()
      setIsAuthenticated(true)
    })
  }

  const register = (data: {
    firstname: string
    lastname: string
    email: string
    password: string
  }) => {
    return axiosInstance.post('/auth/register', data).then(() => {})
  }

  const forgotPassword = (email: string) => {
    return axiosInstance.post('/auth/forgot-password', { email }).then(() => {})
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.deleteAll()
  }

  if (!isInitialized) {
    return null
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isInitialized,
        user,
        login,
        register,
        forgotPassword,
        loginFree,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
