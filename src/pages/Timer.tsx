import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTimer, formatTime } from '@/hooks/useTimer'
import { useHIITTimer } from '@/hooks/useHIITTimer'
import { useWorkouts } from '@/hooks/useWorkouts'
import type { HIITConfig } from '@/types'

// Estimate calories: plank ~5 cal/min, HIIT ~10 cal/min
function estimateCalories(type: string, seconds: number): number {
  const minutes = seconds / 60
  return Math.round(minutes * (type === 'hiit' ? 10 : 5))
}

// Progress ring component for timer
function TimerRing({
  progress,
  children,
}: {
  progress: number
  children: React.ReactNode
}) {
  const size = 340
  const strokeWidth = 24
  const radius = (size - strokeWidth) / 2
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
        style={{ filter: 'drop-shadow(0 0 15px rgba(250, 45, 72, 0.4))' }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#FA2D48"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
        />
      </svg>

      {/* Decorative dashed ring */}
      <svg className="absolute inset-0 transform -rotate-90 scale-90 opacity-30" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={1}
          strokeDasharray="4 8"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  )
}

// Plank Timer Component
function PlankTimerView() {
  const navigate = useNavigate()
  const { saveSession } = useWorkouts()

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

  const calories = estimateCalories('plank', elapsedSeconds)
  const progress = Math.min((elapsedSeconds / 300) * 100, 100) // 5 min as 100%

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background glow */}
      <div className="fixed top-[-20%] left-[-20%] w-[80%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="w-full px-6 py-4 flex justify-between items-center z-20 pt-12">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
        >
          <span className="material-icons-round text-white">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-semibold tracking-wide text-accent uppercase">平板支撑</h1>
        <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md">
          <span className="material-icons-round text-white">more_horiz</span>
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-between px-6 pb-8 pt-4 relative z-10">
        {/* Timer display */}
        <div className="flex-1 flex items-center justify-center">
          <TimerRing progress={progress}>
            <span className="text-accent font-medium tracking-wider text-sm mb-1 uppercase">
              {isRunning ? '进行中' : elapsedSeconds > 0 ? '已暂停' : '准备开始'}
            </span>
            <div className="text-gradient-white font-bold text-[6.5rem] leading-none tracking-tight timer-font">
              {formatTime(elapsedSeconds)}
            </div>
            <span className="text-text-secondary text-xl font-medium mt-2">
              {calories} 千卡
            </span>
          </TimerRing>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-4 w-full mb-8">
          <div className="bg-surface/80 backdrop-blur-xl rounded-3xl p-5 border border-white/5">
            <div className="flex items-start justify-between">
              <span className="material-icons-round text-primary">local_fire_department</span>
              <span className="text-xs font-bold text-primary uppercase">消耗</span>
            </div>
            <div className="mt-2">
              <span className="text-3xl font-bold text-white">{calories}</span>
              <span className="text-xs text-text-secondary uppercase tracking-wider ml-1">千卡</span>
            </div>
          </div>
          <div className="bg-surface/80 backdrop-blur-xl rounded-3xl p-5 border border-white/5">
            <div className="flex items-start justify-between">
              <span className="material-icons-round text-accent">timer</span>
              <span className="text-xs font-bold text-accent uppercase">目标</span>
            </div>
            <div className="mt-2 flex items-end gap-1">
              <span className="text-3xl font-bold text-white">{Math.min(Math.round(progress), 100)}</span>
              <span className="text-lg font-medium text-text-secondary mb-1">%</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="w-full grid grid-cols-3 gap-6 items-center">
          <button
            onClick={stop}
            disabled={elapsedSeconds === 0}
            className="aspect-square rounded-full bg-surface border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all duration-200 group disabled:opacity-30"
          >
            <span className="material-icons-round text-3xl text-accent group-hover:scale-110 transition-transform">stop</span>
          </button>

          <button
            onClick={isRunning ? pause : start}
            className="aspect-square rounded-full bg-primary shadow-glow-primary flex items-center justify-center active:scale-95 hover:brightness-110 transition-all duration-200"
          >
            <span className="material-icons-round text-5xl text-black ml-1">
              {isRunning ? 'pause' : 'play_arrow'}
            </span>
          </button>

          <button className="aspect-square rounded-full bg-surface border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all duration-200 group">
            <span className="material-icons-round text-3xl text-white group-hover:scale-110 transition-transform">flag</span>
          </button>
        </div>
      </main>
    </div>
  )
}

// HIIT Timer Component
function HIITTimerView() {
  const navigate = useNavigate()
  const { saveSession } = useWorkouts()
  const [config, setConfig] = useState<HIITConfig>({
    workSeconds: 30,
    restSeconds: 10,
    rounds: 8,
  })
  const [showConfig, setShowConfig] = useState(false)

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
  const calories = estimateCalories('hiit', state.totalElapsed)

  const phaseLabel = isWork ? '运动' : isRest ? '休息' : isCompleted ? '完成!' : '准备开始'
  const ringColor = isWork ? '#FA2D48' : isRest ? '#F97316' : '#FA2D48'

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background glow */}
      <div className="fixed top-[-20%] left-[-20%] w-[80%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="w-full px-6 py-4 flex justify-between items-center z-20 pt-12">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
        >
          <span className="material-icons-round text-white">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-semibold tracking-wide text-accent uppercase">HIIT 训练</h1>
        <button
          onClick={() => setShowConfig(true)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
        >
          <span className="material-icons-round text-white">settings</span>
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-between px-6 pb-8 pt-4 relative z-10">
        {/* Timer display */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative" style={{ width: 340, height: 340 }}>
            {/* Background ring */}
            <svg className="absolute inset-0 transform -rotate-90" width={340} height={340}>
              <circle cx={170} cy={170} r={158} fill="none" stroke="#2C2C2E" strokeWidth={24} strokeLinecap="round" />
            </svg>
            {/* Progress ring */}
            <svg
              className="absolute inset-0 transform -rotate-90"
              width={340}
              height={340}
              style={{ filter: `drop-shadow(0 0 15px ${ringColor}66)` }}
            >
              <circle
                cx={170}
                cy={170}
                r={158}
                fill="none"
                stroke={ringColor}
                strokeWidth={24}
                strokeLinecap="round"
                strokeDasharray={992}
                strokeDashoffset={992 * (1 - progress / 100)}
                style={{ transition: 'stroke-dashoffset 0.3s ease-out, stroke 0.3s ease-out' }}
              />
            </svg>
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`font-medium tracking-wider text-sm mb-1 uppercase ${isWork ? 'text-primary' : isRest ? 'text-orange-500' : 'text-accent'}`}>
                {!isIdle && !isCompleted ? `INTERVAL ${state.currentRound}/${state.totalRounds}` : phaseLabel}
              </span>
              <div className="text-gradient-white font-bold text-[6.5rem] leading-none tracking-tight timer-font">
                {formatTime(isIdle ? totalConfigTime : isCompleted ? state.totalElapsed : state.timeRemaining)}
              </div>
              <span className="text-text-secondary text-xl font-medium mt-2">
                {isIdle ? '总时长' : `${formatTime(state.totalElapsed)} 已完成`}
              </span>
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-4 w-full mb-8">
          <div className="bg-surface/80 backdrop-blur-xl rounded-3xl p-5 border border-white/5">
            <div className="flex items-start justify-between">
              <span className="material-icons-round text-primary">local_fire_department</span>
              <span className="text-xs font-bold text-primary uppercase">消耗</span>
            </div>
            <div className="mt-2">
              <span className="text-3xl font-bold text-white">{calories}</span>
              <span className="text-xs text-text-secondary uppercase tracking-wider ml-1">千卡</span>
            </div>
          </div>
          <div className="bg-surface/80 backdrop-blur-xl rounded-3xl p-5 border border-white/5">
            <div className="flex items-start justify-between">
              <span className="material-icons-round text-accent">timer</span>
              <span className="text-xs font-bold text-accent uppercase">进度</span>
            </div>
            <div className="mt-2 flex items-end gap-1">
              <span className="text-3xl font-bold text-white">{Math.min(Math.round(progress), 100)}</span>
              <span className="text-lg font-medium text-text-secondary mb-1">%</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="w-full grid grid-cols-3 gap-6 items-center">
          <button
            onClick={isCompleted ? reset : stop}
            disabled={isIdle && state.totalElapsed === 0}
            className="aspect-square rounded-full bg-surface border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all duration-200 group disabled:opacity-30"
          >
            <span className="material-icons-round text-3xl text-accent group-hover:scale-110 transition-transform">
              {isCompleted ? 'refresh' : 'stop'}
            </span>
          </button>

          <button
            onClick={isIdle ? start : isRunning ? pause : resume}
            disabled={isCompleted}
            className="aspect-square rounded-full bg-primary shadow-glow-primary flex items-center justify-center active:scale-95 hover:brightness-110 transition-all duration-200 disabled:opacity-50"
          >
            <span className="material-icons-round text-5xl text-black ml-1">
              {isRunning ? 'pause' : 'play_arrow'}
            </span>
          </button>

          <button className="aspect-square rounded-full bg-surface border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all duration-200 group">
            <span className="material-icons-round text-3xl text-white group-hover:scale-110 transition-transform">flag</span>
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
