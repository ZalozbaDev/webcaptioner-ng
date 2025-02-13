const isAuthenticated = () =>
  window.localStorage.getItem('isAuthenticated') === 'true'

const setIsAuthenticated = () =>
  window.localStorage.setItem('isAuthenticated', 'true')

const getAccessToken = () => window.localStorage.getItem('accessToken')

const setAccessToken = (value: string) =>
  window.localStorage.setItem('accessToken', value)

const getCounterForYoutubeStreaming = (streamingKey: string) => {
  const value = window.localStorage.getItem(`counter-${streamingKey}`)
  return value ? parseInt(value) : 0
}

const setCounterForYoutubeStreaming = (streamingKey: string, counter: number) =>
  window.localStorage.setItem(`counter-${streamingKey}`, counter.toString())

const deleteAll = () => window.localStorage.clear()

export const localStorage = {
  isAuthenticated,
  setIsAuthenticated,
  getAccessToken,
  deleteAll,
  setAccessToken,
  getCounterForYoutubeStreaming,
  setCounterForYoutubeStreaming,
}
