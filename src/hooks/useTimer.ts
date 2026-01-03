import { useState, useRef, useCallback, useEffect } from 'react'
import { feedback } from '@/lib/sounds'

interface UseTimerOptions {
  onComplete?: (durationSeconds: number) => void
}

export function useTimer(options: UseTimerOptions = {}) {
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const intervalRef = useRef<number | null>(null)

  const start = useCallback(() => {
    if (isRunning) return

    feedback.start()
    setIsRunning(true)
    setStartTime(new Date())

    intervalRef.current = window.setInterval(() => {
      setElapsedSeconds(prev => prev + 1)
    }, 1000)
  }, [isRunning])

  const pause = useCallback(() => {
    if (!isRunning) return

    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [isRunning])

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (elapsedSeconds > 0) {
      feedback.complete()
      options.onComplete?.(elapsedSeconds)
    }

    setIsRunning(false)
    setElapsedSeconds(0)
    setStartTime(null)
  }, [elapsedSeconds, options])

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
    setElapsedSeconds(0)
    setStartTime(null)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return {
    isRunning,
    elapsedSeconds,
    startTime,
    start,
    pause,
    stop,
    reset,
  }
}

// Format seconds to MM:SS or HH:MM:SS
export function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// Format seconds to human readable (e.g., "5h 30m", "2m 15s")
export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  }
  return `${seconds}s`
}
