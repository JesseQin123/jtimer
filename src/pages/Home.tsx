import { useNavigate } from 'react-router-dom'
import { useWorkouts } from '@/hooks/useWorkouts'
import { useAuth } from '@/hooks/useAuth'
import { formatDuration } from '@/hooks/useTimer'
import StatCard from '@/components/ui/StatCard'
import WorkoutCard from '@/components/ui/WorkoutCard'

export default function Home() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { sessions, getTotalTime } = useWorkouts()

  // Get stats
  const plankTotalSeconds = getTotalTime('plank')
  const plankHours = Math.floor(plankTotalSeconds / 3600)
  const todaySessions = sessions.filter(s => {
    const sessionDate = new Date(s.started_at)
    const today = new Date()
    return sessionDate.toDateString() === today.toDateString()
  }).length

  // Get last session for "continue" button
  const lastSession = sessions[0]

  return (
    <div className="min-h-full px-6 pt-12 pb-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">摘要</h1>
        <button
          onClick={() => signOut()}
          className="w-9 h-9 rounded-full bg-surface flex items-center justify-center hover:bg-surface-light transition"
        >
          <span className="material-icons-round text-primary text-xl">person</span>
        </button>
      </header>

      {/* Stats cards */}
      <section className="mb-8">
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
          <div className="flex-shrink-0 w-[45%]">
            <StatCard
              icon="fitness_center"
              label="累计"
              value={plankHours.toString().padStart(2, '0')}
              unit="H"
              color="primary"
              progress={Math.min((plankHours / 100) * 100, 100)}
            />
          </div>
          <div className="flex-shrink-0 w-[45%]">
            <StatCard
              icon="bolt"
              label="今日"
              value={todaySessions.toString()}
              unit="次"
              color="accent"
              progress={Math.min((todaySessions / 5) * 100, 100)}
            />
          </div>
        </div>
      </section>

      {/* Start training section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end px-1">
          <h2 className="text-xl font-bold text-white tracking-tight">开始训练</h2>
          <span className="text-sm text-primary font-medium">查看全部</span>
        </div>

        {/* Workout cards */}
        <WorkoutCard
          title="平板支撑"
          subtitle="自定义时长 & 记录"
          icon="fitness_center"
          tag="核心力量"
          color="primary"
          onClick={() => navigate('/timer/plank')}
        />

        <WorkoutCard
          title="HIIT 训练"
          subtitle="Tabata & 间歇跑"
          icon="bolt"
          tag="高强度燃脂"
          color="accent"
          onClick={() => navigate('/timer/hiit')}
        />
      </section>

      {/* Last session continue button */}
      {lastSession && (
        <div className="fixed bottom-28 left-6 right-6 z-40">
          <button
            onClick={() => navigate(`/timer/${lastSession.exercise_type}`)}
            className="w-full bg-surface/90 border border-white/10 backdrop-blur-xl text-white py-4 px-6 rounded-4xl shadow-2xl flex items-center justify-between group active-scale"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="material-icons-round text-accent text-sm">history</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">上次训练</span>
                <span className="font-bold text-sm">
                  {lastSession.exercise_type === 'plank' ? '平板支撑' : 'HIIT'}{' '}
                  {formatDuration(lastSession.duration_seconds)}
                  <span className="text-text-tertiary font-normal ml-1">
                    {new Date(lastSession.started_at).toDateString() === new Date().toDateString()
                      ? '今天'
                      : '昨天'}
                  </span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-primary font-bold text-sm bg-primary/10 px-3 py-1.5 rounded-full">
              <span>再次开始</span>
              <span className="material-icons-round text-base">play_arrow</span>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}
