import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTimer, formatTime, formatDuration } from '@/hooks/useTimer'
import { useHIITTimer } from '@/hooks/useHIITTimer'
import { useWorkouts } from '@/hooks/useWorkouts'
import StatRing from '@/components/ui/StatRing'
import type { HIITConfig } from '@/types'

// Format seconds to "09H13M" format
function formatLifetimeTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours.toString().padStart(2, '0')}H${minutes.toString().padStart(2, '0')}M`
}

// Progress ring component for timer
function TimerRing({
  progress,
  color = '#FF00CC',
  icon,
  children,
}: {
  progress: number
  color?: string
  icon: string
  children: React.ReactNode
}) {
  const size = 300
  const strokeWidth = 16
  const radius = 138
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - Math.min(progress, 100) / 100)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background ring */}
      <svg className="absolute inset-0 transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#2C2C2E"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </svg>

      {/* Progress ring */}
      <svg
        className="absolute inset-0 transform -rotate-90"
        width={size}
        height={size}
        style={{ filter: `drop-shadow(0 0 15px ${color}66)` }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
        />
      </svg>

      {/* Decorative dashed ring - yellow-green */}
      <svg className="absolute inset-0 transform -rotate-90 scale-[0.85] opacity-60" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#00FF66"
          strokeWidth={12}
          strokeDasharray="2 6"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>

      {/* Icon badge - top right */}
      <div className="absolute top-0 right-4 w-14 h-14 bg-surface rounded-full border-2 border-primary flex items-center justify-center shadow-lg transform -translate-y-2 translate-x-2 z-10">
        <span className="material-icons-round text-primary text-2xl">{icon}</span>
      </div>
    </div>
  )
}

// Plank Timer Component
function PlankTimerView() {
  const navigate = useNavigate()
  const { saveSession, getTotalTime, getSessionCount } = useWorkouts()

  // Get stats
  const totalPlankSeconds = getTotalTime('plank')
  const plankSessionCount = getSessionCount('plank')

  const handleComplete = useCallback(async (durationSeconds: number, startTime: Date) => {
    if (durationSeconds >= 5) {
      await saveSession('plank', durationSeconds, startTime)
    }
  }, [saveSession])

  const {
    isRunning,
    elapsedSeconds,
    startTime,
    start,
    pause,
    stop,
  } = useTimer({
    onComplete: (seconds) => {
      if (startTime) {
        handleComplete(seconds, startTime)
      }
    }
  })

  const progress = Math.min((elapsedSeconds / 300) * 100, 100) // 5 min as 100%

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background glow */}
      <div className="fixed top-[-20%] left-[-20%] w-[80%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-accent/20 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="w-full px-6 py-4 flex justify-between items-center z-20 pt-12">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
        >
          <span className="material-icons-round text-white text-2xl">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-semibold tracking-wide text-secondary uppercase">Plank Timer</h1>
        <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md">
          <span className="material-icons-round text-white text-2xl">settings</span>
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center px-6 pb-8 pt-2 relative z-10">
        {/* Timer display - adjusted size */}
        <div className="flex-none flex items-center justify-center mb-6">
          <TimerRing progress={progress} color="#FF00CC" icon="fitness_center">
            <span className="text-secondary font-medium tracking-wider text-sm mb-1 uppercase">
              {isRunning ? '进行中' : elapsedSeconds > 0 ? '已暂停' : '准备开始'}
            </span>
            <div className="text-gradient-white font-bold text-[5.5rem] leading-none tracking-tight timer-font">
              {formatTime(elapsedSeconds)}
            </div>
            <span className="text-text-secondary text-lg font-medium mt-1">
              {formatDuration(totalPlankSeconds + elapsedSeconds)} Total
            </span>
            <div className="mt-4 px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-medium text-white/80">HR --</span>
            </div>
          </TimerRing>
        </div>

        {/* Stats rings */}
        <div className="w-full flex justify-center gap-6 mb-8">
          <StatRing
            value={formatLifetimeTime(totalPlankSeconds)}
            label="Lifetime Plank Time"
            icon="star"
            color="accent"
          />
          <StatRing
            value={plankSessionCount}
            unit="次"
            label="累计次数"
            icon="check"
            color="accent"
          />
        </div>

        {/* Controls */}
        <div className="w-full flex justify-center items-center gap-8 mt-auto">
          <button
            onClick={stop}
            disabled={elapsedSeconds === 0}
            className="w-16 h-16 rounded-full bg-surface border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all duration-200 group disabled:opacity-30"
          >
            <span className="material-icons-round text-2xl text-secondary group-hover:scale-110 transition-transform">stop</span>
          </button>

          <button
            onClick={isRunning ? pause : start}
            className="w-24 h-24 rounded-full bg-primary shadow-glow-primary flex items-center justify-center active:scale-95 hover:brightness-110 transition-all duration-200"
          >
            <span className="material-icons-round text-5xl text-black ml-1">
              {isRunning ? 'pause' : 'play_arrow'}
            </span>
          </button>

          <button className="w-16 h-16 rounded-full bg-surface border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all duration-200 group">
            <span className="material-icons-round text-2xl text-white group-hover:scale-110 transition-transform">flag</span>
          </button>
        </div>
      </main>
    </div>
  )
}

// HIIT Timer Component
function HIITTimerView() {
  const navigate = useNavigate()
  const { saveSession, getTotalTime, getSessionCount } = useWorkouts()
  const [config, setConfig] = useState<HIITConfig>({
    workSeconds: 30,
    restSeconds: 10,
    rounds: 8,
  })
  const [showConfig, setShowConfig] = useState(false)

  // Get stats
  const totalHiitSeconds = getTotalTime('hiit')
  const hiitSessionCount = getSessionCount('hiit')

  const handleComplete = useCallback(async (totalSeconds: number, hiitConfig: HIITConfig, startTime: Date) => {
    if (totalSeconds >= 10) {
      await saveSession('hiit', totalSeconds, startTime, hiitConfig)
    }
  }, [saveSession])

  const {
    state,
    startTime,
    isRunning,
    start,
    pause,
    resume,
    stop,
    reset,
  } = useHIITTimer(config, {
    onComplete: (totalSeconds, hiitConfig) => {
      if (startTime) {
        handleComplete(totalSeconds, hiitConfig, startTime)
      }
    }
  })

  const isIdle = state.phase === 'idle'
  const isCompleted = state.phase === 'completed'
  const isWork = state.phase === 'work'
  const isRest = state.phase === 'rest'

  const totalConfigTime = config.rounds * (config.workSeconds + config.restSeconds) - config.restSeconds
  const progress = isIdle ? 0 : isCompleted ? 100 : (state.totalElapsed / totalConfigTime) * 100

  const ringColor = isWork ? '#FF00CC' : isRest ? '#F97316' : '#FF00CC'

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background glow */}
      <div className="fixed top-[-20%] left-[-20%] w-[80%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-accent/20 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="w-full px-6 py-4 flex justify-between items-center z-20 pt-12">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
        >
          <span className="material-icons-round text-white text-2xl">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-semibold tracking-wide text-secondary uppercase">High Intensity</h1>
        <button
          onClick={() => setShowConfig(true)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
        >
          <span className="material-icons-round text-white text-2xl">settings</span>
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center px-6 pb-8 pt-2 relative z-10">
        {/* Timer display */}
        <div className="flex-none flex items-center justify-center mb-6">
          <TimerRing progress={progress} color={ringColor} icon="bolt">
            <span className={`font-medium tracking-wider text-sm mb-1 uppercase ${isWork ? 'text-primary' : isRest ? 'text-orange-500' : 'text-secondary'}`}>
              {!isIdle && !isCompleted ? `Interval ${state.currentRound}/${state.totalRounds}` : isCompleted ? '完成!' : '准备开始'}
            </span>
            <div className="text-gradient-white font-bold text-[5.5rem] leading-none tracking-tight timer-font">
              {formatTime(isIdle ? totalConfigTime : isCompleted ? state.totalElapsed : state.timeRemaining)}
            </div>
            <span className="text-text-secondary text-lg font-medium mt-1">
              {isIdle ? '总时长' : `${formatTime(state.totalElapsed)} Total`}
            </span>
            <div className="mt-4 px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-medium text-white/80">HR --</span>
            </div>
          </TimerRing>
        </div>

        {/* Stats rings */}
        <div className="w-full flex justify-center gap-6 mb-8">
          <StatRing
            value={formatLifetimeTime(totalHiitSeconds)}
            label="Lifetime HIIT Time"
            icon="star"
            color="accent"
          />
          <StatRing
            value={hiitSessionCount}
            unit="次"
            label="累计次数"
            icon="check"
            color="accent"
          />
        </div>

        {/* Controls */}
        <div className="w-full flex justify-center items-center gap-8 mt-auto">
          <button
            onClick={isCompleted ? reset : stop}
            disabled={isIdle && state.totalElapsed === 0}
            className="w-16 h-16 rounded-full bg-surface border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all duration-200 group disabled:opacity-30"
          >
            <span className="material-icons-round text-2xl text-secondary group-hover:scale-110 transition-transform">
              {isCompleted ? 'refresh' : 'stop'}
            </span>
          </button>

          <button
            onClick={isIdle ? start : isRunning ? pause : resume}
            disabled={isCompleted}
            className="w-24 h-24 rounded-full bg-primary shadow-glow-primary flex items-center justify-center active:scale-95 hover:brightness-110 transition-all duration-200 disabled:opacity-50"
          >
            <span className="material-icons-round text-5xl text-black ml-1">
              {isRunning ? 'pause' : 'play_arrow'}
            </span>
          </button>

          <button className="w-16 h-16 rounded-full bg-surface border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all duration-200 group">
            <span className="material-icons-round text-2xl text-white group-hover:scale-110 transition-transform">flag</span>
          </button>
        </div>
      </main>

      {/* Config modal */}
      {showConfig && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-4xl p-6 w-full max-w-sm border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-6">HIIT 配置</h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-text-secondary mb-2">运动时间 (秒)</label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={config.workSeconds}
                  onChange={e => setConfig(c => ({ ...c, workSeconds: parseInt(e.target.value) || 30 }))}
                  className="w-full px-4 py-3 bg-surface-light border border-white/10 rounded-2xl text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2">休息时间 (秒)</label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={config.restSeconds}
                  onChange={e => setConfig(c => ({ ...c, restSeconds: parseInt(e.target.value) || 10 }))}
                  className="w-full px-4 py-3 bg-surface-light border border-white/10 rounded-2xl text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2">组数</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={config.rounds}
                  onChange={e => setConfig(c => ({ ...c, rounds: parseInt(e.target.value) || 8 }))}
                  className="w-full px-4 py-3 bg-surface-light border border-white/10 rounded-2xl text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowConfig(false)}
                className="flex-1 py-3 bg-surface-light hover:bg-surface-lighter text-white font-medium rounded-2xl transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => setShowConfig(false)}
                className="flex-1 py-3 bg-primary hover:brightness-110 text-white font-medium rounded-2xl transition-all"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Main Timer page component
export default function Timer() {
  const { type } = useParams<{ type: string }>()

  if (type === 'hiit') {
    return <HIITTimerView />
  }

  return <PlankTimerView />
}
