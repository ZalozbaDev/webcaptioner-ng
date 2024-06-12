export const typedVoskResponse = (data: any): VOSKResponse => {
  const typed = JSON.parse(data)
  typed.listen = typed.listen === 'true'
  typed.start = typed.start ? parseFloat(typed.start) : undefined
  typed.stop = typed.stop ? parseFloat(typed.stop) : undefined

  return typed
}
