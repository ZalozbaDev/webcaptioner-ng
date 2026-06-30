export type BeepOptions = {
  frequencyHz?: number
  durationMs?: number
  volume?: number
}

type AudioQueueItem =
  | {
      kind: 'audio'
      data: ArrayBuffer
      estimatedSeconds: number
    }
  | {
      kind: 'beep'
      estimatedSeconds: number
      beepOptions?: BeepOptions
    }

type AudioContextWrapper = {
  playAudioData: (data: ArrayBuffer) => Promise<void>
  playBeep?: (options?: BeepOptions) => Promise<void>
}

class AudioQueueService {
  private queue: AudioQueueItem[] = []
  private isPlaying = false
  private currentItemSeconds = 0
  private audioContextWrapper: AudioContextWrapper | null = null

  initialize(audioContextWrapper: AudioContextWrapper) {
    this.audioContextWrapper = audioContextWrapper
  }

  addToQueue(data: ArrayBuffer, estimatedSeconds = 1) {
    this.queue.push({
      kind: 'audio',
      data,
      estimatedSeconds,
    })

    this.processQueue()
  }

  addBeepToQueue(estimatedSeconds = 0.25, beepOptions?: BeepOptions) {
    this.queue.push({
      kind: 'beep',
      estimatedSeconds,
      beepOptions,
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
      if (item.kind === 'audio') {
        await this.audioContextWrapper.playAudioData(item.data)
      } else {
        if (this.audioContextWrapper.playBeep) {
          await this.audioContextWrapper.playBeep(item.beepOptions)
        } else {
          await new Promise<void>(resolve => {
            window.setTimeout(
              resolve,
              Math.max(0, item.estimatedSeconds) * 1000,
            )
          })
        }
      }
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
