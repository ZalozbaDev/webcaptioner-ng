export const handleSuccess = (
  sampleRate: number,
  webSocket: WebSocket,
  onSetNewProcessor: (processor: AudioWorkletNode) => void,
  onSetNewSource: (source: MediaStreamAudioSourceNode) => void,
  onSetNewContext: (context: AudioContext) => void
) => {
  const context = new AudioContext({ sampleRate })

  context.audioWorklet
    .addModule('worklet/data-conversion-processor.js')
    .then(function () {
      const processor = new AudioWorkletNode(
        context,
        'data-conversion-processor',
        {
          channelCount: 1,
          numberOfInputs: 1,
          numberOfOutputs: 1,
        }
      )
      onSetNewProcessor(processor)
      let constraints = { audio: true }
      navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        const source = context.createMediaStreamSource(stream)

        source.connect(processor)
        processor.connect(context.destination)

        onSetNewSource(source)

        processor.port.onmessage = (event) => {
          webSocket.send(event.data)
        }
        processor.port.start()
      })
    })

  onSetNewContext(context)
}