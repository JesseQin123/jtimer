import { useMemo } from 'react'
import { useWorkouts } from '@/hooks/useWorkouts'
import { formatDuration } from '@/hooks/useTimer'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

function StatCard({
  title,
  value,
  subtitle,
  icon
}: {
  title: string
  value: string
  subtitle?: string
  icon: React.ReactNode
}) {
  return (
    <div className="bg-slate-800 rounded-xl p-4">
      <div className="flex items-start justify-between mb-2">
        <span className="text-slate-400 text-sm">{title}</span>
        <span className="text-slate-600">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
    </div>
  )
}

export default function Stats() {
  const {
    sessions,
    loading,
    getTotalTime,
    getSessionsThisWeek,
    getSessionsThisMonth,
    getStreak
  } = useWorkouts()

  // Calculate daily data for the past 7 days
  const weeklyData = useMemo(() => {
    const data = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const nextDay = new Date(date)
      nextDay.setDate(nextDay.getDate() + 1)

      const dayLabel = date.toLocaleDateString('zh-CN', { weekday: 'short' })

      const daySessions = sessions.filter(s => {
        const sessionDate = new Date(s.started_at)
        return sessionDate >= date && sessionDate < nextDay
      })

      const plankMinutes = Math.round(
        daySessions
          .filter(s => s.exercise_type === 'plank')
          .reduce((acc, s) => acc + s.duration_seconds, 0) / 60
      )

      const hiitMinutes = Math.round(
        daySessions
          .filter(s => s.exercise_type === 'hiit')
          .reduce((acc, s) => acc + s.duration_seconds, 0) / 60
      )

      data.push({
        day: dayLabel,
        plank: plankMinutes,
        hiit: hiitMinutes,
      })
    }

    return data
  }, [sessions])

  const weekSessions = getSessionsThisWeek()
  const monthSessions = getSessionsThisMonth()
  const streak = getStreak()

  const weekTotal = weekSessions.reduce((acc, s) => acc + s.duration_seconds, 0)
  const monthTotal = monthSessions.reduce((acc, s) => acc + s.duration_seconds, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Top stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          title="连续打卡"
          value={`${streak} 天`}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
          }
        />
        <StatCard
          title="本周训练"
          value={formatDuration(weekTotal)}
          subtitle={`${weekSessions.length} 次`}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
      </div>

      {/* Weekly chart */}
      <div className="bg-slate-800 rounded-xl p-4">
        <h3 className="text-slate-400 text-sm mb-4">本周训练 (分钟)</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} barCategoryGap="20%">
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Bar dataKey="plank" stackId="a" fill="#06b6d4" radius={[0, 0, 0, 0]} name="平板支撑" />
              <Bar dataKey="hiit" stackId="a" fill="#f97316" radius={[4, 4, 0, 0]} name="HIIT" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lifetime stats */}
      <div className="bg-slate-800 rounded-xl p-4">
        <h3 className="text-slate-400 text-sm mb-4">累计统计</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
              <span className="text-white">平板支撑</span>
            </div>
            <span className="text-white font-semibold">
              {formatDuration(getTotalTime('plank'))}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-white">HIIT</span>
            </div>
            <span className="text-white font-semibold">
              {formatDuration(getTotalTime('hiit'))}
            </span>
          </div>
          <div className="border-t border-slate-700 pt-4 flex items-center justify-between">
            <span className="text-slate-400">总计</span>
            <span className="text-xl font-bold text-white">
              {formatDuration(getTotalTime())}
            </span>
          </div>
        </div>
      </div>

      {/* Monthly summary */}
      <div className="bg-slate-800 rounded-xl p-4">
        <h3 className="text-slate-400 text-sm mb-2">本月统计</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">
            {formatDuration(monthTotal)}
          </span>
          <span className="text-slate-500">/ {monthSessions.length} 次训练</span>
        </div>
      </div>
    </div>
  )
}
