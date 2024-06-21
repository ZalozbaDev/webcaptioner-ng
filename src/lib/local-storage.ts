const isAuthenticated =
  window.localStorage.getItem('isAuthenticated') === 'true' || false

const setIsAuthenticated = (value: boolean) =>
  window.localStorage.setItem('isAuthenticated', value.toString())

const getCounterForCid = (cid: string) => {
  const value = window.localStorage.getItem(`counter-${cid}`)
  return value ? parseInt(value) : 0
}

const setCounterForCid = (cid: string, counter: number) =>
  window.localStorage.setItem(`counter-${cid}`, counter.toString())

export const localStorage = {
  isAuthenticated,
  setIsAuthenticated,
  getCounterForCid,
  setCounterForCid,
}
