interface StatCardProps {
  icon: string
  label: string
  value: string
  unit?: string
  color: 'primary' | 'accent'
  progress?: number // 0-100 for progress bar
}

export default function StatCard({
  icon,
  label,
  value,
  unit,
  color,
  progress,
}: StatCardProps) {
  const colorClasses = {
    primary: {
      icon: 'text-primary',
      label: 'text-primary',
      glow: 'bg-primary/20',
      bar: 'bg-primary shadow-glow-sm-primary',
    },
    accent: {
      icon: 'text-accent',
      label: 'text-accent',
      glow: 'bg-accent/20',
      bar: 'bg-accent shadow-glow-sm-accent',
    },
  }

  const classes = colorClasses[color]

  return (
    <div className="bg-surface rounded-3xl p-5 border border-white/5 relative overflow-hidden group">
      {/* Glow effect */}
      <div className={`absolute top-0 right-0 w-16 h-16 ${classes.glow} blur-2xl rounded-full -mr-8 -mt-8 group-hover:opacity-150 transition-opacity`} />

      {/* Header */}
      <div className="flex items-start justify-between mb-2 relative z-10">
        <span className={`material-icons-round text-2xl ${classes.icon}`}>{icon}</span>
        <span className={`text-xs font-bold ${classes.label} uppercase tracking-wider`}>{label}</span>
      </div>

      {/* Value */}
      <div className="relative z-10 mt-2">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
          {unit && <span className="text-lg text-text-secondary ml-1">{unit}</span>}
        </div>
      </div>

      {/* Progress bar */}
      {progress !== undefined && (
        <div className="w-full h-1.5 bg-surface-light rounded-full mt-4 overflow-hidden relative z-10">
          <div
            className={`h-full ${classes.bar} rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
    </div>
  )
}
