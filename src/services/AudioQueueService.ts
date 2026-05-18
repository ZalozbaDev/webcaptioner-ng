type AudioQueueItem = {
  data: ArrayBuffer
  estimatedSeconds: number
}

class AudioQueueService {
  private queue: AudioQueueItem[] = []
  private isPlaying = false
  private currentItemSeconds = 0
  private audioContextWrapper: any = null

  initialize(audioContextWrapper: any) {
    this.audioContextWrapper = audioContextWrapper
  }

  addToQueue(data: ArrayBuffer, estimatedSeconds = 1) {
    this.queue.push({
      data,
      estimatedSeconds,
    })

    this.processQueue()
  }

  getBufferedSeconds() {
    const queuedSeconds = this.queue.reduce(
      (total, item) => total + item.estimatedSeconds,
      0,
    )

    return queuedSeconds + this.currentItemSeconds
  }

  private async processQueue() {
    if (this.isPlaying) return
    if (!this.audioContextWrapper) return

    const item = this.queue.shift()

    if (!item) return

    this.isPlaying = true
    this.currentItemSeconds = item.estimatedSeconds

    try {
      await this.audioContextWrapper.playAudioData(item.data)
    } catch (error) {
      console.error('Error playing queued audio:', error)
    } finally {
      this.currentItemSeconds = 0
      this.isPlaying = false
      this.processQueue()
    }
  }
}

export const audioQueueService = new AudioQueueService()
