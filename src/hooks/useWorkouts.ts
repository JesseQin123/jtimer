import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import type { WorkoutSession, ExerciseType, HIITConfig } from '@/types'

export function useWorkouts() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSessions = useCallback(async () => {
    if (!user) {
      setSessions([])
      setLoading(false)
      return
    }

    setLoading(true)
    const { data, error } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('started_at', { ascending: false })

    if (error) {
      console.error('Error fetching sessions:', error)
    } else {
      setSessions(data || [])
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const saveSession = useCallback(async (
    exerciseType: ExerciseType,
    durationSeconds: number,
    startedAt: Date,
    hiitConfig?: HIITConfig
  ) => {
    if (!user) return { error: new Error('Not authenticated') }

    const { data, error } = await supabase
      .from('workout_sessions')
      .insert({
        user_id: user.id,
        exercise_type: exerciseType,
        duration_seconds: durationSeconds,
        hiit_config: hiitConfig || null,
        started_at: startedAt.toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving session:', error)
      return { error }
    }

    setSessions(prev => [data, ...prev])
    return { data }
  }, [user])

  const deleteSession = useCallback(async (sessionId: string) => {
    if (!user) return { error: new Error('Not authenticated') }

    const { error } = await supabase
      .from('workout_sessions')
      .delete()
      .eq('id', sessionId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting session:', error)
      return { error }
    }

    setSessions(prev => prev.filter(s => s.id !== sessionId))
    return { success: true }
  }, [user])

  // Statistics helpers
  const getTotalTime = useCallback((type?: ExerciseType) => {
    return sessions
      .filter(s => !type || s.exercise_type === type)
      .reduce((acc, s) => acc + s.duration_seconds, 0)
  }, [sessions])

  const getSessionsThisWeek = useCallback((type?: ExerciseType) => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    return sessions.filter(s => {
      const sessionDate = new Date(s.started_at)
      return sessionDate >= weekAgo && (!type || s.exercise_type === type)
    })
  }, [sessions])

  const getSessionsThisMonth = useCallback((type?: ExerciseType) => {
    const monthAgo = new Date()
    monthAgo.setMonth(monthAgo.getMonth() - 1)

    return sessions.filter(s => {
      const sessionDate = new Date(s.started_at)
      return sessionDate >= monthAgo && (!type || s.exercise_type === type)
    })
  }, [sessions])

  const getSessionCount = useCallback((type?: ExerciseType) => {
    return sessions.filter(s => !type || s.exercise_type === type).length
  }, [sessions])

  const getStreak = useCallback(() => {
    if (sessions.length === 0) return 0

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get unique dates (sorted descending)
    const uniqueDates = [...new Set(
      sessions.map(s => {
        const d = new Date(s.started_at)
        d.setHours(0, 0, 0, 0)
        return d.getTime()
      })
    )].sort((a, b) => b - a)

    // Check if today or yesterday has a session
    const mostRecent = uniqueDates[0]
    const daysDiff = Math.floor((today.getTime() - mostRecent) / (1000 * 60 * 60 * 24))
    if (daysDiff > 1) return 0

    // Count consecutive days
    let streak = 1
    for (let i = 1; i < uniqueDates.length; i++) {
      const diff = Math.floor((uniqueDates[i - 1] - uniqueDates[i]) / (1000 * 60 * 60 * 24))
      if (diff === 1) {
        streak++
      } else {
        break
      }
    }

    return streak
  }, [sessions])

  return {
    sessions,
    loading,
    saveSession,
    deleteSession,
    fetchSessions,
    getTotalTime,
    getSessionCount,
    getSessionsThisWeek,
    getSessionsThisMonth,
    getStreak,
  }
}
