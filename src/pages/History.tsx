import { useState, useMemo } from 'react'
import { useWorkouts } from '@/hooks/useWorkouts'
import SessionItem from '@/components/ui/SessionItem'
import type { ExerciseType, WorkoutSession } from '@/types'

// Estimate calories
function estimateCalories(type: string, durationSeconds: number): number {
  const minutes = durationSeconds / 60
  return Math.round(minutes * (type === 'hiit' ? 10 : 5))
}

export default function History() {
  const { sessions, loading, deleteSession, getSessionsThisWeek } = useWorkouts()
  const [filter, setFilter] = useState<ExerciseType | 'all'>('all')

  const filteredSessions = filter === 'all'
    ? sessions
    : sessions.filter(s => s.exercise_type === filter)

  // Group by date
  const groupedSessions = useMemo(() => {
    return filteredSessions.reduce((groups, session) => {
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
  }, [filteredSessions])

  // Weekly stats
  const weekSessions = getSessionsThisWeek()
  const weekTotalSeconds = weekSessions.reduce((acc, s) => acc + s.duration_seconds, 0)
  const weekTotalCalories = weekSessions.reduce((acc, s) => acc + estimateCalories(s.exercise_type, s.duration_seconds), 0)
  const weekHours = Math.floor(weekTotalSeconds / 3600)
  const weekMinutes = Math.floor((weekTotalSeconds % 3600) / 60)

  // Weekly chart data (last 7 days)
  const weeklyChartData = useMemo(() => {
    const data = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const nextDay = new Date(date)
      nextDay.setDate(nextDay.getDate() + 1)

      const daySessions = sessions.filter(s => {
        const sessionDate = new Date(s.started_at)
        return sessionDate >= date && sessionDate < nextDay
      })

      const totalMinutes = daySessions.reduce((acc, s) => acc + s.duration_seconds, 0) / 60

      data.push({
        value: totalMinutes,
        isToday: i === 0,
      })
    }

    return data
  }, [sessions])

  const maxChartValue = Math.max(...weeklyChartData.map(d => d.value), 1)

  // Get current date
  const today = new Date()
  const dateStr = today.toLocaleDateString('zh-CN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).toUpperCase()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-full pb-6">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl pt-12 pb-4 px-6 border-b border-white/10">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-sm font-semibold text-primary uppercase tracking-wide mb-1">{dateStr}</div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">训练记录</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface overflow-hidden border border-white/20 flex items-center justify-center">
            <span className="material-icons-round text-primary">person</span>
          </div>
        </div>
      </header>

      <main className="px-6 pt-6 space-y-8">
        {/* Weekly overview */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-white">本周概览</h2>
            <button className="text-accent text-sm font-medium">查看更多</button>
          </div>

          <div className="bg-surface rounded-3xl p-5 border border-white/5 relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -mr-10 -mt-10" />

            <div className="flex justify-between items-end relative z-10">
              <div>
                <p className="text-sm text-text-secondary font-medium mb-1">总运动时长</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-black text-accent">{weekHours}</span>
                  <span className="text-2xl font-bold text-white ml-1">小时</span>
                  <span className="text-4xl font-black text-accent ml-2">{weekMinutes}</span>
                  <span className="text-2xl font-bold text-white ml-1">分</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="material-icons-round text-primary text-3xl mb-1">local_fire_department</span>
                <span className="text-2xl font-bold text-white">{weekTotalCalories.toLocaleString()}</span>
                <span className="text-xs text-text-secondary font-bold uppercase">千卡</span>
              </div>
            </div>

            {/* Mini chart */}
            <div className="mt-6 flex justify-between items-end h-12 space-x-2">
              {weeklyChartData.map((day, i) => {
                const height = Math.max((day.value / maxChartValue) * 100, 10)
                return (
                  <div
                    key={i}
                    className={`w-full rounded-t-sm transition-all ${
                      day.isToday
                        ? 'bg-primary shadow-glow-sm-primary'
                        : 'bg-white/10'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                )
              })}
            </div>
          </div>
        </section>

        {/* History list */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">历史记录</h2>
            <div className="flex gap-2">
              {/* Filter buttons */}
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-surface text-text-secondary hover:text-white'
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setFilter('plank')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filter === 'plank'
                    ? 'bg-primary text-white'
                    : 'bg-surface text-text-secondary hover:text-white'
                }`}
              >
                平板支撑
              </button>
              <button
                onClick={() => setFilter('hiit')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filter === 'hiit'
                    ? 'bg-primary text-white'
                    : 'bg-surface text-text-secondary hover:text-white'
                }`}
              >
                HIIT
              </button>
            </div>
          </div>

          {filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons-round text-text-tertiary text-3xl">history</span>
              </div>
              <p className="text-text-secondary">还没有训练记录</p>
              <p className="text-text-tertiary text-sm mt-1">完成一次训练后会在这里显示</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedSessions).map(([date, dateSessions]) => (
                <div key={date}>
                  <h3 className="text-text-secondary text-sm font-medium mb-3 px-1">{date}</h3>
                  <div className="space-y-3">
                    {dateSessions.map(session => (
                      <SessionItem
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
        </section>

        {/* Trend card */}
        {sessions.length > 0 && (
          <section className="pb-6">
            <h2 className="text-xl font-bold text-white mb-4">趋势</h2>
            <div className="bg-surface rounded-3xl p-5 border border-white/5">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-white/10">
                  <span className="material-icons-round text-accent text-xl">trending_up</span>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">平均运动时长</p>
                  <p className="text-lg font-bold text-white">
                    ↑ 12% <span className="text-sm font-normal text-text-secondary">较上周</span>
                  </p>
                </div>
              </div>
              <div className="h-1 bg-surface-light rounded-full w-full overflow-hidden">
                <div className="h-full bg-accent w-3/4 rounded-full shadow-glow-sm-accent" />
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
