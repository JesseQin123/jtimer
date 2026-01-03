import { useTimer } from '@/hooks/useTimer'
import { useWorkouts } from '@/hooks/useWorkouts'
import TimerDisplay from './TimerDisplay'

export default function PlankTimer() {
  const { saveSession } = useWorkouts()

  const handleComplete = async (durationSeconds: number, startTime: Date) => {
    if (durationSeconds >= 5) { // Only save if at least 5 seconds
      await saveSession('plank', durationSeconds, startTime)
    }
  }

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

  return (
    <div className="flex flex-col items-center">
      {/* Timer display */}
      <TimerDisplay
        seconds={elapsedSeconds}
        size="lg"
        progress={isRunning ? undefined : 0}
        ringColor={isRunning ? 'stroke-cyan-500' : 'stroke-slate-600'}
      />

      {/* Exercise type label */}
      <p className="text-slate-400 mt-4 text-lg">平板支撑</p>

      {/* Controls */}
      <div className="flex gap-4 mt-8">
        {!isRunning ? (
          <button
            onClick={start}
            className="px-12 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-full text-lg transition-all transform hover:scale-105 active:scale-95"
          >
            {elapsedSeconds > 0 ? '继续' : '开始'}
          </button>
        ) : (
          <>
            <button
              onClick={pause}
              className="px-8 py-4 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-full text-lg transition-all"
            >
              暂停
            </button>
            <button
              onClick={stop}
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full text-lg transition-all"
            >
              结束
            </button>
          </>
        )}
      </div>

      {/* Instructions */}
      {!isRunning && elapsedSeconds === 0 && (
        <p className="text-slate-500 text-sm mt-8 text-center max-w-xs">
          点击开始后计时器将自动运行，完成后点击结束保存记录
        </p>
      )}
    </div>
  )
}
