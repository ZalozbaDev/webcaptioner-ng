import axios from 'axios'
import { localStorage } from './local-storage'

const BASE_URL = `${process.env.REACT_APP_WEBCAPTIONER_SERVER}`

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
})

axiosInstance.defaults.headers['Content-Type'] = 'application/json'

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getAccessToken()

    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    } else {
      delete config.headers.Authorization
    }

    return config
  },
  error => {
    Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      localStorage.deleteAll()
      // history.pushState(null, '', '/authentication/login')
    }

    return Promise.reject(error)
  },
)
