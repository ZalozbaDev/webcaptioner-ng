const isAuthenticated =
  window.localStorage.getItem('isAuthenticated') === 'true' || false

const setIsAuthenticated = (value: boolean) =>
  window.localStorage.setItem('isAuthenticated', value.toString())

const getCounterForYoutubeStreaming = (streamingKey: string) => {
  const value = window.localStorage.getItem(`counter-${streamingKey}`)
  return value ? parseInt(value) : 0
}

const setCounterForYoutubeStreaming = (streamingKey: string, counter: number) =>
  window.localStorage.setItem(`counter-${streamingKey}`, counter.toString())

export const localStorage = {
  isAuthenticated,
  setIsAuthenticated,
  getCounterForYoutubeStreaming,
  setCounterForYoutubeStreaming,
}
