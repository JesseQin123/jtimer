// Sound effects manager for timer feedback

class SoundManager {
  private audioContext: AudioContext | null = null

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new AudioContext()
    }
    return this.audioContext
  }

  // Generate a beep sound
  private beep(frequency: number, duration: number, volume: number = 0.3) {
    try {
      const ctx = this.getContext()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.value = frequency
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(volume, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + duration)
    } catch (e) {
      console.warn('Sound playback failed:', e)
    }
  }

  // Start sound - short high beep
  playStart() {
    this.beep(880, 0.15, 0.4)
  }

  // Countdown tick - very short beep
  playTick() {
    this.beep(440, 0.08, 0.2)
  }

  // Phase switch (HIIT work/rest) - two beeps
  playSwitch() {
    this.beep(660, 0.1, 0.3)
    setTimeout(() => this.beep(880, 0.15, 0.35), 120)
  }

  // Workout complete - celebratory sound
  playComplete() {
    this.beep(523, 0.15, 0.4) // C5
    setTimeout(() => this.beep(659, 0.15, 0.4), 150) // E5
    setTimeout(() => this.beep(784, 0.25, 0.4), 300) // G5
  }

  // Warning (3,2,1 countdown) - higher pitch tick
  playWarning() {
    this.beep(660, 0.12, 0.35)
  }
}

export const soundManager = new SoundManager()

// Vibration utility
export function vibrate(pattern: number | number[]) {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern)
  }
}

// Combined feedback functions
export const feedback = {
  start: () => {
    soundManager.playStart()
    vibrate(100)
  },
  tick: () => {
    soundManager.playTick()
    vibrate(50)
  },
  switchPhase: () => {
    soundManager.playSwitch()
    vibrate([100, 50, 100])
  },
  complete: () => {
    soundManager.playComplete()
    vibrate([100, 100, 100, 100, 200])
  },
  warning: () => {
    soundManager.playWarning()
    vibrate(80)
  }
}
