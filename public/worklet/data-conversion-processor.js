class DataConversionAudioProcessor extends AudioWorkletProcessor {
  bufferSize = 4096
  _bytesWritten = 0
  _buffer = new Int16Array(this.bufferSize)

  constructor(options) {
    console.log({ options })
    super()
    this.bufferSize = options.processorOptions.bufferSize || this.bufferSize
    this.bufferSize = parseInt(this.bufferSize, 10)
    this._buffer = new Int16Array(this.bufferSize)
    this.initBuffer()
  }

  initBuffer() {
    this._bytesWritten = 0
  }

  isBufferEmpty() {
    return this._bytesWritten === 0
  }

  isBufferFull() {
    return this._bytesWritten === this.bufferSize
  }

  process(inputs, outputs, parameters) {
    const inputData = inputs[0][0]

    if (this.isBufferFull()) {
      // console.log('flush', this._bytesWritten, this.bufferSize)
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
      this._bytesWritten < this.bufferSize
        ? this._buffer.slice(0, this._bytesWritten)
        : this._buffer
    )
    this.initBuffer()
  }
}

registerProcessor('data-conversion-processor', DataConversionAudioProcessor)
