import { useState } from 'react'
import { useWorkouts } from '@/hooks/useWorkouts'
import { formatDuration } from '@/hooks/useTimer'
import type { ExerciseType, WorkoutSession } from '@/types'

function SessionCard({
  session,
  onDelete
}: {
  session: WorkoutSession
  onDelete: () => void
}) {
  const [showConfirm, setShowConfirm] = useState(false)

  const date = new Date(session.started_at)
  const timeStr = date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })

  const typeLabel = session.exercise_type === 'plank' ? '平板支撑' : 'HIIT'
  const typeColor = session.exercise_type === 'plank' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-orange-500/20 text-orange-400'

  return (
    <div className="bg-slate-800 rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${typeColor}`}>
          {typeLabel}
        </div>
        <div>
          <p className="text-white font-semibold">{formatDuration(session.duration_seconds)}</p>
          <p className="text-slate-500 text-sm">{timeStr}</p>
        </div>
      </div>

      {showConfirm ? (
        <div className="flex gap-2">
          <button
            onClick={() => setShowConfirm(false)}
            className="px-3 py-1 text-sm text-slate-400 hover:text-white"
          >
            取消
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1 text-sm bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
          >
            删除
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowConfirm(true)}
          className="p-2 text-slate-500 hover:text-red-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default function History() {
  const { sessions, loading, deleteSession } = useWorkouts()
  const [filter, setFilter] = useState<ExerciseType | 'all'>('all')

  const filteredSessions = filter === 'all'
    ? sessions
    : sessions.filter(s => s.exercise_type === filter)

  // Group by date
  const groupedSessions = filteredSessions.reduce((groups, session) => {
    const date = new Date(session.started_at).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    })
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(session)
    return groups
  }, {} as Record<string, WorkoutSession[]>)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6">
      {/* Filter */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            filter === 'all'
              ? 'bg-cyan-500 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          全部
        </button>
        <button
          onClick={() => setFilter('plank')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            filter === 'plank'
              ? 'bg-cyan-500 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          平板支撑
        </button>
        <button
          onClick={() => setFilter('hiit')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            filter === 'hiit'
              ? 'bg-cyan-500 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          HIIT
        </button>
      </div>

      {/* Sessions list */}
      {filteredSessions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-slate-500">还没有训练记录</p>
          <p className="text-slate-600 text-sm mt-1">完成一次训练后会在这里显示</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSessions).map(([date, dateSessions]) => (
            <div key={date}>
              <h3 className="text-slate-400 text-sm font-medium mb-3">{date}</h3>
              <div className="space-y-2">
                {dateSessions.map(session => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onDelete={() => deleteSession(session.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
