import { useMemo } from 'react'
import { useWorkouts } from '@/hooks/useWorkouts'
import { formatDuration } from '@/hooks/useTimer'
import type { WorkoutSession } from '@/types'

// Estimate calories
function estimateCalories(type: string, durationSeconds: number): number {
  const minutes = durationSeconds / 60
  return Math.round(minutes * (type === 'hiit' ? 10 : 5))
}

// Activity Ring Component
function ActivityRing({
  progress,
  color,
  size = 160,
  strokeWidth = 8,
  bgOpacity = 0.2,
}: {
  progress: number
  color: string
  size?: number
  strokeWidth?: number
  bgOpacity?: number
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - Math.min(progress, 1))

  return (
    <svg
      className="transform -rotate-90"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke={color}
        strokeWidth={strokeWidth}
        opacity={bgOpacity}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        className="transition-all duration-500"
      />
    </svg>
  )
}

// Workout Item Component
function WorkoutItem({ session }: { session: WorkoutSession }) {
  const isHiit = session.exercise_type === 'hiit'
  const calories = estimateCalories(session.exercise_type, session.duration_seconds)
  const minutes = Math.floor(session.duration_seconds / 60)
  const seconds = session.duration_seconds % 60

  const sessionDate = new Date(session.started_at)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  let dateLabel = sessionDate.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  if (sessionDate.toDateString() === today.toDateString()) {
    dateLabel = '今天'
  } else if (sessionDate.toDateString() === yesterday.toDateString()) {
    dateLabel = '昨天'
  }

  return (
    <div className="bg-surface rounded-xl p-4 flex items-center active:scale-[0.98] transition-transform">
      <div className={`h-14 w-14 rounded-lg flex items-center justify-center mr-4 shrink-0 ${
        isHiit ? 'bg-accent/20' : 'bg-primary/20'
      }`}>
        <span className={`material-icons-round text-2xl ${isHiit ? 'text-accent' : 'text-primary'}`}>
          {isHiit ? 'bolt' : 'fitness_center'}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-base truncate pr-2 text-white">
            {isHiit ? 'HIIT 间歇训练' : '平板支撑'}
          </h3>
          <span className="text-xs text-text-secondary shrink-0">{dateLabel}</span>
        </div>
        <div className="flex items-baseline justify-between mt-1">
          <div className={`text-2xl font-mono tabular-nums ${isHiit ? 'text-accent' : 'text-primary'}`}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
          <div className="flex items-center text-xs text-text-secondary">
            {calories} 千卡
            <span className="material-icons-round text-sm ml-1">chevron_right</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Stats() {
  const {
    sessions,
    loading,
    getTotalTime,
    getSessionsThisWeek,
    getStreak
  } = useWorkouts()

  // Get current date info
  const today = new Date()
  const dateStr = today.toLocaleDateString('zh-CN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).toUpperCase()

  // Weekly data
  const weekSessions = getSessionsThisWeek()
  const weekTotalSeconds = weekSessions.reduce((acc, s) => acc + s.duration_seconds, 0)
  const weekHours = Math.floor(weekTotalSeconds / 3600)
  const weekMinutes = Math.floor((weekTotalSeconds % 3600) / 60)

  // Calculate daily data for the past 7 days
  const weeklyData = useMemo(() => {
    const data = []
    const dayLabels = ['一', '二', '三', '四', '五', '六', '日']

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

      // Get day of week (0 = Sunday, 1 = Monday, etc)
      const dayOfWeek = date.getDay()
      const label = dayLabels[dayOfWeek === 0 ? 6 : dayOfWeek - 1]

      data.push({
        day: date.getDate(),
        label,
        value: totalMinutes,
        isToday: i === 0,
        hasWorkout: daySessions.length > 0,
        progress: Math.min(totalMinutes / 30, 1), // 30 min daily goal
      })
    }

    return data
  }, [sessions])

  const maxChartValue = Math.max(...weeklyData.map(d => d.value), 1)

  // Recent sessions (last 3)
  const recentSessions = sessions.slice(0, 3)

  // Goals (can be made configurable later)
  const dailyCalorieGoal = 500
  const dailyMinuteGoal = 30

  // Today's stats
  const todaySessions = useMemo(() => {
    const todayStart = new Date(today)
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd = new Date(todayStart)
    todayEnd.setDate(todayEnd.getDate() + 1)

    return sessions.filter(s => {
      const sessionDate = new Date(s.started_at)
      return sessionDate >= todayStart && sessionDate < todayEnd
    })
  }, [sessions])

  const todayCalories = todaySessions.reduce((acc, s) => acc + estimateCalories(s.exercise_type, s.duration_seconds), 0)
  const todayMinutes = Math.floor(todaySessions.reduce((acc, s) => acc + s.duration_seconds, 0) / 60)

  const streak = getStreak()

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
            <h1 className="text-3xl font-extrabold tracking-tight text-white">统计</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface overflow-hidden border border-white/20 flex items-center justify-center">
            <span className="material-icons-round text-primary">person</span>
          </div>
        </div>
      </header>

      <main className="px-6 pt-6 space-y-6">
        {/* Activity Rings Summary */}
        <section className="bg-surface rounded-3xl p-5 border border-white/5 relative overflow-hidden">
          {/* Glow effects */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -ml-10 -mt-10" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-accent/20 blur-3xl rounded-full -mr-10 -mb-10" />

          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-5">
              {/* Move */}
              <div>
                <div className="text-base font-medium text-white">消耗</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-primary">{todayCalories}</span>
                  <span className="text-lg font-semibold text-primary/70">/ {dailyCalorieGoal} 千卡</span>
                </div>
              </div>
              {/* Exercise */}
              <div>
                <div className="text-base font-medium text-white">运动</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-accent">{todayMinutes}</span>
                  <span className="text-lg font-semibold text-accent/70">/ {dailyMinuteGoal} 分钟</span>
                </div>
              </div>
              {/* Streak */}
              <div>
                <div className="text-base font-medium text-white">连续打卡</div>
                <div className="text-2xl font-semibold text-text-secondary">{streak} 天</div>
              </div>
            </div>

            {/* Dual Rings */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Outer ring - Calories/Move */}
              <ActivityRing
                progress={todayCalories / dailyCalorieGoal}
                color="#FA2D48"
                size={160}
                strokeWidth={12}
              />
              {/* Inner ring - Exercise */}
              <div className="absolute inset-0 flex items-center justify-center">
                <ActivityRing
                  progress={todayMinutes / dailyMinuteGoal}
                  color="#D2FF0F"
                  size={110}
                  strokeWidth={12}
                />
              </div>
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-surface-light flex items-center justify-center">
                  <span className="material-icons-round text-white text-xl">fitness_center</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Activity Trends */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xl font-bold text-white">活动趋势</h2>
            <button className="text-primary text-sm font-medium">查看更多</button>
          </div>

          <div className="bg-surface rounded-3xl p-5 border border-white/5">
            <div className="flex justify-between items-end mb-6">
              <div>
                <div className="text-sm text-text-secondary mb-1">本周总时长</div>
                <div className="text-3xl font-bold tabular-nums text-white">
                  {weekHours}<span className="text-lg text-text-secondary mx-1">时</span>
                  {weekMinutes}<span className="text-lg text-text-secondary ml-1">分</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-accent text-sm font-medium bg-accent/10 px-2 py-1 rounded-lg">
                  <span className="material-icons-round text-base mr-1">trending_up</span>
                  +12%
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="h-32 w-full flex items-end justify-between space-x-2">
              {weeklyData.map((day, i) => {
                const height = Math.max((day.value / maxChartValue) * 100, 5)
                return (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                    <div className="w-full bg-surface-light rounded-t-sm relative h-24 overflow-hidden">
                      <div
                        className={`absolute bottom-0 w-full rounded-t-sm transition-all ${
                          day.isToday
                            ? 'bg-primary shadow-glow-sm-primary'
                            : 'bg-primary/40 group-hover:bg-primary/60'
                        }`}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    {day.isToday ? (
                      <span className="text-xs font-bold text-white bg-primary w-5 h-5 flex items-center justify-center rounded-full -mt-1 z-10">
                        {day.label}
                      </span>
                    ) : (
                      <span className="text-xs text-text-secondary font-medium">{day.label}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Recent Workouts */}
        {recentSessions.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-xl font-bold text-white">最近训练</h2>
            </div>
            <div className="space-y-3">
              {recentSessions.map(session => (
                <WorkoutItem key={session.id} session={session} />
              ))}
            </div>
          </section>
        )}

        {/* History Calendar Strip */}
        <section className="pb-6">
          <h2 className="text-xl font-bold text-white mb-3 px-1">本周历史</h2>
          <div className="bg-surface rounded-3xl p-4 border border-white/5 overflow-x-auto no-scrollbar">
            <div className="flex justify-between min-w-full gap-2">
              {weeklyData.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-2 min-w-[3rem]">
                  <span className={`text-xs uppercase ${day.isToday ? 'font-bold text-white' : 'text-text-secondary'}`}>
                    {day.label}
                  </span>
                  {day.hasWorkout ? (
                    <div className="relative w-10 h-10">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="20"
                          cy="20"
                          r="14"
                          fill="transparent"
                          stroke="#2C2C2E"
                          strokeWidth="4"
                        />
                        <circle
                          cx="20"
                          cy="20"
                          r="14"
                          fill="transparent"
                          stroke="#FA2D48"
                          strokeWidth="4"
                          strokeDasharray="88"
                          strokeDashoffset={88 * (1 - day.progress)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white">
                        {day.day}
                      </div>
                    </div>
                  ) : day.isToday ? (
                    <div className="w-10 h-10 rounded-full bg-accent text-black flex items-center justify-center text-sm font-bold shadow-lg shadow-accent/20">
                      {day.day}
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium text-text-secondary">
                      {day.day}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lifetime Stats */}
        <section className="pb-6">
          <h2 className="text-xl font-bold text-white mb-3 px-1">累计统计</h2>
          <div className="bg-surface rounded-3xl p-5 border border-white/5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-white">平板支撑</span>
                </div>
                <span className="text-white font-semibold tabular-nums">
                  {formatDuration(getTotalTime('plank'))}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent"></div>
                  <span className="text-white">HIIT</span>
                </div>
                <span className="text-white font-semibold tabular-nums">
                  {formatDuration(getTotalTime('hiit'))}
                </span>
              </div>
              <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                <span className="text-text-secondary">总计</span>
                <span className="text-xl font-bold text-white tabular-nums">
                  {formatDuration(getTotalTime())}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
