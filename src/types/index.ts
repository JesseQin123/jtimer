export type ExerciseType = 'plank' | 'hiit'

export interface HIITConfig {
  workSeconds: number
  restSeconds: number
  rounds: number
}

export interface WorkoutSession {
  id: string
  user_id: string
  exercise_type: ExerciseType
  duration_seconds: number
  hiit_config?: HIITConfig
  started_at: string
  created_at: string
}

export interface HIITPreset {
  id: string
  user_id: string
  name: string
  work_seconds: number
  rest_seconds: number
  rounds: number
}

export interface User {
  id: string
  email: string
}

export type HIITPhase = 'work' | 'rest' | 'idle' | 'completed'

export interface HIITState {
  phase: HIITPhase
  currentRound: number
  totalRounds: number
  timeRemaining: number
  totalElapsed: number
}
