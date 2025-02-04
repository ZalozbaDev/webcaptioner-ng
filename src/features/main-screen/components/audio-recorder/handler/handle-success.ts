import { toast } from 'sonner'

export const handleSuccess = (
  stream: MediaStream,
  sampleRate: number,
  webSocket: WebSocket,
  bufferSize: number,
  onSetNewProcessor: (processor: AudioWorkletNode) => void,
  onSetNewSource: (source: MediaStreamAudioSourceNode) => void,
  onSetNewContext: (context: AudioContext) => void,
  onStop: () => void
) => {
  const context = new AudioContext({ sampleRate })

  context.audioWorklet
    .addModule('worklet/data-conversion-processor.js')
    .then(function () {
      const processor = new AudioWorkletNode(
        context,
        'data-conversion-processor',
        {
          channelCount: 5,
          numberOfInputs: 1,
          numberOfOutputs: 1,
          processorOptions: {
            bufferSize,
          },
        }
      )
      onSetNewProcessor(processor)

      const source = context.createMediaStreamSource(stream)

      source.connect(processor)
      processor.connect(context.destination)

      onSetNewSource(source)
      toast.success('Recording started')
      processor.port.onmessage = event => {
        if (webSocket.readyState === webSocket.OPEN) {
          webSocket.send(event.data)
          if (process.env.REACT_APP_SEND_TIMESTAMP === 'true') {
            webSocket.send(`${new Date().getTime()}`)
          }
        } else if (webSocket.readyState === webSocket.CLOSED) {
          processor.port.close()
          toast.error('WebSocket connection closed')
          onStop()
        }
      }
      processor.port.start()
    })

  onSetNewContext(context)
}
