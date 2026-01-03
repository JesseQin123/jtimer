import { formatTime } from '@/hooks/useTimer'

interface TimerDisplayProps {
  seconds: number
  size?: 'sm' | 'md' | 'lg'
  color?: string
  progress?: number // 0-100, for ring progress
  ringColor?: string
}

export default function TimerDisplay({
  seconds,
  size = 'lg',
  color = 'text-white',
  progress,
  ringColor = 'stroke-cyan-500'
}: TimerDisplayProps) {
  const sizeClasses = {
    sm: 'w-32 h-32 text-2xl',
    md: 'w-48 h-48 text-4xl',
    lg: 'w-64 h-64 text-5xl',
  }

  const ringSize = {
    sm: 120,
    md: 180,
    lg: 240,
  }

  const strokeWidth = 8
  const radius = (ringSize[size] - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = progress !== undefined
    ? circumference * (1 - progress / 100)
    : circumference

  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      {/* Background ring */}
      <svg
        className="absolute inset-0 transform -rotate-90"
        width={ringSize[size]}
        height={ringSize[size]}
      >
        <circle
          cx={ringSize[size] / 2}
          cy={ringSize[size] / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-700"
        />
        {/* Progress ring */}
        <circle
          cx={ringSize[size] / 2}
          cy={ringSize[size] / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className={ringColor}
          style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
      </svg>

      {/* Time display */}
      <span className={`timer-font font-bold ${color} z-10`}>
        {formatTime(seconds)}
      </span>
    </div>
  )
}
