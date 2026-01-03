import { useState, useRef, useCallback, useEffect } from 'react'
import { feedback } from '@/lib/sounds'
import type { HIITConfig, HIITPhase, HIITState } from '@/types'

interface UseHIITTimerOptions {
  onComplete?: (totalDurationSeconds: number, config: HIITConfig) => void
}

export function useHIITTimer(config: HIITConfig, options: UseHIITTimerOptions = {}) {
  const [state, setState] = useState<HIITState>({
    phase: 'idle',
    currentRound: 0,
    totalRounds: config.rounds,
    timeRemaining: config.workSeconds,
    totalElapsed: 0,
  })
  const [startTime, setStartTime] = useState<Date | null>(null)
  const intervalRef = useRef<number | null>(null)

  // Update config when it changes
  useEffect(() => {
    if (state.phase === 'idle') {
      setState(prev => ({
        ...prev,
        totalRounds: config.rounds,
        timeRemaining: config.workSeconds,
      }))
    }
  }, [config, state.phase])

  const tick = useCallback(() => {
    setState(prev => {
      // Countdown warning at 3, 2, 1
      if (prev.timeRemaining <= 4 && prev.timeRemaining > 1) {
        feedback.warning()
      }

      // Time up for current phase
      if (prev.timeRemaining <= 1) {
        if (prev.phase === 'work') {
          // Work phase complete
          if (prev.currentRound >= prev.totalRounds) {
            // All rounds complete
            feedback.complete()
            return { ...prev, phase: 'completed', timeRemaining: 0 }
          }
          // Switch to rest
          feedback.switchPhase()
          return {
            ...prev,
            phase: 'rest' as HIITPhase,
            timeRemaining: config.restSeconds,
            totalElapsed: prev.totalElapsed + 1,
          }
        } else if (prev.phase === 'rest') {
          // Rest complete, start next work round
          feedback.switchPhase()
          return {
            ...prev,
            phase: 'work' as HIITPhase,
            currentRound: prev.currentRound + 1,
            timeRemaining: config.workSeconds,
            totalElapsed: prev.totalElapsed + 1,
          }
        }
      }

      return {
        ...prev,
        timeRemaining: prev.timeRemaining - 1,
        totalElapsed: prev.totalElapsed + 1,
      }
    })
  }, [config])

  const start = useCallback(() => {
    if (state.phase !== 'idle') return

    feedback.start()
    setStartTime(new Date())
    setState(prev => ({
      ...prev,
      phase: 'work',
      currentRound: 1,
      timeRemaining: config.workSeconds,
      totalElapsed: 0,
    }))

    intervalRef.current = window.setInterval(tick, 1000)
  }, [state.phase, config.workSeconds, tick])

  const pause = useCallback(() => {
    if (state.phase === 'idle' || state.phase === 'completed') return

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [state.phase])

  const resume = useCallback(() => {
    if (state.phase === 'idle' || state.phase === 'completed') return
    if (intervalRef.current) return // Already running

    intervalRef.current = window.setInterval(tick, 1000)
  }, [state.phase, tick])

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (state.totalElapsed > 0) {
      options.onComplete?.(state.totalElapsed, config)
    }

    setState({
      phase: 'idle',
      currentRound: 0,
      totalRounds: config.rounds,
      timeRemaining: config.workSeconds,
      totalElapsed: 0,
    })
    setStartTime(null)
  }, [state.totalElapsed, config, options])

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    setState({
      phase: 'idle',
      currentRound: 0,
      totalRounds: config.rounds,
      timeRemaining: config.workSeconds,
      totalElapsed: 0,
    })
    setStartTime(null)
  }, [config])

  // Handle completion
  useEffect(() => {
    if (state.phase === 'completed' && intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
      options.onComplete?.(state.totalElapsed, config)
    }
  }, [state.phase, state.totalElapsed, config, options])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const isRunning = intervalRef.current !== null && (state.phase === 'work' || state.phase === 'rest')

  return {
    state,
    startTime,
    isRunning,
    start,
    pause,
    resume,
    stop,
    reset,
  }
}
