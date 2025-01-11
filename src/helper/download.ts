export const download = async (text: string[], title: string) => {
  const element = document.createElement('a')
  const file = new Blob(
    text.map(v => `${v}\n`),
    { type: 'text/plain' }
  )
  element.href = URL.createObjectURL(file)
  element.download = `${title}.txt`
  document.body.appendChild(element) // Required for this to work in FireFox
  element.click()
}
