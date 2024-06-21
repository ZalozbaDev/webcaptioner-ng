const isAuthenticated =
  window.localStorage.getItem('isAuthenticated') === 'true' || false

const setIsAuthenticated = (value: boolean) =>
  window.localStorage.setItem('isAuthenticated', value.toString())

export const localStorage = { isAuthenticated, setIsAuthenticated }
