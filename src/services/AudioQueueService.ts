type AudioQueueListener = () => void

class AudioQueueService {
  private queue: ArrayBuffer[] = []
  private isPlaying: boolean = false
  private audioContext: {
    playAudioData: (data: ArrayBuffer) => Promise<void>
  } | null = null
  private listeners: Set<AudioQueueListener> = new Set()

  initialize(audioContext: {
    playAudioData: (data: ArrayBuffer) => Promise<void>
  }) {
    this.audioContext = audioContext
  }

  addToQueue(audio: ArrayBuffer) {
    this.queue.push(audio)
    this.notifyListeners()
    this.playNextIfIdle()
  }

  private async playNextIfIdle() {
    if (this.isPlaying || this.queue.length === 0 || !this.audioContext) {
      return
    }

    this.isPlaying = true
    const nextAudio = this.queue.shift()
    this.notifyListeners()

    try {
      await this.audioContext.playAudioData(nextAudio!)
      this.isPlaying = false
      this.playNextIfIdle()
    } catch (error) {
      console.error('Error playing audio:', error)
      this.isPlaying = false
    }
  }

  getQueueLength(): number {
    return this.queue.length
  }

  addListener(listener: AudioQueueListener) {
    this.listeners.add(listener)
  }

  removeListener(listener: AudioQueueListener) {
    this.listeners.delete(listener)
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener())
  }

  clearQueue() {
    this.queue = []
    this.notifyListeners()
  }
}

// Create a singleton instance
export const audioQueueService = new AudioQueueService()
