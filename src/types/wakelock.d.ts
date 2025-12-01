export {}

declare global {
  interface WakeLockSentinel extends EventTarget {
    released: boolean
    type: 'screen'
    release(): Promise<void>
    // addEventListener kommt von EventTarget
  }

  interface Navigator {
    wakeLock?: {
      request(type: 'screen'): Promise<WakeLockSentinel>
    }
  }
}
