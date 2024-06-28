export const typedVoskResponse = (data: any): VOSKResponse => {
  const typed = JSON.parse(data)
  typed.listen = typed.listen === 'true'
  typed.start = typed.start ? parseInt(typed.start) : undefined
  typed.stop = typed.stop ? parseInt(typed.stop) : undefined

  return typed
}
