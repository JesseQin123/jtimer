import { useState } from 'react'
import { useHIITTimer } from '@/hooks/useHIITTimer'
import { useWorkouts } from '@/hooks/useWorkouts'
import { formatTime } from '@/hooks/useTimer'
import type { HIITConfig } from '@/types'

const defaultConfig: HIITConfig = {
  workSeconds: 30,
  restSeconds: 10,
  rounds: 8,
}

export default function HIITTimer() {
  const { saveSession } = useWorkouts()
  const [config, setConfig] = useState<HIITConfig>(defaultConfig)
  const [showConfig, setShowConfig] = useState(false)

  const handleComplete = async (totalSeconds: number, _hiitConfig: HIITConfig, startTime: Date) => {
    if (totalSeconds >= 10) {
      await saveSession('hiit', totalSeconds, startTime, config)
    }
  }

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

  // Calculate total time for current config
  const totalConfigTime = config.rounds * (config.workSeconds + config.restSeconds) - config.restSeconds

  // Progress for the ring
  const getProgress = () => {
    if (isIdle) return 0
    if (isCompleted) return 100
    return (state.totalElapsed / totalConfigTime) * 100
  }

  const phaseColor = isWork ? 'text-green-500' : isRest ? 'text-orange-500' : 'text-slate-400'
  const ringColor = isWork ? 'stroke-green-500' : isRest ? 'stroke-orange-500' : 'stroke-slate-600'

  return (
    <div className="flex flex-col items-center">
      {/* Timer display */}
      <div className="relative">
        {/* Ring container */}
        <div className="w-64 h-64 relative flex items-center justify-center">
          <svg className="absolute inset-0 transform -rotate-90" width="256" height="256">
            <circle
              cx="128"
              cy="128"
              r="116"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-700"
            />
            <circle
              cx="128"
              cy="128"
              r="116"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 116}
              strokeDashoffset={2 * Math.PI * 116 * (1 - getProgress() / 100)}
              className={ringColor}
              style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
            />
          </svg>

          {/* Center content */}
          <div className="z-10 text-center">
            {isIdle ? (
              <>
                <p className="text-slate-400 text-sm">总时间</p>
                <p className="text-4xl font-bold text-white timer-font">
                  {formatTime(totalConfigTime)}
                </p>
              </>
            ) : isCompleted ? (
              <>
                <p className="text-green-500 text-lg font-semibold">完成!</p>
                <p className="text-2xl font-bold text-white timer-font">
                  {formatTime(state.totalElapsed)}
                </p>
              </>
            ) : (
              <>
                <p className={`text-sm font-medium ${phaseColor}`}>
                  {isWork ? '运动' : '休息'}
                </p>
                <p className="text-5xl font-bold text-white timer-font">
                  {formatTime(state.timeRemaining)}
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  第 {state.currentRound} / {state.totalRounds} 组
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Exercise type label */}
      <p className="text-slate-400 mt-4 text-lg">HIIT 间歇训练</p>

      {/* Config summary (when idle) */}
      {isIdle && (
        <button
          onClick={() => setShowConfig(true)}
          className="mt-2 text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1"
        >
          {config.workSeconds}s 运动 / {config.restSeconds}s 休息 × {config.rounds}组
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      )}

      {/* Controls */}
      <div className="flex gap-4 mt-8">
        {isIdle && (
          <button
            onClick={start}
            className="px-12 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-full text-lg transition-all transform hover:scale-105 active:scale-95"
          >
            开始
          </button>
        )}

        {(isWork || isRest) && (
          <>
            {isRunning ? (
              <button
                onClick={pause}
                className="px-8 py-4 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-full text-lg transition-all"
              >
                暂停
              </button>
            ) : (
              <button
                onClick={resume}
                className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-full text-lg transition-all"
              >
                继续
              </button>
            )}
            <button
              onClick={stop}
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full text-lg transition-all"
            >
              结束
            </button>
          </>
        )}

        {isCompleted && (
          <button
            onClick={reset}
            className="px-12 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-full text-lg transition-all"
          >
            重新开始
          </button>
        )}
      </div>

      {/* Config modal */}
      {showConfig && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-semibold text-white mb-4">HIIT 配置</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  运动时间 (秒)
                </label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={config.workSeconds}
                  onChange={e => setConfig(c => ({ ...c, workSeconds: parseInt(e.target.value) || 30 }))}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  休息时间 (秒)
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={config.restSeconds}
                  onChange={e => setConfig(c => ({ ...c, restSeconds: parseInt(e.target.value) || 10 }))}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  组数
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={config.rounds}
                  onChange={e => setConfig(c => ({ ...c, rounds: parseInt(e.target.value) || 8 }))}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowConfig(false)}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => setShowConfig(false)}
                className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors"
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
