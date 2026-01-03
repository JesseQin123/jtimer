import type { WorkoutSession } from '@/types'
import { formatDuration } from '@/hooks/useTimer'

interface SessionItemProps {
  session: WorkoutSession
  onDelete: () => void
}

// Calculate estimated calories (rough estimate)
function estimateCalories(type: string, durationSeconds: number): number {
  const minutes = durationSeconds / 60
  // Plank: ~5 cal/min, HIIT: ~10 cal/min
  const calPerMin = type === 'hiit' ? 10 : 5
  return Math.round(minutes * calPerMin)
}

export default function SessionItem({ session, onDelete }: SessionItemProps) {
  const isPlank = session.exercise_type === 'plank'

  const date = new Date(session.started_at)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  let dateStr: string
  if (date.toDateString() === today.toDateString()) {
    dateStr = '今天'
  } else if (date.toDateString() === yesterday.toDateString()) {
    dateStr = '昨天'
  } else {
    dateStr = date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }) + '日'
  }

  const calories = estimateCalories(session.exercise_type, session.duration_seconds)

  const gradientClasses = isPlank
    ? 'from-purple-400 to-pink-600'
    : 'from-orange-400 to-red-500'

  const iconBgShadow = isPlank
    ? 'shadow-purple-900/20'
    : 'shadow-orange-900/20'

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-surface border border-white/5 active-scale">
      {/* Main content */}
      <div className="p-4 flex items-center relative z-10 bg-surface">
        {/* Icon */}
        <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${gradientClasses} flex items-center justify-center mr-4 shadow-lg ${iconBgShadow}`}>
          <span className="material-icons-round text-white text-2xl">
            {isPlank ? 'accessibility_new' : 'timer'}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="text-base font-bold text-white truncate">
              {isPlank ? '平板支撑' : 'HIIT 高强度间歇'}
            </h3>
            <span className="text-xs text-text-tertiary font-medium">{dateStr}</span>
          </div>
          <div className="flex items-baseline space-x-2 mt-0.5">
            <span className="text-2xl font-bold text-accent timer-font">
              {formatDuration(session.duration_seconds)}
            </span>
            <span className="text-xs font-bold text-primary uppercase">{calories} 千卡</span>
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="ml-4 p-2 text-text-tertiary hover:text-red-500 transition-colors"
        >
          <span className="material-icons-round text-xl">delete</span>
        </button>
      </div>
    </div>
  )
}
