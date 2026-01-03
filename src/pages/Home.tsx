import { useState } from 'react'
import PlankTimer from '@/components/Timer/PlankTimer'
import HIITTimer from '@/components/Timer/HIITTimer'
import type { ExerciseType } from '@/types'

export default function Home() {
  const [exerciseType, setExerciseType] = useState<ExerciseType>('plank')

  return (
    <div className="min-h-full flex flex-col px-4 py-6">
      {/* Exercise type selector */}
      <div className="flex justify-center gap-2 mb-8">
        <button
          onClick={() => setExerciseType('plank')}
          className={`px-6 py-2 rounded-full font-medium transition-all ${
            exerciseType === 'plank'
              ? 'bg-cyan-500 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          平板支撑
        </button>
        <button
          onClick={() => setExerciseType('hiit')}
          className={`px-6 py-2 rounded-full font-medium transition-all ${
            exerciseType === 'hiit'
              ? 'bg-cyan-500 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          HIIT
        </button>
      </div>

      {/* Timer component */}
      <div className="flex-1 flex items-center justify-center">
        {exerciseType === 'plank' ? <PlankTimer /> : <HIITTimer />}
      </div>
    </div>
  )
}
