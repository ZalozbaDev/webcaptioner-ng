export const initWebsocket = (
  url: string,
  onReceiveMessage: (event: MessageEvent) => void
) => {
  const webSocket = new WebSocket(url)
  // webSocket.binaryType = 'arraybuffer'

  webSocket.onerror = error => console.error('WebSocket error:', error)

  webSocket.onmessage = onReceiveMessage

  webSocket.onopen = () => console.log('Connection to Websocket established 🚀')

  return webSocket
}
