class DataConversionAudioProcessor extends AudioWorkletProcessor {
  chunkLength = 4096
  _bytesWritten = 0
  _buffer = new Int16Array(this.chunkLength)

  constructor(options) {
    console.log({ options })
    super()
    this.chunkLength = options.processorOptions.chunkLength || this.chunkLength
    this.chunkLength = parseInt(this.chunkLength, 10)
    this._buffer = new Int16Array(this.chunkLength)
    this.initBuffer()
  }

  initBuffer() {
    this._bytesWritten = 0
  }

  isBufferEmpty() {
    return this._bytesWritten === 0
  }

  isBufferFull() {
    return this._bytesWritten === this.chunkLength
  }

  process(inputs, outputs, parameters) {
    const inputData = inputs[0][0]

    if (this.isBufferFull()) {
      // console.log('flush', this._bytesWritten, this.chunkLength)
      this.flush()
    }

    if (!inputData) return

    for (let index = 0; index < inputData.length; index++) {
      this._buffer[this._bytesWritten++] =
        32767 * Math.max(-1, Math.min(1, inputData[index]))
    }

    return true
  }

  flush() {
    this.port.postMessage(
      this._bytesWritten < this.chunkLength
        ? this._buffer.slice(0, this._bytesWritten)
        : this._buffer
    )
    this.initBuffer()
  }
}

registerProcessor('data-conversion-processor', DataConversionAudioProcessor)
